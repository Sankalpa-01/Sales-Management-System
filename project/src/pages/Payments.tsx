import { useEffect, useState } from 'react';
import React from 'react';
import { processPayment, getPaymentHistory } from '../utils/api';
import { toast } from 'react-toastify';

// Define the shape of the payment payload
interface PaymentPayload {
  sale_id: number;
  amount_paid: number;
  payment_method: string;
}

// Define the shape of a payment history item
interface PaymentHistoryItem {
  payment_id: number;
  sale_id: number;
  amount_paid: number;
  payment_method: string;
  payment_date: string;
}

const Payments: React.FC = () => {
  // State to handle new payment form data
  const [newPayment, setNewPayment] = useState<PaymentPayload>({
    sale_id: 0,
    amount_paid: 0,
    payment_method: '',
  });

  // State to handle fetched payment history
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);

  // Function to fetch payment history from the backend
  const fetchPaymentHistory = async () => {
    try {
      const response = await getPaymentHistory();
      setPaymentHistory(response); // Assuming response contains an array of payment history
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      toast.error('Failed to load payment history.');
    }
  };

  // Fetch payment history on component mount
  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  // Function to handle input field changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPayment((prev) => ({
      ...prev,
      [name]: name === 'sale_id' || name === 'amount_paid' ? Number(value) : value,
    }));
  };

  // Function to handle the payment submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await processPayment(newPayment); // Call API to process payment
      toast.success('Payment processed successfully!');
      setNewPayment({ sale_id: 0, amount_paid: 0, payment_method: '' }); // Reset form
      fetchPaymentHistory(); // Refresh payment history
    } catch (error) {
      console.error('Payment submission failed:', error);
      toast.error('Failed to process payment.');
    }
  };

  return (
    <div className="p-6 ">
      <h2 className="text-2xl font-bold mb-4 my-4">Process Payment</h2>
      <form
        onSubmit={handlePaymentSubmit}
        className="space-y-4 bg-white p-4 rounded shadow-md w-full max-w-md"
      >
        {/* Sale ID Input */}
        <input
          type="number"
          name="sale_id"
          value={newPayment.sale_id || ''}
          onChange={handleInputChange}
          placeholder="Sale ID"
          className="w-full p-2 border rounded"
          required
        />
        {/* Amount Paid Input */}
        <input
          type="number"
          name="amount_paid"
          value={newPayment.amount_paid || ''}
          onChange={handleInputChange}
          placeholder="Amount Paid"
          className="w-full p-2 border rounded"
          required
        />
        {/* Payment Method Select */}
        <select
          name="payment_method"
          value={newPayment.payment_method}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Payment Method</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
        </select>
        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-800"
        >
          Submit Payment
        </button>
      </form>

      <h3 className="text-2xl font-bold mt-8 mb-2">Payment History</h3>
      <div className="overflow-x-auto my-4">
        <table className="min-w-full table-auto text-sm border-collapse">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-3 text-left">Payment ID</th>
              <th className="p-3 text-left">Sale ID</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Render payment history */}
            {paymentHistory.map((payment, index) => (
              <tr
                key={payment.payment_id}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
              >
                <td className="p-3 border">{payment.payment_id}</td>
                <td className="p-3 border">{payment.sale_id}</td>
                <td className="p-3 border">₹{payment.amount_paid}</td>
                <td className="p-3 border capitalize">{payment.payment_method}</td>
                <td className="p-3 border">
                  {new Date(payment.payment_date).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Payments;
