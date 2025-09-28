import { useState } from 'react';
import { getWeather } from '../api';

export default function WeatherPage(){
  const [city, setCity] = useState('Melbourne');
  const [country, setCountry] = useState('AU');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  async function search(){
    setError(''); setData(null);
    if (!city || country.length !== 2) { setError('Enter city and 2-letter country code'); return; }
    try {
      const r = await getWeather(city, country);
      setData(r);
    } catch (e) { setError(e.message); }
  }

  return (
    <div>
      <h2>Weather Search</h2>
      <div style={{display:'flex', gap:8}}>
        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="City" />
        <input value={country} onChange={e=>setCountry(e.target.value.toUpperCase())} placeholder="Country (AU)" maxLength={2} />
        <button onClick={search}>Search</button>
      </div>
      {error && <div className="error">{error}</div>}
      {data && (
        <div className="card" style={{marginTop:12}}>
          <div><strong>{data.city}, {data.country}</strong></div>
          <div>Description: {data.description}</div>
          {typeof data.tempC === 'number' && <div>Temp: {Math.round(data.tempC)} ℃</div>}
          {typeof data.humidity === 'number' && <div>Humidity: {data.humidity}%</div>}
          {typeof data.windKph === 'number' && <div>Wind: {data.windKph} kph</div>}
        </div>
      )}
    </div>
  );
}
