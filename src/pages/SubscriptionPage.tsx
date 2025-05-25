import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CreditCard } from 'lucide-react';
import { useSubscription } from '../contexts/SubscriptionContext';
import toast from 'react-hot-toast';

const SubscriptionPage = () => {
  const { subscription, createTrialSubscription } = useSubscription();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStartTrial = async () => {
    setLoading(true);
    try {
      await createTrialSubscription();
      toast.success('Período de teste iniciado com sucesso!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erro ao iniciar período de teste.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Assinatura</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {subscription ? (
          <div className="p-6">
            <div className="flex items-center justify-between pb-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Seu plano atual: {subscription.plan?.name || 'Padrao'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Status: {subscription.isTrialActive ? 'Em período de teste' : subscription.status === 'active' ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                R$ {subscription.plan?.price.toFixed(2).replace('.', ',')} /mês
              </span>
            </div>

            {subscription.isTrialActive && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Período de teste ativo</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Seu período de teste termina em {formatDate(subscription.trial_end)}. Após essa data, será necessário realizar o pagamento para continuar utilizando o sistema.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Detalhes do plano</h3>
              <dl className="mt-2 space-y-4">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Início do teste</dt>
                  <dd className="text-sm text-gray-900">{formatDate(subscription.trial_start)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Fim do teste</dt>
                  <dd className="text-sm text-gray-900">{formatDate(subscription.trial_end)}</dd>
                </div>
              </dl>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => {
                  toast.success('Em breve você poderá gerenciar sua assinatura aqui!');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Gerenciar assinatura
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Bem-vindo ao Meu Fluxo de Caixa Simples
              </h2>
              <p className="text-gray-500">
                Comece agora com 7 dias de teste gratuito, sem compromisso!
              </p>
            </div>
            
            <div className="mt-8 max-w-md mx-auto">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 text-center">Plano Padrao</h3>
                  <p className="mt-4 text-sm text-gray-500 text-center">
                    Tudo o que você precisa para controlar suas finanças
                  </p>
                  <p className="mt-8 flex justify-center items-baseline">
                    <span className="text-3xl font-extrabold text-gray-900">R$ 14,90</span>
                    <span className="text-sm font-medium text-gray-500">/mês</span>
                  </p>
                  
                  <ul className="mt-6 space-y-4">
                    {[
                      'Controle de entradas e saídas',
                      'Categorias personalizadas',
                      'Separação contas pessoal e empresa',
                      'Relatórios mensais',
                      'Dashboard com gráficos',
                      'Suporte por email'
                    ].map((feature, index) => (
                      <li key={index} className="flex">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="ml-3 text-sm text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={handleStartTrial}
                      disabled={loading}
                      className="w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Iniciando...' : 'Iniciar teste grátis de 7 dias'}
                    </button>
                    <p className="mt-2 text-xs text-gray-500 text-center">
                      Sem compromisso. Cancele a qualquer momento.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPage;