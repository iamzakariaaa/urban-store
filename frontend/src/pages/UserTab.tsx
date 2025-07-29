// UserTab.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation
} from '../features/users/usersApi';
import type { UserRequest, UserResponse } from '../types/user';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import type { Page } from '../utils/Page';

const emptyUserForm: UserRequest = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: { street: '', city: '', state: '', country: '', zipCode: '' },
};

interface UserTabProps {
  onPageChange: (page: Page, userId?: number) => void;
}

const UserTab: React.FC<UserTabProps> = () => {
  const { data: users = [], isLoading, isError } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  /* const [deleteUser] = useDeleteUserMutation(); */

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<UserRequest>(emptyUserForm);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const openAddModal = () => {
    setForm(emptyUserForm);
    setEditingUserId(null);
    setModalOpen(true);
  };

  const openEditModal = (user: UserResponse) => {
    setForm({ ...user });
    setEditingUserId(user.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyUserForm);
    setEditingUserId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUserId) {
        await updateUser({ id: editingUserId, user: form }).unwrap();
      } else {
        await createUser(form).unwrap();
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };

/*   const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(userId).unwrap();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  }; */

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Failed to load users.</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Plus size={24} className="mr-2" />
          User Management
        </h2>
        <Button onClick={openAddModal} className="flex items-center">
          <Plus size={16} className="mr-1" />
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.firstName} {user.lastName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.phone || 'N/A'}</td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-900">
                      <Edit2 size={16} />
                    </button>
                    <button /* onClick={() => handleDelete(user.id)} */ className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <Modal onClose={closeModal} title={editingUserId ? 'Edit User' : 'Add User'}>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="flex gap-4">
              <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="First Name" required className="input" />
              <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last Name" required className="input" />
            </div>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required className="input" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input" />

            <fieldset className="border p-3 rounded space-y-2">
              <legend className="font-semibold">Address</legend>
              <input name="street" value={form.address.street} onChange={handleAddressChange} placeholder="Street" className="input" />
              <input name="city" value={form.address.city} onChange={handleAddressChange} placeholder="City" className="input" />
              <input name="state" value={form.address.state} onChange={handleAddressChange} placeholder="State" className="input" />
              <input name="country" value={form.address.country} onChange={handleAddressChange} placeholder="Country" className="input" />
              <input name="zipCode" value={form.address.zipCode} onChange={handleAddressChange} placeholder="Zip Code" className="input" />
            </fieldset>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit">{editingUserId ? 'Save' : 'Add'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </motion.div>
  );
};

export default UserTab;
