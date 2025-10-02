const express = require('express');
const { authRequired } = require('../middlewares/auth.middleware');
const { createWeatherController } = require('../controllers/weather.controller');

module.exports = (keyPool) => {
  const router = express.Router();
  const controller = createWeatherController(keyPool);

  router.get('/', authRequired, controller.getWeather);
  router.get('/_keypool', (req,res) => res.json(keyPool.snapshot())); // optional debug

  return router;
};
