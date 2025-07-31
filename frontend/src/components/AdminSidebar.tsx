import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Users,
  BarChart3,
  Settings,
  Home,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAppSelector } from '../app/hooks';
import { selectDarkMode } from '../features/ui/uiSlice';

type AdminSection = 'products' | 'users' | 'analytics' | 'settings';

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onPageChange: (page: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeSection,
  onSectionChange,
  onPageChange,
}) => {
  const darkMode = useAppSelector(selectDarkMode);
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'analytics' as AdminSection, label: 'Analytics', icon: BarChart3 },
    { id: 'products' as AdminSection, label: 'Products', icon: Package },
    { id: 'users' as AdminSection, label: 'Users', icon: Users },
    { id: 'settings' as AdminSection, label: 'Settings', icon: Settings },
  ];

  const sidebarBg = darkMode ? 'bg-black border-gray-800' : 'bg-white border-gray-200';
  const navPadding = collapsed ? 'p-2' : 'p-4';
  const itemPadding = collapsed ? 'px-2 py-3' : 'px-4 py-3';
  const bottomPadding = collapsed ? 'p-2' : 'p-4';

  return (
    <motion.div
      className={`h-screen fixed left-0 top-16 z-40 border-r ${sidebarBg} overflow-hidden`}
      initial={{ x: -264 }}
      animate={{ x: 0, width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
     
      <div
        className={`flex items-center justify-between ${navPadding} border-b ${
          darkMode ? 'border-gray-800' : 'border-gray-200'
        }`}
      >
        {!collapsed && (
          <span
            className={`text-lg font-semibold ${
              darkMode ? 'text-white' : 'text-black'
            }`}
          >
            Admin Panel
          </span>
        )}
        <motion.button
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          onClick={() => setCollapsed((c) => !c)}
          className={`inline-flex items-center justify-center rounded-md transition-colors
            ${darkMode ? 'text-gray-300 hover:bg-gray-900' : 'text-gray-700 hover:bg-gray-100'}
            ${collapsed ? 'w-8 h-8' : 'w-9 h-9'}`}
          whileTap={{ scale: 0.96 }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </motion.button>
      </div>

      {/* Navigation */}
      <nav className={`${navPadding} space-y-2`}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center ${itemPadding} rounded-lg text-left transition-all duration-200
                ${isActive
                  ? darkMode
                    ? 'bg-white text-black'
                    : 'bg-black text-white'
                  : darkMode
                  ? 'text-gray-300 hover:bg-gray-900 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-black'}
                ${collapsed ? 'justify-center' : ''}`}
              whileHover={{ x: isActive || collapsed ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon size={20} className={collapsed ? '' : 'mr-3'} />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div
        className={`absolute bottom-0 left-0 right-0 ${bottomPadding} space-y-2`}
      >
        <button
          onClick={() => onPageChange('home')}
          title={collapsed ? 'Back to Store' : undefined}
          className={`w-full flex items-center ${itemPadding} rounded-lg text-left transition-colors
            ${darkMode ? 'text-gray-400 hover:bg-gray-900 hover:text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}
            ${collapsed ? 'justify-center' : ''}`}
        >
          <Home size={20} className={collapsed ? '' : 'mr-3'} />
          {!collapsed && <span className="font-medium">Back to Store</span>}
        </button>

        <button
          title={collapsed ? 'Logout' : undefined}
          className={`w-full flex items-center ${itemPadding} rounded-lg text-left transition-colors
            ${darkMode ? 'text-red-400 hover:bg-red-900/20 hover:text-red-300' : 'text-red-600 hover:bg-red-50 hover:text-red-700'}
            ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className={collapsed ? '' : 'mr-3'} />
          {!collapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
