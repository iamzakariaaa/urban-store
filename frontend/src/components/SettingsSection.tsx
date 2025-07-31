import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette,
  Save,
  Eye,
  EyeOff,
  Moon,
  Sun
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectDarkMode, toggleDarkMode } from '../features/ui/uiSlice';
import Button from './Button';
import { toast } from 'react-toastify';

const SettingsSection: React.FC = () => {
  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'security' | 'appearance'>('general');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    storeName: 'URBAN',
    storeDescription: 'Premium streetwear for the modern urban lifestyle',
    contactEmail: 'contact@urban.store',
    currency: 'USD',
    timezone: 'America/New_York',
    language: 'en',
    emailNotifications: true,
    orderNotifications: true,
    marketingEmails: false,
    pushNotifications: true,
    twoFactorAuth: false,
    passwordExpiry: '90',
    sessionTimeout: '30'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // TODO: Connect to API to save settings
    toast.success('Settings saved successfully!');
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Store Name
          </label>
          <input
            type="text"
            value={settings.storeName}
            onChange={(e) => handleSettingChange('storeName', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
            }`}
          />
        </div>
        
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Contact Email
          </label>
          <input
            type="email"
            value={settings.contactEmail}
            onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
            }`}
          />
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Store Description
        </label>
        <textarea
          value={settings.storeDescription}
          onChange={(e) => handleSettingChange('storeDescription', e.target.value)}
          rows={3}
          className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
            darkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
          }`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Currency
          </label>
          <select
            value={settings.currency}
            onChange={(e) => handleSettingChange('currency', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white focus:ring-white focus:border-white' 
                : 'bg-white border-gray-300 text-gray-900 focus:ring-black focus:border-black'
            }`}
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Timezone
          </label>
          <select
            value={settings.timezone}
            onChange={(e) => handleSettingChange('timezone', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white focus:ring-white focus:border-white' 
                : 'bg-white border-gray-300 text-gray-900 focus:ring-black focus:border-black'
            }`}
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Language
          </label>
          <select
            value={settings.language}
            onChange={(e) => handleSettingChange('language', e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
              darkMode 
                ? 'bg-gray-800 border-gray-700 text-white focus:ring-white focus:border-white' 
                : 'bg-white border-gray-300 text-gray-900 focus:ring-black focus:border-black'
            }`}
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Email Notifications
        </h4>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'General email notifications', description: 'Receive updates about your store' },
            { key: 'orderNotifications', label: 'Order notifications', description: 'Get notified when new orders are placed' },
            { key: 'marketingEmails', label: 'Marketing emails', description: 'Receive promotional content and updates' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.label}
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings] as boolean}
                  onChange={(e) => handleSettingChange(item.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Push Notifications
        </h4>
        <div className="flex items-center justify-between">
          <div>
            <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Browser notifications
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Receive push notifications in your browser
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Authentication
        </h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Two-Factor Authentication
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Password Policy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Password Expiry (days)
            </label>
            <select
              value={settings.passwordExpiry}
              onChange={(e) => handleSettingChange('passwordExpiry', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-white focus:border-white' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-black focus:border-black'
              }`}
            >
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="never">Never</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Session Timeout (minutes)
            </label>
            <select
              value={settings.sessionTimeout}
              onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white focus:ring-white focus:border-white' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-black focus:border-black'
              }`}
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="120">2 hours</option>
            </select>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Change Password
        </h4>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className={`w-full px-4 py-3 pr-12 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                }`}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                  darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                New Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                }`}
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <input
                type="password"
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-white focus:border-white' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-black focus:border-black'
                }`}
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <Button variant="outline" size="sm">
            Update Password
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Theme Settings
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {darkMode ? <Moon size={20} /> : <Sun size={20} />}
            <div>
              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Dark Mode
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Switch between light and dark themes
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => dispatch(toggleDarkMode())}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <h4 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Brand Colors
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Primary', color: '#000000' },
            { name: 'Secondary', color: '#ffffff' },
            { name: 'Accent', color: '#6b7280' },
            { name: 'Success', color: '#10b981' }
          ].map((colorItem) => (
            <div key={colorItem.name} className="text-center">
              <div
                className="w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: colorItem.color }}
              />
              <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {colorItem.name}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {colorItem.color}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'appearance':
        return renderAppearanceSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Settings
          </h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Configure your store settings and preferences
          </p>
        </div>
        <Button onClick={handleSave} className="flex items-center space-x-2">
          <Save size={20} />
          <span>Save Changes</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? darkMode
                      ? 'border-white text-white'
                      : 'border-black text-black'
                    : darkMode
                    ? 'border-transparent text-gray-400 hover:text-gray-300'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`p-6 rounded-xl ${
          darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
        } shadow-lg`}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

export default SettingsSection;