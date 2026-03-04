export interface User {
  user_id: number;
  username: string;
  email: string;
  user_role: 'admin' | 'salesperson' | 'manager';
  created_at: string;
}

export interface Customer {
  customer_id: number;
  username: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

export interface Product {
  product_id: number;
  product_name: string;
  product_description: string;
  price: number;
  stock_quantity: number;
  created_at: string;
}

export interface Sale {
  sale_id: number;
  user_id: number;
  customer_id: number;
  total_amount: number;
  sale_date: string;
}

export interface SaleItem {
  sale_item_id: number;
  sale_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface Payment {
  payment_id: number;
  sale_id: number;
  amount_paid: number;
  payment_method: 'cash' | 'credit_card' | 'paypal' | 'bank_transfer';
  payment_status: 'pending' | 'completed' | 'failed';
  payment_date: string;
}