import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { getStatusBadgeClass, getLicenseExpiryBadge } from '../utils/helpers';
import { Plus, X } from 'lucide-react';

export default function Drivers() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', license_number: '', license_category: 'HMV', license_expiry: '', contact_number: '', safety_score: '100' });
  const { showToast } = useToast();
  const nav = useNavigate();

  const load = () => { const p: Record<string,string> = {}; if (search) p.search = search; if (filterStatus) p.status = filterStatus; api.getDrivers(p).then(setDrivers).finally(() => setLoading(false)); };
  useEffect(load, [search, filterStatus]);

  const openAdd = () => { setEditing(null); setForm({ name: '', license_number: '', license_category: 'HMV', license_expiry: '', contact_number: '', safety_score: '100' }); setShowDrawer(true); };
  const openEdit = (d: any) => { setEditing(d); setForm({ name: d.name, license_number: d.license_number, license_category: d.license_category, license_expiry: d.license_expiry?.split('T')[0] || d.license_expiry, contact_number: d.contact_number || '', safety_score: String(d.safety_score) }); setShowDrawer(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...form, safety_score: Number(form.safety_score) };
      if (editing) { await api.updateDriver(editing.id, data); showToast('Driver updated'); }
      else { await api.createDriver(data); showToast('Driver added'); }
      setShowDrawer(false); load();
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Driver <span className="text-gradient">Management</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{drivers.length} drivers</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} />Add Driver</button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <input className="input-field" placeholder="Search drivers..." value={search} onChange={e => setSearch(e.target.value)} style={{ borderRadius: '100px' }} />
        </div>
        <select className="input-field w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ borderRadius: '100px', minWidth: 130 }}>
          <option value="">All Status</option><option>Available</option><option>On Trip</option><option>Off Duty</option><option>Suspended</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Name</th><th>License</th><th>Category</th><th>License Expiry</th><th>Safety Score</th><th>Status</th><th>Contact</th></tr></thead>
          <tbody>{loading ? <tr><td colSpan={7} className="text-center py-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</td></tr> : drivers.map(d => {
            const lb = getLicenseExpiryBadge(d.license_expiry);
            return (
              <tr key={d.id} className="clickable" onClick={() => nav(`/drivers/${d.id}`)}>
                <td className="font-semibold text-gradient">{d.name}</td>
                <td>{d.license_number}</td>
                <td>{d.license_category}</td>
                <td><span className={`badge ${lb.class}`}>{lb.text}</span></td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                      <div className="h-full rounded-full" style={{
                        width: `${d.safety_score}%`,
                        background: d.safety_score >= 80 ? 'linear-gradient(90deg, #059669, #34d399)' : d.safety_score >= 60 ? 'linear-gradient(90deg, #d97706, #fbbf24)' : 'linear-gradient(90deg, #dc2626, #f87171)',
                      }} />
                    </div>
                    <span className="text-sm font-medium text-white">{d.safety_score}</span>
                  </div>
                </td>
                <td><span className={`badge ${getStatusBadgeClass(d.status)}`}>{d.status}</span></td>
                <td style={{ color: 'rgba(255,255,255,0.5)' }}>{d.contact_number || '—'}</td>
              </tr>
            );
          })}</tbody>
        </table>
      </div>

      {showDrawer && (
        <>
          <div className="drawer-overlay" onClick={() => setShowDrawer(false)} />
          <div className="drawer-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white font-heading">{editing ? 'Edit Driver' : 'Add Driver'}</h2>
              <button onClick={() => setShowDrawer(false)} className="p-2 rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}><X size={18} style={{ color: 'rgba(255,255,255,0.5)' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Full Name</label><input className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>License Number</label><input className="input-field" value={form.license_number} onChange={e => setForm({...form, license_number: e.target.value})} required /></div>
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Category</label><select className="input-field" value={form.license_category} onChange={e => setForm({...form, license_category: e.target.value})}><option>HMV</option><option>LMV</option><option>HPMV</option></select></div>
              </div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>License Expiry</label><input type="date" className="input-field" value={form.license_expiry} onChange={e => setForm({...form, license_expiry: e.target.value})} required /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Contact Number</label><input className="input-field" value={form.contact_number} onChange={e => setForm({...form, contact_number: e.target.value})} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Safety Score (0–100)</label><input type="number" min="0" max="100" className="input-field" value={form.safety_score} onChange={e => setForm({...form, safety_score: e.target.value})} /></div>
              <div className="flex gap-3 pt-2"><button type="submit" className="btn btn-primary flex-1">{editing ? 'Update' : 'Add Driver'}</button><button type="button" onClick={() => setShowDrawer(false)} className="btn btn-secondary">Cancel</button></div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
