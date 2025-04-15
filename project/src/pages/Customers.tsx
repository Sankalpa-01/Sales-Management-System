import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { getAllCustomers, getCustomerById, addCustomer, deleteCustomer } from '../utils/api';
import type { Customer } from '../types';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    username: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch customers from the API
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getAllCustomers();
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setError('Failed to fetch customers. Please try again.');
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) =>
    customer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle fetching customer by ID
  const handleFetchCustomerById = async (customerId: number) => {
    try {
      const response = await getCustomerById(customerId);
      console.log('Customer fetched:', response.data);
    } catch (error) {
      console.error('Error fetching customer by ID:', error);
      setError('Failed to fetch customer details. Please try again.');
    }
  };

  // Handle deleting a customer
  const handleDeleteCustomer = async (customerId: number) => {
    try {
      await deleteCustomer(customerId);
      setCustomers(customers.filter(customer => customer.customer_id !== customerId));
    } catch (error) {
      console.error('Error deleting customer:', error);
      setError('Failed to delete customer. Please try again.');
    }
  };

  // Handle adding a new customer
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await addCustomer(newCustomer);
      setCustomers([...customers, response.data]); // Add new customer to the list
      setShowModal(false); // Close the modal
      setNewCustomer({ username: '', email: '', phone: '', address: '' }); // Reset form
    } catch (error) {
      console.error('Error adding customer:', error);
      setError('Failed to add customer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5" />
          Add Customer
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search customers..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Address</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredCustomers.map((customer) => (
              <tr key={customer.customer_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">{customer.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{customer.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleFetchCustomerById(customer.customer_id)}
                      className="text-blue-600 hover:text-blue-800 transition duration-300"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCustomer(customer.customer_id)}
                      className="text-red-600 hover:text-red-800 transition duration-300"
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

      {/* Modal for Adding a Customer */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-2xl mb-4">Add New Customer</h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleAddCustomer}>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={newCustomer.username}
                  onChange={(e) => setNewCustomer({ ...newCustomer, username: e.target.value })}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Phone"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Address"
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  required
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setError(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? 'Adding...' : 'Add Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
