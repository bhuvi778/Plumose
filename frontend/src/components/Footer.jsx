import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, Sparkles, Leaf, Truck } from 'lucide-react';
import { useVertical } from '../context/VerticalContext.jsx';

export default function Footer() {
  const { vertical, config } = useVertical();

  const COLS = {
    devapi: [
      {
        heading: 'Shop',
        links: [
          { label: 'All Products', to: '/devapi/shop' },
          { label: 'Categories', to: '/devapi/categories' },
          { label: 'Puja Samagri', to: '/devapi/shop' },
          { label: 'Deities', to: '/devapi/shop' },
          { label: 'Incense & Diya', to: '/devapi/shop' },
        ],
      },
      {
        heading: 'Account',
        links: [
          { label: 'Sign In', to: '/login' },
          { label: 'Register', to: '/register' },
          { label: 'My Orders', to: '/devapi/orders' },
          { label: 'Favorites', to: '/devapi/favorites' },
          { label: 'Profile', to: '/devapi/profile' },
        ],
      },
    ],
    herbal: [
      {
        heading: 'Shop',
        links: [
          { label: 'All Products', to: '/herbal/shop' },
          { label: 'Categories', to: '/herbal/categories' },
          { label: 'Ayurvedic Medicine', to: '/herbal/shop' },
          { label: 'Herbal Teas', to: '/herbal/shop' },
          { label: 'Essential Oils', to: '/herbal/shop' },
        ],
      },
      {
        heading: 'Account',
        links: [
          { label: 'Sign In', to: '/login' },
          { label: 'Register', to: '/register' },
          { label: 'My Orders', to: '/herbal/orders' },
          { label: 'Favorites', to: '/herbal/favorites' },
          { label: 'Profile', to: '/herbal/profile' },
        ],
      },
    ],
    courier: [
      {
        heading: 'Services',
        links: [
          { label: 'Domestic Air Express', to: '/courier/services' },
          { label: 'Ground Surface', to: '/courier/services' },
          { label: 'International', to: '/courier/services' },
          { label: 'Cargo', to: '/courier/services' },
          { label: 'Premium Plus', to: '/courier/services' },
        ],
      },
      {
        heading: 'Tools',
        links: [
          { label: 'Track Shipment', to: '/courier/track' },
          { label: 'Rate Enquiry', to: '/courier/rate' },
          { label: 'Pickup Request', to: '/courier/contact' },
          { label: 'Franchise', to: '/courier/contact' },
        ],
      },
    ],
  };

  const commonCols = [
    {
      heading: 'Plumose',
      links: [
        { label: 'Home', to: '/' },
        { label: 'Devapi — Puja', to: '/devapi' },
        { label: 'Herbal — Wellness', to: '/herbal' },
        { label: 'DTDC — Courier', to: '/courier' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About Us', to: '/' },
        { label: 'Privacy Policy', to: '/' },
        { label: 'Terms of Use', to: '/' },
        { label: 'Shipping Policy', to: '/' },
        { label: 'Returns', to: '/' },
      ],
    },
  ];

  const cols = vertical === 'hub' ? commonCols : [...COLS[vertical], ...commonCols];

  return (
    <footer className="mt-20 bg-brand-dark text-surface">
      <div className="container-x py-14">
        {/* Top brand row */}
        <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          <div>
            <Link to="/" className="font-display text-3xl font-bold">
              Plumose
            </Link>
            <p className="mt-3 text-sm text-surface/70 leading-relaxed max-w-sm">
              India ka trusted commerce hub — puja samagri, ayurvedic wellness, aur bharosemand
              courier services. Ek hi chhat ke neeche.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" aria-label="Youtube" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-surface/50 mb-4">Verticals</div>
            <div className="space-y-2">
              <Link to="/devapi" className="flex items-center gap-2 text-sm hover:text-brand-light transition">
                <Sparkles className="w-4 h-4" /> Devapi — Puja & Pooja Essentials
              </Link>
              <Link to="/herbal" className="flex items-center gap-2 text-sm hover:text-brand-light transition">
                <Leaf className="w-4 h-4" /> Herbal — Ayurveda & Wellness
              </Link>
              <Link to="/courier" className="flex items-center gap-2 text-sm hover:text-brand-light transition">
                <Truck className="w-4 h-4" /> DTDC — Courier & Cargo
              </Link>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-surface/50 mb-4">Contact</div>
            <div className="space-y-2 text-sm text-surface/80">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> roshni.adhikari05@gmail.com</div>
              <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 92664 02179</div>
              <div className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /> Damdama Road, Ward No-3, Shushil Nagar, Near Om Sweets, Sohna, Gurugram — 122103 (HR)</div>
            </div>
          </div>
        </div>

        {/* Link cols */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          {cols.map((col) => (
            <div key={col.heading}>
              <div className="text-xs uppercase tracking-[0.2em] text-surface/50 mb-4">{col.heading}</div>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-surface/70 hover:text-brand-light transition">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="text-xs text-surface/50">
            © {new Date().getFullYear()} Plumose. All rights reserved. Made with ♡ in India.
          </div>
          <div className="text-xs text-surface/50">
            {vertical === 'courier' ? 'Authorized DTDC Franchise Partner' : 'GST · FSSAI · Ayush-certified partners'}
          </div>
        </div>
      </div>
    </footer>
  );
}
