const BASE = 'http://localhost:4000'; 

// detect user timezone once
const TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

export async function api(path, { method='GET', body, extraHeaders } = {}) {
  const headers = { 'Content-Type': 'application/json', ...(extraHeaders || {}) };
  const opts = { method, credentials: 'include', headers };
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export const login = (u,p) => api('/auth/login', { method: 'POST', body: { username: u, password: p }});
export const logout = () => api('/auth/logout', { method: 'POST' });
export const me = () => api('/me');

// now passes timezone header
export const getWeather = (city,country) => 
  api(`/weather?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`, {
    extraHeaders: { 'X-Timezone': TZ }
  });

export const getSearches = () => api('/admin/searches');
