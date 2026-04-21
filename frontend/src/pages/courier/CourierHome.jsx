import { Link } from 'react-router-dom';
import { ArrowRight, Package, Truck, Globe2, Plane, Box, MapPin, Phone, Clock, ShieldCheck, Search } from 'lucide-react';
import { useState } from 'react';

export default function CourierHome() {
  const [awb, setAwb] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    if (!awb.trim()) return;
    window.open(`https://www.dtdc.in/tracking/tracking_results.asp?strCnno=${encodeURIComponent(awb.trim())}`, '_blank');
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50 via-surface to-blue-50 pointer-events-none" />
        <div className="container-x relative py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 chip-solid mb-5 bg-brand text-white">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Authorized DTDC Franchise</span>
            </div>
            <h1 className="display text-5xl md:text-7xl leading-[0.95]">
              Deliver <span className="text-brand">bharose</span> ke saath
            </h1>
            <p className="mt-5 text-base text-ink-soft leading-relaxed max-w-lg">
              Domestic aur international courier, cargo, e-commerce logistics — Plumose Courier par
              DTDC ki power with local seva. 19,000+ pincodes, 220+ countries.
            </p>

            {/* Quick track */}
            <form onSubmit={handleTrack} className="mt-8 bg-white rounded-2xl p-2 shadow-card flex items-center gap-2 border border-brand/10 max-w-md">
              <Search className="w-5 h-5 text-ink-mute ml-3" />
              <input
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                placeholder="AWB / Tracking Number"
                className="flex-1 px-2 py-2.5 bg-transparent outline-none text-sm"
              />
              <button type="submit" className="btn-primary text-sm py-2.5 px-4">
                Track
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/courier/rate" className="btn-outline">Get Rate Quote</Link>
              <Link to="/courier/services" className="btn-outline">View Services</Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-brand/15 pt-6 max-w-md">
              {[
                ['19,000+', 'PIN codes'],
                ['220+', 'Countries'],
                ['99%', 'On-time'],
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
                src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=900&q=80"
                alt="Courier"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 card p-4 w-56 hidden md:block">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-brand" />
                <span className="text-sm font-semibold text-ink">Same-day pickup</span>
              </div>
              <div className="text-xs text-ink-soft mt-1">Book before 5 PM · Pan-India delivery</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="container-x py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="kicker mb-2">Our Services</div>
            <h2 className="display text-3xl md:text-4xl">Complete shipping solutions</h2>
          </div>
          <Link to="/courier/services" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-brand">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { Icon: Plane, t: 'Domestic Air Express', d: 'Next-day delivery between metros. Priority handling for urgent shipments.' },
            { Icon: Truck, t: 'Ground Surface', d: 'Economical nationwide surface delivery. 19,000+ serviceable pincodes.' },
            { Icon: Globe2, t: 'International Express', d: 'DHL-backed global network. Door-to-door to 220+ countries.' },
            { Icon: Box, t: 'Cargo & Freight', d: 'Heavy shipments, bulk cargo, B2B logistics with dedicated tracking.' },
            { Icon: Package, t: 'E-commerce Logistics', d: 'Reverse pickups, COD, bulk bookings for online sellers.' },
            { Icon: ShieldCheck, t: 'Premium Plus', d: 'Insured, guaranteed time-bound delivery with priority support.' },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="card-hover p-6">
              <div className="w-12 h-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg text-ink">{t}</h3>
              <p className="text-sm text-ink-soft mt-2 leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="bg-brand-soft/40 py-16">
        <div className="container-x grid md:grid-cols-3 gap-5">
          <Link to="/courier/track" className="card-hover p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-ink">Track Shipment</div>
              <div className="text-xs text-ink-soft mt-0.5">Live tracking with AWB number</div>
            </div>
          </Link>
          <Link to="/courier/rate" className="card-hover p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-ink">Rate Calculator</div>
              <div className="text-xs text-ink-soft mt-0.5">Get instant shipping quote</div>
            </div>
          </Link>
          <Link to="/courier/contact" className="card-hover p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand text-white flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <div className="font-semibold text-ink">Book Pickup</div>
              <div className="text-xs text-ink-soft mt-0.5">Schedule a doorstep pickup</div>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-16">
        <div className="rounded-3xl bg-gradient-to-r from-brand-dark via-brand to-brand-dark text-white p-10 lg:p-14 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
          <div>
            <h3 className="display text-3xl md:text-4xl text-white">Business shipping simplified</h3>
            <p className="mt-2 text-white/80 max-w-lg">
              Bulk contracts, COD, reverse pickups, API integration — e-commerce sellers ke liye
              dedicated plans.
            </p>
          </div>
          <Link to="/courier/contact" className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
            Talk to us <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
