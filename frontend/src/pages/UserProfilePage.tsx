import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Package, Edit2, Save, X, MapPin, Phone, Mail, Calendar, Shield } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { 
  setEditMode,
  selectUserEditMode,
} from '../features/users/usersSlice';
import { 
  useGetUserQuery,
  useUpdateUserMutation 
} from '../features/users/usersApi';
import { selectDarkMode } from '../features/ui/uiSlice';
import Button from '../components/Button';
import ScrollReveal from '../components/ScrollReveal';
import { formatDate } from '../utils/formatters';
import { toast } from 'react-toastify';
import type { UserRequest } from '../types/user';
import type { Page } from '../utils/Page';
import { useGetOrdersByUserIdQuery } from '../features/orders/ordersApi';
import type { OrderStatus } from '../types/order';
import { selectUser, setUser } from '../features/auth/authSlice';
import { skipToken } from '@reduxjs/toolkit/query';

interface UserProfilePageProps {
  onPageChange: (page: Page, productId?: number) => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({ onPageChange }) => {
  const dispatch = useAppDispatch();
  const editMode = useAppSelector(selectUserEditMode);
   const authUser = useAppSelector(selectUser);
  const darkMode = useAppSelector(selectDarkMode);
  
 
  const currentUserId = authUser?.id;

  const { data: user, isLoading, error, refetch } = useGetUserQuery(currentUserId ?? skipToken);


  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);
  
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  
  const [formData, setFormData] = useState<UserRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    }
  });

  //orders data
  const {
    data: orders,
    isLoading: ordersLoading,
    isError: ordersError,
    refetch: refetchOrders,
  } = useGetOrdersByUserIdQuery(currentUserId ?? skipToken)

  useEffect(() => {
  if (currentUserId) {
    refetchOrders();
  }
}, [currentUserId, refetchOrders]);


  useEffect(() => {
  if (user) {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address ?? {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
      },
    });
  }
}, [user]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleSave = async () => {
  if (!user) return;

  try {
    const result = await updateUser({ id: user.id, user: formData }).unwrap();
    console.log(result); 
    toast.success('Profile updated successfully!');
    dispatch(setEditMode(false));
    refetch();
    } catch (error) {
      console.error('Failed to update user:', error);
      toast.error('Failed to update profile');
    }
  };


  const handleCancel = () => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address
      });
    }
    dispatch(setEditMode(false));
  };

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case 'DELIVERED':
      return darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-800';
    case 'PENDING':
    case 'CONFIRMED':
      return darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-100 text-yellow-800';
    case 'SHIPPED':
      return darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-800';
    case 'CANCELLED':
    default:
      return darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800';
  }
};

  if (isLoading) {
    return (
      <div className={`pt-20 min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className={`animate-spin rounded-full h-16 w-16 border-b-2 ${darkMode ? 'border-white' : 'border-black'}`}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`pt-20 min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            Failed to load profile
          </h2>
          <Button onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`pt-20 min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-black'}`}>
            User not found
          </h2>
          <Button onClick={() => onPageChange('home')}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`pt-20 min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'}`}>
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-black'}`}>
              My Profile
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your account settings and preferences
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => onPageChange('products')}
              variant="outline"
              size="sm"
            >
              Browse Products
            </Button>
            <Button
              onClick={() => onPageChange('home')}
              variant="outline"
              size="sm"
            >
              Back to Home
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Card */}
            <motion.div
              className={`${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-sm overflow-hidden`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <h2 className={`text-xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-black'}`}>
                    <User className="mr-2" size={20} />
                    Personal Information
                  </h2>
                  {!editMode ? (
                    <Button
                      onClick={() => dispatch(setEditMode(true))}
                      variant="outline"
                      size="sm"
                    >
                      <Edit2 size={16} className="mr-1" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSave}
                        size="sm"
                        disabled={isUpdating}
                      >
                        <Save size={16} className="mr-1" />
                        {isUpdating ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                      >
                        <X size={16} className="mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      First Name
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                        }`}
                      />
                    ) : (
                      <p className={`text-lg py-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                        {user.firstName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Last Name
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                        }`}
                      />
                    ) : (
                      <p className={`text-lg py-3 ${darkMode ? 'text-white' : 'text-black'}`}>
                        {user.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email
                    </label>
                    {editMode ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                        }`}
                      />
                    ) : (
                      <div className="flex items-center py-3">
                        <Mail size={16} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}>
                          {user.email}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone
                    </label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                          darkMode 
                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                        }`}
                      />
                    ) : (
                      <div className="flex items-center py-3">
                        <Phone size={16} className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        <p className={`text-lg ${darkMode ? 'text-white' : 'text-black'}`}>
                          {user.phone || 'Not provided'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Address Section */}
                <div className={`p-4 border ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'}`}>
                  <h3 className={`text-lg font-medium mb-4 flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <MapPin size={18} className="mr-2" />
                    Address Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Street Address
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="street"
                          value={formData.address.street}
                          onChange={handleAddressChange}
                          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                            darkMode 
                              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                          }`}
                        />
                      ) : (
                        <p className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.address?.street || 'Not provided'}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          City
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="city"
                            value={formData.address.city}
                            onChange={handleAddressChange}
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                              darkMode 
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                            }`}
                          />
                        ) : (
                          <p className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {user.address?.city || 'Not provided'}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          State
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="state"
                            value={formData.address.state}
                            onChange={handleAddressChange}
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                              darkMode 
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                            }`}
                          />
                        ) : (
                          <p className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {user.address?.state || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Country
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="country"
                            value={formData.address.country}
                            onChange={handleAddressChange}
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                              darkMode 
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                            }`}
                          />
                        ) : (
                          <p className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {user.address?.country || 'Not provided'}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Zip Code
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            name="zipCode"
                            value={formData.address.zipCode}
                            onChange={handleAddressChange}
                            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                              darkMode 
                                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                            }`}
                          />
                        ) : (
                          <p className={`py-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {user.address?.zipCode || 'Not provided'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <motion.div
              className={`${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-sm p-6`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className={`font-medium mb-4 flex items-center ${darkMode ? 'text-white' : 'text-black'}`}>
                <Shield className="mr-2" size={18} />
                Account Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Role</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                    {user.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Member Since</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                    January 2024
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Orders</span>
                  <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                    {orders?.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Order History */}
       <ScrollReveal delay={0.4}>
  <motion.div
    className={`mt-8 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'} shadow-sm overflow-hidden`}
  >
    <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <h2 className={`text-xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-black'}`}>
        <Package className="mr-2" size={20} />
        Order History
      </h2>
    </div>

    {ordersLoading ? (
      <div className="p-12 text-center">
        <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Loading orders...</p>
      </div>
    ) : ordersError ? (
      <div className="p-12 text-center">
        <p className={darkMode ? 'text-red-400' : 'text-red-600'}>
          Failed to load orders. Please try again.
        </p>
        <Button onClick={() => refetchOrders()} variant="outline">
          Retry
        </Button>
      </div>
    ) : orders?.length === 0 ? (
      <div className="p-12 text-center">
        <Package size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
        <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
          No orders yet
        </h3>
        <p className={`${darkMode ? 'text-gray-500' : 'text-gray-600'} mb-6`}>
          Start shopping to see your order history here
        </p>
        <Button onClick={() => onPageChange('products')} variant="outline">
          Browse Products
        </Button>
      </div>
    ) : (
      <div className="p-6">
        <div className="space-y-4">
          {orders?.map((order, index) => (
            <motion.div
              key={order.id}
              className={`border p-6 transition-colors ${
                darkMode
                  ? 'border-gray-800 bg-gray-800/50 hover:bg-gray-800'
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-black'}`}>
                    Order #{order.id}
                  </h4>
                  <div className="flex items-center mt-1">
                    <Calendar size={14} className={`mr-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-black'}`}>
                    ${order.totalAmount.toFixed(2)}
                  </p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.productName} × {item.quantity}
                    </span>
                    <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )}
  </motion.div>
</ScrollReveal>

      </motion.div>
    </div>
  );
};

export default UserProfilePage;