import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Truck, Sparkles, HeartHandshake, Star, ChevronRight, Quote, Flame, BookOpen, Leaf } from 'lucide-react';
import api from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import Loader from '../components/Loader.jsx';

/* Gradient per category slug – full class strings for Tailwind JIT */
const CAT_GRAD = {
  'idols-murtis': 'from-orange-500 to-amber-600',
  'diyas-lamps': 'from-yellow-400 to-orange-500',
  'incense-dhoop': 'from-green-600 to-emerald-700',
  'puja-thali': 'from-amber-400 to-yellow-600',
  'bells-ghanti': 'from-yellow-500 to-amber-700',
  'kalash-lota': 'from-orange-400 to-red-500',
  'chunri-vastra': 'from-red-500 to-pink-600',
  'rudraksha-malas': 'from-amber-700 to-stone-700',
  'yantras': 'from-red-700 to-rose-800',
  'havan-samagri': 'from-orange-600 to-red-600',
  'oils-ghee': 'from-yellow-400 to-amber-600',
  'kumkum-chandan': 'from-red-600 to-rose-700',
  'flowers-garlands': 'from-pink-400 to-rose-500',
  'chowki-asan': 'from-amber-800 to-stone-800',
  'books-aartis': 'from-saffron-600 to-maroon-700',
  'shankh': 'from-sky-400 to-cyan-600',
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    Promise.all([
      api.get('/categories'),
      api.get('/products?featured=true&limit=8'),
      api.get('/products?bestseller=true&limit=8'),
    ]).then(([c, f, b]) => {
      setCategories(c.data);
      setFeatured(f.data.products || []);
      setBestsellers(b.data.products || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="overflow-x-hidden">

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative min-h-[92vh] flex items-center bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-700 overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-saffron-600/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-maroon-500/20 rounded-full blur-3xl pointer-events-none" />
        {/* Om watermark */}
        <div className="absolute inset-0 flex items-center justify-end pr-20 pointer-events-none select-none">
          <span className="font-devanagari text-[28rem] text-white/[0.04] leading-none">ॐ</span>
        </div>

        <div className="container-x relative z-10 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-4 py-2 text-saffron-200 text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse" />
              Free delivery on orders above ₹999
            </div>
            <h1 className="font-display text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-[1.1]">
              Bring <span className="text-saffron-400">Divinity</span><br />Into Your Home
            </h1>
            <p className="mt-6 text-lg text-saffron-100/80 max-w-lg leading-relaxed">
              Handcrafted brass idols, pure copper kalash, 108-bead rudraksha malas, authentic havan samagri — everything your mandir deserves, blessed & delivered with devotion.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/shop" className="btn bg-saffron-500 hover:bg-saffron-400 text-white font-semibold shadow-lg shadow-black/20 flex items-center gap-2">
                Shop Now <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/categories" className="btn border-2 border-white/30 text-white hover:bg-white/10 font-medium">
                Browse Categories
              </Link>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-4 max-w-sm">
              {[{ n: '16+', l: 'Categories' }, { n: '60+', l: 'Products' }, { n: '10k+', l: 'Devotees' }].map(s => (
                <div key={s.l} className="text-center border-r border-white/10 last:border-0 pr-4 last:pr-0">
                  <div className="font-display text-4xl font-bold text-saffron-400">{s.n}</div>
                  <div className="text-xs text-saffron-200/60 mt-1 uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: floating puja icons visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative flex justify-center items-center"
          >
            <div className="relative w-72 h-72 md:w-80 md:h-80">
              {/* Core glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-saffron-500/15 to-maroon-600/25 backdrop-blur-sm border border-white/10 flex items-center justify-center flex-col gap-2">
                <span className="text-7xl animate-float">🪔</span>
                <span className="font-devanagari text-white text-3xl">दिव्यम्</span>
                <span className="text-saffron-300 text-sm">Sacred Essentials</span>
              </div>
              {/* Orbit rings */}
              <div className="absolute inset-[-20px] rounded-full border border-white/5" />
              <div className="absolute inset-[-50px] rounded-full border border-white/[0.03]" />
              {/* Orbiting items */}
              {[
                { e: '🕉️', deg: 0 }, { e: '📿', deg: 60 }, { e: '🏺', deg: 120 },
                { e: '🔔', deg: 180 }, { e: '🌸', deg: 240 }, { e: '🐚', deg: 300 },
              ].map(({ e, deg }) => (
                <div
                  key={deg}
                  className="absolute top-1/2 left-1/2 w-12 h-12 bg-white/10 backdrop-blur border border-white/20 rounded-full flex items-center justify-center text-2xl"
                  style={{ transform: `translate(-50%,-50%) rotate(${deg}deg) translateY(-150px) rotate(-${deg}deg)` }}
                >
                  {e}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 80" className="w-full fill-cream">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>
      </section>

      {/* ════════════════ TRUST STRIP ════════════════ */}
      <section className="bg-cream border-b border-saffron-100">
        <div className="container-x py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, t: 'Free Delivery', s: 'All orders above ₹999' },
            { icon: ShieldCheck, t: 'Pran-Pratishtha', s: 'Every idol ritually blessed' },
            { icon: Sparkles, t: 'Artisan Crafted', s: 'Made by Indian craftsmen' },
            { icon: HeartHandshake, t: '7-Day Returns', s: 'Hassle-free policy' },
          ].map(({ icon: Icon, t, s }) => (
            <div key={t} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-saffron-700" />
              </div>
              <div>
                <div className="font-semibold text-sm text-maroon-900">{t}</div>
                <div className="text-xs text-maroon-600">{s}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════ CATEGORIES ════════════════ */}
      <section className="container-x py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="text-saffron-700 text-sm font-devanagari font-medium mb-1">॥ श्रेणियाँ ॥</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-maroon-900">Shop by Category</h2>
          </div>
          <Link to="/categories" className="btn-outline text-sm flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {categories.map((c, i) => {
            const grad = CAT_GRAD[c.slug] || 'from-saffron-500 to-maroon-600';
            const featured = i < 2;
            return (
              <Link
                key={c._id}
                to={`/shop/${c.slug}`}
                className={`group relative rounded-2xl overflow-hidden bg-gradient-to-br ${grad} text-white p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${featured ? 'md:col-span-2' : ''}`}
                style={{ minHeight: featured ? '170px' : '130px' }}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <div className="relative">
                  <div className={`${featured ? 'text-5xl mb-3' : 'text-3xl mb-2'}`}>{c.icon}</div>
                  <div className={`font-bold leading-snug ${featured ? 'text-xl' : 'text-sm'}`}>{c.name}</div>
                  <div className="text-white/70 text-xs mt-1">{c.productCount} items</div>
                  {featured && c.description && (
                    <div className="text-white/65 text-xs mt-2 line-clamp-2 leading-relaxed">{c.description}</div>
                  )}
                </div>
                <ArrowRight className="absolute bottom-4 right-4 w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
              </Link>
            );
          })}
        </div>
      </section>

      {/* ════════════════ FEATURED PRODUCTS ════════════════ */}
      {featured.length > 0 && (
        <section className="bg-gradient-to-b from-saffron-50/60 to-cream py-16">
          <div className="container-x">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-saffron-700 text-sm font-devanagari mb-1">॥ विशेष चयन ॥</div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-maroon-900">Featured Sacred Picks</h2>
                <p className="text-maroon-600/70 text-sm mt-1">Handpicked for their purity, craftsmanship and devotional significance</p>
              </div>
              <Link to="/shop?featured=true" className="btn-outline text-sm hidden md:flex items-center gap-1">
                See all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ FESTIVAL BANNER ════════════════ */}
      <section className="container-x py-12">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-700 p-10 md:p-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 bg-saffron-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-saffron-700/10 rounded-full blur-2xl" />
            <div className="absolute top-6 right-10 font-devanagari text-[9rem] text-white/[0.04] leading-none select-none">॥</div>
          </div>
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div className="text-white">
              <div className="font-devanagari text-saffron-300 text-lg mb-2">॥ महोत्सव विशेष ॥</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                Festive Collection<br />is Here
              </h2>
              <p className="mt-4 text-saffron-100/80 text-lg leading-relaxed">
                Up to <strong className="text-saffron-400">40% OFF</strong> on handpicked diyas, brass idols, complete thali sets and more. This season, light up your home with authentic puja essentials.
              </p>
              <Link to="/shop" className="mt-8 inline-flex items-center gap-2 btn bg-saffron-500 hover:bg-saffron-400 text-white font-semibold">
                Shop Collection <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { e: '🪔', l: 'Diya Sets', off: '35% off' },
                { e: '🕉️', l: 'Brass Idols', off: '40% off' },
                { e: '🍽️', l: 'Thali Sets', off: '30% off' },
                { e: '📿', l: 'Rudraksha', off: '25% off' },
              ].map(item => (
                <div key={item.l} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 text-center text-white hover:bg-white/10 transition-colors">
                  <div className="text-4xl mb-2">{item.e}</div>
                  <div className="font-semibold text-sm">{item.l}</div>
                  <div className="text-saffron-400 font-bold text-sm mt-1">{item.off}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ WHY CHOOSE DEVAPI ════════════════ */}
      <section className="container-x py-16">
        <div className="text-center mb-12">
          <div className="text-saffron-700 text-sm font-devanagari mb-1">॥ विश्वास ॥</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-maroon-900">Why Choose Devapi?</h2>
          <p className="mt-3 text-maroon-700/70 max-w-2xl mx-auto">
            We are not just a store — we are a dedication to the sacred traditions of Bharat and the artisans who keep them alive.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: ShieldCheck, t: 'Pran-Pratishtha Blessed', d: 'Every idol and yantra is properly energised through Vedic rituals by experienced pandits before being shipped. You receive divinity, not just a product.' },
            { icon: Sparkles, t: 'Artisan Crafted in India', d: 'Our products come from generational craftsmen of Varanasi, Jaipur and Moradabad — masters who pour devotion into every chisel stroke and casting mould.' },
            { icon: Truck, t: 'Safe & Secure Delivery', d: 'Specially designed packaging with foam cushioning and anti-scratch wrap ensures your puja items reach you in pristine condition, pan-India.' },
            { icon: Leaf, t: 'Pure & Natural Materials', d: 'Pure 100% brass and copper, genuine rudraksha beads, natural camphor, real sandalwood — we never compromise on the purity of sacred materials.' },
            { icon: Flame, t: 'Authentic Traditions', d: 'Every product is sourced keeping shastra requirements in mind — correct metal alloys, prescribed shapes, and precise muhurat timing for maximum spiritual benefit.' },
            { icon: BookOpen, t: 'Puja Guidance Included', d: 'Each product comes with a guidance booklet covering the correct way to use it, the prayers to chant, installation method and the deep significance behind each item.' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t} className="card p-6 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-2xl bg-saffron-100 flex items-center justify-center mb-4 group-hover:bg-gradient-to-br group-hover:from-saffron-500 group-hover:to-maroon-600 transition-all duration-300">
                <Icon className="w-6 h-6 text-saffron-700 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="font-display text-lg font-bold text-maroon-900">{t}</h3>
              <p className="mt-2 text-sm text-maroon-700/80 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════ BESTSELLERS ════════════════ */}
      {bestsellers.length > 0 && (
        <section className="bg-gradient-to-b from-saffron-50/60 to-cream py-16">
          <div className="container-x">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-saffron-700 text-sm font-devanagari mb-1">॥ लोकप्रिय ॥</div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-maroon-900">Bestsellers</h2>
                <p className="text-maroon-600/70 text-sm mt-1">Most loved by our community of devoted shoppers</p>
              </div>
              <Link to="/shop?bestseller=true" className="btn-outline text-sm hidden md:flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {bestsellers.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════ PUJA GUIDES ════════════════ */}
      <section className="container-x py-16">
        <div className="text-center mb-10">
          <div className="text-saffron-700 text-sm font-devanagari mb-1">॥ ज्ञान ॥</div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-maroon-900">Puja Guides & Sacred Wisdom</h2>
          <p className="mt-2 text-maroon-600/70 text-sm">Deepen your devotional practice with our expert guides</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { e: '🪔', t: 'How to Perform Diwali Puja at Home', d: 'A step-by-step guide covering the traditional Lakshmi-Ganesh puja — from the right samagri and correct placement to the exact mantras and sequences to follow.', tag: 'Festival Rituals', bg: 'from-orange-100 to-amber-100' },
            { e: '📿', t: 'Choosing the Right Rudraksha for You', d: 'Learn about all 21 types of rudraksha beads, their planetary connections, specific physical and spiritual benefits, and how to wear, clean and maintain them properly.', tag: 'Spiritual Guide', bg: 'from-amber-100 to-yellow-100' },
            { e: '🔥', t: 'Complete Guide to Performing Havan', d: 'Everything you need — from gathering the right havan samagri and choosing the correct kund size, to kindling the sacred fire and performing the ahuti with proper mantras.', tag: 'Havan Vidhi', bg: 'from-red-100 to-orange-100' },
          ].map(({ e, t, d, tag, bg }) => (
            <div key={t} className="card overflow-hidden group hover:shadow-glow hover:-translate-y-1 transition-all duration-300">
              <div className={`h-40 bg-gradient-to-br ${bg} flex items-center justify-center`}>
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{e}</span>
              </div>
              <div className="p-5">
                <span className="chip text-xs">{tag}</span>
                <h3 className="font-display font-bold text-maroon-900 mt-3 leading-tight">{t}</h3>
                <p className="text-sm text-maroon-700/80 mt-2 leading-relaxed">{d}</p>
                <button className="mt-4 text-saffron-700 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                  Read more <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════ TESTIMONIALS ════════════════ */}
      <section className="bg-gradient-to-br from-maroon-900 via-maroon-800 to-maroon-700 py-20">
        <div className="container-x">
          <div className="text-center mb-12">
            <div className="text-saffron-400 font-devanagari text-lg mb-1">॥ आशीर्वाद ॥</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white">What Our Devotees Say</h2>
            <p className="text-saffron-200/50 mt-2 text-sm">Trusted by 10,000+ devotees across India</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { n: 'Radhika Sharma', c: 'New Delhi', r: 5, p: 'Brass Ganesha Idol', t: 'The Ganesha idol I received is absolutely divine — solid brass, beautifully polished with intricate detailing. My mandir has never felt more peaceful. The packaging was exceptional. Jai Ganesh! 🙏' },
              { n: 'Amit Kulkarni', c: 'Pune', r: 5, p: 'Complete Brass Thali Set', t: 'Ordered the complete thali set for Ganesh Chaturthi. It arrived well-packaged in just 2 days. The quality is genuinely temple-grade — each item is crafted to perfection. Very satisfied!' },
              { n: 'Priya Iyer', c: 'Bengaluru', r: 5, p: '5 Mukhi Rudraksha Mala', t: 'The rudraksha mala feels genuinely energised. I notice positive vibrations during every japa session. The beads are authentic, well-knotted, and the thread is sturdy. Highly recommended!' },
              { n: 'Vikram Singh', c: 'Jaipur', r: 5, p: 'Shree Yantra – Copper', t: 'The Shree Yantra came with precise geometric lines and a proper puja vidhi booklet. It was clearly energised — you can sense the vibration. My home\'s energy has visibly shifted.' },
              { n: 'Meena Trivedi', c: 'Varanasi', r: 5, p: 'Marble Lakshmi Murti', t: 'Coming from Varanasi, I have seen thousands of idols. The marble Lakshmi from Devapi matches the finest work on Vishwanath Gali. Pure white marble, smooth finish and flawless carving.' },
              { n: 'Rohit Gupta', c: 'Mumbai', r: 4, p: 'Copper Havan Kund', t: 'Perfect havan kund for our weekly Satyanarayan katha. The right size for home use, solid copper construction and the quality is excellent. Delivery was prompt and packaging was protective.' },
            ].map(({ n, c, r, p, t }) => (
              <div key={n} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 flex flex-col">
                <div className="flex text-saffron-400 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-4 h-4 ${i <= r ? 'fill-current' : 'opacity-20'}`} />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-saffron-700/40 mb-2" />
                <p className="text-saffron-100/85 text-sm leading-relaxed flex-1">"{t}"</p>
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-saffron-500 to-maroon-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {n.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-semibold text-sm">{n}</div>
                    <div className="text-saffron-400/60 text-xs">{c}</div>
                  </div>
                  <div className="shrink-0 text-[10px] px-2 py-1 rounded-full bg-white/10 border border-white/10 text-saffron-300 max-w-[90px] truncate" title={p}>
                    {p}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ NEWSLETTER ════════════════ */}
      <section className="container-x py-16">
        <div className="card p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-hero-pattern opacity-30 pointer-events-none" />
          <div className="relative">
            <span className="text-5xl">🙏</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-maroon-900 mt-4">
              Festival Reminders & Members-Only Offers
            </h2>
            <p className="mt-3 text-maroon-700/70 max-w-lg mx-auto leading-relaxed">
              Subscribe for festival puja guides, auspicious muhurat reminders, and exclusive discount offers for members. No spam.
            </p>
            <form
              onSubmit={(e) => { e.preventDefault(); setEmail(''); toast && (window.alert('Subscribed! 🙏')); }}
              className="mt-8 flex gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input flex-1"
              />
              <button type="submit" className="btn-primary shrink-0">Subscribe</button>
            </form>
            <p className="mt-3 text-xs text-maroon-400">Unsubscribe anytime. We respect your privacy.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
