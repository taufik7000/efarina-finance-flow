
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
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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

  const value = {
    user,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
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
