import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { TransactionProvider } from './contexts/TransactionContext';
import { Helmet } from 'react-helmet-async';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import NewTransactionPage from './pages/NewTransactionPage';
import CategoriesPage from './pages/CategoriesPage';
import SubscriptionPage from './pages/SubscriptionPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SubscriptionRoute from './components/auth/SubscriptionRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <TransactionProvider>
            <Helmet>
              <html lang="pt-BR" />
              <meta name="description" content="Controle financeiro simples e eficiente para MEIs e pequenos negócios. Gerencie receitas, despesas e fluxo de caixa em um só lugar." />
              <meta name="keywords" content="fluxo de caixa, controle financeiro, MEI, microempreendedor" />
            </Helmet>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<Layout />}>
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <SubscriptionRoute>
                      <DashboardPage />
                    </SubscriptionRoute>
                  </ProtectedRoute>
                } />
                <Route path="/transactions" element={
                  <ProtectedRoute>
                    <SubscriptionRoute>
                      <TransactionsPage />
                    </SubscriptionRoute>
                  </ProtectedRoute>
                } />
                <Route path="/transactions/new" element={
                  <ProtectedRoute>
                    <SubscriptionRoute>
                      <NewTransactionPage />
                    </SubscriptionRoute>
                  </ProtectedRoute>
                } />
                <Route path="/categories" element={
                  <ProtectedRoute>
                    <SubscriptionRoute>
                      <CategoriesPage />
                    </SubscriptionRoute>
                  </ProtectedRoute>
                } />
                <Route path="/subscription" element={
                  <ProtectedRoute>
                    <SubscriptionPage />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                } />
              </Route>
            </Routes>
          </TransactionProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;