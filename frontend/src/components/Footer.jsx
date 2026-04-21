import { Link } from 'react-router-dom';
import { Instagram, Twitter, Youtube } from 'lucide-react';

const COL_LINKS = [
  {
    heading: 'Shop',
    links: [
      { label: 'New Arrivals', to: '/shop?sort=newest' },
      { label: 'Collection 004', to: '/shop' },
      { label: 'Basics', to: '/shop' },
      { label: 'Heavy Knits', to: '/shop' },
      { label: 'All Products', to: '/shop' },
    ],
  },
  {
    heading: 'Craft',
    links: [
      { label: 'Our Process', to: '/' },
      { label: 'Materials', to: '/' },
      { label: 'Fit Guide', to: '/' },
      { label: 'Care Instructions', to: '/' },
      { label: 'Sustainability', to: '/' },
    ],
  },
  {
    heading: 'Account',
    links: [
      { label: 'Sign In', to: '/login' },
      { label: 'Register', to: '/register' },
      { label: 'My Orders', to: '/orders' },
      { label: 'Favorites', to: '/favorites' },
      { label: 'Profile', to: '/profile' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Use', to: '/' },
      { label: 'Shipping Policy', to: '/' },
      { label: 'Returns', to: '/' },
      { label: 'Cookie Policy', to: '/' },
    ],
  },
  {
    heading: 'Contact',
    links: [
      { label: 'hello@plumose.com', to: '/' },
      { label: '+1 212 000 0000', to: '/' },
      { label: '340 W 23rd St NYC', to: '/' },
      { label: 'Press Enquiries', to: '/' },
      { label: 'Wholesale', to: '/' },
    ],
  },
  {
    heading: 'Social',
    links: [],
    social: true,
  },
];

export default function Footer() {
  return (
    <footer style={{ background: '#0a0a0a', color: '#ffffff' }} className="overflow-hidden">
      {/* â”€â”€ Main link grid â”€â”€ */}
      <div className="container-x pt-16 pb-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 border-b border-white/10 pb-10">
          {COL_LINKS.map((col) => (
            <div key={col.heading}>
              <div className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono mb-4">
                {col.heading}
              </div>
              {col.social ? (
                <div className="flex flex-col gap-3">
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60 hover:text-white link-strike transition-colors"
                  >
                    <Instagram className="w-3.5 h-3.5" /> Instagram
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60 hover:text-white link-strike transition-colors"
                  >
                    <Twitter className="w-3.5 h-3.5" /> Twitter / X
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/60 hover:text-white link-strike transition-colors"
                  >
                    <Youtube className="w-3.5 h-3.5" /> YouTube
                  </a>
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-xs uppercase tracking-wider text-white/60 hover:text-white link-strike transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* â”€â”€ Sub-footer bar â”€â”€ */}
        <div className="pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div
            className="text-lg text-white"
            style={{ fontFamily: 'Anton, Impact, sans-serif', letterSpacing: '-0.02em' }}
          >
            PLUMOSE
          </div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-mono">
            Â© {new Date().getFullYear()} Plumose. All rights reserved. Est. 2024 / NYC.
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-white/30 font-mono">
              Collection 004 â€” Shipping Globally
            </span>
          </div>
        </div>
      </div>

      {/* â”€â”€ Structural anchor display text â”€â”€ */}
      <div className="overflow-hidden select-none pointer-events-none">
        <div
          className="leading-none font-bold text-white/[0.05] whitespace-nowrap"
          style={{
            fontFamily: 'Anton, Impact, sans-serif',
            fontSize: '10vw',
            letterSpacing: '-0.03em',
            marginBottom: '-0.15em',
          }}
        >
          HEAVY
        </div>
      </div>
    </footer>
  );
}
