import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';
import { useVertical } from '../context/VerticalContext.jsx';

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const { vertical, config } = useVertical();
  const base = config.base;

  useEffect(() => {
    api.get(`/categories?vertical=${vertical}`).then((r) => setCats(r.data)).finally(() => setLoading(false));
  }, [vertical]);

  if (loading) return <Loader />;

  return (
    <div className="container-x py-10">
      <div className="mb-8 pb-6 border-b border-brand/15">
        <div className="kicker mb-2">Browse</div>
        <h1 className="display text-4xl md:text-5xl">All Categories</h1>
        <p className="text-sm text-ink-soft mt-2">
          {cats.length} categories · jo bhi chahiye, sab yahan milega
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cats.map((c) => (
          <Link
            key={c._id}
            to={`${base}/shop/${c.slug}`}
            className="group card-hover overflow-hidden flex flex-col"
          >
            <div className="aspect-[4/3] overflow-hidden bg-brand-soft relative">
              {c.image ? (
                <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl opacity-40">
                  {c.icon || '🪔'}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
            </div>
            <div className="p-4 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{c.icon || '🪔'}</span>
                <div className="font-semibold text-ink group-hover:text-brand transition">{c.name}</div>
              </div>
              <div className="text-xs text-ink-soft mt-1">{c.productCount} products</div>
              {c.description && (
                <p className="mt-2 text-xs text-ink-soft line-clamp-2 leading-relaxed">{c.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
