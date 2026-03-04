import { useEffect, useState } from "react";
import React from "react";
import { processPayment, getPaymentHistory } from "../utils/api";
import { toast } from "react-toastify";

interface PaymentPayload {
  sale_id: number;
  amount_paid: number;
  payment_method: string;
}

interface PaymentHistoryItem {
  payment_id: number;
  sale_id: number;
  amount_paid: number;
  payment_method: string;
  payment_date: string;
}

const Payments: React.FC = () => {
  const [newPayment, setNewPayment] = useState<PaymentPayload>({
    sale_id: 0,
    amount_paid: 0,
    payment_method: "",
  });

  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>(
    []
  );

  const fetchPaymentHistory = async () => {
    try {
      const response = await getPaymentHistory();
      setPaymentHistory(response);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
      toast.error("Failed to load payment history.");
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewPayment((prev) => ({
      ...prev,
      [name]:
        name === "sale_id" || name === "amount_paid" ? Number(value) : value,
    }));
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await processPayment(newPayment); // Call API to process payment
      toast.success("Payment processed successfully!");
      setNewPayment({ sale_id: 0, amount_paid: 0, payment_method: "" }); // Reset form
      fetchPaymentHistory(); // Refresh payment history
    } catch (error) {
      console.error("Payment submission failed:", error);
      toast.error("Failed to process payment.");
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 bg-gradient-to-br from-white to-indigo-50">
      <h2 className="text-4xl font-bold mb-6 text-slate-900">Payments</h2>

      <form
        onSubmit={handlePaymentSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
      >
        <h3 className="text-2xl font-semibold text-slate-800">
          Process Payment
        </h3>

        <input
          type="number"
          name="sale_id"
          value={newPayment.sale_id || ""}
          onChange={handleInputChange}
          placeholder="Sale ID"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="number"
          name="amount_paid"
          value={newPayment.amount_paid || ""}
          onChange={handleInputChange}
          placeholder="Amount Paid"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <select
          name="payment_method"
          value={newPayment.payment_method}
          onChange={handleInputChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        >
          <option value="">Select Payment Method</option>
          <option value="cash">Cash</option>
          <option value="card">Card</option>
          <option value="upi">UPI</option>
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
        >
          Submit Payment
        </button>
      </form>

      <h3 className="text-2xl font-bold mt-10 mb-4 text-slate-800">
        Payment History
      </h3>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="min-w-full table-auto text-sm border-collapse">
          <thead className="bg-slate-900 text-white">
            <tr>
              <th className="p-3 text-left">Payment ID</th>
              <th className="p-3 text-left">Sale ID</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Method</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {paymentHistory.map((payment, index) => (
              <tr
                key={payment.payment_id}
                className={`hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                }`}
              >
                <td className="p-3 border">{payment.payment_id}</td>
                <td className="p-3 border">{payment.sale_id}</td>
                <td className="p-3 border">₹{payment.amount_paid}</td>
                <td className="p-3 border capitalize">
                  {payment.payment_method}
                </td>
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
