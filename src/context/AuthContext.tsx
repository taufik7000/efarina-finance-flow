import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import supabase from '../lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { name?: string }) => Promise<void>;
  createDummyUser?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Initialize database tables if they don't exist
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        // Check if users table exists, if not create it
        const { error: tableError } = await supabase.rpc('create_users_table_if_not_exists');
        if (tableError) {
          console.warn('Could not run RPC, trying to create table directly:', tableError);
          
          // Try to create the table directly if RPC fails - using raw SQL is not possible with supabase JS client
          // We'll use the createTable method from storage instead
          try {
            // Use a direct SQL query if available in your Supabase project dashboard
            console.log('Please create the users table manually in your Supabase dashboard if it doesn\'t exist');
          } catch (createError) {
            console.error('Error creating users table:', createError);
          }
        }
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };

    initializeDatabase();
  }, []);

  // Create dummy user on component mount - will run only once
  useEffect(() => {
    const createDummyUserIfNotExists = async () => {
      try {
        // First create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: 'demo@efarina.tv',
          password: '123456',
          options: {
            data: {
              name: 'User Demo',
            }
          }
        });
        
        if (authError && !authError.message.includes('already')) {
          console.error('Error creating dummy user auth:', authError);
          return;
        }
        
        // If user was created or already exists, try to add to users table
        const { data: existingUser, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('email', 'demo@efarina.tv')
          .limit(1);
        
        if (checkError) {
          console.warn('Could not check if dummy user exists:', checkError);
        }

        // If user doesn't exist in users table, add them
        if (!existingUser || existingUser.length === 0) {
          // Get user ID - either from new signup or fetch existing
          let userId = authData?.user?.id;
          
          if (!userId) {
            // Try to get existing user - fixed the email property access
            const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
            if (usersError) {
              console.error('Error listing users:', usersError);
              return;
            }
            
            if (usersData && usersData.users) {
              const existingAuthUser = usersData.users.find(u => u.email === 'demo@efarina.tv');
              userId = existingAuthUser?.id;
            }
          }
          
          if (userId) {
            const { error: insertError } = await supabase
              .from('users')
              .insert([{
                id: userId,
                name: 'User Demo',
                email: 'demo@efarina.tv',
                role: 'user',
                department: 'Demo',
                status: 'active',
              }]);
              
            if (insertError && !insertError.message.includes('duplicate')) {
              console.error('Error inserting dummy user to users table:', insertError);
            } else {
              console.log('Dummy user created or updated');
            }
          }
        } else {
          console.log('Dummy user already exists');
        }
      } catch (error) {
        console.error('Error in dummy user creation process:', error);
      }
    };

    // Don't block the UI rendering with this operation
    createDummyUserIfNotExists();
  }, []);

  useEffect(() => {
    // Check session when component mounts
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Set up listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "Login berhasil",
        description: "Selamat datang kembali!",
      });
    } catch (error: any) {
      console.error("Login error:", error.message);
      toast({
        title: "Login gagal",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      
      // Register new user in Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: name,
          },
          emailRedirectTo: window.location.origin + '/login'
        }
      });
      
      if (authError) throw authError;

      // If the user was created successfully
      if (authData.user) {
        console.log("User created in auth:", authData.user.id);
        
        try {
          // Store additional data in users table
          const { error: profileError } = await supabase.from('users').insert([
            {
              id: authData.user.id,
              name,
              email,
              role: 'user',
              department: 'Umum',
              status: 'active',
            }
          ]);

          if (profileError) {
            console.error("Error inserting user profile:", profileError);
          }
        } catch (insertError) {
          console.error("Error during profile creation:", insertError);
        }
        
        toast({
          title: "Pendaftaran berhasil",
          description: "Silahkan verifikasi email Anda untuk menyelesaikan proses pendaftaran",
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error.message);
      toast({
        title: "Pendaftaran gagal",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari sistem",
      });
    } catch (error: any) {
      console.error("Logout error:", error.message);
      toast({
        title: "Logout gagal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string }) => {
    try {
      setIsLoading(true);
      if (!user) throw new Error('User tidak ditemukan');

      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);

      if (error) throw error;
      
      toast({
        title: "Profil diperbarui",
        description: "Perubahan profil telah disimpan",
      });
    } catch (error: any) {
      console.error("Update profile error:", error.message);
      toast({
        title: "Update profil gagal",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manual function to create dummy user - can be used if needed
  const createDummyUser = async () => {
    try {
      setIsLoading(true);
      
      // Create user in auth
      const { data, error } = await supabase.auth.signUp({
        email: 'demo@efarina.tv',
        password: '123456',
        options: {
          data: {
            name: 'User Demo',
          }
        }
      });
      
      if (error && !error.message.includes('already')) throw error;
      
      // Insert user data
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              name: 'User Demo',
              email: 'demo@efarina.tv',
              role: 'user',
              department: 'Demo',
              status: 'active',
            }
          ]);
          
        if (profileError && !profileError.message.includes('duplicate')) throw profileError;
      }
      
      toast({
        title: "Berhasil",
        description: "Akun demo berhasil dibuat",
      });
      
    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    createDummyUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
