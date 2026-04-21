import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, Sparkles, Heart, Flame, Gift } from 'lucide-react';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import ProductCard from '../components/ProductCard.jsx';
import SectionTitle from '../components/SectionTitle.jsx';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products?featured=true&limit=8'),
      api.get('/products?bestseller=true&limit=8'),
      api.get('/categories'),
    ])
      .then(([f, b, c]) => {
        setFeatured(f.data.products || []);
        setBestsellers(b.data.products || []);
        setCategories(c.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-soft via-surface to-brand-soft pointer-events-none" />
        <div className="container-x relative py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 chip mb-5">
              <Flame className="w-3.5 h-3.5" />
              <span>नवरात्रि स्पेशल · Free delivery ₹499+</span>
            </div>
            <h1 className="display text-5xl md:text-7xl">
              Bhakti ki <span className="text-brand">shuddh</span> dukaan
            </h1>
            <div className="mt-3 font-devanagari text-lg text-brand-dark">
              ॥ देवापि — श्रद्धा के साथ ॥
            </div>
            <p className="mt-5 text-base text-ink-soft leading-relaxed max-w-lg">
              Haath se chuni hui puja samagri, pure brass murtis, havan saamagri aur pooja thali
              sets. Har ghar ke mandir ke liye, bharose ke saath.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/devapi/shop" className="btn-primary">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/devapi/categories" className="btn-outline">
                Browse Categories
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-brand/15 pt-6 max-w-md">
              {[
                ['10k+', 'Happy devotees'],
                ['200+', 'Authentic products'],
                ['4.8★', 'Avg rating'],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-2xl font-bold text-brand-dark">{v}</div>
                  <div className="text-[11px] text-ink-soft mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-glow border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1605379399642-870262d3d051?w=900&q=80"
                alt="Puja"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 card p-4 w-48 hidden md:block">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-brand" />
                <span className="text-sm font-semibold text-ink">100% Authentic</span>
              </div>
              <div className="text-xs text-ink-soft mt-1">Direct from verified artisans</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container-x py-16">
          <SectionTitle kicker="Explore" title="Shop by Category" subtitle="Sab kuch mil jayega — Deva ki seva ke liye" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.slice(0, 12).map((c) => (
              <Link
                key={c._id}
                to={`/devapi/shop/${c.slug}`}
                className="group card-hover p-4 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-brand/10 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition">
                  {c.icon || '🪔'}
                </div>
                <div className="text-sm font-semibold text-ink group-hover:text-brand transition">
                  {c.name}
                </div>
                <div className="text-[11px] text-ink-mute mt-0.5">
                  {c.productCount} items
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="bg-brand-soft/40 py-16">
          <div className="container-x">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="kicker mb-2">Handpicked</div>
                <h2 className="display text-3xl md:text-4xl">Featured Products</h2>
              </div>
              <Link to="/devapi/shop" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-brand hover:gap-2 transition-all">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Trust strip */}
      <section className="container-x py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { Icon: Truck, title: 'Free delivery', sub: 'Orders above ₹499' },
            { Icon: ShieldCheck, title: '100% Authentic', sub: 'Verified artisans' },
            { Icon: Heart, title: 'Blessed packaging', sub: 'With care & devotion' },
            { Icon: Gift, title: 'Festival bundles', sub: 'Curated combo packs' },
          ].map(({ Icon, title, sub }) => (
            <div key={title} className="card p-5 flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-ink text-sm">{title}</div>
                <div className="text-xs text-ink-soft mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      {bestsellers.length > 0 && (
        <section className="container-x py-16">
          <SectionTitle kicker="Top Picks" title="Bestsellers" subtitle="Jo sabse zyada pasand kiye gaye" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestsellers.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="container-x py-10">
        <div className="rounded-3xl bg-gradient-to-r from-brand-dark via-brand to-brand-dark text-white p-10 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
          <div>
            <div className="font-devanagari text-base opacity-80">॥ ॐ नमः शिवाय ॥</div>
            <h3 className="display text-3xl md:text-4xl text-white mt-2">
              Apne mandir ke liye kuch khaas?
            </h3>
            <p className="mt-2 text-white/80 max-w-lg">
              Complete puja sets, festival bundles, aur personalized samagri — sab available.
            </p>
          </div>
          <Link
            to="/devapi/shop"
            className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
          >
            Explore Shop <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

