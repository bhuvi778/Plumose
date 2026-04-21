import { useState } from 'react';
import { Search, ExternalLink, Package, Clock, MapPin } from 'lucide-react';

export default function Track() {
  const [awb, setAwb] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    const trimmed = awb.trim();
    if (!trimmed) return;
    window.open(
      `https://www.dtdc.in/tracking/tracking_results.asp?strCnno=${encodeURIComponent(trimmed)}`,
      '_blank'
    );
  };

  return (
    <div className="bg-surface min-h-screen">
      <div className="container-x py-12 lg:py-16 max-w-4xl">
        <div className="text-center mb-10">
          <div className="kicker mb-3">Shipment Tracking</div>
          <h1 className="display text-4xl md:text-5xl">Track your parcel</h1>
          <p className="mt-3 text-ink-soft">
            Enter your AWB / Consignment number. You'll be redirected to the official DTDC tracking portal.
          </p>
        </div>

        <form onSubmit={handleTrack} className="card p-6 md:p-8">
          <label className="label block mb-2">AWB / Tracking Number</label>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 bg-white border-2 border-brand/20 focus-within:border-brand rounded-xl px-4">
              <Search className="w-5 h-5 text-ink-mute" />
              <input
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                placeholder="e.g. D12345678"
                className="flex-1 py-3 bg-transparent outline-none text-sm"
              />
            </div>
            <button type="submit" className="btn-primary">
              Track Now <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-3 text-xs text-ink-mute">
            Secure tracking powered by DTDC's official portal (dtdc.in).
          </div>
        </form>

        {/* Info cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-10">
          {[
            { Icon: Package, t: 'Where is my AWB?', d: 'Your booking receipt / SMS from us contains the AWB number.' },
            { Icon: Clock, t: 'When does it update?', d: 'Status updates every 2-4 hours at transit scan points.' },
            { Icon: MapPin, t: 'Need help?', d: 'Call our branch for anything beyond online tracking.' },
          ].map(({ Icon, t, d }) => (
            <div key={t} className="card p-5">
              <Icon className="w-5 h-5 text-brand mb-2" />
              <div className="font-semibold text-sm text-ink">{t}</div>
              <div className="text-xs text-ink-soft mt-1 leading-relaxed">{d}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-brand-soft/50 border border-brand/15 p-6 text-center">
          <div className="text-sm text-ink-soft">
            Facing an issue with tracking?{' '}
            <a href="/courier/contact" className="text-brand font-semibold hover:underline">
              Reach out to our team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
