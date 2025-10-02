const express = require('express');
const { authRequired, requireRole } = require('../middlewares/auth.middleware');
const { getAllSearches } = require('../controllers/admin.controller');

const router = express.Router();
router.get('/searches', authRequired, requireRole('admin'), getAllSearches);

module.exports = router;
