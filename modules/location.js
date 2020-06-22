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
  //START-CONSOLE-TESTING
  // console.log('LocationQuery, object:');
  // console.log(object);
  //END-CONSOLE-TESTING
  this.userName = userName;
  this.display_name = object.display_name ? object.display_name : 'No display name available';
  this.lat = object.lat ? object.lat : 'No latitude available';
  this.lon = object.lon ? object.lon : 'No longitude available';
  this.icon = object.icon ? object.icon : 'No icon available';
}

// {
//   place_id: '236114304',
//   licence: 'https://locationiq.com/attribution',
//   osm_type: 'relation',
//   osm_id: '237440',
//   boundingbox: [ '48.6880058', '48.8174119', '-122.531455', '-122.3987106' ],
//   lat: '48.7544012',
//   lon: '-122.4788361',
//   display_name: 'Bellingham, Whatcom County, Washington, USA',
//   class: 'place',
//   type: 'city',
//   importance: 0.56068814436388,
//   icon: 'https://locationiq.org/static/images/mapicons/poi_place_city.p.20.png'
// }
