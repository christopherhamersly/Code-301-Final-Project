'use strict';

const express = require('express');
const app = express();

const pg = require('pg');
const superagent = require('superagent');
require('ejs');
require('dotenv').config();

// const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

client.connect();

const trails = require('./trails.js');
const camping = require('./camping.js');
const climbing = require('./rock_climbing.js');

const getLocation = (request, response) => {
  //START-CONSOLE-TESTING
  console.log('getLocation, request.query:');
  console.log(request.query);
  //END-CONSOLE-TESTING
  let queryCity = request.query.city;
  let queryType = request.query.type;
  let sqlSelect = 'SELECT * FROM locations WHERE search_query like ($1);';
  let sqlSafe = [queryCity];
  client.query(sqlSelect, sqlSafe)
    .then(sqlData => {
      //START-CONSOLE-TESTING
      // console.log('sqlData.rows:');
      // console.log(sqlData.rows);
      //END-CONSOLE-TESTING
      if (sqlData.rows.length === 0)
      {
        getLocationFromAPI(queryType, request, response);
      }
      else
      {
        //putting a new property on sqlData.rows[0] with the userName
        sqlData.rows[0].userName = request.query.userName;
        activityType(sqlData.rows[0], queryType, response);
      }
    })
    .catch(error => {
      console.error('Error checking database for location');
      console.error(error);
    });
};

const getLocationFromAPI = (queryType, request, response) => {
  let userName = request.query.userName;
  let queryCity = request.query.city;
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
      let location = new LocationQuery(userName, queryCity, apiData.body[0]);
      saveLocationToDB(queryType, location, response);
    })
    .catch(error => {
      console.error('Error getting location data');
      console.error(error);
    });
};

const saveLocationToDB = (queryType, location, response) => {
  let sqlInsert = 'INSERT INTO locations (search_query, display_name, lat, lon) VALUES ($1, $2, $3, $4);';
  let {
    search_query,
    display_name,
    lat,
    lon
  } = location;
  let sqlSafe = [search_query, display_name, lat, lon];
  client.query(sqlInsert, sqlSafe)
    .then(() => {
      activityType(location, queryType, response);
    })
    .catch(error => {
      console.log('Error adding location to database');
      console.log(error);
    });
};

const activityType = (location, queryType, response) => {
  //START-CONSOLE-TESTING
  console.log('activityType, queryType:');
  console.log(queryType);
  //END-CONSOLE-TESTING
  switch (queryType) {
  case 'hiking':
    trails.getTrails(location, response);
    break;
  case 'climbing':
    climbing.rockClimbing(location, response);
    break;
  case 'camping':
    camping.getCampgrounds(location, response);
    break;
  default:
    response.status(404).send('\'Nuffin here');
  }
};

module.exports.getLocation = getLocation;

//constructor
function LocationQuery(userName, search_query, object) {
  this.userName = userName;
  this.search_query = search_query;
  this.display_name = object.display_name ? object.display_name : 'No display name available';
  this.lat = object.lat ? object.lat : 'No latitude available';
  this.lon = object.lon ? object.lon : 'No longitude available';
  this.icon = object.icon ? object.icon : 'No icon available';
}
