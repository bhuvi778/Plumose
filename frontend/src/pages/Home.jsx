import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, Sparkles, HeartHandshake } from 'lucide-react';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';
import SectionTitle from '../components/SectionTitle.jsx';
import { useVertical } from '../context/VerticalContext.jsx';

export default function Home() {
  const { config } = useVertical();
  const base = config.base; // '/devapi'
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/categories?vertical=devapi'),
      api.get('/products?vertical=devapi&featured=true&limit=8'),
      api.get('/products?vertical=devapi&bestseller=true&limit=8'),
    ])
      .then(([c, f, b]) => {
        setCategories(c.data);
        setFeatured(f.data.products || []);
        setBestsellers(b.data.products || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="overflow-x-hidden">
      {/* ═══════════ HERO (maroon + saffron) ═══════════ */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-brand-dark via-brand-dark to-brand overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand/30 rounded-full blur-3xl pointer-events-none" />
        {/* Om watermark */}
        <div className="absolute inset-0 flex items-center justify-end pr-20 pointer-events-none select-none">
          <span className="font-devanagari text-[28rem] text-white/[0.04] leading-none">ॐ</span>
        </div>

        <div className="container-x relative z-10 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-amber-200 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
              Free delivery on orders above ₹999
            </div>
            <h1 className="font-display text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.1]">
              Bring <span className="text-amber-400">Divinity</span><br />Into Your Home
            </h1>
            <p className="mt-6 text-lg text-amber-100/80 max-w-lg leading-relaxed">
              Handcrafted brass idols, pure copper kalash, 108-bead rudraksha malas, authentic havan samagri — everything your mandir deserves, blessed & delivered with devotion.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to={`${base}/shop`} className="btn bg-amber-500 hover:bg-amber-400 text-white font-semibold shadow-lg shadow-black/20 flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to={`${base}/categories`} className="btn border-2 border-white/30 text-white hover:bg-white/10 font-medium">
                Browse Categories
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-sm">
              {[
                { n: `${categories.length}+`, l: 'Categories' },
                { n: '60+', l: 'Products' },
                { n: '10k+', l: 'Devotees' },
              ].map((s) => (
                <div key={s.l} className="text-center border-r border-white/10 last:border-0 pr-4 last:pr-0">
                  <div className="font-display text-4xl font-bold text-amber-400">{s.n}</div>
                  <div className="text-xs text-amber-200/60 mt-1 uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: floating puja icons visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              {/* Core glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-500/15 to-brand-dark/25 backdrop-blur-sm border border-white/10 flex items-center justify-center flex-col gap-2">
                <span className="text-7xl">🪔</span>
                <span className="font-devanagari text-white text-3xl">दिव्यम्</span>
                <span className="text-amber-300 text-sm">Sacred Essentials</span>
              </div>
              {/* Orbit rings */}
              <div className="absolute inset-[-20px] rounded-full border border-white/5" />
              <div className="absolute inset-[-50px] rounded-full border border-white/[0.03]" />
              {/* Orbiting items */}
              {[
                { e: '🕉️', deg: 0 },
                { e: '📿', deg: 60 },
                { e: '🏺', deg: 120 },
                { e: '🔔', deg: 180 },
                { e: '🌸', deg: 240 },
                { e: '🐚', deg: 300 },
              ].map(({ e, deg }) => (
                <div
                  key={deg}
                  className="absolute top-1/2 left-1/2 w-12 h-12 bg-white/10 backdrop-blur border border-white/20 rounded-full flex items-center justify-center text-2xl"
                  style={{
                    transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-150px) rotate(-${deg}deg)`,
                  }}
                >
                  {e}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 80" className="w-full fill-surface">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ═══════════ TRUST STRIP ═══════════ */}
      <section className="bg-surface border-b border-brand/10">
        <div className="container-x py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { Icon: Truck, t: 'Free Delivery', s: 'Orders above ₹999' },
            { Icon: ShieldCheck, t: 'Pran-Pratishtha', s: 'Every idol blessed' },
            { Icon: Sparkles, t: 'Artisan Crafted', s: 'Indian craftsmen' },
            { Icon: HeartHandshake, t: '7-Day Returns', s: 'Hassle-free policy' },
          ].map(({ Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-brand" />
              </div>
              <div>
                <div className="font-semibold text-sm text-ink">{t}</div>
                <div className="text-xs text-ink-soft">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ CATEGORIES GRID ═══════════ */}
      {categories.length > 0 && (
        <section className="container-x py-16">
          <SectionTitle
            kicker="Explore"
            title="Shop by Category"
            subtitle="Har zaroorat ke liye shuddh samagri"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((c) => (
              <Link
                key={c._id}
                to={`${base}/shop/${c.slug}`}
                className="group card-hover p-4 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand/10 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition">
                  {c.icon || '🕉️'}
                </div>
                <div className="text-sm font-semibold text-ink group-hover:text-brand transition">{c.name}</div>
                <div className="text-[11px] text-ink-mute mt-0.5">{c.productCount} items</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════ FEATURED ═══════════ */}
      {featured.length > 0 && (
        <section className="bg-brand-soft/40 py-16">
          <div className="container-x">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="kicker mb-2">Handpicked</div>
                <h2 className="display text-3xl md:text-4xl">Featured Products</h2>
              </div>
              <Link to={`${base}/shop`} className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-brand">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ BESTSELLERS ═══════════ */}
      {bestsellers.length > 0 && (
        <section className="container-x py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="kicker mb-2">Top Sellers</div>
              <h2 className="display text-3xl md:text-4xl">Bestsellers</h2>
            </div>
            <Link to={`${base}/shop`} className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-brand">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestsellers.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* ═══════════ BOTTOM CTA ═══════════ */}
      <section className="container-x py-10">
        <div className="rounded-3xl bg-gradient-to-r from-brand-dark via-brand to-brand-dark text-white p-10 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
          <div>
            <div className="font-devanagari text-base opacity-80">॥ ॐ नमः शिवाय ॥</div>
            <h3 className="display text-3xl md:text-4xl text-white mt-2">
              Shuddh samagri, daily darshan
            </h3>
            <p className="mt-2 text-white/80 max-w-lg">
              Blessed, authentic, hand-crafted — apne mandir ke liye wahi samagri jo pandit ji bhi use karein.
            </p>
          </div>
          <Link to={`${base}/shop`} className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

