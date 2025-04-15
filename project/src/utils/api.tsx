import axios from 'axios';

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
  (config: import('axios').InternalAxiosRequestConfig) => {
    const token: string | null = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

// --- AUTH ---
export const registerUser = (userData: { username: string; email: string; password: string }) =>
  api.post('/auth/register', userData);

export const loginUser = (credentials: { email: string; password: string }) =>
  api.post('/auth/login', credentials);

// --- USERS ---
export const getAllUsers = () => api.get('/users');
export const getUserById = (id: number) => api.get(`/users/${id}`);
export const updateUser = (id: number, data: { username: string; email: string; password?: string }) =>
  api.put(`/users/${id}`, data);
export const deleteUser = (id: number) => api.delete(`/users/${id}`);

// --- CUSTOMERS ---
export const getAllCustomers = () => api.get('/customers');
export const getCustomerById = (id: number) => api.get(`/customers/${id}`);
export const addCustomer = (data: { username: string; email: string; phone: string; address?: string }) =>
  api.post('/customers', data);
export const updateCustomer = (id: number, data: { username: string; email: string; phone: string; address?: string }) =>
  api.put(`/customers/${id}`, data);
export const deleteCustomer = (id: number) => api.delete(`/customers/${id}`);

// --- PRODUCTS ---
export const getAllProducts = () => api.get('/products');
export const getProductById = (id: number) => api.get(`/products/${id}`);
export const addProduct = async (data: { product_name: string; product_description?: string; price: number; stock_quantity: number }) => {
  const response = await api.post('/products/add', data);
  return {
    data: {
      ...data,
      product_id: response.data.product_id
    }
  };
};

export const updateProduct = async (id: number, data: { product_name: string; product_description?: string; price: number; stock_quantity: number }) => {
  await api.put(`/products/${id}`, data);
  // Return a new object that combines the form data with the product_id
  // This matches what the frontend expects
  return {
    data: {
      ...data,
      product_id: id
    }
  };
};

export const deleteProduct = (id: number) => api.delete(`/products/${id}`);

// --- SALES ---
export const getAllSales = () => api.get('/sales');
export const getSaleById = (id: number) => api.get(`/sales/${id}`);
export const createSale = (data: {
  user_id: number;
  customer_id: number;
  total_amount: number;
  items: { product_id: number; quantity: number; price: number }[];
}) => api.post('/sales', data);
export const deleteSale = (id: number) => api.delete(`/sales/${id}`);

// --- PAYMENTS ---
export const processPayment = (data: { sale_id: number; amount_paid: number; payment_method: string }) =>
  api.post('/payments/process', data);

export const getPaymentHistory = async () => {
  try {
    const response = await api.get('/payments/history');
    // Check if the response data is in the expected format
    if (response && Array.isArray(response.data)) {
      return response.data;
    } else {
      console.error("Unexpected response format:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }
};

export const getPaymentsBySale = (saleId: number) => api.get(`/payments/${saleId}`);

export default api;