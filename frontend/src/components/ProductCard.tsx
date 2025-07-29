
import { motion } from 'framer-motion';
import { useAppSelector } from '../app/hooks';
import { selectDarkMode } from '../features/ui/uiSlice';
import type { ProductResponse } from '../types/product';

interface ProductCardProps {
  product: ProductResponse;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const darkMode = useAppSelector(selectDarkMode);

  return (
    <motion.div
      className={`${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
      } border overflow-hidden cursor-pointer group`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden">
        <motion.img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3
          className={`font-medium text-lg mb-1 transition-colors ${
            darkMode
              ? 'text-white group-hover:text-gray-300'
              : 'text-black group-hover:text-gray-600'
          }`}
        >
          {product.name}
        </h3>
        <p
          className={`text-sm mb-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          {product.category}
        </p>
        <div className="flex items-center justify-between">
          <span
            className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-black'
            }`}
          >
            ${product.price}
          </span>
          {product.stockQuantity <= 0 && (
            <span className="text-sm text-red-500">Out of Stock</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
