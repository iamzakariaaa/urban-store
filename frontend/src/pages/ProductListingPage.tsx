import { motion } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectFilteredProducts,
  selectSearchQuery,
  selectFilters,
  setSearchQuery,
  setFilters,
  selectAllProducts,
} from '../features/products/productsSlice';
import { selectDarkMode } from '../features/ui/uiSlice'; // import your darkMode selector
import type { Page } from '../utils/Page';

interface ProductListingPageProps {
  onPageChange: (page: Page, productId?: number) => void;
}

export default function ProductListingPage({ onPageChange }: ProductListingPageProps) {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectFilteredProducts);
  const searchQuery = useAppSelector(selectSearchQuery);
  const filters = useAppSelector(selectFilters);
  const allProducts = useAppSelector(selectAllProducts);
  const darkMode = useAppSelector(selectDarkMode); // get dark mode state

  // Compute categories from allProducts (to list in filter dropdown)
  const categories = ['all', ...Array.from(new Set(allProducts.map(p => p.category)))];

  // Handlers
  const handleSearchChange = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleCategoryChange = (category: string) => {
    dispatch(setFilters({ category }));
  };

  const handleSortChange = (sortBy: 'name' | 'price-low' | 'price-high') => {
    dispatch(setFilters({ sortBy }));
  };

  return (
    <div className={`${darkMode ? 'bg-black text-white' : 'bg-white text-black'} pt-20 min-h-screen`}>
      <motion.div
        className="max-w-7xl mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">ALL PRODUCTS</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Discover our complete collection</p>
        </div>

        {/* Filters and Search */}
        <motion.div
          className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} flex flex-col lg:flex-row gap-4 mb-8 p-6 rounded-lg`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search
              className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} absolute left-3 top-1/2 transform -translate-y-1/2`}
              size={20}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`
                w-full pl-10 pr-4 py-2 rounded-lg 
                border
                ${darkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white'
                  : 'bg-white border-gray-200 text-black placeholder-gray-500 focus:ring-black focus:border-black'}
                focus:outline-none focus:ring-2
              `}
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className={`
                appearance-none rounded-lg px-4 py-2 pr-10 border 
                ${darkMode
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-white focus:border-white'
                  : 'bg-white border-gray-200 text-black focus:ring-black focus:border-black'}
                focus:outline-none focus:ring-2
              `}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <ChevronDown
              className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} absolute right-3 top-1/2 transform -translate-y-1/2`}
              size={20}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value as any)}
              className={`
                appearance-none rounded-lg px-4 py-2 pr-10 border
                ${darkMode
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-white focus:border-white'
                  : 'bg-white border-gray-200 text-black focus:ring-black focus:border-black'}
                focus:outline-none focus:ring-2
              `}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <ChevronDown
              className={`${darkMode ? 'text-gray-400' : 'text-gray-400'} absolute right-3 top-1/2 transform -translate-y-1/2`}
              size={20}
            />
          </div>
        </motion.div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <motion.div
            className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-center py-16`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p>Try adjusting your search or filters</p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} onClick={() => onPageChange('product', product.id)} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
