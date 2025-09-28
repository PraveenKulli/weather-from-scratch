import { useState } from 'react';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';

export default function LoginPage(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function onSubmit(e){
    e.preventDefault();
    setError('');
    try{
      const r = await login(username.trim(), password);
      navigate(r.role === 'admin' ? '/admin' : '/');
    }catch(err){
      setError(err.message || 'Login failed');
    }
  }

  return (
    <section className="grid-2">
      <div className="card">
        <h1>Welcome back 👋</h1>
        <div className="sub">Sign in to continue to the Weather Dashboard.</div>
        <form className="form" onSubmit={onSubmit}>
          <input
            className="input"
            value={username}
            onChange={e=>setUsername(e.target.value)}
            placeholder="Username (e.g. alice)" autoComplete="username"
          />
          <input
            type="password"
            className="input"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="Password" autoComplete="current-password"
          />
          <button className="btn" type="submit">Sign In</button>
          {error && <div className="error">{error}</div>}
        </form>
        <div className="sub">Tip: <b>alice / User@123</b> or <b>admin / Admin@123</b></div>
      </div>

      <aside className="card accent">
        <h2 style={{marginTop:0}}>Today’s Forecast</h2>
        <div className="sub" style={{marginBottom:16}}>
          Secure access with JWT • Smart key rotation • Admin insights
        </div>
        <div className="empty-panel">🌤️ <b>Weather Report Website</b></div>
      </aside>
    </section>
  );
}
