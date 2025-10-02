const express = require('express');
const authRoutes = require('./auth.routes');
const adminRoutes = require('./admin.routes');

module.exports = (weatherRoutes) => {
  const router = express.Router();
  router.use('/auth', authRoutes);
  router.use('/weather', weatherRoutes);
  router.use('/admin', adminRoutes);
  return router;
};
