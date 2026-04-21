import { useState } from 'react';
import { Calculator, MessageCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const SERVICE_TYPES = [
  'Domestic Air Express',
  'Ground Surface',
  'International Express',
  'Premium Plus',
  'Cargo / Freight',
  'Lite / Economy',
];

export default function RateEnquiry() {
  const [form, setForm] = useState({
    fromPin: '',
    toPin: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    serviceType: SERVICE_TYPES[0],
    name: '',
    phone: '',
    email: '',
  });
  const [quote, setQuote] = useState(null);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const calculate = (e) => {
    e.preventDefault();
    const { fromPin, toPin, weight, length, width, height, serviceType } = form;
    if (!fromPin || !toPin || !weight) {
      toast.error('From PIN, To PIN and weight are required');
      return;
    }
    // Indicative estimate only — actual rate from team
    const vol = length && width && height ? (Number(length) * Number(width) * Number(height)) / 5000 : 0;
    const chargeable = Math.max(Number(weight), vol);
    const base = {
      'Domestic Air Express': 90,
      'Ground Surface': 45,
      'International Express': 650,
      'Premium Plus': 120,
      'Cargo / Freight': 35,
      'Lite / Economy': 38,
    }[serviceType] || 60;
    const est = Math.round(base * chargeable + 40);
    setQuote({ chargeable: chargeable.toFixed(2), est, serviceType });
    toast.success('Indicative quote generated');
  };

  const whatsapp = () => {
    const msg = encodeURIComponent(
      `Hi Plumose Courier,\n\nRate enquiry:\n• From: ${form.fromPin}\n• To: ${form.toPin}\n• Weight: ${form.weight}kg\n• Dims: ${form.length}x${form.width}x${form.height} cm\n• Service: ${form.serviceType}\n• Name: ${form.name}\n• Phone: ${form.phone}`
    );
    window.open(`https://wa.me/919999999999?text=${msg}`, '_blank');
  };

  return (
    <div className="bg-surface min-h-screen">
      <div className="container-x py-12 lg:py-16 max-w-5xl">
        <div className="mb-10">
          <div className="kicker mb-3">Rate Enquiry</div>
          <h1 className="display text-4xl md:text-5xl">Get a shipping quote</h1>
          <p className="mt-3 text-ink-soft max-w-2xl">
            Fill in parcel details for an indicative estimate. Final rates confirmed by our team
            (pickup area, fuel surcharge, COD etc. may apply).
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <form onSubmit={calculate} className="card p-6 lg:p-8 lg:col-span-2 space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">From PIN code *</label>
                <input className="input mt-1" value={form.fromPin} onChange={(e) => update('fromPin', e.target.value)} placeholder="e.g. 110001" />
              </div>
              <div>
                <label className="label">To PIN code *</label>
                <input className="input mt-1" value={form.toPin} onChange={(e) => update('toPin', e.target.value)} placeholder="e.g. 400001" />
              </div>
            </div>

            <div>
              <label className="label">Service Type</label>
              <select className="input mt-1" value={form.serviceType} onChange={(e) => update('serviceType', e.target.value)}>
                {SERVICE_TYPES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="label">Weight (kg) *</label>
                <input type="number" step="0.1" className="input mt-1" value={form.weight} onChange={(e) => update('weight', e.target.value)} />
              </div>
              <div>
                <label className="label">L (cm)</label>
                <input type="number" className="input mt-1" value={form.length} onChange={(e) => update('length', e.target.value)} />
              </div>
              <div>
                <label className="label">W (cm)</label>
                <input type="number" className="input mt-1" value={form.width} onChange={(e) => update('width', e.target.value)} />
              </div>
              <div>
                <label className="label">H (cm)</label>
                <input type="number" className="input mt-1" value={form.height} onChange={(e) => update('height', e.target.value)} />
              </div>
            </div>

            <div className="border-t border-brand/10 pt-5">
              <div className="text-sm font-semibold text-ink mb-3">Your contact (optional)</div>
              <div className="grid md:grid-cols-3 gap-4">
                <input className="input" placeholder="Name" value={form.name} onChange={(e) => update('name', e.target.value)} />
                <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
                <input className="input" placeholder="Email" value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" className="btn-primary">
                <Calculator className="w-4 h-4" /> Calculate
              </button>
              <button type="button" onClick={whatsapp} className="btn-outline">
                <MessageCircle className="w-4 h-4" /> Confirm on WhatsApp
              </button>
            </div>
          </form>

          <div className="card p-6 h-fit sticky top-24">
            <div className="text-xs text-brand font-semibold uppercase tracking-wider">Estimate</div>
            {quote ? (
              <>
                <div className="mt-2 text-4xl font-display font-bold text-brand-dark">₹{quote.est}</div>
                <div className="text-xs text-ink-soft mt-1">Indicative only · Taxes extra</div>
                <div className="mt-5 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-ink-soft">Service</span><span className="font-medium">{quote.serviceType}</span></div>
                  <div className="flex justify-between"><span className="text-ink-soft">Chargeable wt</span><span className="font-medium">{quote.chargeable} kg</span></div>
                </div>
                <button onClick={whatsapp} className="btn-primary w-full mt-6 text-sm">
                  Book on WhatsApp <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="mt-4 text-sm text-ink-soft">
                Fill the form to see an indicative quote. Our team confirms the exact rate including
                any pickup / fuel / COD charges.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
