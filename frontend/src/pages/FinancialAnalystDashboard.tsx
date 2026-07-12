import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { formatCurrency, formatNumber, downloadCSV } from '../utils/helpers';
import { AreaChart, Area, BarChart, Bar, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ArrowRight, BarChart3, DollarSign, Download, Fuel, TrendingUp } from 'lucide-react';

const COLORS = ['#2b7fff', '#fbbf24', '#34d399', '#a78bfa', '#f87171'];

const darkTooltipStyle = {
  background: '#0d1117',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 12,
  color: '#fff',
};

export default function FinancialAnalystDashboard() {
  const [fuelData, setFuelData] = useState<any[]>([]);
  const [costData, setCostData] = useState<any[]>([]);
  const [roiData, setRoiData] = useState<any[]>([]);
  const [utilData, setUtilData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.getFuelEfficiency(), api.getCostBreakdown(), api.getROILeaderboard(), api.getUtilizationOverTime()])
      .then(([fuel, cost, roi, util]) => {
        setFuelData(fuel);
        setCostData(cost);
        setRoiData(roi);
        setUtilData(util);
      })
      .finally(() => setLoading(false));
  }, []);

  const summary = useMemo(() => {
    const totalOperatingCost = costData.reduce((sum, item) => sum + (item.total_cost || 0), 0);
    const totalRevenue = roiData.reduce((sum, item) => sum + (item.total_revenue || 0), 0);
    const avgFuelEfficiency = fuelData.length
      ? fuelData.reduce((sum, item) => sum + (item.km_per_liter || 0), 0) / fuelData.length
      : 0;
    const topRoi = roiData[0];
    const highestCostVehicle = costData[0];

    return {
      totalOperatingCost,
      totalRevenue,
      avgFuelEfficiency,
      topRoi,
      highestCostVehicle,
    };
  }, [costData, roiData, fuelData]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 rounded w-56" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="card h-28" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Finance <span className="text-gradient">Center</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Track fleet cost efficiency, utilization, and return on investment at a glance.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-secondary" onClick={() => navigate('/reports')}>Open Detailed Reports</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Operating cost</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #dc2626, #f87171)' }}>
              <DollarSign size={18} className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalOperatingCost)}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Revenue</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #059669, #34d399)' }}>
              <TrendingUp size={18} className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(summary.totalRevenue)}</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Avg. efficiency</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2b7fff, #60a5fa)' }}>
              <Fuel size={18} className="text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{summary.avgFuelEfficiency.toFixed(2)} km/L</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Top ROI vehicle</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}>
              <BarChart3 size={18} className="text-white" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{summary.topRoi?.reg_number || '—'}</p>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{summary.topRoi?.roi_percent ?? 0}% ROI</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-white text-lg">Cost trend</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => downloadCSV(costData, 'finance_costs')}>
              <Download size={14} /> CSV
            </button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={costData.filter((d: any) => d.total_cost > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="reg_number" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} stroke="rgba(255,255,255,0.1)" />
              <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} stroke="rgba(255,255,255,0.1)" tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={darkTooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="total_cost" stroke="#2b7fff" strokeWidth={2} fill="url(#costGradient)" />
              <defs>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2b7fff" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2b7fff" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-semibold text-white text-lg">Fleet utilization</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => downloadCSV(utilData, 'finance_utilization')}>
              <Download size={14} /> CSV
            </button>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={utilData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} stroke="rgba(255,255,255,0.1)" tickFormatter={v => v.slice(5)} />
              <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.4)' }} stroke="rgba(255,255,255,0.1)" domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={darkTooltipStyle} formatter={(v: number) => [`${v}%`, 'Utilization']} />
              <Area type="monotone" dataKey="utilization" stroke="#9810fa" strokeWidth={2} fill="url(#utilGradient)" />
              <defs>
                <linearGradient id="utilGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9810fa" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#9810fa" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="font-heading font-semibold text-white text-lg flex items-center gap-2">
              <DollarSign size={18} className="text-amber-400" /> Cost breakdown
            </h2>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Vehicle</th><th>Fuel</th><th>Maintenance</th><th>Total</th></tr>
            </thead>
            <tbody>
              {costData.slice(0, 6).map((item: any) => (
                <tr key={item.id}>
                  <td className="font-medium text-white">{item.reg_number}</td>
                  <td>{formatCurrency(item.fuel_cost)}</td>
                  <td>{formatCurrency(item.maintenance_cost)}</td>
                  <td className="font-semibold text-white">{formatCurrency(item.total_cost)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="font-heading font-semibold text-white text-lg flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" /> ROI leaderboard
            </h2>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Vehicle</th><th>Revenue</th><th>Cost</th><th>ROI</th></tr>
            </thead>
            <tbody>
              {roiData.slice(0, 6).map((item: any) => (
                <tr key={item.id}>
                  <td className="font-medium text-white">{item.reg_number}</td>
                  <td style={{ color: '#34d399' }}>{formatCurrency(item.total_revenue)}</td>
                  <td style={{ color: '#f87171' }}>{formatCurrency(item.total_cost)}</td>
                  <td className="font-semibold" style={{ color: item.roi_percent >= 0 ? '#34d399' : '#f87171' }}>{item.roi_percent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-5 flex items-center justify-between">
        <div>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Highest cost vehicle</p>
          <p className="text-lg font-semibold text-white">{summary.highestCostVehicle?.reg_number || '—'}</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/reports')}>
          Review full analytics <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
