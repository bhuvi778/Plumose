import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api/client.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const FavoriteContext = createContext();
export const useFavorites = () => useContext(FavoriteContext);

export function FavoriteProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState({ products: [] });

  const refresh = useCallback(async () => {
    if (!user) { setFavorites({ products: [] }); return; }
    const { data } = await api.get('/favorites');
    setFavorites(data);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const toggle = async (productId) => {
    if (!user) { toast.error('Please login to save favorites'); return; }
    const { data } = await api.post('/favorites/toggle', { productId });
    setFavorites(data);
    const isFav = data.products.find((p) => (p._id || p) === productId);
    toast.success(isFav ? 'Added to favorites' : 'Removed from favorites');
  };

  const isFavorite = (productId) =>
    favorites.products?.some((p) => (p._id || p) === productId);

  return (
    <FavoriteContext.Provider value={{ favorites, toggle, isFavorite, refresh }}>
      {children}
    </FavoriteContext.Provider>
  );
}
