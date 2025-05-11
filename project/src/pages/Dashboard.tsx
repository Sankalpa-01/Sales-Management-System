import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { io, Socket } from 'socket.io-client';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const socket: Socket = io('http://localhost:5000'); // adjust if backend is hosted elsewhere

const Dashboard: React.FC = () => {
  const [sales, setSales] = useState<any[]>([]);

  // Initial mock data or fetch real data here if needed
  useEffect(() => {
    setSales([
      { sale_id: 1, total_amount: 2000, customer_name: 'Lalit Mohan Naik', date: '2025-04-01' },
      { sale_id: 2, total_amount: 150, customer_name: 'Subham Biswas', date: '2025-04-03' },
    ]);
  }, []);

  // Socket.IO listener
  useEffect(() => {
    socket.on('salesUpdate', (newSale) => {
      console.log('Received new sale:', newSale);
      setSales((prevSales) => [...prevSales, newSale]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Process data for chart
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
        backgroundColor: 'rgba(34,197,94,0.5)',
        borderColor: 'rgba(34,197,94,1)',
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  };

   return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-50 via-white to-teal-50 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">
          Real-Time Sales Dashboard
        </h1>
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;
