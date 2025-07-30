import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/AdminSidebar';
import ProductsSection from '../components/ProductsSection';
import UsersSection from '../components/UsersSection';
import { useAppSelector } from '../app/hooks';
import { selectDarkMode } from '../features/ui/uiSlice';

type AdminSection = 'products' | 'users' | 'analytics' | 'settings';

interface AdminPanelPageProps {
  onPageChange: (page: string) => void;
}

const AdminPanelPage: React.FC<AdminPanelPageProps> = ({ onPageChange }) => {
  const darkMode = useAppSelector(selectDarkMode);
  const [activeSection, setActiveSection] = useState<AdminSection>('products');

  const renderSection = () => {
    switch (activeSection) {
      case 'products':
        return <ProductsSection />;
      case 'users':
        return <UsersSection />;
      case 'analytics':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Analytics
              </h1>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                View your store performance
              </p>
            </div>
            <div className={`p-12 text-center rounded-xl ${
              darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
            }`}>
              <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>
                📊
              </div>
              <h3 className={`text-lg font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>
                Analytics Coming Soon
              </h3>
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Advanced analytics and reporting features will be available here
              </p>
            </div>
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Settings
              </h1>
              <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Configure your store settings
              </p>
            </div>
            <div className={`p-12 text-center rounded-xl ${
              darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
            }`}>
              <div className={`text-6xl mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-300'}`}>
                ⚙️
              </div>
              <h3 className={`text-lg font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-900'
              }`}>
                Settings Panel Coming Soon
              </h3>
              <p className={`${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                Store configuration and settings will be available here
              </p>
            </div>
          </motion.div>
        );
      default:
        return <ProductsSection />;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        onPageChange={onPageChange}
      />

      {/* Main Content */}
      <div className="ml-64 pt-6">
        <div className="max-w-7xl mx-auto px-6 py-15">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderSection()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanelPage;