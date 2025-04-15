import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { getAllProducts, addProduct, updateProduct, deleteProduct } from '../utils/api';
import type { Product } from '../types';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
    price: 0,
    stock_quantity: 0
  });

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.product_description?.toLowerCase().includes(searchTerm.toLowerCase() || '')
  );

  // API calls
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await getAllProducts();
      setProducts(response.data);
      setError('');
    } catch (err) {
      setError('Error fetching products. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async () => {
    try {
      const response = await addProduct(formData);
      setProducts([...products, { ...response.data, product_description: response.data.product_description || '', created_at: new Date().toISOString() }]);
      closeModal();
      setError('');
    } catch (err) {
      setError('Error adding product. Please try again.');
    }
  };

  const handleUpdateProduct = async () => {
    if (!currentProduct) return;

    try {
      const response = await updateProduct(currentProduct.product_id, formData);
      setProducts(products.map(p =>
        p.product_id === currentProduct.product_id
          ? {
            ...response.data,
            product_description: response.data.product_description || '',
            created_at: p.created_at
          }
          : p
      ));
      closeModal();
      setError('');
    } catch (err) {
      setError('Error updating product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.product_id !== productId));
      setError('');
    } catch (err) {
      setError('Error deleting product. Please try again.');
    }
  };

  // Modal handlers
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
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      stock_quantity: typeof product.stock_quantity === 'string' ?
        parseInt(product.stock_quantity) : product.stock_quantity
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
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock_quantity' ? parseFloat(value) : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct) {
      handleUpdateProduct();
    } else {
      handleAddProduct();
    }
  };

  // Helper function to safely format price
  const formatPrice = (price: any): string => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    } else if (typeof price === 'string') {
      return parseFloat(price).toFixed(2);
    } else {
      return '0.00';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <button
          onClick={openAddModal}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700 transition-all"
        >
          <Plus className="h-5 w-5" />
          Add Product
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search products..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-indigo-500 focus:border-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 bg-white shadow-md rounded-lg">
          No products found. Add a new product or try a different search.
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Price</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Stock</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.product_id} className="hover:bg-indigo-50">
                  <td className="px-6 py-4 whitespace-nowrap">{product.product_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.product_description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{formatPrice(product.price)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{product.stock_quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.product_id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">{currentProduct ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <input
                    type="text"
                    name="product_name"
                    value={formData.product_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="product_description"
                    value={formData.product_description}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md"
                  ></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border-gray-300 rounded-md"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                  >
                    {currentProduct ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
