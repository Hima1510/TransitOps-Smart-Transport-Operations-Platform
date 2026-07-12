import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatCurrency, formatNumber, formatDate, getStatusBadgeClass } from '../utils/helpers';
import { ArrowLeft, Truck, DollarSign, Fuel, Wrench, Route } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const COLORS = ['#2b7fff', '#fbbf24', '#34d399', '#a78bfa'];

export default function Vehicle360() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.getVehicle360(Number(id)).then(setData).finally(() => setLoading(false)); }, [id]);

  if (loading) return <div className="animate-pulse p-8"><div className="h-8 rounded w-48" style={{ background: 'rgba(255,255,255,0.06)' }} /></div>;
  if (!data) return <div className="text-center py-20"><p style={{ color: 'rgba(255,255,255,0.5)' }}>Vehicle not found</p></div>;

  const v = data.vehicle;
  const f = data.financials;
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Truck },
    { id: 'trips', label: 'Trips', icon: Route },
    { id: 'fuel', label: 'Fuel', icon: Fuel },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'financials', label: 'Financials', icon: DollarSign },
  ];
  const costPie = [{ name: 'Fuel', value: f.totalFuelCost }, { name: 'Maintenance', value: f.totalMaintenanceCost }, { name: 'Other', value: f.totalExpenses }].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/vehicles" className="p-2 rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <ArrowLeft size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
        </Link>
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-bold text-gradient">{v.reg_number}</h1>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{v.name_model} • {v.type}</p>
        </div>
        <span className={`badge text-base px-4 py-1.5 ${getStatusBadgeClass(v.status)}`}>{v.status}</span>
      </div>

      <div className="flex gap-3 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`pill-tab flex items-center gap-2 ${tab === t.id ? 'active' : ''}`}>
            <t.icon size={16} />{t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { l: 'Odometer', v: `${formatNumber(v.odometer)} km` },
            { l: 'Max Load', v: `${formatNumber(v.max_load_kg)} kg` },
            { l: 'Acquisition Cost', v: formatCurrency(v.acquisition_cost) },
            { l: 'Region', v: v.region || 'N/A' },
            { l: 'Total Trips', v: data.trips?.length || 0 },
            { l: 'Total Revenue', v: formatCurrency(f.totalRevenue) },
            { l: 'Total Distance', v: `${formatNumber(f.totalDistance)} km` },
            { l: 'Fuel Efficiency', v: `${f.fuelEfficiency} km/L` },
          ].map(s => (
            <div key={s.l} className="glow-card p-4">
              <p className="text-xs uppercase tracking-wider mb-1 section-label">{s.l}</p>
              <p className="text-xl font-bold text-white stat-value">{s.v}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'trips' && (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead><tr><th>Route</th><th>Status</th><th>Distance</th><th>Cargo</th><th>Revenue</th><th>Date</th></tr></thead>
            <tbody>
              {data.trips?.map((t: any) => (
                <tr key={t.id}>
                  <td className="font-medium text-white">{t.source} → {t.destination}</td>
                  <td><span className={`badge ${getStatusBadgeClass(t.status)}`}>{t.status}</span></td>
                  <td>{t.actual_distance_km || t.planned_distance_km} km</td>
                  <td>{formatNumber(t.cargo_weight_kg)} kg</td>
                  <td>{formatCurrency(t.revenue)}</td>
                  <td>{formatDate(t.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'fuel' && (
        <div className="space-y-4">
          <div className="glow-card p-5">
            <h3 className="font-semibold text-white mb-4 font-heading">Fuel History</h3>
            {data.fuelLogs?.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={[...data.fuelLogs].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} stroke="rgba(255,255,255,0.1)" tickFormatter={v => v.slice(5)} />
                  <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} stroke="rgba(255,255,255,0.1)" />
                  <Tooltip contentStyle={{ background: '#0d1117', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, color: '#fff' }} />
                  <Line type="monotone" dataKey="liters" stroke="#2b7fff" strokeWidth={2} dot={{ r: 3, fill: '#2b7fff' }} />
                  <Line type="monotone" dataKey="cost" stroke="#fbbf24" strokeWidth={2} dot={{ r: 3, fill: '#fbbf24' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : <p className="text-center py-8" style={{ color: 'rgba(255,255,255,0.4)' }}>No fuel logs</p>}
          </div>
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead><tr><th>Date</th><th>Liters</th><th>Cost</th></tr></thead>
              <tbody>{data.fuelLogs?.map((f: any) => (
                <tr key={f.id}><td>{formatDate(f.date)}</td><td>{f.liters}L</td><td>{formatCurrency(f.cost)}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'maintenance' && (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead><tr><th>Description</th><th>Status</th><th>Cost</th><th>Opened</th><th>Closed</th></tr></thead>
            <tbody>
              {data.maintenanceRecords?.map((m: any) => (
                <tr key={m.id}>
                  <td>{m.description}</td>
                  <td><span className={`badge ${getStatusBadgeClass(m.status)}`}>{m.status}</span></td>
                  <td>{formatCurrency(m.cost)}</td>
                  <td>{formatDate(m.opened_at)}</td>
                  <td>{formatDate(m.closed_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'financials' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { l: 'Total Revenue', v: formatCurrency(f.totalRevenue), c: '#34d399' },
              { l: 'Operating Cost', v: formatCurrency(f.operationalCost), c: '#f87171' },
              { l: 'Net Profit', v: formatCurrency(f.totalRevenue - f.operationalCost), c: f.totalRevenue - f.operationalCost >= 0 ? '#34d399' : '#f87171' },
              { l: 'ROI', v: `${f.roi}%`, c: f.roi >= 0 ? '#34d399' : '#f87171' },
            ].map(s => (
              <div key={s.l} className="glow-card p-4">
                <p className="text-xs uppercase tracking-wider mb-1 section-label">{s.l}</p>
                <p className="text-2xl font-bold stat-value" style={{ color: s.c }}>{s.v}</p>
              </div>
            ))}
          </div>
          {costPie.length > 0 && (
            <div className="glow-card p-5">
              <h3 className="font-semibold text-white mb-4 font-heading">Cost Breakdown</h3>
              <div className="flex items-center gap-8">
                <ResponsiveContainer width={200} height={200}>
                  <PieChart>
                    <Pie data={costPie} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                      {costPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {costPie.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{d.name}</span>
                      <span className="text-sm font-semibold text-white">{formatCurrency(d.value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
