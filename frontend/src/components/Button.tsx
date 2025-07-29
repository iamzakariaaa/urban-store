import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../app/hooks';
import { selectDarkMode } from '../features/ui/uiSlice';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';  // Add this line
}

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button', 
}: ButtonProps) => {
  const darkMode = useAppSelector(selectDarkMode);

  const baseClasses = 'font-medium transition-all duration-200 flex items-center justify-center';

  const variantClasses = {
    primary: darkMode
      ? 'bg-white text-black hover:bg-gray-200 disabled:bg-gray-600'
      : 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-300',
    secondary: darkMode
      ? 'bg-gray-800 text-white hover:bg-gray-700 disabled:bg-gray-700'
      : 'bg-gray-100 text-black hover:bg-gray-200 disabled:bg-gray-100',
    outline: darkMode
      ? 'border-2 border-white text-white bg-transparent hover:bg-white hover:text-black disabled:border-gray-600 disabled:text-gray-600'
      : 'border-2 border-black text-black bg-transparent hover:bg-black hover:text-white disabled:border-gray-300 disabled:text-gray-300',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <motion.button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
