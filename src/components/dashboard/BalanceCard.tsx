import { ReactNode } from 'react';

interface BalanceCardProps {
  title: string;
  amount: number;
  icon?: ReactNode;
  className?: string;
  iconClass?: string;
}

const BalanceCard = ({ 
  title, 
  amount, 
  icon, 
  className = 'bg-white', 
  iconClass = 'text-blue-500' 
}: BalanceCardProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className={`rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {icon && <div className={`p-2 rounded-full ${iconClass}`}>{icon}</div>}
      </div>
      <p className={`mt-2 text-2xl font-semibold ${amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {formatCurrency(amount)}
      </p>
    </div>
  );
};

export default BalanceCard;