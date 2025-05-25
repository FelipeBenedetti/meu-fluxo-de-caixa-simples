import { Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Transaction, useTransactions } from '../../contexts/TransactionContext';
import toast from 'react-hot-toast';

interface TransactionsListProps {
  transactions: Transaction[];
  compact?: boolean;
}

const TransactionsList = ({ transactions, compact = false }: TransactionsListProps) => {
  const { deleteTransaction } = useTransactions();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteTransaction(id);
      toast.success('Transação excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir transação.');
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Nenhuma transação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Descrição
            </th>
            {!compact && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
            )}
            {!compact && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Conta
              </th>
            )}
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Valor
            </th>
            {!compact && (
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(transaction.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {transaction.description}
              </td>
              {!compact && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.category?.name || 'Sem categoria'}
                </td>
              )}
              {!compact && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {transaction.account}
                </td>
              )}
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'entrada' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </td>
              {!compact && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button 
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deletingId === transaction.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsList;