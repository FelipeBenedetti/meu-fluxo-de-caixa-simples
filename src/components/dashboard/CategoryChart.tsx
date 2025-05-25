import { useEffect, useState } from 'react';
import { Transaction } from '../../contexts/TransactionContext';

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategoryChartProps {
  transactions: Transaction[];
}

const colors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
  '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#D946EF'
];

const CategoryChart = ({ transactions }: CategoryChartProps) => {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [chartType, setChartType] = useState<'expense' | 'income'>('expense');

  useEffect(() => {
    // Group transactions by category
    const categoriesMap = new Map<string, { name: string; value: number }>();
    
    transactions.forEach(transaction => {
      // Skip if we're looking at expenses but this is income, or vice versa
      if ((chartType === 'expense' && transaction.type === 'entrada') ||
          (chartType === 'income' && transaction.type === 'saida')) {
        return;
      }
      
      const categoryName = transaction.category?.name || 'Sem categoria';
      const currentTotal = categoriesMap.get(categoryName)?.value || 0;
      
      categoriesMap.set(categoryName, {
        name: categoryName,
        value: currentTotal + transaction.amount
      });
    });
    
    // Convert map to array and add colors
    const categoriesArray = Array.from(categoriesMap.values())
      .sort((a, b) => b.value - a.value)
      .map((category, index) => ({
        ...category,
        color: colors[index % colors.length]
      }));
    
    setCategoryData(categoriesArray);
  }, [transactions, chartType]);

  // Calculate total for percentages
  const total = categoryData.reduce((sum, category) => sum + category.value, 0);

  return (
    <div>
      <div className="flex justify-center space-x-2 mb-4">
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            chartType === 'expense' 
              ? 'bg-red-100 text-red-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setChartType('expense')}
        >
          Despesas
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            chartType === 'income' 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          onClick={() => setChartType('income')}
        >
          Receitas
        </button>
      </div>

      {categoryData.length > 0 ? (
        <div className="space-y-3">
          {/* Simple bar chart */}
          {categoryData.map((category, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{category.name}</span>
                <span className="text-gray-500">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(category.value)}
                  {' '}
                  ({Math.round((category.value / total) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full" 
                  style={{ 
                    width: `${(category.value / total) * 100}%`,
                    backgroundColor: category.color 
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          Não há dados de {chartType === 'expense' ? 'despesas' : 'receitas'} para exibir neste período.
        </div>
      )}
    </div>
  );
};

export default CategoryChart;