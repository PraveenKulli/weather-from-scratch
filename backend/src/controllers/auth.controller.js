const { loginSchema } = require('../models/schemas');
const { login } = require('../services/auth.service');

async function handleLogin(req, res, next) {
  try{
    const creds = loginSchema.parse(req.body || {});
    const { token, role, username } = await login(creds);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 2
    });
    res.json({ message: 'Login successful', role, username });
  }catch(err){ next(err); }
}

function handleLogout(req, res) {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged out' });
}

function whoAmI(req, res) {
  const jwt = require('jsonwebtoken');
  const token = req.cookies?.token;
  if (!token) return res.json({ authenticated:false });
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated:true, user: { username: payload.username, role: payload.role } });
  }catch{
    res.json({ authenticated:false });
  }
}

module.exports = { handleLogin, handleLogout, whoAmI };
