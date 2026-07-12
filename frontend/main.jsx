import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './App.css';

const vehicles = [
  { reg: 'MH 12 AB 4521', model: 'Tata Signa 4825', type: 'Container', status: 'Available', health: 92, capacity: '48T', next: 'Jul 18' },
  { reg: 'DL 01 TR 9088', model: 'Ashok Leyland 5525', type: 'Trailer', status: 'On Trip', health: 81, capacity: '55T', next: 'Jul 20' },
  { reg: 'GJ 05 PX 1130', model: 'BharatBenz 3528', type: 'Tanker', status: 'In Shop', health: 64, capacity: '35T', next: 'Now' },
  { reg: 'KA 03 MT 7742', model: 'Eicher Pro 6048', type: 'Reefer', status: 'Available', health: 88, capacity: '42T', next: 'Jul 24' },
];

const trips = [
  { id: 'TRP-1048', route: 'Mumbai Port -> Pune ICD', vehicle: 'MH 12 AB 4521', driver: 'Karan Shah', status: 'Draft', eta: '2h 20m', load: '31T' },
  { id: 'TRP-1047', route: 'Delhi NCR -> Jaipur Hub', vehicle: 'DL 01 TR 9088', driver: 'Nisha Rao', status: 'Dispatched', eta: '5h 05m', load: '44T' },
  { id: 'TRP-1045', route: 'Surat Yard -> Ahmedabad DC', vehicle: 'GJ 05 PX 1130', driver: 'Amir Khan', status: 'Hold', eta: 'Blocked', load: '29T' },
  { id: 'TRP-1042', route: 'Bengaluru -> Chennai Port', vehicle: 'KA 03 MT 7742', driver: 'Rohit Menon', status: 'Completed', eta: 'Done', load: '38T' },
];

const drivers = [
  { name: 'Karan Shah', status: 'Available', rating: '4.9', licence: 'Valid', phone: '+91 98765 11001' },
  { name: 'Nisha Rao', status: 'On Trip', rating: '4.8', licence: 'Valid', phone: '+91 98765 11002' },
  { name: 'Amir Khan', status: 'Suspended', rating: '4.6', licence: 'Expired', phone: '+91 98765 11003' },
  { name: 'Rohit Menon', status: 'Available', rating: '4.7', licence: 'Valid', phone: '+91 98765 11004' },
];

const maintenance = [
  { job: 'Brake inspection', vehicle: 'GJ 05 PX 1130', priority: 'High', due: 'Today' },
  { job: 'Reefer calibration', vehicle: 'KA 03 MT 7742', priority: 'Medium', due: 'Jul 14' },
  { job: 'Tyre rotation', vehicle: 'MH 12 AB 4521', priority: 'Low', due: 'Jul 18' },
];

const trend = [42, 50, 46, 61, 57, 72, 68, 81, 76, 86, 83, 91];

function Badge({ value }) {
  return <span className={`badge badge-${value.toLowerCase().replaceAll(' ', '-')}`}>{value}</span>;
}

function Icon({ name }) {
  return <span className="ui-icon" aria-hidden="true">{name}</span>;
}

