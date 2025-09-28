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
      {/* Header (brand + single global nav) */}
      <header className="header">
        <div className="brand" onClick={()=>navigate('/')}>
          <span className="logo">🌤️</span>
          <span>Weather Report</span>
        </div>
        <nav className="nav">
          <Link to="/">Search</Link>
          <Link to="/admin">Admin</Link>
          {user ? (
            <button onClick={() => logout().then(()=>navigate('/login'))}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>

      {/* Page body */}
      <main className="body">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<Guard role="admin"><AdminPage /></Guard>} />
          <Route path="/" element={<Guard><WeatherPage /></Guard>} />
        </Routes>
      </main>
    </div>
  );
}
