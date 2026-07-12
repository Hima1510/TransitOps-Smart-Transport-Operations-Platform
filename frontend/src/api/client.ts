const API_BASE = '/api';

async function request(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('transitops_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as Record<string, string> || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${url}`, { ...options, headers });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const rawText = await res.text();
  const data = rawText && isJson ? JSON.parse(rawText) : rawText ? { message: rawText } : {};

  if (!res.ok) {
    const message = typeof data === 'object' && data !== null && 'error' in data ? (data as any).error : (data as any).message || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  login: (email: string, password: string) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (name: string, email: string, password: string, role: string) => request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password, role }) }),
  getKPIs: () => request('/dashboard/kpis'),
  getAttention: () => request('/dashboard/attention'),
  getFuelEfficiency: () => request('/dashboard/fuel-efficiency'),
  getCostBreakdown: () => request('/dashboard/cost-breakdown'),
  getROILeaderboard: () => request('/dashboard/roi-leaderboard'),
  getUtilizationOverTime: () => request('/dashboard/utilization-over-time'),
  getSafetyDashboard: () => request('/dashboard/safety'),
  getVehicles: (p?: Record<string, string>) => request(`/vehicles${p ? '?' + new URLSearchParams(p) : ''}`),
  getVehicle: (id: number) => request(`/vehicles/${id}`),
  getVehicle360: (id: number) => request(`/vehicles/${id}/360`),
  getEligibleVehicles: () => request('/vehicles/eligible'),
  createVehicle: (d: any) => request('/vehicles', { method: 'POST', body: JSON.stringify(d) }),
  updateVehicle: (id: number, d: any) => request(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  deleteVehicle: (id: number) => request(`/vehicles/${id}`, { method: 'DELETE' }),
  getDrivers: (p?: Record<string, string>) => request(`/drivers${p ? '?' + new URLSearchParams(p) : ''}`),
  getDriver: (id: number) => request(`/drivers/${id}`),
  getDriverProfile: (id: number) => request(`/drivers/${id}/profile`),
  getEligibleDrivers: () => request('/drivers/eligible'),
  getExpiringDrivers: () => request('/drivers/expiring'),
  createDriver: (d: any) => request('/drivers', { method: 'POST', body: JSON.stringify(d) }),
  updateDriver: (id: number, d: any) => request(`/drivers/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  getTrips: (p?: Record<string, string>) => request(`/trips${p ? '?' + new URLSearchParams(p) : ''}`),
  getTrip: (id: number) => request(`/trips/${id}`),
  createTrip: (d: any) => request('/trips', { method: 'POST', body: JSON.stringify(d) }),
  dispatchTrip: (id: number) => request(`/trips/${id}/dispatch`, { method: 'POST' }),
  completeTrip: (id: number, d: any) => request(`/trips/${id}/complete`, { method: 'POST', body: JSON.stringify(d) }),
  cancelTrip: (id: number) => request(`/trips/${id}/cancel`, { method: 'POST' }),
  getMaintenance: (p?: Record<string, string>) => request(`/maintenance${p ? '?' + new URLSearchParams(p) : ''}`),
  createMaintenance: (d: any) => request('/maintenance', { method: 'POST', body: JSON.stringify(d) }),
  closeMaintenance: (id: number, d?: any) => request(`/maintenance/${id}/close`, { method: 'POST', body: JSON.stringify(d || {}) }),
  getFuelLogs: (p?: Record<string, string>) => request(`/fuel${p ? '?' + new URLSearchParams(p) : ''}`),
  createFuelLog: (d: any) => request('/fuel', { method: 'POST', body: JSON.stringify(d) }),
  getExpenses: (p?: Record<string, string>) => request(`/expenses${p ? '?' + new URLSearchParams(p) : ''}`),
  createExpense: (d: any) => request('/expenses', { method: 'POST', body: JSON.stringify(d) }),
};
