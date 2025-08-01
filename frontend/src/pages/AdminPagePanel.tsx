import React, { useState } from 'react';
import { motion } from 'framer-motion';
import AdminSidebar from '../components/AdminSidebar';
import ProductsSection from '../components/ProductsSection';
import UsersSection from '../components/UsersSection';
import AnalyticsSection from '../components/AnalyticsSection';
import SettingsSection from '../components/SettingsSection';
import { useAppSelector } from '../app/hooks';
import { selectDarkMode } from '../features/ui/uiSlice';
import type { Page } from '../utils/Page';

type AdminSection = 'products' | 'users' | 'analytics' | 'settings';

interface AdminPanelPageProps {
  onPageChange: (page: Page, productId?: number) => void;
}

const AdminPanelPage: React.FC<AdminPanelPageProps> = ({ onPageChange }) => {
  const darkMode = useAppSelector(selectDarkMode);
  const [activeSection, setActiveSection] = useState<AdminSection>('analytics');

  const renderSection = () => {
    switch (activeSection) {
      case 'products':
        return <ProductsSection />;
      case 'users':
        return <UsersSection />;
      case 'analytics':
        return <AnalyticsSection />;
      case 'settings':
        return <SettingsSection />;
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