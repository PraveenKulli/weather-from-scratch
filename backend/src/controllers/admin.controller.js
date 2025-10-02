const weatherSvc = require('../services/weather.service');

async function getAllSearches(req, res, next) {
  try {
    const rows = await weatherSvc.listAllSearches();
    res.json(rows);
  } catch (e) { next(e); }
}

module.exports = { getAllSearches };
