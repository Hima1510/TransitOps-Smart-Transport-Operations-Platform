import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import { formatCurrency, formatDate, formatNumber } from '../utils/helpers';
import { AlertTriangle, BadgeCheck, ShieldAlert, Wrench, Users, Route, Truck, ChevronRight, Activity } from 'lucide-react';

const statCards = [
  { key: 'complianceScore', label: 'Compliance score', accent: 'linear-gradient(135deg, #059669, #34d399)' },
  { key: 'expiringLicenses', label: 'Expiring licenses', accent: 'linear-gradient(135deg, #d97706, #fbbf24)' },
  { key: 'atRiskDrivers', label: 'At-risk drivers', accent: 'linear-gradient(135deg, #dc2626, #f87171)' },
  { key: 'overdueMaintenance', label: 'Overdue maintenance', accent: 'linear-gradient(135deg, #7c3aed, #a78bfa)' },
];

export default function SafetyOfficerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getSafetyDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    if (!data?.summary) return {} as Record<string, number>;
    return data.summary;
  }, [data]);

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
            Safety <span className="text-gradient">Command Center</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Monitor compliance, licensing, maintenance risk, and active trip exposure in one view.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button className="btn btn-secondary" onClick={() => navigate('/drivers')}>Review Drivers</button>
          <button className="btn btn-primary" onClick={() => navigate('/maintenance')}>Open Maintenance</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.key} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{card.label}</span>
              <div className="w-9 h-9 rounded-lg" style={{ background: card.accent }} />
            </div>
            <p className="text-3xl font-bold text-white">
              {card.key === 'complianceScore' ? `${stats[card.key] ?? 0}%` : stats[card.key] ?? 0}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card p-6 xl:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-400" />
            <h2 className="font-heading font-semibold text-white text-lg">Immediate action list</h2>
          </div>
          <div className="space-y-3">
            {data?.alerts?.length ? data.alerts.map((alert: any, index: number) => (
              <div key={`${alert.type}-${index}`} className="flex items-start justify-between rounded-xl border p-3" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex gap-3">
                  <div className="mt-0.5">
                    {alert.type === 'license' ? <ShieldAlert size={16} className="text-amber-400" /> : alert.type === 'maintenance' ? <Wrench size={16} className="text-orange-400" /> : alert.type === 'driver' ? <Users size={16} className="text-red-400" /> : <Route size={16} className="text-cyan-400" />}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{alert.title}</p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{alert.message}</p>
                  </div>
                </div>
                <button className="text-sm flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.45)' }} onClick={() => navigate(alert.path)}>
                  Open <ChevronRight size={14} />
                </button>
              </div>
            )) : (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-emerald-300">
                <div className="flex items-center gap-2">
                  <BadgeCheck size={16} />
                  <span>No urgent safety alerts at the moment.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-cyan-400" />
            <h2 className="font-heading font-semibold text-white text-lg">Trip exposure</h2>
          </div>
          <div className="space-y-3">
            {data?.trips?.length ? data.trips.map((trip: any) => (
              <div key={trip.id} className="rounded-xl border p-3" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                <p className="font-semibold text-white text-sm">{trip.source} → {trip.destination}</p>
                <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{trip.driver_name} • {trip.vehicle_reg}</p>
                <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{formatNumber(trip.planned_distance_km)} km • {formatNumber(trip.cargo_weight_kg)} kg</p>
              </div>
            )) : (
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>No active trips are currently in motion.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="font-heading font-semibold text-white text-lg flex items-center gap-2">
              <Users size={18} className="text-amber-400" /> Driver watchlist
            </h2>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Score</th><th>Status</th><th>Expiry</th></tr>
            </thead>
            <tbody>
              {data?.drivers?.length ? data.drivers.map((driver: any) => (
                <tr key={driver.id}>
                  <td className="font-medium text-white">{driver.name}</td>
                  <td>{driver.safety_score}</td>
                  <td><span className={`badge ${driver.safety_score < 70 ? 'badge-cancelled' : 'badge-in-shop'}`}>{driver.status}</span></td>
                  <td>{formatDate(driver.license_expiry)}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="text-center py-6" style={{ color: 'rgba(255,255,255,0.45)' }}>No drivers flagged right now.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <h2 className="font-heading font-semibold text-white text-lg flex items-center gap-2">
              <Truck size={18} className="text-orange-400" /> Fleet hold / maintenance
            </h2>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Vehicle</th><th>Issue</th><th>Cost</th></tr>
            </thead>
            <tbody>
              {data?.vehicles?.length ? data.vehicles.map((vehicle: any) => (
                <tr key={vehicle.id}>
                  <td className="font-medium text-white">{vehicle.reg_number}</td>
                  <td>{vehicle.description || 'Inspection pending'}</td>
                  <td>{formatCurrency(vehicle.cost || 0)}</td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="text-center py-6" style={{ color: 'rgba(255,255,255,0.45)' }}>No vehicle hold records to display.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
