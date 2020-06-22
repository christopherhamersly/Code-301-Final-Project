'use strict';

const express = require('express');
const app = express();

const pg = require('pg');
const superagent = require('superagent');
require('ejs');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

const getTrails = (location, response) => {
  //START-CONSOLE-TESTING
  console.log('getTrails, location:');
  console.log(location);
  //END-CONSOLE-TESTING
  let apiURL = 'https://www.hikingproject.com/data/get-trails';
  let apiParams = {
    lat: location.lat,
    lon: location.lon,
    maxDistance: 10,
    key: process.env.HIKING_ROUTES_API_KEY
  };
  superagent.get(apiURL, apiParams)
    .then(apiData => {
      //START-CONSOLE-TESTING
      console.log('getTrails apiData.body:');
      console.log(apiData.body);
      //END-CONSOLE-TESTING
    })
    .catch(error => {
      console.error('Error getting trail data');
      console.error(error);
    });
};

module.exports.getTrails = getTrails;

//constructor



// CREATE TABLE trails (
//   "id" SERIAL PRIMARY KEY,
//   "imgMedium" VARCHAR(255),
//   "name" VARCHAR(255),
//   "summary" VARCHAR(10000),
//   "latitude" DECIMAL(12, 9),
//   "longitude" DECIMAL(12, 9),
//   "length" DECIMAL(7, 2),
//   "ascent" DECIMAL(7, 2),
//   "high" DECIMAL(7, 2),
//   "difficulty" VARCHAR(255),
//   "conditionstatus" VARCHAR(255),
//   "stars" DECIMAL(2,1)
// );
