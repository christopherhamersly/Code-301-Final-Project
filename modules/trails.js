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
  // console.log('getTrails, location:');
  // console.log(location);
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
      // console.log('getTrails apiData.body:');
      // console.log(apiData.body);
      //END-CONSOLE-TESTING
      let rtnTrails = apiData.body.trails.map(oneTrail => {
        return new Trail(oneTrail);
      });
      //START-CONSOLE-TESTING
      // console.log('rtnTrails:');
      // console.log(rtnTrails);
      //END-CONSOLE-TESTING
      response.render('results.ejs', {trailResults: rtnTrails});
    })
    .catch(error => {
      console.error('Error getting trail data');
      console.error(error);
    });
};

module.exports.getTrails = getTrails;

//constructor
function Trail(object) {
  this.name = object.name ? object.name : 'No name available';
  this.summary = object.summary ? object.summary : 'No summary available';
  this.img_medium = object.imgMedium ? object.imgMedium : 'No image link available';
  this.latitude = object.latitude ? object.latitude : 'No latitude available';
  this.longitude = object.longitude ? object.longitude : 'No longitude available';
  this.length = object.length ? object.length : 'No trail length available';
  this.ascent = object.ascent ? object.ascent : 'No total ascent available';
  this.high = object.high ? object.high : 'No max height available';
  this.difficulty = object.difficulty ? object.difficulty : 'No trail difficulty available';
  this.conditionStatus = object.conditionStatus ? object.conditionStatus : 'No trail condition available';
  this.stars = object.stars ? object.stars : 'No trail rating available';
}
