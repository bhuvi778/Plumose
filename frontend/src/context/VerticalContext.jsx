import { createContext, useContext, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const VerticalContext = createContext({ vertical: 'hub', config: {} });

const CONFIG = {
  hub: {
    name: 'Plumose',
    tagline: 'India ka trusted commerce hub',
    base: '/',
  },
  devapi: {
    name: 'Devapi',
    tagline: 'Sacred essentials, delivered with devotion',
    base: '/devapi',
    accentWord: 'पवित्रता', // purity
  },
  herbal: {
    name: 'Plumose Herbal',
    tagline: 'Pure ayurvedic wellness, rooted in tradition',
    base: '/herbal',
    accentWord: 'प्रकृति', // nature
  },
  courier: {
    name: 'DTDC Express',
    tagline: 'Authorized DTDC franchise — India & Worldwide',
    base: '/courier',
    accentWord: 'Delivered',
  },
};

function detect(pathname) {
  if (pathname.startsWith('/devapi')) return 'devapi';
  if (pathname.startsWith('/herbal')) return 'herbal';
  if (pathname.startsWith('/courier')) return 'courier';
  if (pathname.startsWith('/admin')) return 'hub';
  return 'hub';
}

export function VerticalProvider({ children }) {
  const { pathname } = useLocation();
  const vertical = detect(pathname);
  const config = CONFIG[vertical];

  useEffect(() => {
    document.documentElement.setAttribute('data-vertical', vertical);
  }, [vertical]);

  const value = useMemo(() => ({ vertical, config, allVerticals: CONFIG }), [vertical, config]);
  return <VerticalContext.Provider value={value}>{children}</VerticalContext.Provider>;
}

export function useVertical() {
  return useContext(VerticalContext);
}
