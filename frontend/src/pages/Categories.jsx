import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import SectionTitle from '../components/SectionTitle.jsx';

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/categories').then((r) => setCats(r.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loader />;
  return (
    <div className="container-x py-10">
      <SectionTitle kicker="॥ श्रेणियाँ ॥" title="All Puja Categories" subtitle="Explore our entire collection of sacred essentials." />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {cats.map((c) => (
          <Link key={c._id} to={`/shop/${c.slug}`} className="card overflow-hidden group hover:shadow-glow transition hover:-translate-y-1">
            <div className="aspect-[4/3] bg-saffron-100 overflow-hidden">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <div className="font-semibold text-maroon-900 group-hover:text-saffron-700">{c.name}</div>
                  <div className="text-xs text-maroon-500">{c.productCount} products</div>
                </div>
              </div>
              <p className="mt-2 text-xs text-maroon-600 line-clamp-2">{c.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
