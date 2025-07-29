import { motion } from 'framer-motion';
import { ShoppingBag, User, Search, Menu, Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  toggleCartDrawer,
  selectCartCount,
} from '../features/cart/cartSlice';
import {
  toggleDarkMode,
  toggleMobileMenu,
  selectDarkMode,
  selectMobileMenuOpen,
} from '../features/ui/uiSlice';
import type { Page } from '../utils/Page';

interface HeaderProps {
  currentPage: Page;
  onPageChange: (page: Page, productId?: number) => void;
}

const NAV_PAGES: Page[] = ['products', 'profile', 'admin'];
const MOBILE_NAV_PAGES: Page[] = ['home', 'products', 'profile', 'admin'];

function Header({ currentPage, onPageChange }: HeaderProps) {
  const dispatch = useAppDispatch();
  const cartItemCount = useAppSelector(selectCartCount);
  const darkMode = useAppSelector(selectDarkMode);
  const mobileMenuOpen = useAppSelector(selectMobileMenuOpen);

  const handleCartClick = () => dispatch(toggleCartDrawer());
  const handleDarkModeToggle = () => dispatch(toggleDarkMode());
  const handleMobileMenuToggle = () => dispatch(toggleMobileMenu());

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
              URBAN
            </button>

            <nav className="hidden md:flex space-x-6">
              {NAV_PAGES.map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`transition-colors ${
                    currentPage === page
                      ? darkMode
                        ? 'text-gray-300'
                        : 'text-gray-600'
                      : ''
                  } ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
                >
                  {page.toUpperCase()}
                </button>
              ))}
            </nav>
          </motion.div>

          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              className={`transition-colors ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
            >
              <Search size={20} />
            </button>

            <button
              onClick={handleDarkModeToggle}
              className={`transition-colors ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => onPageChange('profile')}
              className={`transition-colors ${darkMode ? 'hover:text-gray-300' : 'hover:text-gray-600'}`}
            >
              <User size={20} />
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
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
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
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        className={`fixed inset-0 z-40 md:hidden ${mobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
        initial={false}
        animate={{ opacity: mobileMenuOpen ? 1 : 0 }}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={handleMobileMenuToggle}
        />
        <motion.div
          className={`absolute right-0 top-0 h-full w-64 ${darkMode ? 'bg-black' : 'bg-white'} shadow-xl`}
          initial={{ x: '100%' }}
          animate={{ x: mobileMenuOpen ? 0 : '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="p-6 pt-20">
            <nav className="space-y-4">
              {MOBILE_NAV_PAGES.map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    onPageChange(page);
                    handleMobileMenuToggle();
                  }}
                  className={`block w-full text-left py-2 text-lg ${
                    darkMode
                      ? 'text-white hover:text-gray-300'
                      : 'text-black hover:text-gray-600'
                  } transition-colors`}
                >
                  {page.toUpperCase()}
                </button>
              ))}
            </nav>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

export default Header;
