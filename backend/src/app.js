require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const { KeyPool } = require('./services/keyPool.service');
const routesFactory = require('./routes');
const weatherRoutesFactory = require('./routes/weather.routes');
const { notFound, errorHandler } = require('./infra/error');

const app = express();

// middlewares
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

// key pool
const keys = (process.env.OWM_KEYS || '').split(',').map(s => s.trim()).filter(Boolean);
while (keys.length < 5) keys.push('DUMMY_' + (keys.length + 1));
const keyPool = new KeyPool(keys);

// routes
app.use('/', routesFactory(weatherRoutesFactory(keyPool)));

// 404 + error
app.use(notFound);
app.use(errorHandler);

module.exports = app;
