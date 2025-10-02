const fetch = require('node-fetch');
const { AppError } = require('../infra/error');
const searches = require('../dao/search.dao');

function buildUrl(city, country, apiKey) {
  const q = encodeURIComponent(`${city},${country}`);
  return `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${apiKey}&units=metric`;
}

async function fetchWeather({ city, country, key }) {
  const url = buildUrl(city, country, key);
  const r = await fetch(url);
  if (!r.ok) throw new AppError(400, 'City/country not found or bad request');
  const data = await r.json();
  return {
    city: data.name,
    country,
    description: data.weather?.[0]?.description,
    tempC: data.main?.temp,
    humidity: data.main?.humidity,
    windKph: data.wind?.speed ? Math.round(data.wind.speed * 3.6) : null
  };
}

function logUserSearch({ userId, country, city, timezone }) {
  if (userId) searches.logSearch(userId, country, city, timezone || 'UTC');
}

function listAllSearches() {
  return searches.listSearches();
}

module.exports = { fetchWeather, logUserSearch, listAllSearches };
