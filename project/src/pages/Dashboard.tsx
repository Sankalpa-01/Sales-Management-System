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
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Real-Time Sales Dashboard</h1>
      <Bar data={chartData} />
    </div>
  );
};

export default Dashboard;
