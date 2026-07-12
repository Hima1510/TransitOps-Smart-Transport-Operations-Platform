import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Plus, X, Fuel, Receipt } from 'lucide-react';

export default function FuelExpenses() {
  const [tab, setTab] = useState<'fuel' | 'expenses'>('fuel');
  const [fuelLogs, setFuelLogs] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [fuelForm, setFuelForm] = useState({ vehicle_id: '', liters: '', cost: '', date: '' });
  const [expenseForm, setExpenseForm] = useState({ vehicle_id: '', category: 'toll', amount: '', date: '', note: '' });
  const { showToast } = useToast();

  const loadFuel = () => api.getFuelLogs().then(setFuelLogs).finally(() => setLoading(false));
  const loadExpenses = () => api.getExpenses().then(setExpenses).finally(() => setLoading(false));
  useEffect(() => { setLoading(true); tab === 'fuel' ? loadFuel() : loadExpenses(); }, [tab]);

  const openNew = async () => { const v = await api.getVehicles(); setVehicles(v); setShowModal(true); };

  const handleFuel = async (e: React.FormEvent) => { e.preventDefault(); try { await api.createFuelLog({ vehicle_id: Number(fuelForm.vehicle_id), liters: Number(fuelForm.liters), cost: Number(fuelForm.cost), date: fuelForm.date }); showToast('Fuel log added'); setShowModal(false); loadFuel(); } catch (err: any) { showToast(err.message, 'error'); } };
  const handleExpense = async (e: React.FormEvent) => { e.preventDefault(); try { await api.createExpense({ vehicle_id: Number(expenseForm.vehicle_id), category: expenseForm.category, amount: Number(expenseForm.amount), date: expenseForm.date, note: expenseForm.note }); showToast('Expense added'); setShowModal(false); loadExpenses(); } catch (err: any) { showToast(err.message, 'error'); } };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Fuel & <span className="text-gradient">Expenses</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Track operating costs</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={16} />Add {tab === 'fuel' ? 'Fuel Log' : 'Expense'}</button>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setTab('fuel')} className={`pill-tab flex items-center gap-2 ${tab === 'fuel' ? 'active' : ''}`}>
          <Fuel size={16} />Fuel Logs
        </button>
        <button onClick={() => setTab('expenses')} className={`pill-tab flex items-center gap-2 ${tab === 'expenses' ? 'active' : ''}`}>
          <Receipt size={16} />Expenses
        </button>
      </div>

      {tab === 'fuel' ? (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead><tr><th>Vehicle</th><th>Date</th><th>Liters</th><th>Cost</th><th>Rate/L</th></tr></thead>
            <tbody>{loading ? <tr><td colSpan={5} className="text-center py-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</td></tr> : fuelLogs.map(f => (
              <tr key={f.id}>
                <td className="font-semibold text-gradient">{f.vehicle_reg}</td>
                <td>{formatDate(f.date)}</td>
                <td>{f.liters}L</td>
                <td>{formatCurrency(f.cost)}</td>
                <td>{formatCurrency(f.cost / f.liters)}/L</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead><tr><th>Vehicle</th><th>Category</th><th>Amount</th><th>Date</th><th>Note</th></tr></thead>
            <tbody>{loading ? <tr><td colSpan={5} className="text-center py-8" style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</td></tr> : expenses.map(e => (
              <tr key={e.id}>
                <td className="font-semibold text-gradient">{e.vehicle_reg}</td>
                <td className="capitalize">{e.category}</td>
                <td>{formatCurrency(e.amount)}</td>
                <td>{formatDate(e.date)}</td>
                <td style={{ color: 'rgba(255,255,255,0.5)' }}>{e.note || '—'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white font-heading">{tab === 'fuel' ? 'Add Fuel Log' : 'Add Expense'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}><X size={18} style={{ color: 'rgba(255,255,255,0.5)' }} /></button>
            </div>
            {tab === 'fuel' ? (
              <form onSubmit={handleFuel} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Vehicle</label><select className="input-field" value={fuelForm.vehicle_id} onChange={e => setFuelForm({...fuelForm, vehicle_id: e.target.value})} required><option value="">Select...</option>{vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number}</option>)}</select></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Liters</label><input type="number" step="0.1" className="input-field" value={fuelForm.liters} onChange={e => setFuelForm({...fuelForm, liters: e.target.value})} required /></div>
                  <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Cost (₹)</label><input type="number" className="input-field" value={fuelForm.cost} onChange={e => setFuelForm({...fuelForm, cost: e.target.value})} required /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Date</label><input type="date" className="input-field" value={fuelForm.date} onChange={e => setFuelForm({...fuelForm, date: e.target.value})} required /></div>
                <div className="flex gap-3 pt-2"><button type="submit" className="btn btn-primary flex-1">Add Fuel Log</button><button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button></div>
              </form>
            ) : (
              <form onSubmit={handleExpense} className="space-y-4">
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Vehicle</label><select className="input-field" value={expenseForm.vehicle_id} onChange={e => setExpenseForm({...expenseForm, vehicle_id: e.target.value})} required><option value="">Select...</option>{vehicles.map(v => <option key={v.id} value={v.id}>{v.reg_number}</option>)}</select></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Category</label><select className="input-field" value={expenseForm.category} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}><option value="toll">Toll</option><option value="insurance">Insurance</option><option value="fines">Fines</option><option value="tires">Tires</option><option value="other">Other</option></select></div>
                  <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Amount (₹)</label><input type="number" className="input-field" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} required /></div>
                </div>
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Date</label><input type="date" className="input-field" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})} required /></div>
                <div><label className="block text-sm font-medium mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Note</label><input className="input-field" value={expenseForm.note} onChange={e => setExpenseForm({...expenseForm, note: e.target.value})} placeholder="Optional..." /></div>
                <div className="flex gap-3 pt-2"><button type="submit" className="btn btn-primary flex-1">Add Expense</button><button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button></div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
