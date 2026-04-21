import { Link } from 'react-router-dom';
import { Sparkles, Leaf, Truck, ArrowRight, ShieldCheck, Package, Heart, MapPin, Phone } from 'lucide-react';

const VERTICALS = [
  {
    key: 'devapi',
    to: '/devapi',
    accent: 'from-orange-600 to-red-800',
    tint: 'bg-orange-50',
    textAccent: 'text-orange-700',
    Icon: Sparkles,
    name: 'Devapi',
    sanskrit: 'देवापि',
    tagline: 'Puja & Pooja Essentials',
    description:
      'Hand-picked puja samagri, pure brass murtis, dhoop-agarbatti, pooja thalis aur sab kuch jo aapki bhakti ko sampoorn banaye.',
    cta: 'Enter Devapi Store',
    stats: [
      { label: 'Product categories', value: '30+' },
      { label: 'Trusted by devotees', value: '10k+' },
      { label: 'Pan-India shipping', value: 'Yes' },
    ],
    highlights: ['Brass & Panchdhatu Murtis', 'Dhoop, Diya & Agarbatti', 'Pooja Thali Sets', 'Havan Samagri', 'Yantras & Malas'],
  },
  {
    key: 'herbal',
    to: '/herbal',
    accent: 'from-lime-700 to-green-900',
    tint: 'bg-lime-50',
    textAccent: 'text-lime-700',
    Icon: Leaf,
    name: 'Herbal',
    sanskrit: 'आयुर्वेद',
    tagline: 'Ayurveda & Natural Wellness',
    description:
      'Shudh ayurvedic medicines, herbal teas, essential oils aur natural cosmetics — vedic tradition meets modern standards.',
    cta: 'Explore Herbal',
    stats: [
      { label: 'Ayush-certified', value: '100%' },
      { label: 'Herbal SKUs', value: '200+' },
      { label: 'Chemical-free', value: 'Always' },
    ],
    highlights: ['Chyawanprash & Triphala', 'Tulsi, Ashwagandha Tea', 'Neem & Aloe Cosmetics', 'Cold-pressed Oils', 'Immunity Boosters'],
  },
  {
    key: 'courier',
    to: '/courier',
    accent: 'from-red-600 to-blue-950',
    tint: 'bg-red-50',
    textAccent: 'text-red-600',
    Icon: Truck,
    name: 'DTDC Courier',
    sanskrit: 'डी टी डी सी',
    tagline: 'Authorized Franchise — India & World',
    description:
      'Domestic & international courier, cargo, premium express. Track shipments, request pickups, aur competitive rates with trusted DTDC network.',
    cta: 'Book DTDC Service',
    stats: [
      { label: 'PIN codes covered', value: '19,000+' },
      { label: 'Countries served', value: '220+' },
      { label: 'On-time delivery', value: '99%' },
    ],
    highlights: ['Domestic Air Express', 'Ground Surface', 'International Express', 'Cargo & Heavy', 'Premium Plus'],
  },
];

export default function Hub() {
  return (
    <div className="bg-surface">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-soft via-surface to-surface pointer-events-none" />
        <div className="container-x relative pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 chip mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              <span>Ek chhat ke neeche — teen zaroorat</span>
            </div>
            <h1 className="display text-5xl md:text-7xl lg:text-8xl leading-[1.05]">
              <span className="text-ink">Welcome to</span>
              <br />
              <span className="bg-gradient-to-br from-orange-600 via-red-700 to-green-800 bg-clip-text text-transparent">
                Plumose
              </span>
            </h1>
            <p className="mt-6 text-base md:text-lg text-ink-soft leading-relaxed">
              India ka multi-vertical commerce hub — sacred puja essentials, pure ayurvedic
              wellness, aur trusted DTDC courier services. Sab kuch ek jagah, bharose ke saath.
            </p>
            <div className="mt-4 font-devanagari text-sm text-ink-soft">
              ॥ श्रद्धा • शुद्धता • सेवा ॥
            </div>
          </div>
        </div>
      </section>

      {/* Vertical cards */}
      <section className="container-x pb-20">
        <div className="grid lg:grid-cols-3 gap-6">
          {VERTICALS.map(({ key, to, accent, tint, textAccent, Icon, name, sanskrit, tagline, description, cta, stats, highlights }) => (
            <Link
              key={key}
              to={to}
              className="group relative block rounded-3xl overflow-hidden bg-white border border-brand/15 shadow-card hover:shadow-glow hover:-translate-y-1 transition-all duration-500"
            >
              {/* Gradient top */}
              <div className={`h-32 bg-gradient-to-br ${accent} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
                <div className="absolute top-5 left-5 w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="absolute top-5 right-5 font-devanagari text-white/60 text-lg">
                  {sanskrit}
                </div>
                <div className="absolute -bottom-6 right-5 text-white/10 font-display text-7xl font-bold select-none">
                  0{VERTICALS.findIndex((v) => v.key === key) + 1}
                </div>
              </div>

              <div className="p-6 lg:p-7">
                <h2 className="font-display text-3xl font-bold text-ink">{name}</h2>
                <div className={`mt-1 text-xs uppercase tracking-widest font-semibold ${textAccent}`}>
                  {tagline}
                </div>
                <p className="mt-4 text-sm text-ink-soft leading-relaxed min-h-[72px]">
                  {description}
                </p>

                {/* Highlights */}
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {highlights.slice(0, 4).map((h) => (
                    <span
                      key={h}
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${tint} ${textAccent}`}
                    >
                      {h}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-2 pt-5 border-t border-brand/10">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <div className="text-lg font-bold text-ink">{s.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-ink-mute mt-0.5 leading-tight">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold ${textAccent} group-hover:gap-3 transition-all`}>
                  {cta} <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-gradient-to-b from-white to-brand-soft border-y border-brand/10">
        <div className="container-x py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { Icon: ShieldCheck, title: 'Bharosemand', desc: 'Verified sources & genuine products' },
              { Icon: Package, title: 'Pan-India Delivery', desc: 'Via DTDC express network' },
              { Icon: Heart, title: 'Made with ♡', desc: 'Family-run, customer-first' },
              { Icon: Phone, title: '7-day Support', desc: 'Call or WhatsApp anytime' },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-ink">{title}</div>
                  <div className="text-xs text-ink-soft mt-0.5 leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="container-x py-16 text-center">
        <h3 className="display text-3xl md:text-4xl">Kaunsa vertical chahiye aaj?</h3>
        <p className="mt-3 text-ink-soft max-w-xl mx-auto">
          Har vertical apni kahani kehta hai — puja ki shraddha, ayurveda ki shuddhata, aur courier
          ki speed. Choose your path above.
        </p>
      </section>
    </div>
  );
}
