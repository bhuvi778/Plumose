import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ShoppingBag, User, LogOut, Package, LayoutDashboard, X, Menu,
  Heart, Leaf, Truck, Sparkles, Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useVertical } from '../context/VerticalContext.jsx';

const VERTICALS = [
  { key: 'devapi', label: 'Devapi', sub: 'Puja', to: '/devapi', Icon: Sparkles },
  { key: 'herbal', label: 'Herbal', sub: 'Ayurveda', to: '/herbal', Icon: Leaf },
  { key: 'courier', label: 'Courier', sub: 'DTDC', to: '/courier', Icon: Truck },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { vertical, config } = useVertical();
  const [menu, setMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isShop = vertical === 'devapi' || vertical === 'herbal';
  const base = config.base;

  const shopLinks = [
    { to: base, label: 'Home', end: true },
    { to: `${base}/shop`, label: 'Shop' },
    { to: `${base}/categories`, label: 'Categories' },
  ];
  const courierLinks = [
    { to: '/courier', label: 'Home', end: true },
    { to: '/courier/services', label: 'Services' },
    { to: '/courier/track', label: 'Track' },
    { to: '/courier/rate', label: 'Rate' },
    { to: '/courier/contact', label: 'Contact' },
  ];
  const links = vertical === 'courier' ? courierLinks : (isShop ? shopLinks : []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-surface/95 backdrop-blur-md shadow-soft' : 'bg-surface/80 backdrop-blur-sm'
        } border-b border-brand/10`}
      >
        {/* Vertical tabs strip - always visible */}
        <div className="border-b border-brand/10 bg-surface-soft/40">
          <div className="container-x flex items-center justify-between h-10">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                  vertical === 'hub'
                    ? 'bg-ink text-white'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                Plumose
              </Link>
              <span className="w-px h-4 bg-brand/20 mx-1" />
              {VERTICALS.map(({ key, label, sub, to, Icon }) => (
                <Link
                  key={key}
                  to={to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wider transition whitespace-nowrap ${
                    vertical === key
                      ? 'bg-brand text-white shadow-soft'
                      : 'text-ink-soft hover:text-ink hover:bg-brand/5'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{label}</span>
                  <span className="hidden sm:inline opacity-70 normal-case font-normal tracking-normal text-[10px]">· {sub}</span>
                </Link>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3 text-[11px] text-ink-mute">
              <span>Free delivery over ₹999</span>
            </div>
          </div>
        </div>

        {/* Main row */}
        <div className="container-x flex items-center justify-between h-16 gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold text-brand-dark leading-none">
              {vertical === 'hub' ? 'Plumose' : config.name}
            </span>
            {vertical !== 'hub' && (
              <span className="hidden sm:inline text-[11px] text-ink-mute uppercase tracking-wider border-l border-brand/20 pl-2">
                by Plumose
              </span>
            )}
          </Link>

          {/* Center nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition ${
                    isActive
                      ? 'bg-brand text-white shadow-soft'
                      : 'text-ink-soft hover:text-brand hover:bg-brand/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {isShop && (
              <>
                <Link
                  to={`${base}/favorites`}
                  className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full hover:bg-brand/10 text-ink-soft hover:text-brand transition"
                  aria-label="Favorites"
                >
                  <Heart className="w-5 h-5" />
                </Link>
                <Link
                  to={`${base}/cart`}
                  className="relative flex w-10 h-10 items-center justify-center rounded-full hover:bg-brand/10 text-ink-soft hover:text-brand transition"
                  aria-label="Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setMenu(!menu)}
                  className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-brand/10 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-xs font-medium text-ink max-w-[90px] truncate">
                    {user.name}
                  </span>
                </button>
                {menu && (
                  <div
                    className="absolute right-0 mt-2 w-56 card p-2 z-50 animate-fade-in"
                    onMouseLeave={() => setMenu(false)}
                  >
                    <div className="px-3 py-2 border-b border-brand/10 mb-1">
                      <div className="text-xs text-ink-soft">Signed in as</div>
                      <div className="text-sm font-semibold text-ink truncate">{user.email}</div>
                    </div>
                    {isShop && (
                      <>
                        <MenuItem to={`${base}/profile`} Icon={User} label="Profile" onClick={() => setMenu(false)} />
                        <MenuItem to={`${base}/orders`} Icon={Package} label="My Orders" onClick={() => setMenu(false)} />
                      </>
                    )}
                    {user.role === 'admin' && (
                      <MenuItem to="/admin" Icon={LayoutDashboard} label="Admin Panel" onClick={() => setMenu(false)} />
                    )}
                    <button
                      onClick={() => { logout(); setMenu(false); navigate('/'); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink hover:bg-brand/10 transition"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-xs py-2 px-4">
                Sign In
              </Link>
            )}

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand/10 text-ink"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] bg-surface flex flex-col animate-fade-in">
          <div className="flex items-center justify-between p-4 border-b border-brand/15">
            <span className="font-display text-xl font-bold text-brand-dark">Plumose</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close">
              <X className="w-6 h-6 text-ink" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-6">
            <div>
              <div className="label">Switch vertical</div>
              <div className="grid grid-cols-1 gap-2">
                {VERTICALS.map(({ key, label, sub, to, Icon }) => (
                  <Link
                    key={key}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition ${
                      vertical === key ? 'bg-brand/10 border-brand/30' : 'border-brand/10 hover:bg-brand/5'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-ink">{label}</div>
                      <div className="text-xs text-ink-soft">{sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {links.length > 0 && (
              <div>
                <div className="label">Navigate</div>
                <div className="space-y-1">
                  {links.map((l) => (
                    <NavLink
                      key={l.to}
                      to={l.to}
                      end={l.end}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                          isActive ? 'bg-brand text-white' : 'text-ink hover:bg-brand/5'
                        }`
                      }
                    >
                      {l.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function MenuItem({ to, Icon, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink hover:bg-brand/10 transition"
    >
      <Icon className="w-4 h-4" /> {label}
    </Link>
  );
}
