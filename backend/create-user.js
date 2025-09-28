const bcrypt = require('bcryptjs');
const db = require('./db');

async function createUser(username, password, role = 'user') {
  const hash = await bcrypt.hash(password, 10);
  try {
    db.prepare('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)').run(username, hash, role);
    console.log(`User ${username} created with role ${role}`);
  } catch (e) {
    console.error('Error inserting user:', e.message);
  }
}

createUser('neha', 'kulli@123', 'user');