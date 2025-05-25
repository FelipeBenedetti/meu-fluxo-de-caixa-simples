import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useTransactions } from '../contexts/TransactionContext';
import BalanceCard from '../components/dashboard/BalanceCard';
import TransactionsList from '../components/transactions/TransactionsList';
import CategoryChart from '../components/dashboard/CategoryChart';

const DashboardPage = () => {
  const { transactions } = useTransactions();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState({
    income: 0,
    expense: 0,
    balance: 0,
    personalBalance: 0,
    businessBalance: 0,
  });

  // Filter transactions for current month
  const currentMonthTransactions = transactions.filter(transaction => {
    const date = new Date(transaction.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  // Calculate monthly summary
  useEffect(() => {
    if (transactions.length > 0) {
      const filteredTransactions = transactions.filter(transaction => {
        const date = new Date(transaction.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      });

      let income = 0;
      let expense = 0;
      let personalIncome = 0;
      let personalExpense = 0;
      let businessIncome = 0;
      let businessExpense = 0;

      filteredTransactions.forEach(transaction => {
        if (transaction.type === 'entrada') {
          income += transaction.amount;
          if (transaction.account === 'pessoal') {
            personalIncome += transaction.amount;
          } else {
            businessIncome += transaction.amount;
          }
        } else {
          expense += transaction.amount;
          if (transaction.account === 'pessoal') {
            personalExpense += transaction.amount;
          } else {
            businessExpense += transaction.amount;
          }
        }
      });

      setMonthlyData({
        income,
        expense,
        balance: income - expense,
        personalBalance: personalIncome - personalExpense,
        businessBalance: businessIncome - businessExpense,
      });
    }
  }, [transactions, currentMonth, currentYear]);

  // Handle month navigation
  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Get month name
  const getMonthName = (month: number) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link 
          to="/transactions/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Nova Transação
        </Link>
      </div>

      {/* Month selector */}
      <div className="flex justify-center items-center space-x-4 bg-white rounded-lg p-3 shadow-sm">
        <button 
          onClick={handlePreviousMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-lg font-medium text-gray-900">
          {getMonthName(currentMonth)} {currentYear}
        </h2>
        <button 
          onClick={handleNextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BalanceCard 
          title="Saldo Total" 
          amount={monthlyData.balance} 
          icon={<DollarSign className="h-5 w-5" />} 
          className="bg-white" 
        />
        <BalanceCard 
          title="Receitas" 
          amount={monthlyData.income} 
          icon={<TrendingUp className="h-5 w-5" />} 
          className="bg-green-50" 
          iconClass="text-green-500" 
        />
        <BalanceCard 
          title="Despesas" 
          amount={monthlyData.expense} 
          icon={<TrendingDown className="h-5 w-5" />} 
          className="bg-red-50" 
          iconClass="text-red-500" 
        />
      </div>

      {/* Personal vs Business Accounts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BalanceCard 
          title="Conta Pessoal" 
          amount={monthlyData.personalBalance} 
          className="bg-white" 
        />
        <BalanceCard 
          title="Conta Empresa" 
          amount={monthlyData.businessBalance} 
          className="bg-white" 
        />
      </div>

      {/* Charts and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Categorias</h2>
          <CategoryChart transactions={currentMonthTransactions} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Últimas Transações</h2>
          <TransactionsList 
            transactions={currentMonthTransactions.slice(0, 5)} 
            compact={true} 
          />
          <div className="mt-4 text-center">
            <Link 
              to="/transactions" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todas as transações
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;