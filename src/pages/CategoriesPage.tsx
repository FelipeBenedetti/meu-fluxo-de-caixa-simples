import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useCategories, Category } from '../hooks/useCategories';
import toast from 'react-hot-toast';

const CategoriesPage = () => {
  const { categories, loading, createCategory, updateCategory, deleteCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editedName, setEditedName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCategoryName.trim()) {
      toast.error('O nome da categoria não pode estar vazio.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createCategory(newCategoryName);
      if (result) {
        toast.success('Categoria criada com sucesso!');
        setNewCategoryName('');
      } else {
        toast.error('Erro ao criar categoria.');
      }
    } catch (error) {
      toast.error('Erro ao criar categoria.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingCategory || !editedName.trim()) {
      toast.error('O nome da categoria não pode estar vazio.');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await updateCategory(editingCategory.id, editedName);
      if (success) {
        toast.success('Categoria atualizada com sucesso!');
        setEditingCategory(null);
      } else {
        toast.error('Erro ao atualizar categoria.');
      }
    } catch (error) {
      toast.error('Erro ao atualizar categoria.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    try {
      const success = await deleteCategory(id);
      if (success) {
        toast.success('Categoria excluída com sucesso!');
      } else {
        toast.error('Erro ao excluir categoria.');
      }
    } catch (error) {
      toast.error('Erro ao excluir categoria.');
      console.error(error);
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setEditedName(category.name);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditedName('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add new category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Nova Categoria</h2>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div>
              <label htmlFor="category-name" className="block text-sm font-medium text-gray-700">
                Nome da categoria
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="category-name"
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Ex: Alimentação, Transporte, Lazer..."
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !newCategoryName.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-r-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Categories list */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Suas Categorias</h2>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Carregando categorias...</p>
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center py-4 text-gray-500">
              Você ainda não tem categorias. Crie sua primeira categoria!
            </p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {categories.map((category) => (
                <li key={category.id} className="py-3">
                  {editingCategory?.id === category.id ? (
                    <form onSubmit={handleUpdateCategory} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="flex-1 min-w-0 block px-3 py-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting || !editedName.trim()}
                        className="inline-flex items-center p-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900">{category.name}</span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditing(category)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;