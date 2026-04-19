import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 bg-gradient-to-br from-maroon-900 to-maroon-800 text-saffron-100">
      <div className="container-x py-16 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">🪔</span>
            <div>
              <div className="font-display text-2xl font-bold text-white">Devapi</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-saffron-300">Sacred Essentials</div>
            </div>
          </div>
          <p className="text-sm text-saffron-200/80 leading-relaxed">
            Handpicked puja essentials — idols, diyas, incense, thali sets and more. We bring the divinity of temples to your home mandir.
          </p>
          <div className="flex gap-3 mt-5">
            <a className="p-2 rounded-full bg-white/10 hover:bg-saffron-500 transition"><Instagram className="w-4 h-4" /></a>
            <a className="p-2 rounded-full bg-white/10 hover:bg-saffron-500 transition"><Facebook className="w-4 h-4" /></a>
            <a className="p-2 rounded-full bg-white/10 hover:bg-saffron-500 transition"><Youtube className="w-4 h-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-saffron-200/80">
            <li><Link to="/shop/idols-murtis" className="hover:text-white">Idols & Murtis</Link></li>
            <li><Link to="/shop/diyas-lamps" className="hover:text-white">Diyas & Lamps</Link></li>
            <li><Link to="/shop/puja-thali" className="hover:text-white">Puja Thali Sets</Link></li>
            <li><Link to="/shop/rudraksha-malas" className="hover:text-white">Rudraksha & Malas</Link></li>
            <li><Link to="/shop" className="hover:text-white">View all</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Help</h4>
          <ul className="space-y-2 text-sm text-saffron-200/80">
            <li><a className="hover:text-white">Shipping & Delivery</a></li>
            <li><a className="hover:text-white">Returns & Refunds</a></li>
            <li><a className="hover:text-white">Track Order</a></li>
            <li><a className="hover:text-white">FAQs</a></li>
            <li><a className="hover:text-white">Contact us</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Get in touch</h4>
          <ul className="space-y-3 text-sm text-saffron-200/80">
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5" /> Varanasi, Uttar Pradesh, India</li>
            <li className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> care@devapi.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x py-4 text-xs text-saffron-300/70 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Devapi. Crafted with devotion 🙏</span>
          <span className="font-devanagari">सर्वे भवन्तु सुखिनः • सर्वे सन्तु निरामयाः</span>
        </div>
      </div>
    </footer>
  );
}
