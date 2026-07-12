export function getStatusBadgeClass(status: string): string {
  const m: Record<string, string> = { 'Available': 'badge-available', 'On Trip': 'badge-on-trip', 'In Shop': 'badge-in-shop', 'Retired': 'badge-retired', 'Draft': 'badge-draft', 'Dispatched': 'badge-dispatched', 'Completed': 'badge-completed', 'Cancelled': 'badge-cancelled', 'Suspended': 'badge-suspended', 'Off Duty': 'badge-off-duty', 'open': 'badge-open', 'closed': 'badge-closed' };
  return m[status] || 'badge-draft';
}
export function formatCurrency(a: number): string { return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(a); }
export function formatNumber(n: number): string { return new Intl.NumberFormat('en-IN').format(n); }
export function formatDate(d: string | null): string { if (!d) return '—'; return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
export function daysUntil(d: string): number { const t = new Date(); t.setHours(0,0,0,0); const x = new Date(d); x.setHours(0,0,0,0); return Math.ceil((x.getTime() - t.getTime()) / 86400000); }
export function getLicenseExpiryBadge(d: string): { text: string; class: string } {
  const days = daysUntil(d);
  if (days < 0) return { text: `Expired ${Math.abs(days)}d ago`, class: 'badge-cancelled' };
  if (days <= 30) return { text: `${days}d left`, class: 'badge-cancelled' };
  if (days <= 60) return { text: `${days}d left`, class: 'badge-in-shop' };
  return { text: `${days}d left`, class: 'badge-available' };
}
export function downloadCSV(data: any[], filename: string) {
  if (!data.length) return;
  const h = Object.keys(data[0]);
  const csv = [h.join(','), ...data.map(r => h.map(k => { const v = r[k]; return typeof v === 'string' && v.includes(',') ? `"${v}"` : v ?? ''; }).join(','))].join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = `${filename}.csv`; a.click();
}
export function getNavItems(role: string) {
  const base = [{ path: '/', label: 'Dashboard', icon: 'LayoutDashboard' }];
  if (role === 'fleet_manager') return [...base, { path: '/vehicles', label: 'Vehicles', icon: 'Truck' }, { path: '/drivers', label: 'Drivers', icon: 'Users' }, { path: '/trips', label: 'Trips', icon: 'Route' }, { path: '/maintenance', label: 'Maintenance', icon: 'Wrench' }, { path: '/fuel-expenses', label: 'Fuel & Expenses', icon: 'Fuel' }, { path: '/reports', label: 'Reports', icon: 'BarChart3' }];
  if (role === 'driver') return [...base, { path: '/trips', label: 'My Trips', icon: 'Route' }, { path: '/vehicles', label: 'Vehicles', icon: 'Truck' }];
  if (role === 'safety_officer') return [...base, { path: '/safety', label: 'Safety Center', icon: 'LayoutDashboard' }, { path: '/vehicles', label: 'Vehicles', icon: 'Truck' }, { path: '/drivers', label: 'Drivers', icon: 'Users' }, { path: '/trips', label: 'Trips', icon: 'Route' }, { path: '/maintenance', label: 'Maintenance', icon: 'Wrench' }];
  if (role === 'financial_analyst') return [...base, { path: '/finance', label: 'Finance Center', icon: 'LayoutDashboard' }, { path: '/vehicles', label: 'Vehicles', icon: 'Truck' }, { path: '/fuel-expenses', label: 'Fuel & Expenses', icon: 'Fuel' }, { path: '/reports', label: 'Reports', icon: 'BarChart3' }];
  return base;
}
