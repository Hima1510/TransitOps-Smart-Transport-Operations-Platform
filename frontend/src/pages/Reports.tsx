import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { formatCurrency, formatNumber, downloadCSV } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, Cell } from 'recharts';
import { Download, TrendingUp, Fuel, DollarSign, BarChart3 } from 'lucide-react';

const COLORS = ['#2563eb', '#f59e0b', '#10b981', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316', '#ec4899'];

export default function Reports() {
  const [tab, setTab] = useState('fuel');
  const [fuelData, setFuelData] = useState<any[]>([]);
  const [costData, setCostData] = useState<any[]>([]);
  const [roiData, setRoiData] = useState<any[]>([]);
  const [utilData, setUtilData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { Promise.all([api.getFuelEfficiency(), api.getCostBreakdown(), api.getROILeaderboard(), api.getUtilizationOverTime()]).then(([fuel, cost, roi, util]) => { setFuelData(fuel); setCostData(cost); setRoiData(roi); setUtilData(util); }).finally(() => setLoading(false)); }, []);

  const tabs = [{ id: 'fuel', label: 'Fuel Efficiency', icon: Fuel }, { id: 'utilization', label: 'Fleet Utilization', icon: BarChart3 }, { id: 'costs', label: 'Cost Breakdown', icon: DollarSign }, { id: 'roi', label: 'Vehicle ROI', icon: TrendingUp }];

  if (loading) return <div className="animate-pulse p-8"><div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-48"></div></div>;

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-primary-color">Reports & Analytics</h1><p className="text-secondary-color text-sm mt-1">Data-driven fleet insights</p></div>
      <div className="flex gap-1 border-b border-app overflow-x-auto">{tabs.map(t => (<button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${tab === t.id ? 'border-primary-500 text-primary-500' : 'border-transparent text-secondary-color hover:text-primary-color'}`}><t.icon size={16} />{t.label}</button>))}</div>

      {tab === 'fuel' && (
        <div className="space-y-4">
          <div className="card p-5"><div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-primary-color">Fuel Efficiency by Vehicle (km/L)</h3><button className="btn btn-secondary btn-sm" onClick={() => downloadCSV(fuelData, 'fuel_efficiency')}><Download size={14} /> CSV</button></div>
            <ResponsiveContainer width="100%" height={300}><BarChart data={fuelData.filter((d: any) => d.km_per_liter > 0)}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="reg_number" tick={{fontSize:12}} stroke="var(--text-muted)" /><YAxis tick={{fontSize:12}} stroke="var(--text-muted)" /><Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border-color)',borderRadius:8}} formatter={(v: number) => [`${v} km/L`, 'Efficiency']} /><Bar dataKey="km_per_liter" radius={[6,6,0,0]}>{fuelData.filter((d: any) => d.km_per_liter > 0).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar></BarChart></ResponsiveContainer>
          </div>
          <div className="card overflow-hidden"><table className="data-table"><thead><tr><th>Vehicle</th><th>Model</th><th>Type</th><th>Distance</th><th>Fuel (L)</th><th>Efficiency</th></tr></thead><tbody>{fuelData.map((d: any) => (<tr key={d.id}><td className="font-medium text-primary-500">{d.reg_number}</td><td>{d.name_model}</td><td>{d.type}</td><td>{formatNumber(d.total_distance)} km</td><td>{formatNumber(d.total_liters)}</td><td className="font-semibold">{d.km_per_liter} km/L</td></tr>))}</tbody></table></div>
        </div>
      )}
      {tab === 'utilization' && (
        <div className="card p-5"><div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-primary-color">Fleet Utilization — Last 30 Days</h3><button className="btn btn-secondary btn-sm" onClick={() => downloadCSV(utilData, 'utilization')}><Download size={14} /> CSV</button></div>
          <ResponsiveContainer width="100%" height={350}><AreaChart data={utilData}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="date" tick={{fontSize:11}} stroke="var(--text-muted)" tickFormatter={v => v.slice(5)} /><YAxis tick={{fontSize:12}} stroke="var(--text-muted)" domain={[0,100]} unit="%" /><Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border-color)',borderRadius:8}} formatter={(v: number) => [`${v}%`, 'Utilization']} /><defs><linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} /><stop offset="95%" stopColor="#2563eb" stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="utilization" stroke="#2563eb" strokeWidth={2} fill="url(#utilGrad)" /></AreaChart></ResponsiveContainer>
        </div>
      )}
      {tab === 'costs' && (
        <div className="space-y-4">
          <div className="card p-5"><div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-primary-color">Cost Breakdown by Vehicle</h3><button className="btn btn-secondary btn-sm" onClick={() => downloadCSV(costData, 'cost_breakdown')}><Download size={14} /> CSV</button></div>
            <ResponsiveContainer width="100%" height={300}><BarChart data={costData.filter((d: any) => d.total_cost > 0)}><CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" /><XAxis dataKey="reg_number" tick={{fontSize:12}} stroke="var(--text-muted)" /><YAxis tick={{fontSize:12}} stroke="var(--text-muted)" tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} /><Tooltip contentStyle={{background:'var(--bg-card)',border:'1px solid var(--border-color)',borderRadius:8}} formatter={(v: number) => formatCurrency(v)} /><Legend /><Bar dataKey="fuel_cost" name="Fuel" stackId="a" fill="#2563eb" /><Bar dataKey="maintenance_cost" name="Maintenance" stackId="a" fill="#f59e0b" /><Bar dataKey="other_expenses" name="Other" stackId="a" fill="#10b981" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer>
          </div>
          <div className="card overflow-hidden"><table className="data-table"><thead><tr><th>Vehicle</th><th>Fuel</th><th>Maintenance</th><th>Other</th><th>Total</th></tr></thead><tbody>{costData.map((d: any) => (<tr key={d.id}><td className="font-medium text-primary-500">{d.reg_number}</td><td>{formatCurrency(d.fuel_cost)}</td><td>{formatCurrency(d.maintenance_cost)}</td><td>{formatCurrency(d.other_expenses)}</td><td className="font-bold">{formatCurrency(d.total_cost)}</td></tr>))}</tbody></table></div>
        </div>
      )}
      {tab === 'roi' && (
        <div className="space-y-4">
          <div className="card p-5"><div className="flex items-center justify-between mb-4"><h3 className="font-semibold text-primary-color">Vehicle ROI Leaderboard</h3><button className="btn btn-secondary btn-sm" onClick={() => downloadCSV(roiData, 'roi_leaderboard')}><Download size={14} /> CSV</button></div><p className="text-sm text-secondary-color mb-4">ROI = (Revenue − Operating Cost) / Acquisition Cost × 100</p></div>
          <div className="card overflow-hidden"><table className="data-table"><thead><tr><th>#</th><th>Vehicle</th><th>Type</th><th>Acquisition</th><th>Revenue</th><th>Cost</th><th>ROI</th></tr></thead><tbody>{roiData.map((d: any, i: number) => (<tr key={d.id}><td><span className={`w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300' : i === 1 ? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' : i === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' : 'bg-surface-100 text-secondary-color dark:bg-surface-700'}`}>{i+1}</span></td><td className="font-medium text-primary-500">{d.reg_number}</td><td>{d.type}</td><td>{formatCurrency(d.acquisition_cost)}</td><td className="text-green-600">{formatCurrency(d.total_revenue)}</td><td className="text-red-500">{formatCurrency(d.total_cost)}</td><td><span className={`text-lg font-bold ${d.roi_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>{d.roi_percent}%</span></td></tr>))}</tbody></table></div>
        </div>
      )}
    </div>
  );
}
