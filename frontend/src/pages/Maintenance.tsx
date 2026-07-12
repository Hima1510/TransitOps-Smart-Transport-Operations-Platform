import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { getStatusBadgeClass, formatCurrency, formatDate } from '../utils/helpers';
import { Plus, X, CheckCircle } from 'lucide-react';

export default function Maintenance() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('open');
  const [showModal, setShowModal] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [form, setForm] = useState({ vehicle_id: '', description: '', cost: '' });
  const { showToast } = useToast();

  const load = () => { api.getMaintenance({ status: tab }).then(setRecords).finally(() => setLoading(false)); };
  useEffect(load, [tab]);

  const openNew = async () => { const v = await api.getVehicles(); setVehicles(v); setForm({ vehicle_id: '', description: '', cost: '' }); setShowModal(true); };

  const handleCreate = async (e: React.FormEvent) => { e.preventDefault(); try { await api.createMaintenance({ vehicle_id: Number(form.vehicle_id), description: form.description, cost: Number(form.cost) || 0 }); showToast('Maintenance record created — Vehicle is now In Shop'); setShowModal(false); load(); } catch (err: any) { showToast(err.message, 'error'); } };
  const handleClose = async (id: number) => { try { await api.closeMaintenance(id); showToast('Maintenance closed — Vehicle returned to Available'); load(); } catch (err: any) { showToast(err.message, 'error'); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-primary-color">Maintenance</h1><p className="text-secondary-color text-sm mt-1">{records.length} {tab} records</p></div><button className="btn btn-primary" onClick={openNew}><Plus size={16} />New Record</button></div>
      <div className="flex gap-1 border-b border-app">
        {['open', 'closed'].map(t => (<button key={t} onClick={() => { setTab(t); setLoading(true); }} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${tab === t ? 'border-primary-500 text-primary-500' : 'border-transparent text-secondary-color'}`}>{t}</button>))}
      </div>
      <div className="card overflow-hidden">
        <table className="data-table"><thead><tr><th>Vehicle</th><th>Description</th><th>Cost</th><th>Status</th><th>Opened</th><th>Closed</th><th>Action</th></tr></thead>
          <tbody>{loading ? <tr><td colSpan={7} className="text-center py-8">Loading...</td></tr> : records.length === 0 ? <tr><td colSpan={7} className="text-center py-8 text-secondary-color">No {tab} maintenance records</td></tr> : records.map(m => (
            <tr key={m.id}><td className="font-semibold text-primary-500">{m.vehicle_reg}</td><td>{m.description}</td><td>{formatCurrency(m.cost)}</td>
              <td><span className={`badge ${getStatusBadgeClass(m.status)}`}>{m.status}</span></td><td>{formatDate(m.opened_at)}</td><td>{formatDate(m.closed_at)}</td>
              <td>{m.status === 'open' && <button onClick={() => handleClose(m.id)} className="btn btn-success btn-sm"><CheckCircle size={13} />Close</button>}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-semibold text-primary-color">New Maintenance Record</h2><button onClick={() => setShowModal(false)} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg"><X size={18} /></button></div>
            <div className="guardrail-alert mb-4 !border-amber-300 !bg-amber-50 !text-amber-800 dark:!bg-amber-950/30 dark:!text-amber-300 dark:!border-amber-800"><span>⚠️</span><span>Creating maintenance will automatically move the vehicle to <strong>In Shop</strong> status.</span></div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div><label className="block text-sm font-medium text-secondary-color mb-1">Vehicle</label><select className="input-field" value={form.vehicle_id} onChange={e => setForm({...form, vehicle_id: e.target.value})} required><option value="">Select vehicle...</option>{vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number} — {v.name_model} ({v.status})</option>)}</select></div>
              <div><label className="block text-sm font-medium text-secondary-color mb-1">Description</label><textarea className="input-field" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} required placeholder="e.g. Engine oil change, brake pad replacement..." /></div>
              <div><label className="block text-sm font-medium text-secondary-color mb-1">Estimated Cost (₹)</label><input type="number" className="input-field" value={form.cost} onChange={e => setForm({...form, cost: e.target.value})} /></div>
              <div className="flex gap-3 pt-2"><button type="submit" className="btn btn-primary flex-1">Create & Send to Shop</button><button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
