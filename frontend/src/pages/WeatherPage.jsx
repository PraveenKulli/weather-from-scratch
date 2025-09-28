import { useState } from 'react';
import { getWeather } from '../api';

export default function WeatherPage(){
  const [city, setCity] = useState('Melbourne');
  const [country, setCountry] = useState('AU');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  async function search(){
    setError(''); setData(null);
    if (!city || country.length !== 2) {
      setError('Enter a city and 2-letter country code, e.g., AU, IN, US');
      return;
    }
    try {
      const r = await getWeather(city.trim(), country.trim().toUpperCase());
      setData(r);
    } catch (e) { setError(e.message); }
  }

  return (
    <section className="card">
      <h1>Weather Search</h1>
      <div className="sub">Look up the current description for any city.</div>

      <div className="row wrap">
        <input className="input w-2" value={city}
          onChange={e=>setCity(e.target.value)} placeholder="City (e.g., Melbourne)" />
        <input className="input w-1" value={country}
          onChange={e=>setCountry(e.target.value.toUpperCase())}
          placeholder="Country (AU)" maxLength={2} />
        <button className="btn" onClick={search}>Search</button>
      </div>

      {error && <div className="error">{error}</div>}

      {data && (
        <div className="result-grid">
          <div className="card">
            <div className="result-title">{data.city}, {data.country}</div>
            <div className="result-desc">“{data.description}”</div>
          </div>
          <div className="card stats">
            <div><span>Temp</span><b>{typeof data.tempC === 'number' ? Math.round(data.tempC) + ' ℃' : '—'}</b></div>
            <div><span>Humidity</span><b>{typeof data.humidity === 'number' ? data.humidity + '%' : '—'}</b></div>
            <div><span>Wind</span><b>{typeof data.windKph === 'number' ? data.windKph + ' kph' : '—'}</b></div>
          </div>
        </div>
      )}
    </section>
  );
}
