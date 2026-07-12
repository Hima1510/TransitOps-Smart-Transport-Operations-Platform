import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { formatNumber, daysUntil, formatDate } from '../utils/helpers';
import { Truck, CheckCircle, Wrench, Route, Clock, Users, AlertTriangle, ShieldAlert, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [attention, setAttention] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { Promise.all([api.getKPIs(), api.getAttention()]).then(([k, a]) => { setKpis(k); setAttention(a); }).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="animate-pulse space-y-6"><div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-48"></div><div className="grid grid-cols-4 gap-4">{[1,2,3,4,5,6].map(i => <div key={i} className="card p-5 h-24"></div>)}</div></div>;

  const gaugeData = [{ name: 'Utilized', value: kpis?.fleetUtilization || 0 }, { name: 'Idle', value: 100 - (kpis?.fleetUtilization || 0) }];
  const kpiCards = [
    { label: 'Active Vehicles', value: kpis?.totalVehicles, icon: Truck, color: 'from-blue-500 to-blue-700' },
    { label: 'Available', value: kpis?.availableVehicles, icon: CheckCircle, color: 'from-emerald-500 to-emerald-700' },
    { label: 'In Maintenance', value: kpis?.inMaintenance, icon: Wrench, color: 'from-amber-500 to-amber-700' },
    { label: 'Active Trips', value: kpis?.activeTrips, icon: Route, color: 'from-indigo-500 to-indigo-700' },
    { label: 'Pending Trips', value: kpis?.pendingTrips, icon: Clock, color: 'from-violet-500 to-violet-700' },
    { label: 'Drivers On Duty', value: kpis?.driversOnDuty, icon: Users, color: 'from-teal-500 to-teal-700' },
  ];

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-primary-color">Fleet Dashboard</h1><p className="text-secondary-color text-sm mt-1">Real-time overview of your transport operations</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(k => (
          <div key={k.label} className="card p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3"><span className="text-secondary-color text-sm font-medium">{k.label}</span><div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${k.color} flex items-center justify-center`}><k.icon size={18} className="text-white" /></div></div>
            <p className="text-3xl font-bold text-primary-color">{formatNumber(k.value || 0)}</p>
          </div>
        ))}
        <div className="card p-5 lg:col-span-2 flex items-center gap-6">
          <div className="w-[140px] h-[140px] relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={gaugeData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}><Cell fill="#2563eb" /><Cell fill="#e2e8f0" /></Pie></PieChart></ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-bold text-primary-color">{kpis?.fleetUtilization}%</span><span className="text-[11px] text-muted-color">Utilized</span></div>
          </div>
          <div><h3 className="font-semibold text-primary-color text-lg">Fleet Utilization</h3><p className="text-secondary-color text-sm mt-1">{kpis?.vehiclesOnTrip} of {kpis?.totalVehicles} vehicles currently on trips</p>
            <div className="mt-3 flex gap-4 text-sm"><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span><span className="text-secondary-color">On Trip ({kpis?.vehiclesOnTrip})</span></span><span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700"></span><span className="text-secondary-color">Idle ({(kpis?.totalVehicles || 0) - (kpis?.vehiclesOnTrip || 0)})</span></span></div>
          </div>
        </div>
      </div>
      {attention && (
        <div className="card p-6">
          <h2 className="font-semibold text-primary-color text-lg mb-4 flex items-center gap-2"><AlertTriangle size={20} className="text-amber-500" />Attention Required</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attention.expiredLicenses?.length > 0 && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
                <div className="flex items-center gap-2 mb-3"><ShieldAlert size={18} className="text-red-500" /><h3 className="font-semibold text-red-700 dark:text-red-400 text-sm">Expired Licenses</h3></div>
                {attention.expiredLicenses.map((d: any) => (<div key={d.id} className="flex items-center justify-between py-2 border-b border-red-100 dark:border-red-900 last:border-0"><span className="text-sm text-primary-color font-medium">{d.name}</span><span className="text-xs text-red-600 dark:text-red-400 font-semibold">Expired {Math.abs(daysUntil(d.license_expiry))}d ago</span></div>))}
              </div>
            )}
            {attention.expiringLicenses?.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <div className="flex items-center gap-2 mb-3"><Calendar size={18} className="text-amber-500" /><h3 className="font-semibold text-amber-700 dark:text-amber-400 text-sm">Expiring Soon</h3></div>
                {attention.expiringLicenses.map((d: any) => (<div key={d.id} className="flex items-center justify-between py-2 border-b border-amber-100 dark:border-amber-900 last:border-0"><span className="text-sm text-primary-color font-medium">{d.name}</span><span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">{daysUntil(d.license_expiry)}d left</span></div>))}
              </div>
            )}
            {attention.overdueMaintenance?.length > 0 && (
              <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900">
                <div className="flex items-center gap-2 mb-3"><Wrench size={18} className="text-orange-500" /><h3 className="font-semibold text-orange-700 dark:text-orange-400 text-sm">Overdue Maintenance</h3></div>
                {attention.overdueMaintenance.map((m: any) => (<div key={m.id} className="flex items-center justify-between py-2 border-b border-orange-100 dark:border-orange-900 last:border-0"><span className="text-sm text-primary-color font-medium">{m.vehicle_reg}</span><span className="text-xs text-orange-600 dark:text-orange-400">{m.description?.substring(0,30)}...</span></div>))}
              </div>
            )}
            {!attention.expiredLicenses?.length && !attention.expiringLicenses?.length && !attention.overdueMaintenance?.length && (
              <div className="col-span-3 text-center py-8 text-secondary-color"><CheckCircle size={40} className="mx-auto mb-2 text-green-500" /><p className="font-medium">All clear! No urgent items.</p></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
