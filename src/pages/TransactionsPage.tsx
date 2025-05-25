import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Filter } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import TransactionsList from '../components/transactions/TransactionsList';

const TransactionsPage = () => {
  const { transactions } = useTransactions();
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [typeFilter, setTypeFilter] = useState<'all' | 'entrada' | 'saida'>('all');
  const [accountFilter, setAccountFilter] = useState<'all' | 'pessoal' | 'empresa'>('all');

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.date);
    const matchesMonth = date.getMonth() === month && date.getFullYear() === year;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesAccount = accountFilter === 'all' || transaction.account === accountFilter;
    
    return matchesMonth && matchesType && matchesAccount;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Histórico de Transações</h1>
        <Link 
          to="/transactions/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Nova Transação
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-500">Filtros:</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
            {/* Month/Year selector */}
            <div>
              <label htmlFor="month-year" className="block text-sm font-medium text-gray-700 mb-1">
                Mês/Ano
              </label>
              <div className="flex space-x-2">
                <select
                  id="month"
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {[
                    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                  ].map((monthName, index) => (
                    <option key={index} value={index}>{monthName}</option>
                  ))}
                </select>
                <select
                  id="year"
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(yearOption => (
                    <option key={yearOption} value={yearOption}>{yearOption}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type filter */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                id="type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | 'entrada' | 'saida')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">Todos</option>
                <option value="entrada">Receitas</option>
                <option value="saida">Despesas</option>
              </select>
            </div>

            {/* Account filter */}
            <div>
              <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
                Conta
              </label>
              <select
                id="account"
                value={accountFilter}
                onChange={(e) => setAccountFilter(e.target.value as 'all' | 'pessoal' | 'empresa')}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="all">Todas</option>
                <option value="pessoal">Pessoal</option>
                <option value="empresa">Empresa</option>
              </select>
            </div>
          </div>
        </div>

        <TransactionsList transactions={filteredTransactions} />
      </div>
    </div>
  );
};

export default TransactionsPage;