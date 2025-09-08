import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import {
    BarChart3,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    Package,
    ShoppingCart,
    Tags,
    Users,
    X
} from 'lucide-react';
import { ReactNode, useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const sidebarItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Kategori',
    href: '/admin/kategori',
    icon: Tags,
  },
  {
    title: 'Produk',
    href: '/admin/produk',
    icon: Package,
  },
  {
    title: 'Pelanggan',
    href: '/admin/pelanggan',
    icon: Users,
  },
  {
    title: 'Pesanan',
    href: '/admin/pesanan',
    icon: ShoppingCart,
  },
  {
    title: 'Laporan',
    href: '/admin/laporan',
    icon: BarChart3,
  },
  {
    title: 'Feedback',
    href: '/admin/feedback',
    icon: MessageSquare,
  },
];

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentPath = window.location.pathname;

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">Toko Tas Berkah</h1>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-100"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden mr-2"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                {title && <h1 className="text-2xl font-bold text-gray-900">{title}</h1>}
                {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
