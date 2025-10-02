const db = require('../infra/db');

function logSearch(userId, country, city, timezone = 'UTC') {
  return db.prepare(
    'INSERT INTO searches(user_id, country, city, timezone) VALUES(?,?,?,?)'
  ).run(userId, country, city, timezone);
}

function listSearches() {
  return db.prepare(`
    SELECT
      s.id,
      u.username,
      s.country,
      s.city,
      strftime('%Y-%m-%dT%H:%M:%SZ', s.created_at) AS time, -- ISO UTC
      s.timezone
    FROM searches s JOIN users u ON u.id = s.user_id
    ORDER BY s.created_at DESC
  `).all();
}

module.exports = { logSearch, listSearches };