function App() {
  const nav = ['Dashboard', 'Vehicles', 'Drivers', 'Trips', 'Maintenance', 'Fuel', 'Reports'];

  return (
    <main className="ops-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Icon name="T" /></div>
          <div>
            <strong>TransitOps</strong>
            <span>Smart Transport</span>
          </div>
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {nav.map((item, index) => (
            <button className={index === 0 ? 'nav-item active' : 'nav-item'} key={item}>
              <Icon name={item.slice(0, 1)} />
              {item}
            </button>
          ))}
        </nav>

        <section className="sidebar-panel">
          <span>Guardrail status</span>
          <strong>8 checks active</strong>
          <p>Dispatch rules are blocking expired licences, overloaded cargo, and in-shop vehicles.</p>
        </section>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operations command center</p>
            <h1>Fleet Dashboard</h1>
          </div>
          <div className="topbar-actions">
            <label className="search">
              <Icon name="/" />
              <input placeholder="Search vehicles, drivers, trips..." />
            </label>
            <button className="ghost-btn"><Icon name="E" /> Export</button>
            <button className="primary-btn"><Icon name="+" /> New Trip</button>
          </div>
        </header>

        <section className="hero-band">
          <div className="hero-copy">
            <p>Live status, rule-driven dispatch, automated maintenance, and analytics in one dark workspace.</p>
            <div className="quick-stats">
              <span><strong>128</strong> vehicles</span>
              <span><strong>24</strong> active trips</span>
              <span><strong>91%</strong> utilization</span>
            </div>
          </div>
          <div className="route-map" aria-label="Fleet route visualization">
            <span className="hub hub-a"></span>
            <span className="hub hub-b"></span>
            <span className="hub hub-c"></span>
            <span className="route-line line-a"></span>
            <span className="route-line line-b"></span>
            <span className="moving-unit"></span>
          </div>
        </section>

        <section className="kpi-grid" aria-label="Fleet metrics">
          <article className="metric-card">
            <span>Vehicles Available</span>
            <strong>86</strong>
            <p>+12 from yesterday</p>
          </article>
          <article className="metric-card">
            <span>In Maintenance</span>
            <strong>6</strong>
            <p>3 high priority</p>
          </article>
          <article className="metric-card">
            <span>Active Trips</span>
            <strong>24</strong>
            <p>9 pending dispatch</p>
          </article>
          <article className="metric-card">
            <span>Fuel + Expenses</span>
            <strong>INR 8.4L</strong>
            <p>-6.3% this month</p>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="panel wide">
            <div className="panel-head">
              <div>
                <h2>Recent Trips</h2>
                <p>{'Draft -> Dispatched -> Completed lifecycle with automatic status transitions.'}</p>
              </div>
              <select aria-label="Trip filter">
                <option>All statuses</option>
                <option>Dispatched</option>
                <option>Draft</option>
              </select>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Trip</th><th>Route</th><th>Vehicle</th><th>Driver</th><th>ETA</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {trips.map((trip) => (
                    <tr key={trip.id}>
                      <td>{trip.id}<small>{trip.load}</small></td>
                      <td>{trip.route}</td>
                      <td>{trip.vehicle}</td>
                      <td>{trip.driver}</td>
                      <td>{trip.eta}</td>
                      <td><Badge value={trip.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <div>
                <h2>Fleet status</h2>
                <p>Vehicle health by operating state.</p>
              </div>
            </div>
            <div className="status-list">
              {vehicles.map((vehicle) => (
                <div className="status-row" key={vehicle.reg}>
                  <div>
                    <strong>{vehicle.reg}</strong>
                    <span>{vehicle.model}</span>
                  </div>
                  <div className="health-meter"><span style={{ width: `${vehicle.health}%` }} /></div>
                  <Badge value={vehicle.status} />
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <div>
                <h2>Drivers</h2>
                <p>Licence and duty status.</p>
              </div>
            </div>
            <div className="driver-list">
              {drivers.map((driver) => (
                <div className="driver-card" key={driver.name}>
                  <div className="avatar">{driver.name.split(' ').map((part) => part[0]).join('')}</div>
                  <div>
                    <strong>{driver.name}</strong>
                    <span>{driver.phone}</span>
                  </div>
                  <Badge value={driver.status} />
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <div>
                <h2>Maintenance queue</h2>
                <p>Opening a job parks the vehicle automatically.</p>
              </div>
            </div>
            <div className="maintenance-list">
              {maintenance.map((item) => (
                <div className="maintenance-item" key={item.job}>
                  <span className={`priority ${item.priority.toLowerCase()}`}>{item.priority}</span>
                  <strong>{item.job}</strong>
                  <p>{item.vehicle} - {item.due}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <div>
                <h2>Fleet utilization %</h2>
                <p>Monthly utilization trend.</p>
              </div>
            </div>
            <div className="bar-chart" aria-label="Fleet utilization chart">
              {trend.map((value, index) => (
                <span key={index} style={{ height: `${value}%` }}><i>{value}</i></span>
              ))}
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
