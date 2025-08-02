import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, User, Search, Menu, Moon, Sun, LogIn, LogOut } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { toggleCartDrawer } from '../features/cart/cartSlice';
import { toggleDarkMode, toggleMobileMenu, selectDarkMode, selectMobileMenuOpen } from '../features/ui/uiSlice';
import { selectCartCount } from '../features/cart/cartSlice';
import { logout, selectIsAuthenticated, selectUser } from '../features/auth/authSlice';
import { toast } from 'react-toastify';
import type { Page } from '../utils/Page';

interface HeaderProps {
  currentPage: Page;
  onPageChange: (page: Page, productId?: number) => void;
}


const Header: React.FC<HeaderProps> = ({ currentPage, onPageChange }) => {
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(selectCartCount);
  const darkMode = useAppSelector(selectDarkMode);
  const mobileMenuOpen = useAppSelector(selectMobileMenuOpen);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const handleCartClick = () => {
    dispatch(toggleCartDrawer());
  };

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleMobileMenuToggle = () => {
    dispatch(toggleMobileMenu());
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    onPageChange('home');
  };
  return (
    <>
      <motion.header 
        className={`${darkMode ? 'bg-black text-white' : 'bg-white text-black'} py-4 px-6 fixed w-full top-0 z-50 backdrop-blur-md bg-opacity-95 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button 
              onClick={() => onPageChange('home')}
              className={`text-2xl font-bold tracking-wider transition-colors ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
            >
              URBAN DRIPP
            </button>
            
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => onPageChange('products')}
                className={`transition-colors ${currentPage === 'products' ? (darkMode ? 'text-gray-300' : 'text-gray-600') : ''} ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
              >
                SHOP
              </button>
              {isAuthenticated && (
                <>
                  <button 
                    onClick={() => onPageChange('profile')}
                    className={`transition-colors ${currentPage === 'profile' ? (darkMode ? 'text-gray-300' : 'text-gray-600') : ''} ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                  >
                    PROFILE
                  </button>
                  {user?.role === 'ADMIN' && (
                    <button 
                      onClick={() => onPageChange('admin')}
                      className={`transition-colors ${currentPage === 'admin' ? (darkMode ? 'text-gray-300' : 'text-gray-600') : ''} ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                    >
                      ADMIN
                    </button>
                  )}
                </>
              )}
            </nav>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button className={`transition-colors ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}>
              <Search size={20} />
            </button>
            <button 
              onClick={handleDarkModeToggle}
              className={`transition-colors ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
           
            
            <button 
              onClick={handleCartClick}
              className={`transition-colors relative ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
            >
              <ShoppingBag size={20} />
              {cartItemCount > 0 && (
                <motion.span 
                  className={`absolute -top-2 -right-2 ${darkMode ? 'bg-white text-black' : 'bg-black text-white'} text-xs rounded-full w-5 h-5 flex items-center justify-center`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {cartItemCount}
                </motion.span>
              )}
            </button>
            <button 
              onClick={handleMobileMenuToggle}
              className={`md:hidden transition-colors ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
            >
              <Menu size={20} />
            </button>
             {isAuthenticated ? (
              <>
                <button 
                  onClick={() => onPageChange('profile')}
                  className={`transition-colors ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                  title={`${user?.firstName} ${user?.lastName}`}
                >
                  <User size={20} />
                </button>
                <button 
                  onClick={handleLogout}
                  className={`transition-colors ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <button 
                onClick={() => onPageChange('login')}
                className={`transition-colors ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                title="Login"
              >
                <LogIn size={20} />
              </button>
            )}
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        className={`fixed inset-0 z-40 md:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        initial={false}
        animate={{ opacity: mobileMenuOpen ? 1 : 0 }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={handleMobileMenuToggle} />
        <motion.div
          className={`absolute right-0 top-0 h-full w-64 ${darkMode ? 'bg-black' : 'bg-white'} shadow-xl`}
          initial={{ x: '100%' }}
          animate={{ x: mobileMenuOpen ? 0 : '100%' }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="p-6 pt-20">
            <nav className="space-y-4">
              <button 
                onClick={() => { onPageChange('home'); handleMobileMenuToggle(); }}
                className={`block w-full text-left py-2 text-lg ${darkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'} transition-colors`}
              >
                HOME
              </button>
              <button 
                onClick={() => { onPageChange('products'); handleMobileMenuToggle(); }}
                className={`block w-full text-left py-2 text-lg ${darkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'} transition-colors`}
              >
                SHOP
              </button>
              
              {isAuthenticated ? (
                <>
                  <button 
                    onClick={() => { onPageChange('profile'); handleMobileMenuToggle(); }}
                    className={`block w-full text-left py-2 text-lg ${darkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'} transition-colors`}
                  >
                    PROFILE
                  </button>
                  {user?.role === 'ADMIN' && (
                    <button 
                      onClick={() => { onPageChange('admin'); handleMobileMenuToggle(); }}
                      className={`block w-full text-left py-2 text-lg ${darkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'} transition-colors`}
                    >
                      ADMIN
                    </button>
                  )}
                  <button 
                    onClick={() => { handleLogout(); handleMobileMenuToggle(); }}
                    className={`block w-full text-left py-2 text-lg ${darkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'} transition-colors`}
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => { onPageChange('login'); handleMobileMenuToggle(); }}
                    className={`block w-full text-left py-2 text-lg ${darkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'} transition-colors`}
                  >
                    LOGIN
                  </button>
                  <button 
                    onClick={() => { onPageChange('signup'); handleMobileMenuToggle(); }}
                    className={`block w-full text-left py-2 text-lg ${darkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'} transition-colors`}
                  >
                    SIGN UP
                  </button>
                </>
              )}
            </nav>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default Header;