import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { formatNumber, daysUntil, formatDate } from '../utils/helpers';
import { Truck, CheckCircle, Wrench, Route, Clock, Users, AlertTriangle, ShieldAlert, Calendar, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const kpiGradients = [
  'linear-gradient(135deg, #155dfc, #2b7fff)',
  'linear-gradient(135deg, #059669, #34d399)',
  'linear-gradient(135deg, #d97706, #fbbf24)',
  'linear-gradient(135deg, #6366f1, #818cf8)',
  'linear-gradient(135deg, #7c3aed, #a78bfa)',
  'linear-gradient(135deg, #0891b2, #22d3ee)',
];

export default function Dashboard() {
  const [kpis, setKpis] = useState<any>(null);
  const [attention, setAttention] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loadingKPIs, setLoadingKPIs] = useState(false);
  
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [region, setRegion] = useState('');

  useEffect(() => {
    setLoadingKPIs(true);
    const params: Record<string, string> = {};
    if (type) params.type = type;
    if (status) params.status = status;
    if (region) params.region = region;
    
    api.getKPIs(params)
      .then(k => setKpis(k))
      .finally(() => {
        setLoadingKPIs(false);
        setLoading(false);
      });
  }, [type, status, region]);

  useEffect(() => {
    api.getAttention().then(a => setAttention(a));
  }, []);

  if (loading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 rounded w-48" style={{ background: 'rgba(255,255,255,0.06)' }} />
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4,5,6].map(i => <div key={i} className="card p-5 h-24" />)}
      </div>
    </div>
  );

  const gaugeData = [
    { name: 'Utilized', value: kpis?.fleetUtilization || 0 },
    { name: 'Idle', value: 100 - (kpis?.fleetUtilization || 0) },
  ];
  const kpiCards = [
    { label: 'Active Vehicles', value: kpis?.totalVehicles, icon: Truck, idx: 0 },
    { label: 'Available', value: kpis?.availableVehicles, icon: CheckCircle, idx: 1 },
    { label: 'In Maintenance', value: kpis?.inMaintenance, icon: Wrench, idx: 2 },
    { label: 'Active Trips', value: kpis?.activeTrips, icon: Route, idx: 3 },
    { label: 'Pending Trips', value: kpis?.pendingTrips, icon: Clock, idx: 4 },
    { label: 'Drivers On Duty', value: kpis?.driversOnDuty, icon: Users, idx: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white">
            Fleet <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Real-time overview of your transport operations
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <select value={type} onChange={e => setType(e.target.value)} className="input-field py-2 text-xs cursor-pointer" style={{ minWidth: '130px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <option value="" style={{ background: '#0d1117', color: 'white' }}>All Vehicle Types</option>
              <option value="Truck" style={{ background: '#0d1117', color: 'white' }}>Truck</option>
              <option value="Van" style={{ background: '#0d1117', color: 'white' }}>Van</option>
              <option value="Bus" style={{ background: '#0d1117', color: 'white' }}>Bus</option>
              <option value="Car" style={{ background: '#0d1117', color: 'white' }}>Car</option>
            </select>
          </div>
          <div>
            <select value={status} onChange={e => setStatus(e.target.value)} className="input-field py-2 text-xs cursor-pointer" style={{ minWidth: '130px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <option value="" style={{ background: '#0d1117', color: 'white' }}>All Statuses</option>
              <option value="Available" style={{ background: '#0d1117', color: 'white' }}>Available</option>
              <option value="On Trip" style={{ background: '#0d1117', color: 'white' }}>On Trip</option>
              <option value="In Shop" style={{ background: '#0d1117', color: 'white' }}>In Shop</option>
            </select>
          </div>
          <div>
            <select value={region} onChange={e => setRegion(e.target.value)} className="input-field py-2 text-xs cursor-pointer" style={{ minWidth: '130px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <option value="" style={{ background: '#0d1117', color: 'white' }}>All Regions</option>
              <option value="North" style={{ background: '#0d1117', color: 'white' }}>North</option>
              <option value="South" style={{ background: '#0d1117', color: 'white' }}>South</option>
              <option value="West" style={{ background: '#0d1117', color: 'white' }}>West</option>
              <option value="East" style={{ background: '#0d1117', color: 'white' }}>East</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-200 ${loadingKPIs ? 'opacity-50' : 'opacity-100'}`}>
        {kpiCards.map(k => (
          <div key={k.label} className="glow-card p-5 hover:border-purple-500/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{k.label}</span>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: kpiGradients[k.idx], boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
                <k.icon size={18} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white stat-value">{formatNumber(k.value || 0)}</p>
          </div>
        ))}

        {/* Fleet Utilization Gauge */}
        <div className="glow-card p-5 lg:col-span-2 flex items-center gap-6">
          <div className="w-[140px] h-[140px] relative flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gaugeData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                  <Cell fill="url(#gaugeGradient)" />
                  <Cell fill="rgba(255,255,255,0.06)" />
                </Pie>
                <defs>
                  <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#155dfc" />
                    <stop offset="100%" stopColor="#9810fa" />
                  </linearGradient>
                </defs>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">{kpis?.fleetUtilization}%</span>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Utilized</span>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={18} className="text-gradient" style={{ color: '#9810fa' }} />
              <h3 className="font-semibold text-white text-lg font-heading">Fleet Utilization</h3>
            </div>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {kpis?.vehiclesOnTrip} of {kpis?.totalVehicles} vehicles currently on trips
            </p>
            <div className="mt-3 flex gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(135deg, #155dfc, #9810fa)' }} />
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>On Trip ({kpis?.vehiclesOnTrip})</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>Idle ({(kpis?.totalVehicles || 0) - (kpis?.vehiclesOnTrip || 0)})</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Attention Section */}
      {attention && (
        <div className="glow-card p-6">
          <h2 className="font-heading font-semibold text-white text-lg mb-4 flex items-center gap-2">
            <AlertTriangle size={20} style={{ color: '#fbbf24' }} />
            Attention Required
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attention.expiredLicenses?.length > 0 && (
              <div className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <ShieldAlert size={18} style={{ color: '#f87171' }} />
                  <h3 className="font-semibold text-sm" style={{ color: '#f87171' }}>Expired Licenses</h3>
                </div>
                {attention.expiredLicenses.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(239,68,68,0.1)' }}>
                    <span className="text-sm text-white font-medium">{d.name}</span>
                    <span className="text-xs font-semibold" style={{ color: '#f87171' }}>Expired {Math.abs(daysUntil(d.license_expiry))}d ago</span>
                  </div>
                ))}
              </div>
            )}
            {attention.expiringLicenses?.length > 0 && (
              <div className="p-4 rounded-xl" style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.2)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar size={18} style={{ color: '#fbbf24' }} />
                  <h3 className="font-semibold text-sm" style={{ color: '#fbbf24' }}>Expiring Soon</h3>
                </div>
                {attention.expiringLicenses.map((d: any) => (
                  <div key={d.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(217,119,6,0.1)' }}>
                    <span className="text-sm text-white font-medium">{d.name}</span>
                    <span className="text-xs font-semibold" style={{ color: '#fbbf24' }}>{daysUntil(d.license_expiry)}d left</span>
                  </div>
                ))}
              </div>
            )}
            {attention.overdueMaintenance?.length > 0 && (
              <div className="p-4 rounded-xl" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Wrench size={18} style={{ color: '#fb923c' }} />
                  <h3 className="font-semibold text-sm" style={{ color: '#fb923c' }}>Overdue Maintenance</h3>
                </div>
                {attention.overdueMaintenance.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid rgba(249,115,22,0.1)' }}>
                    <span className="text-sm text-white font-medium">{m.vehicle_reg}</span>
                    <span className="text-xs" style={{ color: '#fb923c' }}>{m.description?.substring(0,30)}...</span>
                  </div>
                ))}
              </div>
            )}
            {!attention.expiredLicenses?.length && !attention.expiringLicenses?.length && !attention.overdueMaintenance?.length && (
              <div className="col-span-3 text-center py-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <CheckCircle size={40} className="mx-auto mb-2" style={{ color: '#34d399' }} />
                <p className="font-medium">All clear! No urgent items.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
