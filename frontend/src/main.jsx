import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { FavoriteProvider } from './context/FavoriteContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <FavoriteProvider>
            <App />
            <Toaster
              position="top-center"
              toastOptions={{
                style: { background: '#4a0f0f', color: '#fffaf1', borderRadius: '12px' },
                success: { iconTheme: { primary: '#ffa329', secondary: '#4a0f0f' } },
              }}
            />
          </FavoriteProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
