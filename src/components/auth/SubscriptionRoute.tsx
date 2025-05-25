import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useSubscription } from '../../contexts/SubscriptionContext';

const SubscriptionRoute = ({ children }: { children: ReactNode }) => {
  const { subscription, loading } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to subscription page if user doesn't have an active subscription or trial
  if (!subscription || !subscription.hasActiveSubscription) {
    return <Navigate to="/subscription" />;
  }

  return <>{children}</>;
};

export default SubscriptionRoute;