import React, { useState } from 'react';
import { motion } from 'framer-motion';
import UserTab from './UserTab';
import ProductTab from './ProductTab';
import type { Page } from '../utils/Page';



type Tab = 'products' | 'users';
interface AdminPanelPageProps {
  onPageChange: (page: Page, productId?: number) => void;
}

const AdminPanelPage: React.FC<AdminPanelPageProps> = ({ onPageChange }) => {
  const [activeTab, setActiveTab] = useState<Tab>('products');

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <motion.div
        className="max-w-7xl mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

        {/* Tab Navigation */}
        <nav className="mb-8 flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-2 border-b-2 font-medium text-sm ${
              activeTab === 'products'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-2 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Users
          </button>
        </nav>

        {/* Tab Content */}
        {activeTab === 'products' ? <ProductTab onPageChange={onPageChange} /> : <UserTab onPageChange={onPageChange} />}
      </motion.div>
    </div>
  );
};

export default AdminPanelPage;
