
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Catalog } from './pages/Catalog';
import { FAQManager } from './pages/FAQManager';
import { Orders } from './pages/Orders';
import { Conversations } from './pages/Conversations';
import { Simulator } from './pages/Simulator';
import { Settings } from './pages/Settings';
import { Auth } from './pages/Auth';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Simple auth persistence simulator
  useEffect(() => {
    const authStatus = localStorage.getItem('replyrush_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('replyrush_auth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('replyrush_auth');
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'products': return <Catalog />;
      case 'faqs': return <FAQManager />;
      case 'orders': return <Orders />;
      case 'conversations': return <Conversations />;
      case 'simulator': return <Simulator />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout 
      currentPage={currentPage} 
      setCurrentPage={setCurrentPage} 
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
};

export default App;
