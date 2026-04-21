import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ShoppingBag, User, LogOut, Package, LayoutDashboard, X, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [menu, setMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/categories', label: 'Categories' },
  ];

  return (
    <>
      {/* â”€â”€ Fixed mix-blend-difference header â”€â”€ */}
      <header
        className="fixed top-0 left-0 right-0 z-40 px-8 py-6 pointer-events-none"
        style={{ mixBlendMode: 'difference' }}
      >
        <div className="flex items-start justify-between pointer-events-auto">
          {/* Logo â€” top-left */}
          <Link to="/" className="text-white select-none">
            <div
              className="text-4xl leading-none"
              style={{ fontFamily: 'Anton, Impact, sans-serif', letterSpacing: '-0.02em' }}
            >
              PLUMOSE
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] mt-1 font-light opacity-80">
              Est. 2024 / NYC
            </div>
          </Link>

          {/* Vertical nav â€” pushed 8rem from right */}
          <nav className="hidden lg:flex flex-col items-end gap-2 mr-32">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className="text-white text-[11px] uppercase tracking-[0.2em] font-medium link-strike"
              >
                {l.label}
              </NavLink>
            ))}
            {user && (
              <NavLink
                to="/orders"
                className="text-white text-[11px] uppercase tracking-[0.2em] font-medium link-strike"
              >
                Orders
              </NavLink>
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-white"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* â”€â”€ Fixed Cart Button â€” top-right, NO blend mode â”€â”€ */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-3">
        {/* User menu */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenu(!menu)}
              className="w-10 h-10 bg-white border border-ink flex items-center justify-center text-ink text-sm font-bold shadow-cart hover:scale-110 transition-transform"
              aria-label="Account"
            >
              {user.name.charAt(0).toUpperCase()}
            </button>
            {menu && (
              <div
                className="absolute right-0 mt-2 w-52 bg-concrete border border-ink shadow-sharp z-50"
                onMouseLeave={() => setMenu(false)}
              >
                <Link
                  to="/profile"
                  onClick={() => setMenu(false)}
                  className="flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-wide hover:bg-ink hover:text-concrete transition-colors"
                >
                  <User className="w-3.5 h-3.5" /> Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setMenu(false)}
                  className="flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-wide hover:bg-ink hover:text-concrete transition-colors"
                >
                  <Package className="w-3.5 h-3.5" /> Orders
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMenu(false)}
                    className="flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-wide text-accent hover:bg-ink hover:text-concrete transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" /> Admin
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMenu(false); }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-xs uppercase tracking-wide hover:bg-ink hover:text-concrete transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="hidden sm:flex items-center gap-1 bg-ink text-concrete px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-ink/80 transition-colors"
          >
            Sign in
          </Link>
        )}

        {/* Cart â€” 64Ã—64 circular button */}
        <Link
          to="/cart"
          className="relative w-16 h-16 bg-white flex items-center justify-center shadow-cart hover:scale-110 transition-transform duration-200"
          style={{ borderRadius: '50%' }}
          aria-label="Cart"
        >
          <ShoppingBag className="w-6 h-6 text-ink" strokeWidth={1.5} />
          {totalItems > 0 && (
            <span
              className="absolute -top-1 -right-1 w-5 h-5 bg-accent flex items-center justify-center font-bold"
              style={{ fontSize: '10px', color: '#fff', borderRadius: '50%' }}
            >
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* â”€â”€ Mobile slide-in menu â”€â”€ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-ink text-concrete flex flex-col p-8">
          <div className="flex items-start justify-between mb-12">
            <div
              className="text-4xl text-concrete"
              style={{ fontFamily: 'Anton, Impact, sans-serif' }}
            >
              PLUMOSE
            </div>
            <button onClick={() => setMobileOpen(false)} className="text-concrete">
              <X className="w-7 h-7" />
            </button>
          </div>
          <nav className="flex flex-col gap-6">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setMobileOpen(false)}
                className="text-3xl uppercase font-display text-concrete link-strike"
                style={{ fontFamily: 'Anton, Impact, sans-serif', letterSpacing: '-0.02em' }}
              >
                {l.label}
              </NavLink>
            ))}
            {!user && (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-3xl uppercase font-display text-concrete link-strike"
                style={{ fontFamily: 'Anton, Impact, sans-serif', letterSpacing: '-0.02em' }}
              >
                Sign In
              </Link>
            )}
          </nav>
          <div className="mt-auto text-xs uppercase tracking-widest text-concrete/40">
            Est. 2024 / NYC
          </div>
        </div>
      )}
    </>
  );
}
