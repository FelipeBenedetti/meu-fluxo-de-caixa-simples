import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
              onClick={toggleSidebar}
            >
              <span className="sr-only">Abrir menu</span>
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 lg:hidden">
              <h1 className="ml-3 text-xl font-bold text-blue-600">Meu Fluxo de Caixa</h1>
            </div>
          </div>

          <div className="flex items-center">
            <button className="p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <span className="sr-only">Ver notificações</span>
              <Bell className="h-6 w-6" />
            </button>
            
            <div className="ml-3 relative">
              <div className="flex items-center">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 hover:bg-gray-100"
                >
                  <span className="sr-only">Abrir menu de usuário</span>
                  <User className="h-8 w-8 rounded-full p-1 bg-gray-200 text-gray-600" />
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                    {user?.user_metadata?.name || 'Usuário'}
                  </span>
                </button>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="ml-3 p-1 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="sr-only">Sair</span>
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;