import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { 
  closeCartDrawer, 
  selectCartDrawerOpen, 
  selectCartItems, 
  selectCartTotal,
  optimisticUpdateQuantity,
} from '../features/cart/cartSlice';
import { selectDarkMode } from '../features/ui/uiSlice';
import Button from '../components/Button';
import  {formatCurrency } from '../utils/formatters';
import { toast } from 'react-toastify';

// Import RTK Query hooks for cart mutations
import { 
  useUpdateCartItemMutation, 
  useRemoveCartItemMutation 
} from '../features/cart/cartApi';

const CartDrawer = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectCartDrawerOpen);
  const cartItems = useAppSelector(selectCartItems);
  const cartTotal = useAppSelector(selectCartTotal);
  const darkMode = useAppSelector(selectDarkMode);

  // RTK Query mutation hooks
  const [updateCartItemApi] = useUpdateCartItemMutation();
  const [removeCartItemApi] = useRemoveCartItemMutation();

  const handleClose = () => {
    dispatch(closeCartDrawer());
  };

  const handleUpdateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 0) return; // prevent negative quantities

    // Optimistic UI update
    dispatch(optimisticUpdateQuantity({ productId, quantity: newQuantity }));

    try {
      await updateCartItemApi({ userId: 'current-user-id', productId, quantity: newQuantity }).unwrap();

      if (newQuantity === 0) {
        toast.success('Item removed from cart');
      } else {
        toast.success('Cart updated');
      }
    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  const handleRemoveItem = async (productId: number) => {
    dispatch(optimisticUpdateQuantity({ productId, quantity: 0 }));

    try {
      await removeCartItemApi({ userId: 'current-user-id', productId }).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      
    }
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    toast.info('Checkout functionality coming soon!');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          
          {/* Drawer */}
          <motion.div
            className={`fixed right-0 top-0 h-full w-full max-w-md ${darkMode ? 'bg-black text-white' : 'bg-white text-black'} shadow-2xl z-50 flex flex-col`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
              <h2 className="text-xl font-bold flex items-center">
                <ShoppingBag className="mr-2" size={20} />
                Cart ({cartItems.length})
              </h2>
              <button
                onClick={handleClose}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                aria-label="Close cart drawer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ShoppingBag size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                  <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                    Add some items to get started
                  </p>
                  <Button onClick={handleClose} variant="outline">
                    Continue Shopping
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      className={`flex items-center space-x-4 p-4 rounded-lg border ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      layout
                    >
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.product.name}</h4>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.product.category}
                        </p>
                        <p className="font-bold">{formatCurrency(item.product.price)}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                          className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                          aria-label={`Decrease quantity of ${item.product.name}`}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1 min-w-[40px] text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                          className={`p-1 rounded transition-colors ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                          aria-label={`Increase quantity of ${item.product.name}`}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        aria-label={`Remove ${item.product.name} from cart`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <motion.div
                className={`p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold">{formatCurrency(cartTotal)}</span>
                </div>
                <Button 
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                >
                  CHECKOUT
                </Button>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mt-2 text-center`}>
                  Secure checkout powered by Stripe
                </p>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
