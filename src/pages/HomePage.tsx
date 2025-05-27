import { Link } from 'react-router-dom';
import { CreditCard, PieChart, TrendingUp, Users } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Navigation */}
            <nav className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <CreditCard className="h-8 w-8 text-blue-500" />
                        <span className="ml-2 text-xl font-bold">Meu Fluxo de Caixa</span>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <Link
                            to="/login"
                            className="px-3 py-2 text-sm sm:text-base text-gray-300 hover:text-white transition-colors"
                        >
                            Entrar
                        </Link>
                        <Link
                            to="/register"
                            className="px-3 py-2 text-sm sm:text-base rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                        >
                            Criar Conta
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-6 py-24 text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-8">
                    Controle financeiro{' '}
                    <span className="text-blue-500">simples e eficiente</span>
                    <br />
                    para seu negócio
                </h1>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                    Gerencie suas finanças pessoais e empresariais em um só lugar.
                    Sem complicação, sem planilhas complexas.
                </p>
                <Link
                    to="/register"
                    className="inline-block px-8 py-4 text-xl font-bold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                    Experimente Grátis por 7 Dias
                </Link>
                <p className="mt-4 text-gray-500">
                    Sem compromisso. Cancele quando quiser.
                </p>
            </div>

            {/* Features */}
            <div className="container mx-auto px-6 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    <div className="text-center">
                        <div className="bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <PieChart className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Dashboard Intuitivo</h3>
                        <p className="text-gray-400">
                            Visualize suas finanças de forma clara e objetiva com gráficos e relatórios simples
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Controle Total</h3>
                        <p className="text-gray-400">
                            Separe contas pessoais e empresariais, categorize transações e acompanhe seu fluxo de caixa
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="h-8 w-8 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Feito para MEIs</h3>
                        <p className="text-gray-400">
                            Desenvolvido especialmente para microempreendedores e pequenos negócios
                        </p>
                    </div>
                </div>
            </div>

            {/* Pricing */}
            <div className="container mx-auto px-6 py-24">
                <div className="max-w-md mx-auto bg-gray-900 rounded-2xl p-8">
                    <h2 className="text-2xl font-bold text-center mb-8">Plano Único e Transparente</h2>
                    <div className="text-center mb-8">
                        <div className="text-4xl font-bold">
                            R$ 14,90
                            <span className="text-lg text-gray-400">/mês</span>
                        </div>
                    </div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center">
                            <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            </div>
                            Dashboard completo
                        </li>
                        <li className="flex items-center">
                            <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            </div>
                            Categorias ilimitadas
                        </li>
                        <li className="flex items-center">
                            <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            </div>
                            Contas pessoal e empresa
                        </li>
                        <li className="flex items-center">
                            <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-3">
                                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            </div>
                            Relatórios e gráficos
                        </li>
                    </ul>
                    <Link
                        to="/register"
                        className="block w-full py-3 text-center font-bold bg-blue-600 hover:bg-blue-700 rounded-xl"
                    >
                        Começar Agora
                    </Link>
                </div>
            </div>

            {/* Footer */}
            <footer className="container mx-auto px-6 py-12 border-t border-gray-800">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <CreditCard className="h-6 w-6 text-blue-500" />
                        <span className="ml-2 font-bold">Meu Fluxo de Caixa</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                        © 2025 Meu Fluxo de Caixa Simples. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;