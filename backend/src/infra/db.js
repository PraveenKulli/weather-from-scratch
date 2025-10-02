const Database = require('better-sqlite3');
const db = new Database('weather.db');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('user','admin'))
);

CREATE TABLE IF NOT EXISTS searches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  timezone TEXT DEFAULT 'UTC',
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`);

try { db.exec(`ALTER TABLE searches ADD COLUMN timezone TEXT DEFAULT 'UTC'`); } catch (_){}

module.exports = db;
