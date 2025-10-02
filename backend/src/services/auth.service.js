const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppError } = require('../infra/error');
const users = require('../dao/user.dao');

async function login({ username, password }) {
  const row = users.findByUsername(username);
  if (!row) throw new AppError(401, 'Invalid credentials');
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) throw new AppError(401, 'Invalid credentials');

  const token = jwt.sign(
    { id: row.id, username: row.username, role: row.role },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
  return { token, role: row.role, username: row.username };
}

module.exports = { login };
