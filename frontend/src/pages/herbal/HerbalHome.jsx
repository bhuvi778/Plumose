import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, FlaskConical, HeartPulse, Sun } from 'lucide-react';
import api from '../../api/client.js';
import Loader from '../../components/Loader.jsx';
import ProductCard from '../../components/ProductCard.jsx';
import SectionTitle from '../../components/SectionTitle.jsx';

export default function HerbalHome() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products?vertical=herbal&limit=8'),
      api.get('/categories?vertical=herbal'),
    ])
      .then(([p, c]) => {
        setProducts(p.data.products || []);
        setCategories(c.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime-50 via-surface to-green-50 pointer-events-none" />
        <div className="container-x relative py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 chip mb-5">
              <Leaf className="w-3.5 h-3.5" />
              <span>100% Ayush-certified · Chemical-free</span>
            </div>
            <h1 className="display text-5xl md:text-7xl">
              Prakriti ki <span className="text-brand">shuddhata</span>
            </h1>
            <div className="mt-3 font-devanagari text-lg text-brand-dark">
              ॥ आयुर्वेदो अमृतानाम् ॥
            </div>
            <p className="mt-5 text-base text-ink-soft leading-relaxed max-w-lg">
              Classical ayurvedic medicines, pure herbal teas, cold-pressed essential oils aur
              natural cosmetics — vedic tradition aur modern standards ka perfect sangam.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/herbal/shop" className="btn-primary">
                Shop Herbal <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/herbal/categories" className="btn-outline">Browse Categories</Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-brand/15 pt-6 max-w-md">
              {[
                ['Ayush', 'Certified'],
                ['200+', 'Herbal SKUs'],
                ['0%', 'Chemicals'],
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
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900&q=80"
                alt="Herbal"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 card p-4 w-48 hidden md:block">
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-brand" />
                <span className="text-sm font-semibold text-ink">Pure & Natural</span>
              </div>
              <div className="text-xs text-ink-soft mt-1">Sourced from Ayush-certified farms</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories highlight */}
      <section className="container-x py-16">
        <SectionTitle
          kicker="Our Range"
          title="Shop by Wellness Need"
          subtitle="Har zaroorat ke liye prakriti ka samadhan"
        />
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              Icon: HeartPulse,
              title: 'Immunity & Wellness',
              desc: 'Chyawanprash, Giloy, Tulsi, Ashwagandha — roz ki energy ke liye.',
            },
            {
              Icon: FlaskConical,
              title: 'Essential Oils',
              desc: 'Cold-pressed neem, coconut, eucalyptus — skin aur hair ke liye.',
            },
            {
              Icon: Sun,
              title: 'Natural Cosmetics',
              desc: 'Neem face wash, aloe vera gel, herbal shampoo — daily care.',
            },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="card-hover p-6">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-ink">{title}</h3>
              <p className="text-sm text-ink-soft mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories grid */}
      {categories.length > 0 && (
        <section className="bg-brand-soft/40 py-16">
          <div className="container-x">
            <SectionTitle kicker="Categories" title="Browse Everything" />
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.slice(0, 12).map((c) => (
                <Link
                  key={c._id}
                  to={`/herbal/shop/${c.slug}`}
                  className="group card-hover p-4 text-center"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-brand/10 flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition">
                    {c.icon || '🌿'}
                  </div>
                  <div className="text-sm font-semibold text-ink group-hover:text-brand transition">{c.name}</div>
                  <div className="text-[11px] text-ink-mute mt-0.5">{c.productCount} items</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured products */}
      {products.length > 0 && (
        <section className="container-x py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="kicker mb-2">Handpicked</div>
              <h2 className="display text-3xl md:text-4xl">Popular in Herbal</h2>
            </div>
            <Link to="/herbal/shop" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-brand">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.slice(0, 8).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}

      {/* Trust band */}
      <section className="container-x py-10">
        <div className="rounded-3xl bg-gradient-to-r from-brand-dark via-brand to-brand-dark text-white p-10 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
          <div>
            <div className="font-devanagari text-base opacity-80">॥ स्वास्थ्यं परमं धनम् ॥</div>
            <h3 className="display text-3xl md:text-4xl text-white mt-2">
              Chemical-free lifestyle ki shuruat
            </h3>
            <p className="mt-2 text-white/80 max-w-lg">
              Har product Ayush-certified, purity-tested aur family-safe. Prakriti ke saath jude
              rahiye.
            </p>
          </div>
          <Link to="/herbal/shop" className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
