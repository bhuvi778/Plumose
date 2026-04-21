import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import Loader from '../components/Loader.jsx';

export default function Categories() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/categories').then((r) => setCats(r.data)).finally(() => setLoading(false)); }, []);
  if (loading) return <Loader />;
  return (
    <div className="container-x py-20">
      <div className="mb-10 border-b border-ink/20 pb-8">
        <div className="text-[10px] uppercase tracking-[0.3em] text-ink/40 font-mono mb-3">Browse</div>
        <h1 className="text-5xl md:text-7xl text-ink leading-[0.85] tracking-tighter" style={{ fontFamily: 'Anton, Impact, sans-serif', textTransform: 'uppercase' }}>
          Categories
        </h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cats.map((c) => (
          <Link
            key={c._id}
            to={`/shop/${c.slug}`}
            className="group border border-ink/10 hover:border-ink transition-colors bg-concrete"
          >
            <div className="aspect-[4/3] overflow-hidden bg-ink/5">
              {c.image
                ? <img src={c.image} alt={c.name} className="w-full h-full object-cover img-cinematic" />
                : <div className="w-full h-full flex items-center justify-center text-ink/20 text-4xl font-mono">P</div>
              }
            </div>
            <div className="p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-ink group-hover:line-through transition">{c.name}</div>
              <div className="text-[10px] font-mono text-ink/40 mt-0.5">{c.productCount} products</div>
              {c.description && (
                <p className="mt-2 text-xs text-ink/50 line-clamp-2 font-body leading-relaxed">{c.description}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
