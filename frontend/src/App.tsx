import React, {  useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { store } from './app/store';
import { useAppSelector } from './app/hooks';
import { selectDarkMode } from './features/ui/uiSlice';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import type { Page } from './utils/Page';
import AdminPanelPage from './pages/AdminPagePanel';



function AppContent() {
  const [currentPage, setCurrentPage] = React.useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = React.useState<number | null>(null);
  const darkMode = useAppSelector(selectDarkMode);

  const handlePageChange = (page: Page, productId?: number) => {
    setCurrentPage(page);
    if (page === 'product' && productId !== undefined) {
      setSelectedProductId(productId);
    } else {
      setSelectedProductId(null); // Clear product id when leaving product page
    }
  };

  // Auto-scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={handlePageChange} />;
      case 'products':
        return <ProductListingPage onPageChange={handlePageChange} />;
      case 'product':
         return selectedProductId !== null ? (
            <ProductDetailsPage
              productId={selectedProductId}
              onPageChange={handlePageChange}
            />
          ) : (
            
            <HomePage onPageChange={handlePageChange} />
          );
          case 'admin': // Add this case for admin panel
          return <AdminPanelPage onPageChange={handlePageChange} />;
          default:
          return <HomePage onPageChange={handlePageChange} />;
    }
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <Header
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <CartDrawer />

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.main>
      </AnimatePresence>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? 'dark' : 'light'}
        toastStyle={{
          backgroundColor: darkMode ? '#1f2937' : '#ffffff',
          color: darkMode ? '#ffffff' : '#000000',
        }}
      />
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
