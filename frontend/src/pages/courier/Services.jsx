import { Link } from 'react-router-dom';
import { ArrowRight, Plane, Truck, Globe2, Box, Package, ShieldCheck, Zap, Clock } from 'lucide-react';

const SERVICES = [
  {
    Icon: Plane,
    title: 'Domestic Air Express',
    tagline: 'Fastest priority delivery',
    features: ['Next-day metro delivery', 'Priority handling', 'Real-time tracking', 'Doorstep pickup'],
    eta: '1-2 days',
  },
  {
    Icon: Truck,
    title: 'Ground Surface',
    tagline: 'Economical pan-India delivery',
    features: ['19,000+ PIN codes', 'Cost-effective rates', 'Bulk-friendly', 'COD supported'],
    eta: '3-7 days',
  },
  {
    Icon: Globe2,
    title: 'International Express',
    tagline: 'Door-to-door globally',
    features: ['220+ countries', 'Customs assistance', 'DHL-backed network', 'Insurance available'],
    eta: '3-10 days',
  },
  {
    Icon: ShieldCheck,
    title: 'Premium Plus',
    tagline: 'Guaranteed time-bound',
    features: ['Money-back guarantee', 'Insured shipments', 'Priority customer care', 'SMS + email alerts'],
    eta: 'Time-definite',
  },
  {
    Icon: Box,
    title: 'Cargo & Freight',
    tagline: 'Bulk and heavy shipments',
    features: ['100kg+ consignments', 'Dedicated tracking', 'B2B contracts', 'Multi-modal'],
    eta: 'As per route',
  },
  {
    Icon: Package,
    title: 'E-commerce Logistics',
    tagline: 'Built for online sellers',
    features: ['Reverse pickups', 'COD remittance', 'API integration', 'Bulk booking discounts'],
    eta: 'Flexible',
  },
  {
    Icon: Zap,
    title: 'Lite / Economy',
    tagline: 'Budget parcels',
    features: ['Lowest rates', 'Documents + small parcels', 'Surface mode', 'Easy booking'],
    eta: '5-10 days',
  },
  {
    Icon: Clock,
    title: 'Same-Day / Hyperlocal',
    tagline: 'City deliveries in hours',
    features: ['Same-day within city', '2-hour express slots', 'Retail + Food supported', 'Live tracking'],
    eta: 'Same day',
  },
];

export default function Services() {
  return (
    <div className="bg-surface min-h-screen">
      <div className="container-x py-12 lg:py-16">
        <div className="max-w-2xl mb-12">
          <div className="kicker mb-3">Services</div>
          <h1 className="display text-4xl md:text-5xl">Har parcel ke liye sahi plan</h1>
          <p className="mt-4 text-ink-soft leading-relaxed">
            Documents se le kar heavy cargo tak, local se international tak — DTDC ki poori range
            aapki zaroorat ke hisaab se.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map(({ Icon, title, tagline, features, eta }) => (
            <div key={title} className="card-hover p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="chip text-[11px]">ETA · {eta}</span>
              </div>
              <h3 className="font-semibold text-lg text-ink">{title}</h3>
              <div className="text-xs text-brand font-medium mt-1">{tagline}</div>
              <ul className="mt-4 space-y-1.5 text-sm text-ink-soft flex-1">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/courier/rate"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:gap-2 transition-all"
              >
                Get quote <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl bg-brand-dark text-white p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h3 className="display text-2xl md:text-3xl text-white">Bulk seller ho? Contract rates lo.</h3>
            <p className="mt-2 text-white/80">Volume-based discounts, dedicated account manager, API support.</p>
          </div>
          <Link to="/courier/contact" className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
            Contact sales <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
