import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { getStatusBadgeClass, formatCurrency, formatNumber } from '../utils/helpers';
import { Plus, LayoutGrid, List, Play, CheckCircle, XCircle, MapPin, Truck as TruckIcon, User, Package, X } from 'lucide-react';

export default function Trips() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'table'>('kanban');
  const [showModal, setShowModal] = useState(false);
  const [eligibleVehicles, setEligibleVehicles] = useState<any[]>([]);
  const [eligibleDrivers, setEligibleDrivers] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ source: '', destination: '', vehicle_id: '', driver_id: '', cargo_weight_kg: '', planned_distance_km: '', revenue: '' });
  const { showToast } = useToast();

  const load = () => { api.getTrips().then(setTrips).finally(() => setLoading(false)); };
  useEffect(load, []);

  const openNew = async () => { setError(''); setForm({ source: '', destination: '', vehicle_id: '', driver_id: '', cargo_weight_kg: '', planned_distance_km: '', revenue: '' }); const [v, d] = await Promise.all([api.getEligibleVehicles(), api.getEligibleDrivers()]); setEligibleVehicles(v); setEligibleDrivers(d); setShowModal(true); };

  const handleCreate = async (e: React.FormEvent) => { e.preventDefault(); setError(''); try { await api.createTrip({ ...form, vehicle_id: Number(form.vehicle_id), driver_id: Number(form.driver_id), cargo_weight_kg: Number(form.cargo_weight_kg), planned_distance_km: Number(form.planned_distance_km), revenue: Number(form.revenue) }); showToast('Trip created as Draft'); setShowModal(false); load(); } catch (err: any) { setError(err.message); } };
  const dispatch = async (id: number) => { try { await api.dispatchTrip(id); showToast('Trip dispatched'); load(); } catch (err: any) { showToast(err.message, 'error'); } };
  const complete = async (id: number) => { try { await api.completeTrip(id, {}); showToast('Trip completed'); load(); } catch (err: any) { showToast(err.message, 'error'); } };
  const cancel = async (id: number) => { try { await api.cancelTrip(id); showToast('Trip cancelled'); load(); } catch (err: any) { showToast(err.message, 'error'); } };

  const columns = [
    { status: 'Draft', label: 'Draft', color: 'rgba(255,255,255,0.5)' },
    { status: 'Dispatched', label: 'Dispatched', color: '#60a5fa' },
    { status: 'Completed', label: 'Completed', color: '#34d399' },
    { status: 'Cancelled', label: 'Cancelled', color: '#f87171' },
  ];

  const selectedVehicle = eligibleVehicles.find(v => v.id === Number(form.vehicle_id));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Trip <span className="text-gradient">Management</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{trips.length} total trips</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setView('kanban')}
              className="p-2 transition-all"
              style={{ background: view === 'kanban' ? 'linear-gradient(135deg, #155dfc, #9810fa)' : 'rgba(255,255,255,0.04)', color: view === 'kanban' ? '#fff' : 'rgba(255,255,255,0.5)' }}>
              <LayoutGrid size={18} />
            </button>
            <button onClick={() => setView('table')}
              className="p-2 transition-all"
              style={{ background: view === 'table' ? 'linear-gradient(135deg, #155dfc, #9810fa)' : 'rgba(255,255,255,0.04)', color: view === 'table' ? '#fff' : 'rgba(255,255,255,0.5)' }}>
              <List size={18} />
            </button>
          </div>
          <button className="btn btn-primary" onClick={openNew}><Plus size={16} />New Trip</button>
        </div>
      </div>

      {view === 'kanban' ? (
        <div className="kanban-board">
          {columns.map(col => { const colTrips = trips.filter(t => t.status === col.status); return (
            <div key={col.status} className="kanban-column">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm font-heading" style={{ color: col.color }}>{col.label}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' }}>{colTrips.length}</span>
              </div>
              {colTrips.map(t => (
                <div key={t.id} className="kanban-card">
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#2b7fff' }} />
                    <p className="font-semibold text-white text-sm">{t.source} → {t.destination}</p>
                  </div>
                  <div className="space-y-1 text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex items-center gap-1.5"><TruckIcon size={12} />{t.vehicle_reg}</div>
                    <div className="flex items-center gap-1.5"><User size={12} />{t.driver_name}</div>
                    <div className="flex items-center gap-1.5"><Package size={12} />{formatNumber(t.cargo_weight_kg)} kg</div>
                  </div>
                  {t.revenue > 0 && <p className="text-sm font-semibold mb-2" style={{ color: '#34d399' }}>{formatCurrency(t.revenue)}</p>}
                  <div className="flex gap-2">
                    {t.status === 'Draft' && <><button onClick={() => dispatch(t.id)} className="btn btn-primary btn-sm"><Play size={13} />Dispatch</button><button onClick={() => cancel(t.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}><XCircle size={16} /></button></>}
                    {t.status === 'Dispatched' && <><button onClick={() => complete(t.id)} className="btn btn-success btn-sm"><CheckCircle size={13} />Complete</button><button onClick={() => cancel(t.id)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'rgba(255,255,255,0.3)' }}><XCircle size={16} /></button></>}
                  </div>
                </div>
              ))}
            </div>
          ); })}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead><tr><th>Route</th><th>Vehicle</th><th>Driver</th><th>Cargo</th><th>Status</th><th>Revenue</th><th>Actions</th></tr></thead>
            <tbody>{trips.map(t => (
              <tr key={t.id}>
                <td className="font-medium text-white">{t.source} → {t.destination}</td>
                <td className="text-gradient">{t.vehicle_reg}</td>
                <td>{t.driver_name}</td>
                <td>{formatNumber(t.cargo_weight_kg)} kg</td>
                <td><span className={`badge ${getStatusBadgeClass(t.status)}`}>{t.status}</span></td>
                <td>{formatCurrency(t.revenue)}</td>
                <td>
                  <div className="flex gap-1">
                    {t.status === 'Draft' && <><button onClick={() => dispatch(t.id)} className="btn btn-primary btn-sm">Dispatch</button><button onClick={() => cancel(t.id)} className="btn btn-danger btn-sm">Cancel</button></>}
                    {t.status === 'Dispatched' && <><button onClick={() => complete(t.id)} className="btn btn-success btn-sm">Complete</button><button onClick={() => cancel(t.id)} className="btn btn-danger btn-sm">Cancel</button></>}
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white font-heading">New Trip</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}><X size={18} style={{ color: 'rgba(255,255,255,0.5)' }} /></button>
            </div>
            {error && <div className="guardrail-alert mb-4"><span>🛡️</span><span>{error}</span></div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Origin</label><input className="input-field" value={form.source} onChange={e => setForm({...form, source: e.target.value})} placeholder="e.g. Mumbai" required /></div>
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Destination</label><input className="input-field" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} placeholder="e.g. Delhi" required /></div>
              </div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Vehicle</label><select className="input-field" value={form.vehicle_id} onChange={e => setForm({...form, vehicle_id: e.target.value})} required><option value="">Select vehicle...</option>{eligibleVehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number} — {v.name_model} ({formatNumber(v.max_load_kg)}kg max)</option>)}</select></div>
              <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Driver</label><select className="input-field" value={form.driver_id} onChange={e => setForm({...form, driver_id: e.target.value})} required><option value="">Select driver...</option>{eligibleDrivers.map(d => <option key={d.id} value={d.id}>{d.name} — Score: {d.safety_score}</option>)}</select></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Cargo (kg)</label><input type="number" className="input-field" value={form.cargo_weight_kg} onChange={e => setForm({...form, cargo_weight_kg: e.target.value})} required />{selectedVehicle && Number(form.cargo_weight_kg) > selectedVehicle.max_load_kg && <p className="text-xs mt-1" style={{ color: '#f87171' }}>Exceeds max load ({formatNumber(selectedVehicle.max_load_kg)} kg)</p>}</div>
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Distance (km)</label><input type="number" className="input-field" value={form.planned_distance_km} onChange={e => setForm({...form, planned_distance_km: e.target.value})} required /></div>
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Revenue (₹)</label><input type="number" className="input-field" value={form.revenue} onChange={e => setForm({...form, revenue: e.target.value})} /></div>
              </div>
              <div className="flex gap-3 pt-2"><button type="submit" className="btn btn-primary flex-1">Create Trip (Draft)</button><button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
