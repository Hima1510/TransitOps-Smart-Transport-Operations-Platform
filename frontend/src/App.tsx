import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Vehicle360 from './pages/Vehicle360';
import Drivers from './pages/Drivers';
import DriverProfile from './pages/DriverProfile';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';
import FuelExpenses from './pages/FuelExpenses';
import Reports from './pages/Reports';

function ProtectedLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="flex min-h-screen" style={{ background: '#010509' }}>
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col">
        <TopBar />
        <main className="flex-1 p-6 overflow-auto bg-app">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/vehicles/:id" element={<Vehicle360 />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/drivers/:id" element={<DriverProfile />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/maintenance" element={<Maintenance />} />
          <Route path="/fuel-expenses" element={<FuelExpenses />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
