import { useEffect, useState } from 'react';
import { me } from './api';
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { me().then(r => { setUser(r.user || null); setLoading(false); }).catch(()=>setLoading(false)); }, []);
  return { user, setUser, loading };
}
