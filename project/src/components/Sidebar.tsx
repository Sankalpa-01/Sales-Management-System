import {
  Home,
  Users,
  Package,
  ShoppingCart,
  CreditCard,
  BarChart3,
  LogOut,
  Menu,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Sales', href: '/sales', icon: ShoppingCart },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const renderLinks = () => (
    <>
      {navigation.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center px-4 py-2 text-sm font-medium ${
              isActive
                ? 'bg-gray-800 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <Icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-gray-900 text-white h-14 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <h1 className="text-lg font-bold">Sales Management</h1>
        <button onClick={handleLogout}>
          <LogOut className="h-6 w-6 text-white" />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-14 left-0 right-0 z-40 bg-gray-900">
          <nav className="space-y-1 py-2">
            {renderLinks()}
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex h-screen w-64 flex-col bg-gray-900">
        <div className="flex h-16 items-center justify-center">
          <h1 className="text-xl font-bold text-white">Sales Management</h1>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">{renderLinks()}</nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="mr-3 h-6 w-6 flex-shrink-0" />
            Logout
          </button>
        </div>
      </div>

      {/* Space for fixed mobile navbar */}
      <div className="md:hidden h-14" />
    </>
  );
}
