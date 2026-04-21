import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Hub from './pages/Hub.jsx';

// Devapi (puja) — shared e-commerce pages reused with vertical-aware links
import Home from './pages/Home.jsx';
import Shop from './pages/Shop.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Favorites from './pages/Favorites.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import Orders from './pages/Orders.jsx';
import OrderDetail from './pages/OrderDetail.jsx';
import Categories from './pages/Categories.jsx';

// Herbal
import HerbalHome from './pages/herbal/HerbalHome.jsx';

// Courier
import CourierHome from './pages/courier/CourierHome.jsx';
import CourierServices from './pages/courier/Services.jsx';
import CourierTrack from './pages/courier/Track.jsx';
import CourierRate from './pages/courier/RateEnquiry.jsx';
import CourierContact from './pages/courier/Contact.jsx';

// Admin
import AdminLayout from './admin/AdminLayout.jsx';
import AdminDashboard from './admin/Dashboard.jsx';
import AdminProducts from './admin/Products.jsx';
import AdminCategories from './admin/Categories.jsx';
import AdminOrders from './admin/Orders.jsx';
import AdminUsers from './admin/Users.jsx';

import { useAuth } from './context/AuthContext.jsx';

function Protected({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-soft text-sm">
        Loading…
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

/* Shared e-commerce routes, mounted twice (once under /devapi, once under /herbal) */
function ShopRoutes({ vertical }) {
  return (
    <Routes>
      <Route index element={vertical === 'herbal' ? <HerbalHome /> : <Home />} />
      <Route path="shop" element={<Shop />} />
      <Route path="shop/:categorySlug" element={<Shop />} />
      <Route path="categories" element={<Categories />} />
      <Route path="product/:slug" element={<ProductDetail />} />
      <Route path="cart" element={<Cart />} />
      <Route path="favorites" element={<Protected><Favorites /></Protected>} />
      <Route path="checkout" element={<Protected><Checkout /></Protected>} />
      <Route path="order-success/:id" element={<Protected><OrderSuccess /></Protected>} />
      <Route path="profile" element={<Protected><Profile /></Protected>} />
      <Route path="orders" element={<Protected><Orders /></Protected>} />
      <Route path="orders/:id" element={<Protected><OrderDetail /></Protected>} />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-ink">
      <Routes>
        {/* Public storefront layout */}
        <Route element={<MainLayout />}>
          {/* Parent hub */}
          <Route path="/" element={<Hub />} />

          {/* Shared auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Devapi vertical */}
          <Route path="/devapi/*" element={<ShopRoutes vertical="devapi" />} />

          {/* Herbal vertical */}
          <Route path="/herbal/*" element={<ShopRoutes vertical="herbal" />} />

          {/* Courier vertical */}
          <Route path="/courier" element={<CourierHome />} />
          <Route path="/courier/services" element={<CourierServices />} />
          <Route path="/courier/track" element={<CourierTrack />} />
          <Route path="/courier/rate" element={<CourierRate />} />
          <Route path="/courier/contact" element={<CourierContact />} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <Protected adminOnly>
              <AdminLayout />
            </Protected>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* Legacy redirects */}
        <Route path="/shop" element={<Navigate to="/devapi/shop" replace />} />
        <Route path="/shop/:slug" element={<Navigate to="/devapi/shop" replace />} />
        <Route path="/categories" element={<Navigate to="/devapi/categories" replace />} />
        <Route path="/product/:slug" element={<Navigate to="/devapi" replace />} />
        <Route path="/cart" element={<Navigate to="/devapi/cart" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
