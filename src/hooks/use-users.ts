
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/types/supabase';

type User = Database['public']['Tables']['users']['Row'];
type UserInput = Database['public']['Tables']['users']['Insert'];
type UserUpdate = Database['public']['Tables']['users']['Update'];

export const useUsers = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all users
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data || [];
    },
  });

  // Create a new user
  const createUser = useMutation({
    mutationFn: async (newUser: UserInput) => {
      setIsCreating(true);
      
      const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Berhasil',
        description: 'Pengguna berhasil ditambahkan',
      });
    },
    onSettled: () => {
      setIsCreating(false);
    }
  });

  // Update a user
  const updateUser = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UserUpdate }) => {
      setIsUpdating(true);
      
      const { data: updatedData, error } = await supabase
        .from('users')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Berhasil',
        description: 'Data pengguna berhasil diperbarui',
      });
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  });

  // Delete a user
  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id);

      if (error) {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Berhasil',
        description: 'Pengguna berhasil dihapus',
      });
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  return {
    users,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    createUser,
    updateUser,
    deleteUser,
  };
};
