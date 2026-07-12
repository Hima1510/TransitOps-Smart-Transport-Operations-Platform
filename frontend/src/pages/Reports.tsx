import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { formatCurrency, formatNumber, downloadCSV } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend, Cell } from 'recharts';
import { Download, TrendingUp, Fuel, DollarSign, BarChart3 } from 'lucide-react';

const COLORS = ['#2b7fff', '#fbbf24', '#34d399', '#a78bfa', '#f87171', '#22d3ee', '#fb923c', '#f472b6'];

const darkTooltipStyle = {
  background: '#0d1117',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  color: '#fff',
};

export default function Reports() {
  const [tab, setTab] = useState('fuel');
  const [fuelData, setFuelData] = useState<any[]>([]);
  const [costData, setCostData] = useState<any[]>([]);
  const [roiData, setRoiData] = useState<any[]>([]);
  const [utilData, setUtilData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { Promise.all([api.getFuelEfficiency(), api.getCostBreakdown(), api.getROILeaderboard(), api.getUtilizationOverTime()]).then(([fuel, cost, roi, util]) => { setFuelData(fuel); setCostData(cost); setRoiData(roi); setUtilData(util); }).finally(() => setLoading(false)); }, []);

  const tabs = [
    { id: 'fuel', label: 'Fuel Efficiency', icon: Fuel },
    { id: 'utilization', label: 'Fleet Utilization', icon: BarChart3 },
    { id: 'costs', label: 'Cost Breakdown', icon: DollarSign },
    { id: 'roi', label: 'Vehicle ROI', icon: TrendingUp },
  ];

  if (loading) return <div className="animate-pulse p-8"><div className="h-8 rounded w-48" style={{ background: 'rgba(255,255,255,0.06)' }} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-white">
          Reports & <span className="text-gradient">Analytics</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Data-driven fleet insights</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`pill-tab flex items-center gap-2 ${tab === t.id ? 'active' : ''}`}>
            <t.icon size={16} />{t.label}
          </button>
        ))}
      </div>

      {tab === 'fuel' && (
        <div className="space-y-4">
          <div className="glow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white font-heading">Fuel Efficiency by Vehicle (km/L)</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => downloadCSV(fuelData, 'fuel_efficiency')}><Download size={14} /> CSV</button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fuelData.filter((d: any) => d.km_per_liter > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="reg_number" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} stroke="rgba(255,255,255,0.1)" />
                <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} stroke="rgba(255,255,255,0.1)" />
                <Tooltip contentStyle={darkTooltipStyle} formatter={(v: number) => [`${v} km/L`, 'Efficiency']} />
                <Bar dataKey="km_per_liter" radius={[6, 6, 0, 0]}>
                  {fuelData.filter((d: any) => d.km_per_liter > 0).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead><tr><th>Vehicle</th><th>Model</th><th>Type</th><th>Distance</th><th>Fuel (L)</th><th>Efficiency</th></tr></thead>
              <tbody>{fuelData.map((d: any) => (
                <tr key={d.id}>
                  <td className="font-medium text-gradient">{d.reg_number}</td>
                  <td>{d.name_model}</td><td>{d.type}</td>
                  <td>{formatNumber(d.total_distance)} km</td>
                  <td>{formatNumber(d.total_liters)}</td>
                  <td className="font-semibold text-white">{d.km_per_liter} km/L</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'utilization' && (
        <div className="glow-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white font-heading">Fleet Utilization — Last 30 Days</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => downloadCSV(utilData, 'utilization')}><Download size={14} /> CSV</button>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={utilData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} stroke="rgba(255,255,255,0.1)" tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} stroke="rgba(255,255,255,0.1)" domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={darkTooltipStyle} formatter={(v: number) => [`${v}%`, 'Utilization']} />
              <defs>
                <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2b7fff" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="#9810fa" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#9810fa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="utilization" stroke="#2b7fff" strokeWidth={2} fill="url(#utilGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {tab === 'costs' && (
        <div className="space-y-4">
          <div className="glow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white font-heading">Cost Breakdown by Vehicle</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => downloadCSV(costData, 'cost_breakdown')}><Download size={14} /> CSV</button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={costData.filter((d: any) => d.total_cost > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="reg_number" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} stroke="rgba(255,255,255,0.1)" />
                <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} stroke="rgba(255,255,255,0.1)" tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={darkTooltipStyle} formatter={(v: number) => formatCurrency(v)} />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.6)' }} />
                <Bar dataKey="fuel_cost" name="Fuel" stackId="a" fill="#2b7fff" />
                <Bar dataKey="maintenance_cost" name="Maintenance" stackId="a" fill="#fbbf24" />
                <Bar dataKey="other_expenses" name="Other" stackId="a" fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead><tr><th>Vehicle</th><th>Fuel</th><th>Maintenance</th><th>Other</th><th>Total</th></tr></thead>
              <tbody>{costData.map((d: any) => (
                <tr key={d.id}>
                  <td className="font-medium text-gradient">{d.reg_number}</td>
                  <td>{formatCurrency(d.fuel_cost)}</td>
                  <td>{formatCurrency(d.maintenance_cost)}</td>
                  <td>{formatCurrency(d.other_expenses)}</td>
                  <td className="font-bold text-white">{formatCurrency(d.total_cost)}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'roi' && (
        <div className="space-y-4">
          <div className="glow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white font-heading">Vehicle ROI Leaderboard</h3>
              <button className="btn btn-secondary btn-sm" onClick={() => downloadCSV(roiData, 'roi_leaderboard')}><Download size={14} /> CSV</button>
            </div>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>ROI = (Revenue − Operating Cost) / Acquisition Cost × 100</p>
          </div>
          <div className="card overflow-hidden">
            <table className="data-table">
              <thead><tr><th>#</th><th>Vehicle</th><th>Type</th><th>Acquisition</th><th>Revenue</th><th>Cost</th><th>ROI</th></tr></thead>
              <tbody>{roiData.map((d: any, i: number) => (
                <tr key={d.id}>
                  <td>
                    <span className="w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold"
                      style={{
                        background: i === 0 ? 'rgba(251,191,36,0.15)' : i === 1 ? 'rgba(255,255,255,0.08)' : i === 2 ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
                        color: i === 0 ? '#fbbf24' : i === 1 ? 'rgba(255,255,255,0.6)' : i === 2 ? '#fb923c' : 'rgba(255,255,255,0.4)',
                        border: `1px solid ${i === 0 ? 'rgba(251,191,36,0.25)' : i === 1 ? 'rgba(255,255,255,0.12)' : i === 2 ? 'rgba(249,115,22,0.25)' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      {i + 1}
                    </span>
                  </td>
                  <td className="font-medium text-gradient">{d.reg_number}</td>
                  <td>{d.type}</td>
                  <td>{formatCurrency(d.acquisition_cost)}</td>
                  <td style={{ color: '#34d399' }}>{formatCurrency(d.total_revenue)}</td>
                  <td style={{ color: '#f87171' }}>{formatCurrency(d.total_cost)}</td>
                  <td>
                    <span className="text-lg font-bold" style={{ color: d.roi_percent >= 0 ? '#34d399' : '#f87171' }}>
                      {d.roi_percent}%
                    </span>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
