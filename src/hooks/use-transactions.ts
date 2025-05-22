
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import supabase from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { Database } from '@/types/supabase';
import { useAuth } from '@/context/AuthContext';

type Transaction = Database['public']['Tables']['transactions']['Row'];
type TransactionInput = Database['public']['Tables']['transactions']['Insert'];
type TransactionUpdate = Database['public']['Tables']['transactions']['Update'];

export const useTransactions = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  // Fetch all transactions
  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

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

  // Create a new transaction
  const createTransaction = useMutation({
    mutationFn: async (newTransaction: Omit<TransactionInput, 'user_id'>) => {
      if (!user) throw new Error('User tidak ditemukan');
      setIsCreating(true);
      
      const transactionWithUser = {
        ...newTransaction,
        user_id: user.id
      };
      
      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionWithUser])
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
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Berhasil',
        description: 'Transaksi berhasil ditambahkan',
      });
    },
    onSettled: () => {
      setIsCreating(false);
    }
  });

  // Update a transaction
  const updateTransaction = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TransactionUpdate }) => {
      setIsUpdating(true);
      
      const { data: updatedData, error } = await supabase
        .from('transactions')
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
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Berhasil',
        description: 'Transaksi berhasil diperbarui',
      });
    },
    onSettled: () => {
      setIsUpdating(false);
    }
  });

  // Delete a transaction
  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('transactions')
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
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({
        title: 'Berhasil',
        description: 'Transaksi berhasil dihapus',
      });
    },
    onSettled: () => {
      setIsDeleting(false);
    }
  });

  return {
    transactions,
    isLoading,
    error,
    isCreating,
    isUpdating,
    isDeleting,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
