import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, Package, Tag, ShoppingCart, Users, Home, LogOut, Menu, Sparkles } from 'lucide-react';
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

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display text-xl text-white font-bold">Plumose</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-white/40">Admin</div>
          </div>
        </Link>
      </div>

      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                isActive ? 'bg-white text-brand-dark' : 'text-white/70 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-1">
        <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition">
          <Home className="w-4 h-4" /> Back to Store
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-red-500/20 transition">
          <LogOut className="w-4 h-4" /> Logout
        </button>
        <div className="px-4 py-3 mt-2 rounded-xl bg-white/5">
          <div className="text-[10px] uppercase tracking-wider text-white/40 mb-0.5">Logged in as</div>
          <div className="text-white text-xs font-semibold truncate">{user?.name}</div>
          <div className="text-white/40 text-[10px] truncate">{user?.email}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface flex" data-vertical="hub">
      <aside className="hidden lg:flex lg:flex-col w-64 fixed inset-y-0 left-0 bg-ink z-40 overflow-hidden">
        <Sidebar />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-ink flex flex-col overflow-hidden">
            <Sidebar />
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-ink/10 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="p-1.5 hover:bg-ink/5 rounded-lg lg:hidden">
              <Menu className="w-5 h-5 text-ink" />
            </button>
            <h1 className="font-display text-xl text-ink font-bold">Admin Console</h1>
          </div>
          <div className="text-xs text-ink-soft hidden sm:block">Welcome, {user?.name}</div>
        </header>

        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
