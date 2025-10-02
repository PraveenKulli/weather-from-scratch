const express = require('express');
const { handleLogin, handleLogout, whoAmI } = require('../controllers/auth.controller');
const { authRequired } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/login', handleLogin);
router.post('/logout', authRequired, handleLogout);
router.get('/me', whoAmI);

module.exports = router;
