const API_KEY = process.env.OPEN_WEATHER_API_KEY;
const express = require('express');

var router = express.Router();
var url = 'http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=${API_KEY}';

//Add API calls here

module.exports = router;