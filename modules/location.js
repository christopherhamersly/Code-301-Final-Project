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

const trails = require('./trails.js');

const getLocation = (request, response) => {
  //START-CONSOLE-TESTING
  console.log('getLocation, request.query:');
  console.log(request.query);
  //END-CONSOLE-TESTING
  let userName = request.query.userName;
  let queryCity = request.query.city;
  let queryType = request.query.type;
  let apiURL = 'https://us1.locationiq.com/v1/search.php';
  let apiParams = {
    key: process.env.LOCATION_IQ_API_KEY,
    q: queryCity,
    format: 'json',
    limit: 1
  };
  superagent.get(apiURL, apiParams)
    .then(apiData => {
      //START-CONSOLE-TESTING
      // console.log('apiData.body:');
      // console.log(apiData.body);
      //END-CONSOLE-TESTING
      let location = new LocationQuery(userName, apiData.body[0]);
      activityType(location, queryType, response);
    })
    .catch(error => {
      console.error('Error getting location data');
      console.error(error);
    });
};

const activityType = (location, queryType, response) => {
  switch (queryType) {
  case 'hiking':
    trails.getTrails(location, response);
    break;
  case 'climbing':
    break;
  case 'camping':
    break;
  default:
    response.status(404).send('\'Nuffin here');
  }
};

module.exports.getLocation = getLocation;

//constructor
function LocationQuery(userName, object) {
  this.userName = userName;
  this.display_name = object.display_name ? object.display_name : 'No display name available';
  this.lat = object.lat ? object.lat : 'No latitude available';
  this.lon = object.lon ? object.lon : 'No longitude available';
  this.icon = object.icon ? object.icon : 'No icon available';
}
