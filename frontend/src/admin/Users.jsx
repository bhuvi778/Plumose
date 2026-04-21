import { useEffect, useState, useMemo } from 'react';
import api from '../api/client.js';
import { Search } from 'lucide-react';
import Loader from '../components/Loader.jsx';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    api.get('/admin/users')
      .then((r) => setUsers(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = users;
    if (roleFilter !== 'all') list = list.filter((u) => u.role === roleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q)
      );
    }
    return list;
  }, [users, search, roleFilter]);

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="display text-3xl md:text-4xl text-ink">Users</h1>
        <p className="text-sm text-ink-soft mt-1">{filtered.length} of {users.length} users</p>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-mute pointer-events-none" />
          <input placeholder="Search by name, email or phone…"
            value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-9" />
        </div>
        <div className="flex rounded-xl border border-brand/20 overflow-hidden">
          {[['all', 'All users'], ['user', 'Customers'], ['admin', 'Admins']].map(([val, label]) => (
            <button key={val} onClick={() => setRoleFilter(val)}
              className={`px-4 py-2 text-sm font-medium transition ${roleFilter === val ? 'bg-brand text-white' : 'bg-surface-soft text-ink-soft hover:bg-brand/10'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-14 text-center text-ink-mute text-sm">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-brand-soft/50 border-b border-brand/10">
                <tr className="text-left text-[11px] uppercase tracking-wider text-ink-soft">
                  <th className="p-3 pl-4">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <tr key={u._id} className="border-t border-brand/5 hover:bg-brand-soft/30">
                    <td className="p-3 pl-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-brand/15 flex items-center justify-center text-brand font-semibold text-xs shrink-0">
                          {u.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <span className="font-medium text-ink">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-ink-soft">{u.email}</td>
                    <td className="p-3 text-xs text-ink-mute">{u.phone || '—'}</td>
                    <td className="p-3">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${
                        u.role === 'admin' ? 'bg-brand text-white' : 'bg-brand/10 text-brand-dark'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-ink-mute">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
