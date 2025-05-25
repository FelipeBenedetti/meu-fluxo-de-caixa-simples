import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export interface Category {
  id: string;
  name: string;
  user_id: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchCategories = async () => {
    if (!user) {
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [user]);

  const createCategory = async (name: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, user_id: user.id }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setCategories([...categories, data]);
      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating category:', err);
      return null;
    }
  };

  const updateCategory = async (id: string, name: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('categories')
        .update({ name })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setCategories(categories.map(category => 
        category.id === id ? { ...category, name } : category
      ));
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error updating category:', err);
      return false;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      setCategories(categories.filter(category => category.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting category:', err);
      return false;
    }
  };

  const refreshCategories = async () => {
    await fetchCategories();
  };

  return {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
    refreshCategories
  };
};