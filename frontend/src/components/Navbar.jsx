import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Menu, X, LogOut, Package, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useFavorites } from '../context/FavoriteContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/shop?search=${encodeURIComponent(q.trim())}`);
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop All' },
    { to: '/categories', label: 'Categories' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all ${scrolled ? 'bg-cream/90 backdrop-blur-md shadow-sm' : 'bg-cream/70 backdrop-blur'}`}>
      <div className="bg-maroon-900 text-saffron-100 text-xs py-1.5 text-center tracking-wide">
        ॐ • Free shipping on orders above ₹999 • Pran-pratishtha blessed products
      </div>
      <div className="container-x flex items-center gap-6 py-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-3xl">🪔</span>
          <div className="leading-tight">
            <div className="font-display text-2xl font-bold text-maroon-900">Devapi</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-saffron-700">Sacred Essentials</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-medium transition ${isActive ? 'bg-saffron-100 text-maroon-900' : 'text-maroon-800 hover:bg-saffron-50'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={submit} className="hidden md:flex flex-1 max-w-xl relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-maroon-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search for idols, diyas, chunri..."
            className="input pl-11 pr-4 bg-white"
          />
        </form>

        <div className="flex items-center gap-1 ml-auto">
          <Link to="/favorites" className="relative p-2.5 rounded-full hover:bg-saffron-100 transition" title="Favorites">
            <Heart className="w-5 h-5 text-maroon-800" />
            {favorites.products?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-maroon-700 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {favorites.products.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative p-2.5 rounded-full hover:bg-saffron-100 transition" title="Cart">
            <ShoppingBag className="w-5 h-5 text-maroon-800" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-saffron-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button onClick={() => setMenu(!menu)} className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-saffron-100 transition">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-saffron-400 to-maroon-600 flex items-center justify-center text-white text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline text-sm font-medium text-maroon-900">{user.name.split(' ')[0]}</span>
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 card py-2 z-50" onMouseLeave={() => setMenu(false)}>
                  <Link to="/profile" onClick={() => setMenu(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-saffron-50 text-sm"><User className="w-4 h-4" /> Profile</Link>
                  <Link to="/orders" onClick={() => setMenu(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-saffron-50 text-sm"><Package className="w-4 h-4" /> My Orders</Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setMenu(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-saffron-50 text-sm text-saffron-700"><LayoutDashboard className="w-4 h-4" /> Admin Panel</Link>
                  )}
                  <button onClick={() => { logout(); setMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-saffron-50 text-sm text-maroon-700">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary ml-2 hidden sm:inline-flex">Sign in</Link>
          )}

          <button onClick={() => setOpen(!open)} className="lg:hidden p-2">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden container-x pb-4 space-y-2">
          <form onSubmit={submit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-maroon-500" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="input pl-11 bg-white" />
          </form>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} onClick={() => setOpen(false)} end={l.to === '/'}
              className={({ isActive }) => `block px-4 py-2 rounded-xl ${isActive ? 'bg-saffron-100' : 'hover:bg-saffron-50'}`}>
              {l.label}
            </NavLink>
          ))}
          {!user && <Link to="/login" onClick={() => setOpen(false)} className="btn-primary w-full">Sign in</Link>}
        </div>
      )}
    </header>
  );
}
