// ProductTab.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../features/products/productsApi';
import type { ProductRequest, ProductResponse } from '../types/product';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import type { Page } from '../utils/Page';

const emptyProductForm: ProductRequest = {
  name: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  category: '',
  imageUrl: ''
};

interface ProductTabProps {
  onPageChange: (page: Page, productId?: number) => void;
}

const ProductTab: React.FC<ProductTabProps> = () => {
  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ProductRequest>(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const openAddModal = () => {
    setForm(emptyProductForm);
    setEditingProductId(null);
    setModalOpen(true);
  };

  const openEditModal = (product: ProductResponse) => {
    setForm({ ...product });
    setEditingProductId(product.id);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyProductForm);
    setEditingProductId(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stockQuantity' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProductId !== null) {
        await updateProduct({ id: editingProductId, ...form }).unwrap();
      } else {
        await createProduct(form).unwrap();
      }
      closeModal();
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id).unwrap();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Failed to load products.</p>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Plus size={24} className="mr-2" />
          Product Management
        </h2>
        <Button onClick={openAddModal} className="flex items-center">
          <Plus size={16} className="mr-1" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Stock</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product.id}>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                    <span>{product.name}</span>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.stockQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-900">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
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
        <Modal onClose={closeModal} title={editingProductId !== null ? 'Edit Product' : 'Add Product'}>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="input" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input" />
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="Price" required className="input" />
            <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} placeholder="Stock Quantity" required className="input" />
            <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required className="input" />
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" className="input" />
            <div className="flex items-center gap-2">
              <input id="active" type="checkbox"  onChange={e => setForm(prev => ({ ...prev, active: e.target.checked }))} />
              <label htmlFor="active" className="select-none">Active</label>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
              <Button type="submit">{editingProductId !== null ? 'Save' : 'Add'}</Button>
            </div>
          </form>
        </Modal>
      )}
    </motion.div>
  );
};

export default ProductTab;
