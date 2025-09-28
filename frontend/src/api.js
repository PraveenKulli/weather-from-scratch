const BASE = 'http://localhost:4000';
export async function api(path, { method='GET', body } = {}) {
  const opts = { method, credentials: 'include', headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}
export const login = (u,p) => api('/auth/login', { method: 'POST', body: { username: u, password: p }});
export const logout = () => api('/auth/logout', { method: 'POST' });
export const me = () => api('/me');
export const getWeather = (city,country) => api(`/weather?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`);
export const getSearches = () => api('/admin/searches');
