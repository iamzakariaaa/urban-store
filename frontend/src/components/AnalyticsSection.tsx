import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from 'lucide-react';
import { useAppSelector } from '../app/hooks';
import { selectDarkMode } from '../features/ui/uiSlice';

const AnalyticsSection: React.FC = () => {
  const darkMode = useAppSelector(selectDarkMode);

  const stats = [
    {
      label: 'Total Revenue',
      value: '$124,592',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Total Orders',
      value: '1,429',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'blue'
    },
    {
      label: 'Active Users',
      value: '892',
      change: '-2.1%',
      trend: 'down',
      icon: Users,
      color: 'purple'
    },
    {
      label: 'Page Views',
      value: '24,891',
      change: '+15.3%',
      trend: 'up',
      icon: Eye,
      color: 'orange'
    }
  ];

  const topProducts = [
    { name: 'Essential Hoodie', sales: 234, revenue: '$28,080' },
    { name: 'Urban Jacket', sales: 189, revenue: '$37,800' },
    { name: 'Street Joggers', sales: 156, revenue: '$13,260' },
    { name: 'Minimal Tee', sales: 143, revenue: '$6,435' },
    { name: 'Cargo Pants', sales: 98, revenue: '$9,310' }
  ];

  const recentActivity = [
    { action: 'New order placed', user: 'Alex Chen', time: '2 minutes ago', amount: '$245' },
    { action: 'Product updated', user: 'Admin', time: '15 minutes ago', product: 'Essential Hoodie' },
    { action: 'User registered', user: 'Jordan Smith', time: '1 hour ago' },
    { action: 'Order shipped', user: 'Taylor Kim', time: '2 hours ago', amount: '$189' },
    { action: 'Review posted', user: 'Casey Brown', time: '3 hours ago', rating: '5 stars' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Analytics
          </h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your store performance and insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
            darkMode 
              ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            <Calendar size={16} className="mr-2" />
            Last 30 days
          </button>
          <button className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
            darkMode 
              ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}>
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight;
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
              } shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${
                  stat.color === 'green'
                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    : stat.color === 'blue'
                    ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    : stat.color === 'purple'
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400'
                    : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  <TrendIcon size={16} className="mr-1" />
                  {stat.change}
                </div>
              </div>
              <div>
                <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className={`p-6 rounded-xl ${
            darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Top Products
            </h3>
            <TrendingUp size={20} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                } hover:bg-opacity-80 transition-colors`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-8 rounded-full ${
                    index === 0 ? 'bg-green-500' :
                    index === 1 ? 'bg-blue-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-orange-500' : 'bg-gray-500'
                  }`} />
                  <div>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {product.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {product.sales} sales
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {product.revenue}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className={`p-6 rounded-xl ${
            darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
          } shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Activity
            </h3>
            <div className={`w-3 h-3 rounded-full bg-green-500 animate-pulse`} />
          </div>
          
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`flex items-start space-x-3 p-4 rounded-lg ${
                  darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
                } hover:bg-opacity-80 transition-colors`}
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.action.includes('order') ? 'bg-green-500' :
                  activity.action.includes('updated') ? 'bg-blue-500' :
                  activity.action.includes('registered') ? 'bg-purple-500' :
                  activity.action.includes('shipped') ? 'bg-orange-500' : 'bg-gray-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <span className="font-medium">{activity.action}</span>
                    {activity.user && (
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {' '}by {activity.user}
                      </span>
                    )}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {activity.time}
                    </p>
                    {activity.amount && (
                      <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {activity.amount}
                      </span>
                    )}
                    {activity.rating && (
                      <span className={`text-xs font-medium ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                        {activity.rating}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Chart Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`p-8 rounded-xl ${
          darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        } shadow-lg`}
      >
        <h3 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Revenue Overview
        </h3>
        <div className={`h-64 rounded-lg flex items-center justify-center ${
          darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
        }`}>
          <div className="text-center">
            <TrendingUp size={48} className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h4 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-900'}`}>
              Chart Integration
            </h4>
            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Connect your preferred charting library here
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsSection;