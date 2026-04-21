import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get('/admin/users').then((r) => setUsers(r.data)); }, []);
  return (
    <div>
      <div className="border border-ink p-8 mb-8">
        <div className="text-[10px] font-mono uppercase tracking-[0.3em] text-ink/40 mb-2">Admin / Users</div>
        <h1 className="text-4xl uppercase tracking-tighter leading-[0.9]" style={{ fontFamily: 'Anton, Impact, sans-serif' }}>Users</h1>
      </div>
      <div className="border border-ink overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-ink/40 text-[10px] uppercase tracking-widest font-mono bg-ink/5 border-b border-ink/10"><tr>
            <th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Phone</th><th className="text-left p-3">Role</th><th className="text-left p-3">Joined</th>
          </tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-ink/10 hover:bg-ink/5">
                <td className="p-3 font-medium text-ink">{u.name}</td>
                <td className="p-3 font-mono text-xs text-ink/70">{u.email}</td>
                <td className="p-3 font-mono text-xs text-ink/50">{u.phone || '—'}</td>
                <td className="p-3">
                  <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider ${u.role === 'admin' ? 'bg-ink text-concrete' : 'border border-ink/30 text-ink/60'}`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-xs font-mono text-ink/40">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
