import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useStripe } from '../hooks/useStripe';
import { STRIPE_PRODUCTS } from '../stripe-config';
import toast from 'react-hot-toast';
import { CreditCard, User } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { subscription } = useSubscription();
  const { createCheckoutSession, loading: stripeLoading } = useStripe();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('O nome não pode estar vazio.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await updateProfile(name);
      
      if (error) {
        toast.error('Erro ao atualizar perfil.');
        console.error(error);
      } else {
        toast.success('Perfil atualizado com sucesso!');
      }
    } catch (error) {
      toast.error('Ocorreu um erro ao atualizar o perfil.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!subscription) return;

    try {
      const response = await createCheckoutSession({
        priceId: STRIPE_PRODUCTS.MEU_FLUXO_DE_CAIXA_SIMPLES.priceId,
        mode: 'subscription',
        successUrl: `${window.location.origin}/profile?success=true`,
        cancelUrl: `${window.location.origin}/profile?success=false`,
      });

      if (response?.url) {
        window.location.href = response.url;
      } else {
        toast.error('Erro ao redirecionar para o checkout.');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Erro ao processar sua solicitação.');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatSubscriptionStatus = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      trial: {
        label: 'Período de teste',
        className: 'bg-yellow-100 text-yellow-800',
      },
      active: {
        label: 'Ativo',
        className: 'bg-green-100 text-green-800',
      },
      canceled: {
        label: 'Cancelado',
        className: 'bg-red-100 text-red-800',
      },
      incomplete: {
        label: 'Incompleto',
        className: 'bg-orange-100 text-orange-800',
      },
      past_due: {
        label: 'Pagamento atrasado',
        className: 'bg-red-100 text-red-800',
      },
    };

    return statusMap[status] || { label: status, className: 'bg-gray-100 text-gray-800' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Seu Perfil</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-10 w-10 text-blue-600 bg-blue-100 rounded-full p-2" />
            <h2 className="text-lg font-medium text-gray-900">Informações Pessoais</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={user?.email || ''}
                disabled
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">O email não pode ser alterado.</p>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>

        {/* Subscription Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-6">
            <CreditCard className="h-10 w-10 text-blue-600 bg-blue-100 rounded-full p-2" />
            <h2 className="text-lg font-medium text-gray-900">Informações da Assinatura</h2>
          </div>
          
          {subscription ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Plano atual</h3>
                <p className="mt-1 text-sm text-gray-900">{subscription.plan?.name || 'Padrão'}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1">
                  {subscription.isTrialActive ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Em período de teste
                    </span>
                  ) : (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      formatSubscriptionStatus(subscription.status).className
                    }`}>
                      {formatSubscriptionStatus(subscription.status).label}
                    </span>
                  )}
                </div>
              </div>
              
              {subscription.isTrialActive && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Período de teste</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    Termina em {formatDate(subscription.trial_end)}
                  </p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Preço</h3>
                <p className="mt-1 text-sm text-gray-900">
                  R$ {subscription.plan?.price.toFixed(2).replace('.', ',')} /mês
                </p>
              </div>
              
              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleManageSubscription}
                  disabled={stripeLoading}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {stripeLoading ? 'Processando...' : 'Gerenciar assinatura'}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">Você ainda não possui uma assinatura ativa.</p>
              <button
                type="button"
                onClick={() => {
                  window.location.href = '/subscription';
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Iniciar teste grátis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;