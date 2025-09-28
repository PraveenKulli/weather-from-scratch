import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './auth';
import LoginPage from './pages/LoginPage';
import WeatherPage from './pages/WeatherPage';
import AdminPage from './pages/AdminPage';
import { logout } from './api';

function Guard({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="container">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function App(){
  const { user } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="nav">
        <Link to="/">Search</Link>
        <Link to="/admin">Admin</Link>
        {user ? (
          <button onClick={() => logout().then(()=>navigate('/login'))}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<Guard role="admin"><AdminPage /></Guard>} />
        <Route path="/" element={<Guard><WeatherPage /></Guard>} />
      </Routes>
    </div>
  );
}
