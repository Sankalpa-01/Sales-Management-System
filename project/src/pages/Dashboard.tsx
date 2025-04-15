import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Sample hardcoded data to simulate the backend data
const mockData = {
  users: [
    { username: 'Sankalpa Panda', email: 'sankalpa@gmail.com', role: 'admin' },
    { username: 'Subham Sahoo', email: 'subham@gmail.com', role: 'salesperson' },
    { username: 'Bibeka Naik', email: 'bibeka@gmail.com', role: 'manager' },
  ],
  customers: [
    { username: 'Lalit Mohan Naik', email: 'lalit@gmail.com', phone: '1234567890' },
    { username: 'Subham Biswas', email: 'subham@gmail.com', phone: '9876543210' },
    { username: 'Swostideep Nayak', email: 'swosti@gmail.com', phone: '9879898765' },
  ],
  products: [
    { product_name: 'Laptop', price: 1200, stock_quantity: 10 },
    { product_name: 'Smartphone', price: 800, stock_quantity: 15 },
    { product_name: 'Headphones', price: 150, stock_quantity: 30 },
  ],
  sales: [
    { sale_id: 1, total_amount: 2000, customer_name: 'Lalit Mohan Naik', date: '2025-04-01' },
    { sale_id: 2, total_amount: 150, customer_name: 'Subham Biswas', date: '2025-04-03' },
    { sale_id: 3, total_amount: 700, customer_name: 'Swostideep Nayak', date: '2025-04-05' },
  ],
};

const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);

  // Simulating API calls by loading mock data
  useEffect(() => {
    setUsers(mockData.users);
    setCustomers(mockData.customers);
    setProducts(mockData.products);
    setSales(mockData.sales);
  }, []);

  // Prepare data for the sales chart (Total sales by date)
  const salesData = sales.reduce((acc: any, sale: any) => {
    const saleDate = new Date(sale.date).toLocaleDateString();
    if (!acc[saleDate]) {
      acc[saleDate] = 0;
    }
    acc[saleDate] += sale.total_amount;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(salesData),
    datasets: [
      {
        label: 'Total Sales ($)',
        data: Object.values(salesData),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">Sales Management Dashboard</h1>

      {/* Graph Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sales Overview</h2>
        <div className="w-full h-80">
          <Bar data={chartData} />
        </div>
      </div>

      {/* Users Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="py-2 px-4">Username</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{user.username}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customers Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="py-2 px-4">Username</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Phone</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{customer.username}</td>
                  <td className="py-2 px-4">{customer.email}</td>
                  <td className="py-2 px-4">{customer.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-yellow-500 text-white">
              <tr>
                <th className="py-2 px-4">Product Name</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Stock Quantity</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{product.product_name}</td>
                  <td className="py-2 px-4">${product.price}</td>
                  <td className="py-2 px-4">{product.stock_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sales Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sales</h2>
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead className="bg-purple-500 text-white">
              <tr>
                <th className="py-2 px-4">Sale ID</th>
                <th className="py-2 px-4">Customer</th>
                <th className="py-2 px-4">Total Amount</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{sale.sale_id}</td>
                  <td className="py-2 px-4">{sale.customer_name}</td>
                  <td className="py-2 px-4">${sale.total_amount}</td>
                  <td className="py-2 px-4">{sale.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
