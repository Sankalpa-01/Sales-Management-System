import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { io } from "socket.io-client";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
);

const socket = io("http://localhost:5000");

const Dashboard: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [topProducts, setTopProducts] = useState<any[]>([]);

  useEffect(() => {
    socket.on("salesUpdate", (newSale) => {
      setSales((prev) => {
        const exists = prev.some((s) => s.sale_id === newSale.sale_id);
        if (!exists) return [...prev, newSale];
        return prev;
      });
    });

    return () => socket.off("salesUpdate");
  }, []);

  useEffect(() => {
    const revenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
    setTotalRevenue(revenue);

    const productMap: any = {};
    sales.forEach((sale) => {
      if (!productMap[sale.product_name]) productMap[sale.product_name] = 0;
      productMap[sale.product_name] += sale.total_amount;
    });
    const sorted = Object.entries(productMap)
      .map(([product, amount]) => ({ product, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
    setTopProducts(sorted);
  }, [sales]);

  const chartData = {
    labels: sales.map((sale) => new Date(sale.date).toLocaleDateString()),
    datasets: [
      {
        label: "Sales Amount",
        data: sales.map((sale) => sale.total_amount),
        backgroundColor: "rgba(34,197,94,0.5)",
        borderColor: "rgba(34,197,94,1)",
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Real-Time Sales Chart" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-center">Sales Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-600">
              Total Revenue
            </h2>
            <p className="text-2xl font-bold text-green-600">
              ${totalRevenue.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 col-span-2">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Top Selling Products
          </h2>
          <ul className="space-y-2">
            {topProducts.map((item, index) => (
              <li key={index} className="flex justify-between border-b pb-2">
                <span>{item.product}</span>
                <span className="font-bold">${item.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Live Sales Feed
          </h2>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {sales
              .slice(-10)
              .reverse()
              .map((sale) => (
                <div
                  key={sale.sale_id}
                  className="flex justify-between border-b pb-1 text-sm"
                >
                  <span>{sale.customer_name}</span>
                  <span>${sale.total_amount}</span>
                  <span>{new Date(sale.date).toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
