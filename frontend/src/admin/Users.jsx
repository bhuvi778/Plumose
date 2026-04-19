import { useEffect, useState } from 'react';
import api from '../api/client.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  useEffect(() => { api.get('/admin/users').then((r) => setUsers(r.data)); }, []);
  return (
    <div>
      <h2 className="font-display text-3xl font-bold text-maroon-900 mb-6">Users</h2>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-saffron-50 text-maroon-700 text-xs uppercase"><tr>
            <th className="text-left p-3">Name</th><th className="text-left p-3">Email</th><th className="text-left p-3">Phone</th><th className="text-left p-3">Role</th><th className="text-left p-3">Joined</th>
          </tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-saffron-100">
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.phone || '—'}</td>
                <td className="p-3"><span className={`chip ${u.role === 'admin' ? 'text-saffron-700' : ''}`}>{u.role}</span></td>
                <td className="p-3 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
