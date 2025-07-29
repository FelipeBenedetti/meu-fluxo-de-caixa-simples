import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'trial';
  trial_start: string | null;
  trial_end: string | null;
  plan: {
    name: string;
    price: number;
    description: string;
  };
  isTrialActive: boolean;
  hasActiveSubscription: boolean;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  refreshSubscription: () => Promise<void>;
  createTrialSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchSubscription = async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          plan:plans(*)
        `)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching subscription:', error);
        setSubscription(null);
      } else if (data) {
        // Calculate if trial is active
        const isTrialActive = data.trial_end ? new Date(data.trial_end) > new Date() : false;

        // Determine if there's an active subscription (either paid or in trial period)
        const hasActiveSubscription = data.status === 'active' || isTrialActive;

        setSubscription({
          ...data,
          isTrialActive,
          hasActiveSubscription
        });
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error('Error in fetchSubscription:', error);
      setSubscription(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSubscription();
  }, [user]);

  const refreshSubscription = async () => {
    await fetchSubscription();
  };

  const createTrialSubscription = async () => {
    if (!user) return;

    // Get the standard plan id
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .select('id')
      .eq('name', 'Padrão')
      .single();

    if (planError || !planData) {
      console.error('Error fetching plan:', planError);
      throw new Error('Plano "Padrão" não encontrado. Verifique se o plano padrão existe no banco de dados.');
    }

    // Calculate trial period dates
    const trialStart = new Date();
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7); // 7 days trial

    // Create subscription with trial period
    const { error } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: user.id,
          plan_id: planData.id,
          status: 'trial',
          trial_start: trialStart.toISOString(),
          trial_end: trialEnd.toISOString()
        }
      ]);

    if (error) {
      console.error('Error creating trial subscription:', error);
      throw error; // Lança o erro para que possa ser tratado no lado do cliente
    } else {
      await refreshSubscription();
    }
  };
  return (
    <SubscriptionContext.Provider value={{
      subscription,
      loading,
      refreshSubscription,
      createTrialSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};