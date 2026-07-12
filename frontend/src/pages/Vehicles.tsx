import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { getStatusBadgeClass, formatCurrency, formatNumber } from '../utils/helpers';
import { Plus, Search, X } from 'lucide-react';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ reg_number: '', name_model: '', type: 'Truck', max_load_kg: '', odometer: '', acquisition_cost: '', region: 'North' });
  const { showToast } = useToast();
  const nav = useNavigate();

  const load = () => { const p: Record<string,string> = {}; if (search) p.search = search; if (filterType) p.type = filterType; if (filterStatus) p.status = filterStatus; api.getVehicles(p).then(setVehicles).finally(() => setLoading(false)); };
  useEffect(load, [search, filterType, filterStatus]);

  const openAdd = () => { setEditing(null); setForm({ reg_number: '', name_model: '', type: 'Truck', max_load_kg: '', odometer: '', acquisition_cost: '', region: 'North' }); setShowDrawer(true); };
  const openEdit = (v: any) => { setEditing(v); setForm({ reg_number: v.reg_number, name_model: v.name_model, type: v.type, max_load_kg: String(v.max_load_kg), odometer: String(v.odometer), acquisition_cost: String(v.acquisition_cost), region: v.region || 'North' }); setShowDrawer(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...form, max_load_kg: Number(form.max_load_kg), odometer: Number(form.odometer), acquisition_cost: Number(form.acquisition_cost) };
      if (editing) { await api.updateVehicle(editing.id, data); showToast('Vehicle updated'); }
      else { await api.createVehicle(data); showToast('Vehicle added'); }
      setShowDrawer(false); load();
    } catch (err: any) { showToast(err.message, 'error'); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Vehicle <span className="text-gradient">Registry</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{vehicles.length} vehicles</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><Plus size={16} />Add Vehicle</button>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input className="input-field pl-9" placeholder="Search vehicles..." value={search} onChange={e => setSearch(e.target.value)} style={{ borderRadius: '100px' }} />
        </div>
        <select className="input-field w-auto" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ borderRadius: '100px', minWidth: 130 }}>
          <option value="">All Types</option><option>Truck</option><option>Van</option><option>Bus</option><option>Car</option>
        </select>
        <select className="input-field w-auto" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ borderRadius: '100px', minWidth: 130 }}>
          <option value="">All Status</option><option>Available</option><option>On Trip</option><option>In Shop</option><option>Retired</option>
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="data-table">
          <thead><tr><th>Reg #</th><th>Model</th><th>Type</th><th>Max Load</th><th>Odometer</th><th>Status</th><th>Cost</th></tr></thead>
          <tbody>{loading ? <tr><td colSpan={7} className="text-center py-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</td></tr> : vehicles.map(v => (
            <tr key={v.id} className="clickable" onClick={() => nav(`/vehicles/${v.id}`)}>
              <td className="font-semibold text-gradient">{v.reg_number}</td><td>{v.name_model}</td><td>{v.type}</td>
              <td>{formatNumber(v.max_load_kg)} kg</td><td>{formatNumber(v.odometer)} km</td>
              <td><span className={`badge ${getStatusBadgeClass(v.status)}`}>{v.status}</span></td>
              <td>{formatCurrency(v.acquisition_cost)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>

      {showDrawer && (
        <>
          <div className="drawer-overlay" onClick={() => setShowDrawer(false)} />
          <div className="drawer-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white font-heading">{editing ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
              <button onClick={() => setShowDrawer(false)} className="p-2 rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}><X size={18} style={{ color: 'rgba(255,255,255,0.5)' }} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Registration Number</label><input className="input-field" value={form.reg_number} onChange={e => setForm({...form, reg_number: e.target.value})} required /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Model</label><input className="input-field" value={form.name_model} onChange={e => setForm({...form, name_model: e.target.value})} required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Type</label><select className="input-field" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option>Truck</option><option>Van</option><option>Bus</option><option>Car</option></select></div>
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Region</label><select className="input-field" value={form.region} onChange={e => setForm({...form, region: e.target.value})}><option>North</option><option>South</option><option>East</option><option>West</option></select></div>
              </div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Max Load (kg)</label><input type="number" className="input-field" value={form.max_load_kg} onChange={e => setForm({...form, max_load_kg: e.target.value})} required /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Odometer (km)</label><input type="number" className="input-field" value={form.odometer} onChange={e => setForm({...form, odometer: e.target.value})} /></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Acquisition Cost (₹)</label><input type="number" className="input-field" value={form.acquisition_cost} onChange={e => setForm({...form, acquisition_cost: e.target.value})} /></div>
              <div className="flex gap-3 pt-2"><button type="submit" className="btn btn-primary flex-1">{editing ? 'Update' : 'Add Vehicle'}</button><button type="button" onClick={() => setShowDrawer(false)} className="btn btn-secondary">Cancel</button></div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
