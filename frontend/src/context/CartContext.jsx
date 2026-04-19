import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/client.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      setLoading(true);
      const { data } = await api.get('/cart');
      setCart(data);
    } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) { toast.error('Please login to add to cart'); return false; }
    const { data } = await api.post('/cart', { productId, quantity });
    setCart(data);
    toast.success('Added to cart');
    return true;
  };
  const updateQty = async (productId, quantity) => {
    const { data } = await api.put('/cart', { productId, quantity });
    setCart(data);
  };
  const removeItem = async (productId) => {
    const { data } = await api.delete(`/cart/${productId}`);
    setCart(data);
    toast.success('Removed from cart');
  };
  const clear = async () => {
    await api.delete('/cart/clear');
    setCart({ items: [] });
  };

  const totalItems = cart.items?.reduce((a, b) => a + b.quantity, 0) || 0;
  const subtotal = cart.items?.reduce((a, b) => a + (b.product?.price || 0) * b.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, refresh, addToCart, updateQty, removeItem, clear, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}
