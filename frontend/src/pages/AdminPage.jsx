import { useEffect, useState } from 'react';
import { getSearches } from '../api';

function formatTime(ts){
  // Format nicely in the user's local time
  try{
    const d = new Date(ts); // SQLite CURRENT_TIMESTAMP is ISO-like, safe to parse
    return d.toLocaleString(undefined, {
      year:'numeric', month:'short', day:'2-digit',
      hour:'2-digit', minute:'2-digit', second:'2-digit'
    });
  }catch{ return ts; }
}

export default function AdminPage(){
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getSearches().then(setRows).catch(e=>setError(e.message));
  }, []);

  return (
    <section className="card">
      <h1>Admin — User Searches</h1>
      <div className="sub">All successful lookups across users.</div>
      {error && <div className="error">{error}</div>}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr><th>User</th><th>Country</th><th>City</th><th>Time</th></tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.username}</td>
                <td>{r.country}</td>
                <td>{r.city}</td>
                <td>{formatTime(r.time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
