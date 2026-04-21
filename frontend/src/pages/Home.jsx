import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight } from 'lucide-react';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import ProductCard from '../components/ProductCard.jsx';

/* â”€â”€ static editorial content â”€â”€ */
const ARCH_ITEMS = [
  { label: '500GSM', desc: 'Heavyweight French terry composition. Triple-washed. Garment dyed in single-lot batches to ensure colour consistency throughout the run.' },
  { label: 'SEAM SPEC', desc: 'Felled seams on outseam and inseam for structural integrity. 401 chainstitch on body construction. 504 overlock at panel junctions.' },
  { label: 'DROP PATTERN', desc: 'Low-slung seat geometry with 6cm drop crotch. Extended hem at rear for coverage architecturally balanced by a cropped front panel.' },
  { label: 'HARDWARE', desc: 'Custom moulded YKK NATULONÂ® zippers with hand-lacquered pulls. All external hardware in raw brass â€” no plating, deliberate patina.' },
];

const TESTIMONIALS = [
  { handle: '@kade.berlin', quote: 'The weight of the fabric is insane. Nothing else in my wardrobe feels like this. It\'s structural.', rotate: 'rotate-1', variant: 'fill' },
  { handle: '@studio_grim', quote: 'Wore the black utility trousers for an entire month straight. The dye didn\'t fade, the seams didn\'t budge.', rotate: '-rotate-1', variant: 'outline' },
  { handle: '@archi.wear', quote: 'Plumose is what happens when someone who builds things decides to make clothes.', rotate: 'rotate-2', variant: 'fill' },
  { handle: '@north.dressed', quote: 'Every piece is a considered object. I don\'t say that lightly.', rotate: '-rotate-2', variant: 'outline' },
  { handle: '@jvn.studio', quote: 'Ordered twice. Zero quality issues. Deadstock fabric on the second drop is something else entirely.', rotate: 'rotate-1', variant: 'fill' },
  { handle: '@rawform_co', quote: 'The care instructions say machine wash but I\'ll never trust a machine with this thing.', rotate: '-rotate-1', variant: 'outline' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    Promise.all([
      api.get('/products?featured=true&limit=8'),
      api.get('/products?limit=9'),
    ]).then(([f, p]) => {
      setFeatured(f.data.products || []);
      setProducts(p.data.products || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  /* helper: deterministic fake out-of-stock sizes per product  */
  const oos = (id) => SIZES.filter((_, i) => (id.charCodeAt(id.length - 1) + i) % 4 === 0);

  return (
    <div className="overflow-x-hidden bg-concrete">

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Â§ 1 â€” ASYMMETRIC HERO
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="relative min-h-screen bg-concrete overflow-hidden">
        {/* Right image â€” absolute, 65% width, off-screen crop */}
        <div className="absolute top-0 right-0 w-[65%] h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80"
            alt="Collection 004"
            className="w-full h-full object-cover object-left img-cinematic"
          />
          {/* Dim overlay */}
          <div className="absolute inset-0 bg-concrete/10 pointer-events-none" />
          {/* Vertical section label */}
          <div
            className="absolute bottom-20 -left-2 pointer-events-none select-none"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'bottom left' }}
          >
            <span className="text-[10px] uppercase tracking-[0.4em] text-white/50 font-mono whitespace-nowrap">
              Collection 004 â€” SS 2025
            </span>
          </div>
          {/* Tech label on image */}
          <div className="tech-label top-8 left-8">500gsm</div>
        </div>

        {/* Left text â€” 42% width, low-positioned */}
        <div className="relative z-10 flex flex-col justify-end min-h-screen pb-20 pl-8 lg:pl-14 pr-6">
          <div className="max-w-[42%]">
            {/* Live indicator */}
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-ink/60 font-mono">
                Drop 004 â€” Live Now
              </span>
            </div>

            <h1
              className="text-[clamp(4.5rem,9vw,11rem)] text-ink leading-[0.85] tracking-tighter"
              style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}
            >
              RAW<br />FORM
            </h1>

            <p className="mt-8 text-sm text-ink/60 font-body tracking-wide leading-relaxed"
               style={{ maxWidth: '320px' }}>
              Heavy garments. Considered construction. Zero compromise. Technical streetwear built for the architectural generation â€” not the algorithmic one.
            </p>

            <Link
              to="/shop"
              className="mt-10 inline-flex items-center gap-3 text-xs uppercase tracking-[0.25em] font-bold text-ink border-b-2 border-ink pb-1 link-strike"
            >
              Shop Collection 004 <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* Stats row */}
            <div className="mt-16 flex items-start gap-8 border-t border-ink/20 pt-6">
              {[['004', 'Drop Number'], ['60+', 'SKUs Live'], ['500GSM', 'Base Weight']].map(([n, l]) => (
                <div key={l}>
                  <div
                    className="text-3xl text-ink leading-none"
                    style={{ fontFamily: 'Anton, Impact, sans-serif' }}
                  >
                    {n}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-ink/40 mt-1 font-mono">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Â§ 2 â€” TICKER / MARQUEE
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div className="bg-ink text-concrete py-3 overflow-hidden whitespace-nowrap text-[10px] uppercase tracking-[0.3em] font-mono">
        <div className="inline-block animate-[marquee_22s_linear_infinite]">
          {Array(6).fill('GARMENT DYED â€” FREE RETURNS â€” 60+ STYLES â€” COLLECTION 004 LIVE â€” HEAVY FRENCH TERRY â€” ARCHITECTURAL FIT â€” ').join('')}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Â§ 3 â€” HORIZONTAL PRODUCT STRIP  "Essentials"
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="py-20 overflow-hidden">
        <div className="container-x mb-8 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-2">Â§ 02</div>
            <h2
              className="text-5xl md:text-6xl text-ink leading-[0.85] tracking-tighter"
              style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}
            >
              Essentials
            </h2>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-widest font-bold border-b border-ink pb-0.5 link-strike hidden md:block">
            View All
          </Link>
        </div>

        {/* Horizontal scrolling strip */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none px-6 lg:px-14 pb-4"
        >
          {(featured.length > 0 ? featured : products).map((product, i) => (
            <Link
              key={product._id}
              to={`/product/${product.slug}`}
              className="relative flex-none w-[260px] snap-start group"
            >
              {/* Image â€” 3:4 aspect */}
              <div className="relative overflow-hidden bg-ink/5" style={{ aspectRatio: '3/4' }}>
                {product.images?.[0] ? (
                  <>
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover img-cinematic"
                    />
                    {/* Secondary image fades in */}
                    {product.images[1] && (
                      <img
                        src={product.images[1]}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/5">
                    <span className="text-5xl opacity-30">P</span>
                  </div>
                )}
                {/* Tech label */}
                {i % 3 === 0 && (
                  <div className="tech-label bottom-3 left-3">
                    {product.material || 'Garment Dyed'}
                  </div>
                )}
                {i % 3 === 1 && (
                  <div className="tech-label bottom-3 left-3">500gsm</div>
                )}
              </div>

              {/* Metadata */}
              <div className="pt-3">
                <div className="text-xs font-bold uppercase tracking-wider text-ink line-clamp-1">
                  {product.name}
                </div>
                <div className="mt-1 text-sm font-mono text-ink/70">
                  ${product.price}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Â§ 4 â€” TECHNICAL INFO GRID  "Architecture"
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="border-t border-ink/20 py-20">
        <div className="container-x">
          <div className="grid grid-cols-12 gap-6">
            {/* Left 4 cols â€” sticky */}
            <div className="col-span-12 md:col-span-4 md:sticky md:top-24 self-start">
              <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-3">Â§ 03</div>
              <h2
                className="text-5xl text-ink leading-[0.85] tracking-tighter mb-8"
                style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}
              >
                Architecture
              </h2>
              <p className="text-sm text-ink/60 font-body tracking-wide leading-relaxed mb-10 max-w-xs">
                Every garment is an engineering problem solved. Here is how we build.
              </p>

              <div className="space-y-6">
                {ARCH_ITEMS.map((item) => (
                  <div key={item.label} className="border-l-2 border-ink pl-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink font-mono mb-1">
                      {item.label}
                    </div>
                    <p className="text-xs text-ink/60 font-body leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 8 cols â€” varied images */}
            <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-4">
              {(products.length > 0 ? products : featured).slice(0, 6).map((product, i) => (
                <div
                  key={product._id}
                  className="relative overflow-hidden bg-ink/5 group"
                  style={{ aspectRatio: i % 3 === 0 ? '4/5' : '1/1' }}
                >
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover img-cinematic"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-ink/5">
                      <span className="text-4xl opacity-20">P</span>
                    </div>
                  )}
                  {/* Tech label â€” bottom-right on even */}
                  {i % 2 === 0 && (
                    <div className="tech-label bottom-3 right-3">
                      {['Chainstitch', 'Felled Seam', 'YKK Hardware'][i % 3]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Â§ 5 â€” LIVE INVENTORY GRID  "Broken grid"
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="border-t border-ink/20 py-20 bg-concrete">
        <div className="container-x">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-2">Â§ 04</div>
              <h2
                className="text-5xl md:text-6xl text-ink leading-[0.85] tracking-tighter"
                style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}
              >
                In Stock<br />
                <span className="text-ink/30">Now</span>
              </h2>
            </div>
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-ink/50 font-mono">Live Inventory</span>
            </div>
          </div>

          {/* Broken / staggered grid */}
          <div className="grid grid-cols-12 gap-4">
            {products.slice(0, 9).map((product, i) => {
              /* Varying spans for editorial broken grid */
              const span = [6, 3, 3, 3, 6, 3, 3, 3, 6][i] || 3;
              const offset = [0, 0, 0, 0, 24, 0, 24, 0, 0][i];
              const outOfStock = oos(product._id);

              return (
                <div
                  key={product._id}
                  className={`col-span-12 sm:col-span-6 md:col-span-${span} group`}
                  style={{ marginTop: offset ? `${offset * 4}px` : undefined }}
                >
                  <Link to={`/product/${product.slug}`} className="block">
                    {/* Image */}
                    <div className="relative overflow-hidden bg-ink/5" style={{ aspectRatio: '3/4' }}>
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover img-cinematic"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl opacity-20">P</span>
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-concrete/60 flex items-center justify-center">
                          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink/50 font-mono">
                            Sold Out
                          </span>
                        </div>
                      )}
                      {/* Tech label */}
                      {product.material && (
                        <div className="tech-label top-3 left-3">{product.material}</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="pt-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-ink line-clamp-1">
                        {product.name}
                      </div>
                      <div className="mt-1 text-xs font-mono text-ink/50">${product.price}</div>

                      {/* Size rail */}
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {SIZES.map((s) => (
                          <span
                            key={s}
                            className={`text-[10px] font-mono ${
                              outOfStock.includes(s)
                                ? 'text-ink/25 line-through'
                                : 'text-ink/60'
                            }`}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link to="/shop" className="btn-brutal inline-flex items-center gap-2">
              View Full Inventory <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          Â§ 6 â€” MASONRY SOCIAL PROOF
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="border-t border-ink/20 py-20 bg-concrete">
        <div className="container-x">
          <div className="mb-10">
            <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-2">Â§ 05</div>
            <h2
              className="text-5xl md:text-6xl text-ink leading-[0.85] tracking-tighter"
              style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}
            >
              The<br />Verdict
            </h2>
          </div>

          {/* Masonry â€” columns-3 */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.handle}
                className={`break-inside-avoid inline-block w-full p-6 ${
                  t.variant === 'fill'
                    ? 'bg-concrete border border-ink'
                    : 'bg-transparent border border-ink'
                } transform ${t.rotate}`}
              >
                <p className="text-sm font-mono leading-relaxed text-ink mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ink flex-none" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-ink/50 font-mono">
                    {t.handle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

