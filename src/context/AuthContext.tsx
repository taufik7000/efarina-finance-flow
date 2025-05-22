
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
  createDummyUser?: () => Promise<void>; // Optional method for creating dummy user
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Create dummy user on component mount - will run only once
  useEffect(() => {
    const createDummyUserIfNotExists = async () => {
      try {
        // Check if the dummy user exists
        const { data: existingUsers, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('email', 'demo@efarina.tv')
          .limit(1);
        
        if (checkError) {
          console.error('Error checking for dummy user:', checkError);
          return;
        }

        // If dummy user doesn't exist, create one
        if (!existingUsers || existingUsers.length === 0) {
          // First try to create the user in auth
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: 'demo@efarina.tv',
            password: '123456',
            email_confirm: true, // Auto confirm email
            user_metadata: {
              name: 'User Demo'
            }
          });

          // If there was an error creating the user in auth but it's not because the user exists
          if (authError && !authError.message.includes('already exists')) {
            console.error('Error creating dummy user in auth:', authError);
            
            // Fallback to signUp method
            try {
              const { data, error } = await supabase.auth.signUp({
                email: 'demo@efarina.tv',
                password: '123456',
                options: {
                  data: {
                    name: 'User Demo',
                  }
                }
              });
              
              if (error) throw error;
              
              // Insert directly to users table if auth user was created
              if (data.user) {
                await supabase.from('users').insert([{
                  id: data.user.id,
                  name: 'User Demo',
                  email: 'demo@efarina.tv',
                  role: 'user',
                  department: 'Demo',
                  status: 'active',
                }]);
              }
              
              console.log('Dummy user created via signUp');
            } catch (signupError) {
              console.error('Failed to create dummy user via signUp:', signupError);
            }
          } 
          // If the auth user was created successfully or already exists
          else {
            // Get user ID either from newly created user or existing one
            let userId = authData?.user?.id;
            
            if (!userId) {
              // Try to get the user ID from an existing auth user
              const { data: existingAuthUser } = await supabase.auth.signInWithPassword({
                email: 'demo@efarina.tv',
                password: '123456'
              });
              
              if (existingAuthUser.user) {
                userId = existingAuthUser.user.id;
                
                // Sign out again since we just wanted the ID
                await supabase.auth.signOut();
              }
            }
            
            // If we have a user ID, ensure user exists in users table
            if (userId) {
              const { error: insertError } = await supabase.from('users').insert([{
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
                console.log('Dummy user created or existed');
              }
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
        }
      });
      
      if (authError) throw authError;

      // If the user was created successfully
      if (authData.user) {
        console.log("User created in auth:", authData.user.id);
        
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
          throw profileError;
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
      
      // Check if user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'demo@efarina.tv');
      
      if (checkError) throw checkError;
      
      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: "Informasi",
          description: "Akun demo sudah ada",
        });
        return;
      }
      
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
      
      if (error) throw error;
      
      // Insert user data
      if (data.user) {
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
          
        if (profileError) throw profileError;
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
