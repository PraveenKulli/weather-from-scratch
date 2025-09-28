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
    try {
      const r = await login(username, password);
      navigate(r.role === 'admin' ? '/admin' : '/');
    } catch (e) { setError(e.message); }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div><input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" /></div>
        <div><input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" /></div>
        <button>Sign In</button>
      </form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
