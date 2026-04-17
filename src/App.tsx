import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import PoS from './pages/PoS';
import Transactions from './pages/Transactions';
import Webstore from './pages/Webstore';
import Login from './pages/Login';
import Insights from './pages/Insights';
import CRM from './pages/CRM';
import { Page } from './types';
import { useStore } from './store';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('webstore');
  const { isAuthenticated } = useStore();

  const adminPages: Page[] = ['dashboard', 'products', 'inventory', 'pos', 'transactions', 'insights', 'crm'];

  const renderPage = () => {
    // Protected pages logic
    if (adminPages.includes(currentPage) && !isAuthenticated) {
      return <Login setPage={setCurrentPage} />;
    }

    switch (currentPage) {
      case 'webstore':
        return <Webstore setPage={setCurrentPage} />;
      case 'login':
        return <Login setPage={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <Products />;
      case 'inventory':
        return <Inventory />;
      case 'pos':
        return <PoS />;
      case 'transactions':
        return <Transactions />;
      case 'insights':
        return <Insights />;
      case 'crm':
        return <CRM />;
      default:
        return <Webstore setPage={setCurrentPage} />;
    }
  };

  if (currentPage === 'webstore' || currentPage === 'login' || (!isAuthenticated && adminPages.includes(currentPage))) {
    return renderPage();
  }

  return (
    <Layout currentPage={currentPage} setPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}
