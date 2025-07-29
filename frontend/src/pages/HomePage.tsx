import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useGetProductsQuery } from '../features/products/productsApi';
import { selectAllProducts } from '../features/products/productsSlice';
import { selectDarkMode } from '../features/ui/uiSlice';
import { useAppSelector } from '../app/hooks';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ScrollReveal from '../components/ScrollReveal';
import type { Page } from '../utils/Page';

interface HomePageProps {
  onPageChange: (page: Page, productId?: number) => void;
}

const HomePage = ({ onPageChange }: HomePageProps) => {
  useGetProductsQuery();
  const darkMode = useAppSelector(selectDarkMode);
  const products = useAppSelector(selectAllProducts);

  const isLoading = products.length === 0;

  const featuredProducts = products.filter((product) => product.active);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <motion.section 
        className={`${darkMode ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen flex items-center`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-6xl lg:text-8xl font-bold mb-6 leading-tight">
              URBAN
              <br />
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>STYLE</span>
            </h1>
            <p className={`text-xl mb-8 max-w-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Minimalist streetwear designed for the modern urban lifestyle. 
              Clean lines, premium materials, bold statement.
            </p>
            <Button 
              onClick={() => onPageChange('products')}
              size="lg"
              variant="outline"
              className="group"
            >
              SHOP NOW 
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
          </motion.div>
          
          <motion.div
            className="relative"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg"
                alt="Urban Fashion"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Products */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>FEATURED</h2>
              <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Essential pieces for your urban wardrobe</p>
            </div>
          </ScrollReveal>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <LoadingSkeleton variant="card" count={4} />
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>No featured products found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ScrollReveal key={product.id} delay={index * 0.1}>
                  <ProductCard 
                    product={product}
                    onClick={() => onPageChange('product', product.id)}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
          
          <ScrollReveal delay={0.4}>
            <div className="text-center mt-12">
              <Button 
                onClick={() => onPageChange('products')}
                variant="outline"
                size="lg"
              >
                VIEW ALL PRODUCTS
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Brand Statement */}
      <section className={`py-20 ${darkMode ? 'bg-black' : 'bg-white'}`}>
        <ScrollReveal>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-black'}`}>DESIGNED FOR THE CITY</h2>
            <p className={`text-lg leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Every piece is crafted with intention. From premium materials to timeless silhouettes, 
              our collections embody the essence of urban minimalism. Less noise, more substance.
            </p>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

export default HomePage;
