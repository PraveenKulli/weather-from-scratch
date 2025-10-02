const { weatherQuerySchema } = require('../models/schemas');
const { AppError } = require('../infra/error');
const weatherSvc = require('../services/weather.service');

function createWeatherController(keyPool) {
  return {
    getWeather: async (req, res, next) => {
      try {
        const { city, country } = weatherQuerySchema.parse({
          city: req.query.city || '',
          country: req.query.country || ''
        });

        const key = keyPool.getAvailableKey();
        if (!key) throw new AppError(429, 'Hourly OpenWeatherMap key limit exceeded');

        const out = await weatherSvc.fetchWeather({ city, country, key });

        const tz = req.get('x-timezone') || 'UTC';
        weatherSvc.logUserSearch({ userId: req.user?.id, country, city, timezone: tz });

        res.json(out);
      } catch (e) { next(e); }
    }
  };
}
module.exports = { createWeatherController };
