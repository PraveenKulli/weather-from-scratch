import { useEffect, useState } from 'react';
import { getSearches } from '../api';

export default function AdminPage(){
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getSearches().then(setRows).catch(e=>setError(e.message));
  }, []);

  return (
    <div>
      <h2>Admin — User Searches</h2>
      {error && <div className="error">{error}</div>}
      <table className="table">
        <thead><tr><th>User</th><th>Country</th><th>City</th><th>Time</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.username}</td>
              <td>{r.country}</td>
              <td>{r.city}</td>
              <td>{new Date(r.time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
