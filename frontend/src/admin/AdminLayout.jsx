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
        <Link to="/" className="block">
          <div
            className="text-2xl text-white"
            style={{ fontFamily: 'Anton, Impact, sans-serif', letterSpacing: '-0.02em' }}
          >
            PLUMOSE
          </div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 mt-1 font-mono">Admin Panel</div>
        </Link>
      </div>

      <nav className="p-4 space-y-0.5 flex-1 overflow-y-auto">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wide font-bold transition-colors ${
                isActive
                  ? 'bg-white text-ink'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-0.5">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wide font-bold text-white/40 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Home className="w-4 h-4" /> Back to Store
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wide font-bold text-white/40 hover:text-white hover:bg-accent/20 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
        <div className="px-4 py-3 mt-2 border border-white/10">
          <div className="text-[10px] font-mono uppercase tracking-wide text-white/30 mb-1">Logged in as</div>
          <div className="text-white text-xs font-bold uppercase tracking-wide truncate">{user?.name}</div>
          <div className="text-white/30 text-[10px] font-mono truncate">{user?.email}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-concrete flex">
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-60 fixed inset-y-0 left-0 bg-ink z-40 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 bg-ink flex flex-col overflow-hidden">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-concrete border-b border-ink/10 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-1.5 hover:bg-ink/5 lg:hidden"
            >
              <Menu className="w-5 h-5 text-ink" />
            </button>
            <div
              className="text-xl text-ink"
              style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase', letterSpacing: '-0.02em' }}
            >
              Admin
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-ink/40 hidden sm:block">
            {user?.name}
          </div>
        </header>

        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
