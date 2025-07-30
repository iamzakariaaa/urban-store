import React, { useState} from 'react';
import { motion } from 'framer-motion';
import { Plus, Users, UserCheck, UserX } from 'lucide-react';
import DataTable from './DataTable';
import AdminModal from './AdminModal';
import FormField from './FormField';
import Button from './Button';
import { useAppSelector } from '../app/hooks';
import { selectDarkMode } from '../features/ui/uiSlice';

import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation
} from '../features/users/usersApi';

const emptyUserForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: { street: '', city: '', state: '', country: '', zipCode: '' },
};

const UsersSection: React.FC = () => {
  const darkMode = useAppSelector(selectDarkMode);

  // RTK Query hooks
  const { data: users = [], isLoading, isError } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  // const [deleteUser] = useDeleteUserMutation();

  const [activeTab, setActiveTab] = useState<'overview' | 'manage'>('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState(emptyUserForm);

  // Replace mock stats with dynamic data if you want
  const stats = [
    { label: 'Total Users', value: users.length.toString(), icon: Users, color: 'blue' },
    {
      label: 'Active Users',
      value: 2,
      icon: UserCheck,
      color: 'green',
    },
    {
      label: 'Inactive Users',
      value: 0,
      icon: UserX,
      color: 'red',
    },
  ];

  // Columns for DataTable remain unchanged, but use real users data
  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (_: any, row: any) => (
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'
            }`}
          >
            {row.firstName?.[0]}
            {row.lastName?.[0]}
          </div>
          <div>
            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {row.firstName} {row.lastName}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Phone',
      render: (value: string) => value || 'N/A',
    },
    {
      key: 'address',
      label: 'Location',
      render: (address: any) => `${address.city}, ${address.state}`,
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            value === 'active'
              ? darkMode
                ? 'bg-green-900/30 text-green-400'
                : 'bg-green-100 text-green-800'
              : darkMode
              ? 'bg-red-900/30 text-red-400'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {value === 'active' ? 'Active' : 'Inactive'}
        </span>
      ),
    },
  ];

  const handleEdit = (user: any) => {
    setEditingUser(user);
    setFormData(user);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingUser(null);
    setFormData(emptyUserForm);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser({ id: editingUser.id, user: formData }).unwrap();
      } else {
        await createUser(formData).unwrap();
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to save user:', error);
    }
  };

  /* const handleDelete = async (user: any) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(user.id).unwrap();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  }; */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    address: {
      ...prev.address,
      [name]: value,
    },
  }));
};


  if (isLoading) return <p className="text-center py-6">Loading users...</p>;
  if (isError) return <p className="text-center py-6 text-red-600">Failed to load users.</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Users</h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your customer base</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Add User</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'manage', label: 'Manage Users' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? darkMode
                    ? 'border-white text-white'
                    : 'border-black text-black'
                  : darkMode
                  ? 'border-transparent text-gray-400 hover:text-gray-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-6 rounded-xl ${
                    darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-lg ${
                        stat.color === 'blue'
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                          : stat.color === 'green'
                          ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      <Icon size={24} />
                    </div>
                    <div className="ml-4">
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{stat.value}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ) : (
        <DataTable columns={columns} data={users} onEdit={handleEdit} onDelete={() => {}} />
      )}

      {/* Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add User'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
            <FormField
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
            />
            <FormField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          {/* Address Section */}
          <div
            className={`p-4 rounded-lg border ${
              darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <h3 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Address Information</h3>

            <div className="space-y-4">
              <FormField
                label="Street Address"
                name="street"
                value={formData.address.street}
                onChange={handleAddressChange}
                placeholder="Enter street address"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="City"
                  name="city"
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  placeholder="Enter city"
                />
                <FormField
                  label="State"
                  name="state"
                  value={formData.address.state}
                  onChange={handleAddressChange}
                  placeholder="Enter state"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Country"
                  name="country"
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  placeholder="Enter country"
                />
                <FormField
                  label="Zip Code"
                  name="zipCode"
                  value={formData.address.zipCode}
                  onChange={handleAddressChange}
                  placeholder="Enter zip code"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{editingUser ? 'Update User' : 'Add User'}</Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default UsersSection;
