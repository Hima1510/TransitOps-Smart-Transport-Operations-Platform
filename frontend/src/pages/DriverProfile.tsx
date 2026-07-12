import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import { formatCurrency, formatNumber, formatDate, getStatusBadgeClass, getLicenseExpiryBadge, daysUntil } from '../utils/helpers';
import { ArrowLeft, Shield, Phone, CreditCard } from 'lucide-react';

export default function DriverProfile() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.getDriverProfile(Number(id)).then(setData).finally(() => setLoading(false)); }, [id]);
  if (loading) return <div className="animate-pulse p-8"><div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-48"></div></div>;
  if (!data) return <div className="text-center py-20"><p className="text-secondary-color">Driver not found</p></div>;

  const d = data.driver;
  const s = data.stats;
  const lb = getLicenseExpiryBadge(d.license_expiry);
  const daysLeft = daysUntil(d.license_expiry);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4"><Link to="/drivers" className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"><ArrowLeft size={20} /></Link>
        <div className="flex-1"><h1 className="text-2xl font-bold text-primary-color">{d.name}</h1><p className="text-secondary-color text-sm flex items-center gap-3"><span className="flex items-center gap-1"><CreditCard size={14} />{d.license_number}</span>{d.contact_number && <span className="flex items-center gap-1"><Phone size={14} />{d.contact_number}</span>}</p></div>
        <span className={`badge text-base px-4 py-1.5 ${getStatusBadgeClass(d.status)}`}>{d.status}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <div className="relative inline-block mb-3">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-color)" strokeWidth="8" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={d.safety_score >= 80 ? '#059669' : d.safety_score >= 60 ? '#d97706' : '#dc2626'} strokeWidth="8" strokeDasharray={`${d.safety_score * 3.14} ${314 - d.safety_score * 3.14}`} strokeDashoffset="78.5" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-bold text-primary-color">{d.safety_score}</span><span className="text-xs text-secondary-color">Safety</span></div>
          </div>
          <p className="text-sm text-secondary-color">{d.safety_score >= 80 ? 'Excellent Driver' : d.safety_score >= 60 ? 'Needs Improvement' : 'At Risk'}</p>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4"><Shield size={18} className="text-primary-500" /><h3 className="font-semibold text-primary-color">License Details</h3></div>
          <div className="space-y-3">
            <div className="flex justify-between"><span className="text-secondary-color text-sm">Category</span><span className="font-medium text-primary-color">{d.license_category}</span></div>
            <div className="flex justify-between"><span className="text-secondary-color text-sm">Expiry</span><span className={`badge ${lb.class}`}>{lb.text}</span></div>
            <div className="flex justify-between"><span className="text-secondary-color text-sm">Date</span><span className="font-medium text-primary-color">{formatDate(d.license_expiry)}</span></div>
            {daysLeft <= 30 && daysLeft > 0 && <div className="guardrail-alert text-sm">⚠ License expiring in {daysLeft} days — renew immediately</div>}
            {daysLeft < 0 && <div className="guardrail-alert text-sm">🛑 License expired — driver cannot be assigned to trips</div>}
          </div>
        </div>
        <div className="card p-6">
          <h3 className="font-semibold text-primary-color mb-4">Performance Stats</h3>
          <div className="space-y-4">
            <div><p className="text-secondary-color text-xs uppercase mb-1">Completed Trips</p><p className="text-2xl font-bold text-primary-color">{s.totalTrips}</p></div>
            <div><p className="text-secondary-color text-xs uppercase mb-1">Total Distance</p><p className="text-2xl font-bold text-primary-color">{formatNumber(s.totalDistance)} km</p></div>
            <div><p className="text-secondary-color text-xs uppercase mb-1">Total Revenue</p><p className="text-2xl font-bold text-green-600">{formatCurrency(s.totalRevenue)}</p></div>
          </div>
        </div>
      </div>
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-app"><h3 className="font-semibold text-primary-color">Trip History</h3></div>
        <table className="data-table"><thead><tr><th>Route</th><th>Vehicle</th><th>Status</th><th>Distance</th><th>Revenue</th><th>Date</th></tr></thead>
          <tbody>{data.trips?.map((t: any) => (<tr key={t.id}><td className="font-medium">{t.source} → {t.destination}</td><td className="text-primary-500">{t.vehicle_reg}</td><td><span className={`badge ${getStatusBadgeClass(t.status)}`}>{t.status}</span></td><td>{t.actual_distance_km || t.planned_distance_km} km</td><td>{formatCurrency(t.revenue)}</td><td>{formatDate(t.created_at)}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}
