import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectCurrentProduct,
  selectCurrentProductLoading,
  selectCurrentProductError,
  setCurrentProductLoading,
  setCurrentProductError,
  setCurrentProduct,
  selectAllProducts,
  clearCurrentProduct,
} from '../features/products/productsSlice';
import { addOrUpdateCartItem } from '../features/cart/cartSlice';
import { selectDarkMode } from '../features/ui/uiSlice';
import Button from '../components/Button';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-toastify';
import type { Page } from '../utils/Page';

interface ProductDetailPageProps {
  productId: number;
  onPageChange: (page: Page, productId?: number) => void;
}

export default function ProductDetailPage({ productId, onPageChange }: ProductDetailPageProps) {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectCurrentProduct);
  const loading = useAppSelector(selectCurrentProductLoading);
  const error = useAppSelector(selectCurrentProductError);
  const allProducts = useAppSelector(selectAllProducts);
  const darkMode = useAppSelector(selectDarkMode);
  const [quantity, setQuantity] = useState(1);

  // Load product detail 
  useEffect(() => {
    async function fetchProduct() {
      try {
        dispatch(setCurrentProductLoading(true));
        dispatch(setCurrentProductError(null));
        const found = allProducts.find(p => p.id === productId);
        if (found) {
          dispatch(setCurrentProduct(found));
        } else {
          dispatch(setCurrentProductError('Product not found'));
          dispatch(clearCurrentProduct());
        }
      } catch (err) {
        dispatch(setCurrentProductError('Failed to load product'));
      } finally {
        dispatch(setCurrentProductLoading(false));
      }
    }
    fetchProduct();
  }, [productId, dispatch, allProducts]);

  const relatedProducts = allProducts
    .filter(p => p.id !== productId && p.category === product?.category)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addOrUpdateCartItem({ 
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl,
        },
        quantity,
        id: product.id,
        price: product.price * quantity,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      toast.success(`Added ${quantity} ${product.name}${quantity > 1 ? 's' : ''} to cart!`);
    }
  };

  if (loading) {
    return (
      <div className={`pt-20 min-h-screen ${darkMode ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
        <div className={`animate-spin rounded-full h-16 w-16 border-b-2 ${darkMode ? 'border-white' : 'border-black'}`}></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className={`pt-20 min-h-screen ${darkMode ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>Product not found</h2>
          <Button onClick={() => onPageChange('products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`pt-20 min-h-screen ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <motion.div
        className="max-w-7xl mx-auto px-6 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back Button */}
        <motion.button
          onClick={() => onPageChange('products')}
          className={`flex items-center transition-colors mb-8 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </motion.button>

        {/* Product Details */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-50">
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div>
              <p className={`text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{product.category}</p>
              <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>{product.name}</h1>
              <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>{formatCurrency(product.price)}</p>
            </div>

            <div>
              <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{product.description}</p>
            </div>

            {product.stockQuantity > 0 ? (
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className={`flex items-center border rounded-lg ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className={`p-2 transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className={`p-2 transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}`}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button onClick={handleAddToCart} size="lg" className="w-full">
                  ADD TO CART
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-red-500 font-medium">Out of Stock</p>
                <Button disabled size="lg" className="w-full">
                  NOTIFY WHEN AVAILABLE
                </Button>
              </div>
            )}

            {/* Product Details */}
            <div className={`border-t pt-6 space-y-4 ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h3 className="font-medium">Product Details</h3>
              <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Premium quality materials</li>
                <li>• Modern minimalist design</li>
                <li>• Comfortable urban fit</li>
                <li>• Sustainable production</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <ScrollReveal delay={0.6}>
            <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-black'}`}>You might also like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ScrollReveal key={relatedProduct.id} delay={0.7 + index * 0.1}>
                  <ProductCard product={relatedProduct} onClick={() => onPageChange('product', relatedProduct.id)} />
                </ScrollReveal>
              ))}
            </div>
          </ScrollReveal>
        )}
      </motion.div>
    </div>
  );
}
