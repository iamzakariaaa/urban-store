import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
  selectAuthLoading,
  selectAuthError
} from '../features/auth/authSlice';
import { useLoginMutation } from '../features/auth/authApi';
import { selectDarkMode } from '../features/ui/uiSlice';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import type { Page } from '../utils/Page';

interface LoginPageProps {

  onPageChange: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onPageChange }) => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  const [login] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  dispatch(loginStart());

  try {
    const response = await login(formData).unwrap();
    dispatch(loginSuccess(response));
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));

    toast.success(`Welcome back, ${response.user.firstName}!`);

    if (response.user.role === 'ADMIN') {
      onPageChange('admin');
    } else {
      onPageChange('home');
    }
  } catch (error: any) {
    dispatch(loginFailure(error?.data || 'Login failed'));
    toast.error(error?.data || 'Login failed');
  }
};

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <motion.div
        className="max-w-md w-full mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <motion.button
            onClick={() => onPageChange('home')}
            className={`text-4xl font-bold tracking-wider mb-4 transition-colors ${
              darkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            URBAN
          </motion.button>
          <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-black'}`}>
            Welcome Back
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to your account to continue
          </p>
        </div>

        <motion.div
          className={`${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} rounded-xl shadow-lg p-8`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full pl-12 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`w-full pl-12 pr-12 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                    darkMode
                      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full flex items-center justify-center"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2" size={20} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <button
                onClick={() => onPageChange('signup')}
                className={`font-medium transition-colors ${
                  darkMode ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-600'
                }`}
              >
                Sign up
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
