import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../utils/api';
import type { Product } from '../types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    price: 0,
    stock_quantity: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await getAllProducts();
      setProducts(res.data || []);
      setError('');
    } catch {
      setError('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.product_description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  const openAddModal = () => {
    setCurrentProduct(null);
    setFormData({
      product_name: '',
      product_description: '',
      price: 0,
      stock_quantity: 0
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      product_name: product.product_name,
      product_description: product.product_description || '',
      price: Number(product.price),
      stock_quantity: Number(product.stock_quantity)
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentProduct(null);
    setFormData({
      product_name: '',
      product_description: '',
      price: 0,
      stock_quantity: 0
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock_quantity' ? Number(value) : value
    }));
  };

  const handleAddProduct = async () => {
    try {
      const res = await addProduct(formData);
      setProducts(prev => [...prev, {
        ...res.data,
        product_description: res.data.product_description || '',
        created_at: new Date().toISOString()
      }]);
      closeModal();
    } catch {
      setError('Failed to add product.');
    }
  };

  const handleUpdateProduct = async () => {
    if (!currentProduct) return;
    try {
      const res = await updateProduct(currentProduct.product_id, formData);
      setProducts(prev => prev.map(p =>
        p.product_id === currentProduct.product_id
          ? { ...res.data, product_description: res.data.product_description || '', created_at: p.created_at }
          : p
      ));
      closeModal();
    } catch {
      setError('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.product_id !== id));
    } catch {
      setError('Failed to delete product.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    currentProduct ? handleUpdateProduct() : handleAddProduct();
  };

  const formatPrice = (price: string | number) =>
    typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2);

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 my-7">Products</h1>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-indigo-600 rounded-full"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 bg-white rounded shadow">No products found.</div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-medium">Name</th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium">Description</th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium">Price</th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium">Stock</th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.map(product => (
                <tr key={product.product_id} className="hover:bg-indigo-50">
                  <td className="px-4 sm:px-6 py-4">{product.product_name}</td>
                  <td className="px-4 sm:px-6 py-4">{product.product_description}</td>
                  <td className="px-4 sm:px-6 py-4">₹{formatPrice(product.price)}</td>
                  <td className="px-4 sm:px-6 py-4">{product.stock_quantity}</td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex space-x-2">
                      <button onClick={() => openEditModal(product)} className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteProduct(product.product_id)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-full sm:max-w-lg">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">{currentProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="product_description"
                  value={formData.product_description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={closeModal} className="text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                  {currentProduct ? 'Save Changes' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
