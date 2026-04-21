import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { FavoriteProvider } from './context/FavoriteContext.jsx';
import { VerticalProvider } from './context/VerticalContext.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <VerticalProvider>
        <AuthProvider>
          <CartProvider>
            <FavoriteProvider>
              <App />
              <Toaster
                position="top-center"
                toastOptions={{
                  style: { background: 'rgb(var(--ink))', color: 'rgb(var(--surface))', borderRadius: '12px', fontSize: '14px' },
                  success: { iconTheme: { primary: 'rgb(var(--brand))', secondary: 'rgb(var(--surface))' } },
                }}
              />
            </FavoriteProvider>
          </CartProvider>
        </AuthProvider>
      </VerticalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
