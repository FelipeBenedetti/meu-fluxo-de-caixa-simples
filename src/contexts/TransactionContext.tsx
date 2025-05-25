import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

export interface Transaction {
  id: string;
  user_id: string;
  type: 'entrada' | 'saida';
  amount: number;
  date: string;
  description: string;
  category_id: string;
  account: 'pessoal' | 'empresa';
  category?: {
    id: string;
    name: string;
  };
}

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  createTransaction: (transaction: Omit<Transaction, 'id' | 'user_id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id' | 'user_id'>>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionsByMonth: (month: number, year: number) => Transaction[];
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          category:categories(id, name)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      setTransactions(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  const createTransaction = async (transaction: Omit<Transaction, 'id' | 'user_id'>) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([
          {
            ...transaction,
            user_id: user.id,
          }
        ]);

      if (error) {
        throw error;
      }

      await fetchTransactions();
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateTransaction = async (id: string, transaction: Partial<Omit<Transaction, 'id' | 'user_id'>>) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('transactions')
        .update(transaction)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      await fetchTransactions();
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setTransactions(transactions.filter(t => t.id !== id));
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionsByMonth = (month: number, year: number) => {
    return transactions.filter(transaction => {
      const date = new Date(transaction.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  };

  const refreshTransactions = async () => {
    await fetchTransactions();
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      loading,
      error,
      createTransaction,
      updateTransaction,
      deleteTransaction,
      getTransactionsByMonth,
      refreshTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};