import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../contexts/TransactionContext';
import { useCategories } from '../hooks/useCategories';
import toast from 'react-hot-toast';

const NewTransactionPage = () => {
  const [type, setType] = useState<'entrada' | 'saida'>('entrada');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [account, setAccount] = useState<'pessoal' | 'empresa'>('pessoal');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { createTransaction } = useTransactions();
  const { categories, loading: categoriesLoading } = useCategories();
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description || !categoryId || !date) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createTransaction({
        type,
        amount: parseFloat(amount.replace(',', '.')),
        description,
        category_id: categoryId,
        date,
        account
      });

      toast.success('Transação criada com sucesso!');
      navigate('/transactions');
    } catch (error) {
      toast.error('Erro ao criar transação.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nova Transação</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Tipo de Transação</label>
            <div className="flex space-x-4">
              <label className={`
                flex items-center justify-center px-4 py-2 rounded-md cursor-pointer
                ${type === 'entrada' 
                  ? 'bg-green-100 text-green-800 border-2 border-green-500' 
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent'}
              `}>
                <input
                  type="radio"
                  value="entrada"
                  checked={type === 'entrada'}
                  onChange={() => setType('entrada')}
                  className="sr-only"
                />
                Receita
              </label>
              <label className={`
                flex items-center justify-center px-4 py-2 rounded-md cursor-pointer
                ${type === 'saida' 
                  ? 'bg-red-100 text-red-800 border-2 border-red-500' 
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent'}
              `}>
                <input
                  type="radio"
                  value="saida"
                  checked={type === 'saida'}
                  onChange={() => setType('saida')}
                  className="sr-only"
                />
                Despesa
              </label>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="text-sm font-medium text-gray-700 block mb-2">
              Valor (R$)*
            </label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => {
                // Allow only numbers and comma/dot
                const value = e.target.value.replace(/[^0-9.,]/g, '');
                setAmount(value);
              }}
              placeholder="0,00"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-2">
              Descrição*
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Salário, Aluguel, Compras no supermercado"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="text-sm font-medium text-gray-700 block mb-2">
              Categoria*
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={categoriesLoading}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="text-sm font-medium text-gray-700 block mb-2">
              Data*
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Account */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Conta*</label>
            <div className="flex space-x-4">
              <label className={`
                flex items-center justify-center px-4 py-2 rounded-md cursor-pointer
                ${account === 'pessoal' 
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-500' 
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent'}
              `}>
                <input
                  type="radio"
                  value="pessoal"
                  checked={account === 'pessoal'}
                  onChange={() => setAccount('pessoal')}
                  className="sr-only"
                />
                Pessoal
              </label>
              <label className={`
                flex items-center justify-center px-4 py-2 rounded-md cursor-pointer
                ${account === 'empresa' 
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-500' 
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent'}
              `}>
                <input
                  type="radio"
                  value="empresa"
                  checked={account === 'empresa'}
                  onChange={() => setAccount('empresa')}
                  className="sr-only"
                />
                Empresa
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/transactions')}
              className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Transação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewTransactionPage;