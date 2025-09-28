require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./db');

const upsert = db.prepare('INSERT OR IGNORE INTO users(username,password_hash,role) VALUES(?,?,?)');

(async () => {
  const adminHash = await bcrypt.hash('Admin@123', 10);
  const userHash = await bcrypt.hash('User@123', 10);
  upsert.run('admin', adminHash, 'admin');
  upsert.run('alice', userHash, 'user');
  console.log('Seeded: admin/Admin@123 and alice/User@123');
})();
