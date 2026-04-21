import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'General', message: '' });
  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const send = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return toast.error('Name and phone required');
    const msg = encodeURIComponent(
      `Plumose Courier Enquiry\n\n• Name: ${form.name}\n• Phone: ${form.phone}\n• Email: ${form.email}\n• Subject: ${form.subject}\n• Message: ${form.message}`
    );
    window.open(`https://wa.me/919999999999?text=${msg}`, '_blank');
    toast.success('Opening WhatsApp...');
  };

  return (
    <div className="bg-surface min-h-screen">
      <div className="container-x py-12 lg:py-16">
        <div className="max-w-2xl mb-10">
          <div className="kicker mb-3">Contact</div>
          <h1 className="display text-4xl md:text-5xl">Baat kijiye, bhejiye bharose ke saath</h1>
          <p className="mt-3 text-ink-soft">
            Pickup request, bulk quote, franchise query, ya koi bhi sawaal — hum ready hain.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Info */}
          <div className="space-y-4">
            {[
              { Icon: Phone, label: 'Call', value: '+91 99999 99999', href: 'tel:+919999999999' },
              { Icon: MessageCircle, label: 'WhatsApp', value: 'Chat instantly', href: 'https://wa.me/919999999999' },
              { Icon: Mail, label: 'Email', value: 'hello@plumose.in', href: 'mailto:hello@plumose.in' },
              { Icon: MapPin, label: 'Branch', value: 'Main Road, Your City, India' },
              { Icon: Clock, label: 'Hours', value: 'Mon-Sat · 9:30 AM – 8:00 PM' },
            ].map(({ Icon, label, value, href }) => {
              const Wrap = href ? 'a' : 'div';
              return (
                <Wrap key={label} href={href} target={href?.startsWith('http') ? '_blank' : undefined} className="card-hover p-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-ink-mute font-semibold">{label}</div>
                    <div className="text-sm font-medium text-ink mt-0.5">{value}</div>
                  </div>
                </Wrap>
              );
            })}
          </div>

          {/* Form */}
          <form onSubmit={send} className="card p-6 lg:p-8 lg:col-span-2 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Name *</label>
                <input className="input mt-1" value={form.name} onChange={(e) => update('name', e.target.value)} />
              </div>
              <div>
                <label className="label">Phone *</label>
                <input className="input mt-1" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="label">Email</label>
                <input className="input mt-1" value={form.email} onChange={(e) => update('email', e.target.value)} />
              </div>
              <div>
                <label className="label">Subject</label>
                <select className="input mt-1" value={form.subject} onChange={(e) => update('subject', e.target.value)}>
                  <option>General</option>
                  <option>Pickup Request</option>
                  <option>Bulk / Business</option>
                  <option>Franchise Enquiry</option>
                  <option>Complaint / Support</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Message</label>
              <textarea rows={5} className="input mt-1" value={form.message} onChange={(e) => update('message', e.target.value)} />
            </div>
            <button type="submit" className="btn-primary">
              Send on WhatsApp <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Franchise strip */}
        <div className="mt-14 rounded-3xl bg-gradient-to-r from-brand-dark via-brand to-brand-dark text-white p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-glow">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="display text-2xl md:text-3xl text-white">Authorized DTDC Franchise</h3>
              <p className="mt-1 text-white/80 max-w-xl">
                Plumose Courier is an authorized DTDC partner delivering pan-India and global
                shipping with local service.
              </p>
            </div>
          </div>
          <a
            href="tel:+919999999999"
            className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
          >
            <Phone className="w-4 h-4" /> Call Now
          </a>
        </div>
      </div>
    </div>
  );
}
