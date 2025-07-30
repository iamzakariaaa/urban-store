import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, TrendingUp, AlertCircle } from 'lucide-react';
import DataTable from './DataTable';
import AdminModal from './AdminModal';
import FormField from './FormField';
import Button from './Button';
import { useAppSelector } from '../app/hooks';
import { selectDarkMode } from '../features/ui/uiSlice';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from '../features/products/productsApi';
import type { ProductRequest, ProductResponse } from '../types/product';

const emptyProduct: ProductRequest = {
  name: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  category: '',
  imageUrl: ''
};

const ProductsSection: React.FC = () => {
  const darkMode = useAppSelector(selectDarkMode);
  const [activeTab, setActiveTab] = useState<'overview' | 'manage'>('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductResponse | null>(null);
  const [formData, setFormData] = useState<ProductRequest>(emptyProduct);

  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const stats = [
    { label: 'Total Products', value: products.length.toString(), icon: Package, color: 'blue' },
    {
      label: 'In Stock',
      value: products.filter(p => p.stockQuantity > 0).length.toString(),
      icon: TrendingUp,
      color: 'green'
    },
    {
      label: 'Out of Stock',
      value: products.filter(p => p.stockQuantity === 0).length.toString(),
      icon: AlertCircle,
      color: 'red'
    }
  ];

  const columns = [
    {
      key: 'image',
      label: 'Product',
      render: (_: unknown, row: ProductResponse) => (
        <div className="flex items-center space-x-3">
          <img
            src={row.imageUrl}
            alt={row.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {row.name}
            </div>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {row.category}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      render: (value: number) => `$${value.toFixed(2)}`
    },
    {
      key: 'stockQuantity',
      label: 'Stock',
      render: (value: number) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value > 0
            ? darkMode
              ? 'bg-green-900/30 text-green-400'
              : 'bg-green-100 text-green-800'
            : darkMode
            ? 'bg-red-900/30 text-red-400'
            : 'bg-red-100 text-red-800'
        }`}>
          {value > 0 ? `${value} in stock` : 'Out of stock'}
        </span>
      )
    }
  ];

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
    setModalOpen(true);
  };

  const handleEdit = (product: ProductResponse) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setModalOpen(true);
  };

  const handleDelete = async (product: ProductResponse) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(product.id).unwrap();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, ...formData }).unwrap();
      } else {
        await createProduct(formData).unwrap();
      }
      setModalOpen(false);
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stockQuantity' ? Number(value) : value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Products
          </h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Manage your product catalog
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center space-x-2">
          <Plus size={20} />
          <span>Add Product</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'manage', label: 'Manage Products' }
          ].map((tab) => (
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
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
                    <div className={`p-3 rounded-lg ${
                      stat.color === 'blue'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                        : stat.color === 'green'
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      <Icon size={24} />
                    </div>
                    <div className="ml-4">
                      <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {stat.value}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      ) : (
         <>
            {isLoading && (
            <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                Loading products...
            </div>
            )}

            {isError && (
            <div className="text-center py-10 text-red-500">
                Failed to load products. Please try again.
            </div>
            )}

            {!isLoading && !isError && (
            <DataTable
                columns={columns}
                data={products}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            )}
        </>
      )}

      {/* Modal */}
      <AdminModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProduct ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              required
            />
            <FormField
              label="Category"
              name="category"
              type="select"
              value={formData.category}
              onChange={handleChange}
              placeholder="Select category"
              required
              options={[
                { value: 'Hoodies', label: 'Hoodies' },
                { value: 'T-Shirts', label: 'T-Shirts' },
                { value: 'Pants', label: 'Pants' },
                { value: 'Jackets', label: 'Jackets' }
              ]}
            />
          </div>

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              required
            />
            <FormField
              label="Stock Quantity"
              name="stockQuantity"
              type="number"
              value={formData.stockQuantity}
              onChange={handleChange}
              placeholder="0"
              required
            />
          </div>

          <FormField
            label="Image URL"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />

          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </AdminModal>
    </div>
  );
};

export default ProductsSection;
