import { useState, useEffect } from "react";
import { Plus, Search, Eye, Trash2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllSales, deleteSale, createSale } from "../utils/api";

interface SaleItem {
  product_id: number;
  quantity: number;
  price: number;
}

interface ApiSale {
  sale_id: number;
  user_id: number;
  customer_id: number;
  total_amount: number | string;
  sale_date: string;
  customer_name?: string;
  user_name?: string;
  items: SaleItem[];
}

export default function Sales() {
  const [sales, setSales] = useState<ApiSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSale, setNewSale] = useState({
    user_id: "",
    customer_id: "",
    items: [{ product_id: "", quantity: 1, price: "" }],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllSales();
        const processedData = data.data.map((sale: ApiSale) => ({
          ...sale,
          total_amount:
            typeof sale.total_amount === "string"
              ? parseFloat(sale.total_amount)
              : sale.total_amount,
        }));
        setSales(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch sales");
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, []);

  const handleDeleteSale = async (saleId: number) => {
    setDeleteLoading(saleId);
    try {
      await deleteSale(saleId);
      setSales(sales.filter((sale) => sale.sale_id !== saleId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete sale");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSales = sales.filter((sale) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      String(sale.sale_id).includes(searchLower) ||
      String(sale.user_id).includes(searchLower) ||
      String(sale.customer_id).includes(searchLower) ||
      (sale.customer_name &&
        sale.customer_name.toLowerCase().includes(searchLower)) ||
      sale.sale_date.toLowerCase().includes(searchLower) ||
      String(sale.total_amount).includes(searchLower) ||
      sale.items.some((item) => String(item.product_id).includes(searchLower))
    );
  });

  const handleAddItem = () => {
    setNewSale({
      ...newSale,
      items: [...newSale.items, { product_id: "", quantity: 1, price: "" }],
    });
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...newSale.items];
    newItems.splice(index, 1);
    setNewSale({ ...newSale, items: newItems });
  };

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...newSale.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setNewSale({ ...newSale, items: newItems });
  };

  const handleCreateSale = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const totalAmount = newSale.items.reduce(
        (sum, item) => sum + Number(item.quantity) * Number(item.price),
        0
      );

      const submissionData = {
        user_id: Number(newSale.user_id),
        customer_id: Number(newSale.customer_id),
        total_amount: totalAmount,
        items: newSale.items.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          price: Number(item.price),
        })),
      };

      const result = await createSale(submissionData);
      setSales([
        { ...result.data, total_amount: Number(result.data.total_amount) },
        ...sales,
      ]);
      setShowCreateModal(false);
      setNewSale({
        user_id: "",
        customer_id: "",
        items: [{ product_id: "", quantity: 1, price: "" }],
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create sale");
    }
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8 py-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-900 my-6">Sales</h1>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-indigo-700"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-5 w-5" />
          New Sale
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          placeholder="Search sales..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {loading ? (
        <div className="text-center py-8">Loading sales data...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="text-center py-8 bg-white rounded shadow">
          No sales found.
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Sale ID</th>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium">Sale Date</th>
                <th className="px-4 py-3 text-left font-medium">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left font-medium">Items</th>
                <th className="px-4 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSales.map((sale) => (
                <tr key={sale.sale_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{sale.sale_id}</td>
                  <td className="px-4 py-3">
                    {sale.customer_name || `Customer ID: ${sale.customer_id}`}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    ₹{Number(sale.total_amount).toFixed(2)}
                  </td>
                  <td
                    className="px-4 py-3 text-blue-600 hover:text-blue-800 cursor-pointer"
                    onClick={() => navigate(`/sales/${sale.sale_id}`)}
                  >
                    View Items
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/sales/edit/${sale.sale_id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteSale(sale.sale_id)}
                        disabled={deleteLoading === sale.sale_id}
                        className="text-red-600 hover:text-red-800"
                      >
                        {deleteLoading === sale.sale_id ? (
                          <svg
                            className="animate-spin h-5 w-5"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                          </svg>
                        ) : (
                          <Trash2 className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-screen">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create New Sale</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateSale} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    User ID
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newSale.user_id}
                    onChange={(e) =>
                      setNewSale({ ...newSale, user_id: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer ID
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={newSale.customer_id}
                    onChange={(e) =>
                      setNewSale({ ...newSale, customer_id: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Items
                </h3>
                {newSale.items.map((item, index) => (
                  <div key={index} className="flex flex-wrap gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Product ID"
                      value={item.product_id}
                      onChange={(e) =>
                        handleItemChange(index, "product_id", e.target.value)
                      }
                      className="flex-1 min-w-[80px] px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="flex-1 min-w-[60px] px-3 py-2 border border-gray-300 rounded-md"
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                      className="flex-1 min-w-[80px] px-3 py-2 border border-gray-300 rounded-md"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-blue-600 hover:text-blue-800 mt-1"
                >
                  Add Item
                </button>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                >
                  Create Sale
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
