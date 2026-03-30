import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Droplet, 
  ShoppingCart, 
  Truck, 
  Factory, 
  FileText, 
  LogOut,
  Menu,
  X,
  Bell,
  Users
} from 'lucide-react';
import { ModeToggle } from './mode-toggle';
import { useStore } from '../store';

const allNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['ADMIN', 'STAFF'] },
  { name: 'Supplier', href: '/suppliers', icon: Users, roles: ['ADMIN'] },
  { name: 'Bahan Baku', href: '/raw-materials', icon: Package, roles: ['ADMIN', 'STAFF'] },
  { name: 'Produk', href: '/products', icon: Droplet, roles: ['ADMIN', 'STAFF'] },
  { name: 'Pemesanan Bahan', href: '/purchase-orders', icon: ShoppingCart, roles: ['ADMIN'] },
  { name: 'Pemasukan Gudang', href: '/goods-receipts', icon: Truck, roles: ['ADMIN', 'STAFF'] },
  { name: 'Produksi', href: '/productions', icon: Factory, roles: ['ADMIN', 'STAFF'] },
  { name: 'Order Masuk', href: '/sales-orders', icon: ShoppingCart, roles: ['ADMIN'] },
  { name: 'Pengeluaran Barang', href: '/shipments', icon: Truck, roles: ['ADMIN', 'STAFF'] },
  { name: 'Laporan', href: '/reports', icon: FileText, roles: ['ADMIN'] },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  
  const { currentUser, logout, notifications, markNotificationRead } = useStore();

  const navigation = allNavigation.filter(nav => currentUser && nav.roles.includes(currentUser.role));
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col">
          <div className="flex items-center justify-between h-16 px-6 border-b border-border">
            <span className="text-xl font-bold text-foreground">Essential Oil</span>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-muted-foreground" />
            </button>
          </div>
          <div className="px-4 py-3 bg-primary/10 border-b border-border">
            <p className="text-sm font-medium text-primary">Halo, {currentUser?.username}</p>
            <p className="text-xs text-primary/80">{currentUser?.role === 'ADMIN' ? 'Administrator' : 'Staf Gudang'}</p>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-muted-foreground rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-muted-foreground" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-card border-r border-border">
          <div className="flex items-center h-16 px-6 border-b border-border">
            <span className="text-xl font-bold text-foreground">Essential Oil</span>
          </div>
          <div className="px-6 py-4 bg-primary/10 border-b border-border">
            <p className="text-sm font-medium text-primary">Halo, {currentUser?.username}</p>
            <p className="text-xs text-primary/80">{currentUser?.role === 'ADMIN' ? 'Administrator' : 'Staf Gudang'}</p>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-muted-foreground rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-muted-foreground" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <div className="flex items-center justify-between h-16 px-4 bg-card border-b border-border lg:justify-end">
          <div className="lg:hidden flex items-center">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6 text-muted-foreground" />
            </button>
            <span className="ml-4 text-xl font-bold text-foreground">Essential Oil</span>
          </div>
          
          <div className="flex items-center gap-4">
            <ModeToggle />
            
            <div className="relative">
              <button 
                className="p-2 text-muted-foreground hover:text-foreground relative transition-colors"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-background" />
                )}
              </button>

              {notifOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-popover border border-border ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-3 border-b border-border flex justify-between items-center">
                    <h3 className="text-sm font-medium text-popover-foreground">Notifikasi</h3>
                    <span className="text-xs text-muted-foreground">{unreadCount} belum dibaca</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground text-center">Tidak ada notifikasi</div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          className={`p-4 border-b border-border hover:bg-accent cursor-pointer transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                          onClick={() => markNotificationRead(notif.id)}
                        >
                          <p className={`text-sm ${!notif.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                            {notif.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notif.date).toLocaleString('id-ID')}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-background">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
