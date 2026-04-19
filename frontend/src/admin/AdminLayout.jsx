import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, Home, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/products', icon: Package, label: 'Products' },
    { to: '/admin/categories', icon: Tag, label: 'Categories' },
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/admin/users', icon: Users, label: 'Users' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-3xl">🪔</span>
          <div>
            <div className="font-display font-bold text-white text-lg tracking-wide">Devapi</div>
            <div className="text-[10px] text-saffron-300 uppercase tracking-widest">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-saffron-500 text-white shadow-md'
                  : 'text-saffron-200 hover:bg-white/8 hover:text-white'
              }`
            }>
            <Icon className="w-5 h-5 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-saffron-200 hover:bg-white/8 hover:text-white transition-all">
          <Home className="w-4 h-4" /> Back to Store
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-saffron-200 hover:bg-red-500/20 hover:text-red-300 transition-all">
          <LogOut className="w-4 h-4" /> Logout
        </button>
        <div className="px-4 py-3 mt-2 rounded-xl bg-white/5 border border-white/10">
          <div className="text-xs text-saffron-300/70 mb-1">Logged in as</div>
          <div className="text-white text-sm font-semibold truncate">👑 {user?.name}</div>
          <div className="text-saffron-400/70 text-xs truncate">{user?.email}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 fixed inset-y-0 left-0 bg-maroon-900 text-saffron-100 z-40 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 bg-maroon-900 text-saffron-100 flex flex-col overflow-hidden">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content area — offset by sidebar on desktop */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white border-b border-saffron-100 px-4 lg:px-6 py-4 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-saffron-50 lg:hidden">
              <Menu className="w-5 h-5 text-maroon-700" />
            </button>
            <h1 className="font-display text-xl font-bold text-maroon-900">Admin Panel</h1>
          </div>
          <div className="text-sm text-maroon-600 hidden sm:block">
            <span className="font-medium text-maroon-900">👑 {user?.name}</span>
          </div>
        </header>

        <main className="p-4 lg:p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
