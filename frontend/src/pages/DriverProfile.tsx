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

  if (loading) return <div className="animate-pulse p-8"><div className="h-8 rounded w-48" style={{ background: 'rgba(255,255,255,0.06)' }} /></div>;
  if (!data) return <div className="text-center py-20"><p style={{ color: 'rgba(255,255,255,0.5)' }}>Driver not found</p></div>;

  const d = data.driver;
  const s = data.stats;
  const lb = getLicenseExpiryBadge(d.license_expiry);
  const daysLeft = daysUntil(d.license_expiry);

  const scoreColor = d.safety_score >= 80 ? '#34d399' : d.safety_score >= 60 ? '#fbbf24' : '#f87171';
  const scoreGradient = d.safety_score >= 80
    ? 'url(#scoreGreen)' : d.safety_score >= 60
    ? 'url(#scoreAmber)' : 'url(#scoreRed)';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/drivers" className="p-2 rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.04)' }}>
          <ArrowLeft size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
        </Link>
        <div className="flex-1">
          <h1 className="font-heading text-2xl font-bold text-gradient">{d.name}</h1>
          <p className="text-sm flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span className="flex items-center gap-1"><CreditCard size={14} />{d.license_number}</span>
            {d.contact_number && <span className="flex items-center gap-1"><Phone size={14} />{d.contact_number}</span>}
          </p>
        </div>
        <span className={`badge text-base px-4 py-1.5 ${getStatusBadgeClass(d.status)}`}>{d.status}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Safety Score */}
        <div className="glow-card p-6 text-center">
          <div className="relative inline-block mb-3">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="scoreGreen" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="scoreAmber" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
                <linearGradient id="scoreRed" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#f87171" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
              <circle cx="60" cy="60" r="50" fill="none" stroke={scoreGradient}
                strokeWidth="8"
                strokeDasharray={`${d.safety_score * 3.14} ${314 - d.safety_score * 3.14}`}
                strokeDashoffset="78.5" strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 8px ${scoreColor}40)` }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-white">{d.safety_score}</span>
              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Safety</span>
            </div>
          </div>
          <p className="text-sm" style={{ color: scoreColor }}>
            {d.safety_score >= 80 ? 'Excellent Driver' : d.safety_score >= 60 ? 'Needs Improvement' : 'At Risk'}
          </p>
        </div>

        {/* License Details */}
        <div className="glow-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} style={{ color: '#2b7fff' }} />
            <h3 className="font-semibold text-white font-heading">License Details</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Category</span>
              <span className="font-medium text-white">{d.license_category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Expiry</span>
              <span className={`badge ${lb.class}`}>{lb.text}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Date</span>
              <span className="font-medium text-white">{formatDate(d.license_expiry)}</span>
            </div>
            {daysLeft <= 30 && daysLeft > 0 && (
              <div className="guardrail-alert text-sm" style={{ background: 'rgba(217,119,6,0.1)', borderColor: 'rgba(217,119,6,0.25)', borderLeftColor: '#d97706', color: '#fbbf24' }}>
                ⚠ License expiring in {daysLeft} days — renew immediately
              </div>
            )}
            {daysLeft < 0 && (
              <div className="guardrail-alert text-sm">🛑 License expired — driver cannot be assigned to trips</div>
            )}
          </div>
        </div>

        {/* Performance Stats */}
        <div className="glow-card p-6">
          <h3 className="font-semibold text-white mb-4 font-heading">Performance Stats</h3>
          <div className="space-y-4">
            <div>
              <p className="text-xs uppercase section-label mb-1">Completed Trips</p>
              <p className="text-2xl font-bold text-white stat-value">{s.totalTrips}</p>
            </div>
            <div>
              <p className="text-xs uppercase section-label mb-1">Total Distance</p>
              <p className="text-2xl font-bold text-white stat-value">{formatNumber(s.totalDistance)} km</p>
            </div>
            <div>
              <p className="text-xs uppercase section-label mb-1">Total Revenue</p>
              <p className="text-2xl font-bold stat-value" style={{ color: '#34d399' }}>{formatCurrency(s.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trip History */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="font-semibold text-white font-heading">Trip History</h3>
        </div>
        <table className="data-table">
          <thead><tr><th>Route</th><th>Vehicle</th><th>Status</th><th>Distance</th><th>Revenue</th><th>Date</th></tr></thead>
          <tbody>
            {data.trips?.map((t: any) => (
              <tr key={t.id}>
                <td className="font-medium text-white">{t.source} → {t.destination}</td>
                <td className="text-gradient">{t.vehicle_reg}</td>
                <td><span className={`badge ${getStatusBadgeClass(t.status)}`}>{t.status}</span></td>
                <td>{t.actual_distance_km || t.planned_distance_km} km</td>
                <td>{formatCurrency(t.revenue)}</td>
                <td>{formatDate(t.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
