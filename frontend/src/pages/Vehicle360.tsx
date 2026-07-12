import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatCurrency, formatNumber, formatDate, getStatusBadgeClass } from '../utils/helpers';
import { ArrowLeft, Truck, DollarSign, Fuel, Wrench, Route } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#8b5cf6'];

export default function Vehicle360() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.getVehicle360(Number(id)).then(setData).finally(() => setLoading(false)); }, [id]);
  if (loading) return <div className="animate-pulse p-8"><div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-48"></div></div>;
  if (!data) return <div className="text-center py-20"><p className="text-secondary-color">Vehicle not found</p></div>;

  const v = data.vehicle;
  const f = data.financials;
  const tabs = [{ id: 'overview', label: 'Overview', icon: Truck }, { id: 'trips', label: 'Trips', icon: Route }, { id: 'fuel', label: 'Fuel', icon: Fuel }, { id: 'maintenance', label: 'Maintenance', icon: Wrench }, { id: 'financials', label: 'Financials', icon: DollarSign }];
  const costPie = [{ name: 'Fuel', value: f.totalFuelCost }, { name: 'Maintenance', value: f.totalMaintenanceCost }, { name: 'Other', value: f.totalExpenses }].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4"><Link to="/vehicles" className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"><ArrowLeft size={20} /></Link>
        <div className="flex-1"><h1 className="text-2xl font-bold text-primary-color">{v.reg_number}</h1><p className="text-secondary-color text-sm">{v.name_model} • {v.type}</p></div>
        <span className={`badge text-base px-4 py-1.5 ${getStatusBadgeClass(v.status)}`}>{v.status}</span>
      </div>
      <div className="flex gap-1 border-b border-app overflow-x-auto">{tabs.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? 'border-primary-500 text-primary-500' : 'border-transparent text-secondary-color hover:text-primary-color'}`}><t.icon size={16} />{t.label}</button>))}</div>

      {tab === 'overview' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[{ l: 'Odometer', v: `${formatNumber(v.odometer)} km` }, { l: 'Max Load', v: `${formatNumber(v.max_load_kg)} kg` }, { l: 'Acquisition Cost', v: formatCurrency(v.acquisition_cost) }, { l: 'Region', v: v.region || 'N/A' }, { l: 'Total Trips', v: data.trips?.length || 0 }, { l: 'Total Revenue', v: formatCurrency(f.totalRevenue) }, { l: 'Total Distance', v: `${formatNumber(f.totalDistance)} km` }, { l: 'Fuel Efficiency', v: `${f.fuelEfficiency} km/L` }].map(s => (
            <div key={s.l} className="card p-4"><p className="text-secondary-color text-xs uppercase tracking-wider mb-1">{s.l}</p><p className="text-xl font-bold text-primary-color">{s.v}</p></div>
          ))}
        </div>
      )}
      {tab === 'trips' && (
        <div className="card overflow-hidden"><table className="data-table"><thead><tr><th>Route</th><th>Status</th><th>Distance</th><th>Cargo</th><th>Revenue</th><th>Date</th></tr></thead><tbody>
          {data.trips?.map((t: any) => (<tr key={t.id}><td className="font-medium">{t.source} → {t.destination}</td><td><span className={`badge ${getStatusBadgeClass(t.status)}`}>{t.status}</span></td><td>{t.actual_distance_km || t.planned_distance_km} km</td><td>{formatNumber(t.cargo_weight_kg)} kg</td><td>{formatCurrency(t.revenue)}</td><td>{formatDate(t.created_at)}</td></tr>))}
        </tbody></table></div>
      )}
      {tab === 'fuel' && (
        <div className="space-y-4">
          <div className="card p-5"><h3 className="font-semibold text-primary-color mb-4">Fuel History</h3>
            {data.fuelLogs?.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}><LineChart data={[...data.fuelLogs].reverse()}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="date" tick={{fontSize:11}} stroke="var(--text-muted)" tickFormatter={v => v.slice(5)} /><YAxis tick={{fontSize:12}} stroke="var(--text-muted)" /><Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border-color)',borderRadius:8}} /><Line type="monotone" dataKey="liters" stroke="#2563eb" strokeWidth={2} dot={{r:3}} /><Line type="monotone" dataKey="cost" stroke="#f59e0b" strokeWidth={2} dot={{r:3}} /></LineChart></ResponsiveContainer>
            ) : <p className="text-secondary-color text-center py-8">No fuel logs</p>}
          </div>
          <div className="card overflow-hidden"><table className="data-table"><thead><tr><th>Date</th><th>Liters</th><th>Cost</th></tr></thead><tbody>{data.fuelLogs?.map((f: any) => (<tr key={f.id}><td>{formatDate(f.date)}</td><td>{f.liters}L</td><td>{formatCurrency(f.cost)}</td></tr>))}</tbody></table></div>
        </div>
      )}
      {tab === 'maintenance' && (
        <div className="card overflow-hidden"><table className="data-table"><thead><tr><th>Description</th><th>Status</th><th>Cost</th><th>Opened</th><th>Closed</th></tr></thead><tbody>
          {data.maintenanceRecords?.map((m: any) => (<tr key={m.id}><td>{m.description}</td><td><span className={`badge ${getStatusBadgeClass(m.status)}`}>{m.status}</span></td><td>{formatCurrency(m.cost)}</td><td>{formatDate(m.opened_at)}</td><td>{formatDate(m.closed_at)}</td></tr>))}
        </tbody></table></div>
      )}
      {tab === 'financials' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[{ l: 'Total Revenue', v: formatCurrency(f.totalRevenue), c: 'text-green-600' }, { l: 'Operating Cost', v: formatCurrency(f.operationalCost), c: 'text-red-500' }, { l: 'Net Profit', v: formatCurrency(f.totalRevenue - f.operationalCost), c: f.totalRevenue - f.operationalCost >= 0 ? 'text-green-600' : 'text-red-500' }, { l: 'ROI', v: `${f.roi}%`, c: f.roi >= 0 ? 'text-green-600' : 'text-red-500' }].map(s => (
              <div key={s.l} className="card p-4"><p className="text-secondary-color text-xs uppercase tracking-wider mb-1">{s.l}</p><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p></div>
            ))}
          </div>
          {costPie.length > 0 && (
            <div className="card p-5"><h3 className="font-semibold text-primary-color mb-4">Cost Breakdown</h3>
              <div className="flex items-center gap-8"><ResponsiveContainer width={200} height={200}><PieChart><Pie data={costPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>{costPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie></PieChart></ResponsiveContainer>
                <div className="space-y-3">{costPie.map((d, i) => (<div key={d.name} className="flex items-center gap-3"><div className="w-3 h-3 rounded-full" style={{background:COLORS[i]}}></div><span className="text-sm text-secondary-color">{d.name}</span><span className="text-sm font-semibold text-primary-color">{formatCurrency(d.value)}</span></div>))}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
