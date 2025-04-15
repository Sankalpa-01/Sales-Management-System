import { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// Type definitions
type SaleItem = {
  product_id: number;
  quantity: number;
  price: number;
};

type Sale = {
  sale_id: number;
  customer_id: number;
  user_id: number;
  total_amount: number;
  sale_date: string;
  items: SaleItem[];
};

type Product = {
  product_id: number;
  product_name: string;
  product_description: string;
  price: number;
  stock_quantity: number;
};

type ProductSalesData = {
  name: string;
  sales: number;
  revenue: number;
};

type MonthlySalesData = {
  month: string;
  sales: number;
};

type SummaryData = {
  totalSales: number;
  averageOrderValue: number;
  totalProductsSold: number;
  salesGrowth: number;
  aovGrowth: number;
  productSalesGrowth: number;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function Reports() {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [productData, setProductData] = useState<ProductSalesData[]>([]);
  const [monthlySalesData, setMonthlySalesData] = useState<MonthlySalesData[]>([]);
  const [summary, setSummary] = useState<SummaryData>({
    totalSales: 0,
    averageOrderValue: 0,
    totalProductsSold: 0,
    salesGrowth: 0,
    aovGrowth: 0,
    productSalesGrowth: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API calls with mock data
        const [salesResult, productsResult] = await Promise.all([
          fetchMockSalesData(),
          fetchMockProductsData()
        ]);
        
        // Process sales data
        setSalesData(salesResult);
        
        // Process products data
        const processedProductData = processProductData(salesResult, productsResult);
        setProductData(processedProductData.productDataArray);
        
        // Generate monthly sales data
        const monthlySales = generateMonthlySalesData(salesResult);
        setMonthlySalesData(monthlySales);
        
        // Calculate summary metrics
        setSummary(calculateSummaryMetrics(salesResult, processedProductData));
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch report data');
        setIsLoading(false);
        console.error('Error fetching report data:', err);
      }
    };

    fetchData();
  }, []);

  // Mock data fetch functions
  const fetchMockSalesData = async (): Promise<Sale[]> => {
    // In a real app, replace with actual API call
    return [
      {
        sale_id: 1,
        customer_id: 1,
        user_id: 2,
        total_amount: 2000,
        sale_date: '2023-04-01',
        items: [
          { product_id: 1, quantity: 1, price: 1200 },
          { product_id: 2, quantity: 1, price: 800 }
        ]
      },
      {
        sale_id: 2,
        customer_id: 2,
        user_id: 3,
        total_amount: 150,
        sale_date: '2023-04-05',
        items: [
          { product_id: 3, quantity: 1, price: 150 }
        ]
      },
      {
        sale_id: 3,
        customer_id: 3,
        user_id: 4,
        total_amount: 400,
        sale_date: '2023-04-10',
        items: [
          { product_id: 4, quantity: 2, price: 200 }
        ]
      },
      {
        sale_id: 4,
        customer_id: 4,
        user_id: 5,
        total_amount: 1000,
        sale_date: '2023-04-15',
        items: [
          { product_id: 5, quantity: 2, price: 500 }
        ]
      },
      {
        sale_id: 5,
        customer_id: 5,
        user_id: 2,
        total_amount: 500,
        sale_date: '2023-04-20',
        items: [
          { product_id: 5, quantity: 1, price: 500 }
        ]
      }
    ];
  };

  const fetchMockProductsData = async (): Promise<Product[]> => {
    // In a real app, replace with actual API call
    return [
      {
        product_id: 1,
        product_name: 'Laptop',
        product_description: 'High-performance laptop',
        price: 1200,
        stock_quantity: 10
      },
      {
        product_id: 2,
        product_name: 'Smartphone',
        product_description: 'Latest model smartphone',
        price: 800,
        stock_quantity: 15
      },
      {
        product_id: 3,
        product_name: 'Headphones',
        product_description: 'Noise-cancelling headphones',
        price: 150,
        stock_quantity: 30
      },
      {
        product_id: 4,
        product_name: 'Smartwatch',
        product_description: 'Fitness tracking smartwatch',
        price: 200,
        stock_quantity: 25
      },
      {
        product_id: 5,
        product_name: 'Tablet',
        product_description: '10-inch tablet with stylus support',
        price: 500,
        stock_quantity: 20
      }
    ];
  };

  // Data processing functions
  const processProductData = (sales: Sale[], products: Product[]) => {
    const productSalesMap = new Map<number, {
      product_id: number;
      name: string;
      description: string;
      price: number;
      stock: number;
      quantitySold: number;
      revenue: number;
    }>();

    // Initialize product sales map with all products
    products.forEach((product) => {
      productSalesMap.set(product.product_id, {
        product_id: product.product_id,
        name: product.product_name,
        description: product.product_description,
        price: product.price,
        stock: product.stock_quantity,
        quantitySold: 0,
        revenue: 0
      });
    });
    
    // Calculate sales for each product
    let totalQuantitySold = 0;
    let totalRevenue = 0;
    
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const productInfo = productSalesMap.get(item.product_id);
        if (productInfo) {
          productInfo.quantitySold += item.quantity;
          productInfo.revenue += item.price * item.quantity;
          totalQuantitySold += item.quantity;
          totalRevenue += item.price * item.quantity;
        }
      });
    });
    
    // Convert map to array for charts
    const productDataArray = Array.from(productSalesMap.values())
      .filter(product => product.quantitySold > 0)
      .map(product => ({
        name: product.name,
        sales: product.quantitySold,
        revenue: product.revenue
      }));
    
    return {
      productDataArray,
      totalQuantitySold,
      totalRevenue
    };
  };

  const generateMonthlySalesData = (sales: Sale[]): MonthlySalesData[] => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData: MonthlySalesData[] = Array(12).fill(null).map((_, i) => ({
      month: monthNames[i],
      sales: 0
    }));
    
    sales.forEach((sale) => {
      const saleDate = new Date(sale.sale_date);
      const monthIndex = saleDate.getMonth();
      monthlyData[monthIndex].sales += sale.total_amount;
    });
    
    const nonEmptyMonths = monthlyData.filter(m => m.sales > 0);
    return nonEmptyMonths.length > 0 ? nonEmptyMonths : monthlyData.slice(6);
  };

  const calculateSummaryMetrics = (
    sales: Sale[], 
    { totalQuantitySold, totalRevenue }: { totalQuantitySold: number, totalRevenue: number }
  ): SummaryData => {
    const avgOrderValue = sales.length > 0 
      ? totalRevenue / sales.length
      : 0;
    
    return {
      totalSales: totalRevenue,
      averageOrderValue: avgOrderValue,
      totalProductsSold: totalQuantitySold,
      salesGrowth: 8.5, // Would come from comparing to previous period
      aovGrowth: -2.1, // Would come from comparing to previous period
      productSalesGrowth: 12.3 // Would come from comparing to previous period
    };
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading reports...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center h-64 flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-semibold text-gray-900">Sales Management Reports</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard 
          title="Total Sales" 
          value={summary.totalSales} 
          isCurrency 
          growth={summary.salesGrowth} 
        />
        <SummaryCard 
          title="Average Order Value" 
          value={summary.averageOrderValue} 
          isCurrency 
          growth={summary.aovGrowth} 
        />
        <SummaryCard 
          title="Total Products Sold" 
          value={summary.totalProductsSold} 
          isCurrency={false} 
          growth={summary.productSalesGrowth} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartCard title="Monthly Sales">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Revenue']} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#4f46e5" 
                name="Sales (₹)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Product Sales">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar 
                yAxisId="left" 
                dataKey="sales" 
                fill="#8884d8" 
                name="Units Sold" 
              />
              <Bar 
                yAxisId="right" 
                dataKey="revenue" 
                fill="#82ca9d" 
                name="Revenue (₹)" 
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Product Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="sales"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {productData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, _, { payload }) => 
                  [`${value} units`, (payload as ProductSalesData).name]
                } 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Sales</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <TableHeader>Sale ID</TableHeader>
                <TableHeader>Customer ID</TableHeader>
                <TableHeader>Salesperson ID</TableHeader>
                <TableHeader>Total Amount</TableHeader>
                <TableHeader>Items</TableHeader>
                <TableHeader>Actions</TableHeader>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {salesData.slice(0, 5).map((sale) => (
                <tr key={sale.sale_id}>
                  <TableCell>{sale.sale_id}</TableCell>
                  <TableCell>{sale.customer_id}</TableCell>
                  <TableCell>{sale.user_id}</TableCell>
                  <TableCell>₹{sale.total_amount.toFixed(2)}</TableCell>
                  <TableCell>{sale.items.length}</TableCell>
                  <TableCell>
                    <button className="text-indigo-600 hover:text-indigo-900 mr-2">
                      View
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </TableCell>
                </tr>
              ))}
              {salesData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No sales data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Reusable components
type SummaryCardProps = {
  title: string;
  value: number;
  isCurrency: boolean;
  growth: number;
};

const SummaryCard = ({ title, value, isCurrency, growth }: SummaryCardProps) => (
  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-2 text-2xl font-semibold text-gray-900">
      {isCurrency ? '₹' : ''}
      {isCurrency 
        ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
        : value}
    </p>
    <p className={`mt-1 text-sm ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {growth >= 0 ? '+' : ''}{growth}% from last month
    </p>
  </div>
);

type ChartCardProps = {
  title: string;
  children: React.ReactNode;
};

const ChartCard = ({ title, children }: ChartCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-lg font-medium text-gray-900 mb-4">{title}</h2>
    {children}
  </div>
);

const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
    {children}
  </td>
);