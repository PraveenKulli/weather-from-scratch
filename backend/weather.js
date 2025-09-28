const fetch = require('node-fetch');
const { z } = require('zod');
const db = require('./db');

const querySchema = z.object({
  city: z.string().trim().min(2).max(80),
  country: z.string().trim().toUpperCase().length(2)
});

function buildUrl(city, country, apiKey) {
  const q = encodeURIComponent(`${city},${country}`);
  return `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=metric`;
}

function logSearch(userId, country, city) {
  db.prepare('INSERT INTO searches(user_id, country, city) VALUES(?,?,?)').run(userId, country, city);
}

async function getWeatherWithPool(pool, req, res) {
  try {
    const { city, country } = querySchema.parse({ city: req.query.city || '', country: req.query.country || '' });
    const key = pool.getAvailableKey();
    if (!key) return res.status(429).json({ error: 'Hourly OpenWeatherMap key limit exceeded' });

    const url = buildUrl(city, country, key);
    const r = await fetch(url);
    if (!r.ok) {
      return res.status(400).json({ error: 'City/country not found or bad request' });
    }
    const data = await r.json();

    if (req.user?.id) logSearch(req.user.id, country, city);

    const out = {
      city: data.name,
      country,
      description: data.weather?.[0]?.description,
      tempC: data.main?.temp,
      humidity: data.main?.humidity,
      windKph: data.wind?.speed ? Math.round(data.wind.speed * 3.6) : null
    };
    res.json(out);
  } catch (e) {
    if (e.issues) return res.status(400).json({ error: 'Invalid city/country' });
    res.status(500).json({ error: 'Server error' });
  }
}

function getAllSearches(req, res) {
  const rows = db.prepare(`
    SELECT
      s.id,
      u.username,
      s.country,
      s.city,
      -- SQLite CURRENT_TIMESTAMP is UTC; format it as ISO-8601 UTC
      strftime('%Y-%m-%dT%H:%M:%SZ', s.created_at) AS time
    FROM searches s
    JOIN users u ON u.id = s.user_id
    ORDER BY s.created_at DESC
  `).all();

  res.json(rows);
}

module.exports = { getWeatherWithPool, getAllSearches };
