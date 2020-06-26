'use strict';

const queryType = 'hiking';

//setup
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

const getTrails = (location, response) => {
  //START-CONSOLE-TESTING
  // console.log('getTrails, location:');
  // console.log(location);
  //END-CONSOLE-TESTING
  let sqlSelect = 'SELECT api_id FROM trails;';
  client.query(sqlSelect)
    .then(sqlData => {
      //START-CONSOLE-TESTING
      // console.log('getTrails, DB api_ids:');
      // console.log(sqlData.rows);
      //END-CONSOLE-TESTING
      getTrailsFromAPI(sqlData.rows, location, response);
    })
    .catch(error => {
      console.error('Error checking cache for favorited trails');
      console.error(error);
    });
};

const getTrailsFromAPI = (apiIDsFromCache, location, response) => {
  let apiURL = 'https://www.hikingproject.com/data/get-trails';
  let apiParams = {
    lat: location.lat,
    lon: location.lon,
    maxDistance: 10,
    key: process.env.HIKING_ROUTES_API_KEY
  };

  //START-CONSOLE-TESTING
  // console.log('getTrailsFromAPI, apiIDsFromCache, flattened:');
  // console.log(apiIDsFromCache);
  //END-CONSOLE-TESTING
  superagent.get(apiURL, apiParams)
    .then(apiData => {
      //START-CONSOLE-TESTING
      // console.log('getTrails apiData.body:');
      // console.log(apiData.body);
      //END-CONSOLE-TESTING
      //flatten the array from an array of objects with a single key-value pair, to
      //an array of numbers
      apiIDsFromCache = apiIDsFromCache.map(sqlObject => sqlObject.api_id);
      let rtnTrails = apiData.body.trails.map(oneTrail => {
        let newTrail = new Trail(oneTrail);
        newTrail.cached = apiIDsFromCache.includes(oneTrail.id.toString());
        return newTrail;
      });
      //START-CONSOLE-TESTING
      // console.log('rtnTrails:');
      // console.log(rtnTrails);
      //END-CONSOLE-TESTING
      response.status(200).render('results.ejs',
        {
          queryType: queryType,
          userName: location.userName,
          trailResults: rtnTrails
        });
    })
    .catch(error => {
      console.error('Error getting trail data from API');
      console.error(error);
    });
};

//constructor
function Trail(object) {
  let placeholderImage = './public/images/weekend_warrior_imagenotavailable.png'
  this.api_id = object.id;
  this.cached = false;
  this.name = object.name ? object.name : 'No name available';
  this.summary = object.summary ? object.summary : 'No summary available';
  this.img_medium = object.imgMedium ? object.imgMedium : placeholderImage;
  this.latitude = object.latitude ? object.latitude : 0.0;
  this.longitude = object.longitude ? object.longitude : 0.0;
  this.length = object.length ? object.length : 'No trail length available';
  this.ascent = object.ascent ? object.ascent : 'No total ascent available';
  this.high = object.high ? object.high : 'No max height available';
  this.difficulty = object.difficulty ? object.difficulty : 'No trail difficulty available';
  this.conditionStatus = object.conditionStatus ? object.conditionStatus : 'No trail condition available';
  this.stars = object.stars ? object.stars : 'No trail rating available';
}

module.exports.getTrails = getTrails;
