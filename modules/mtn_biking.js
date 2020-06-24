'use strict';
const queryType = 'mountainbiking';

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

const mountainBiking = (location, response) => {
  console.log('we are in the mountain biking function')
  let apiUrl = 'https://www.mtbproject.com/data/get-trails';
  let apiParams = {
    lat: location.lat,
    lon: location.lon,
    maxDistance: 30,
    key: process.env.MTN_BIKING_API_KEY
  };
  superagent.get(apiUrl, apiParams)
  // console.log('results', results.body);
    .then(apiData => {
      // console.log(apiData.body.trails)
      let mtnbikearrary = apiData.body.trails.map(oneBike => {
        return new MtBikes(oneBike);
      });
      response.status(200).render('results.ejs',
        {
          queryType: queryType,
          mtBikeResults: mtnbikearrary
        });
    }) .catch(error => {
      console.error('error', error)
    })
}

module.exports.mountainBiking = mountainBiking;

// constructor
function MtBikes(obj) {
  this.location = obj.location ? obj.location : 'No city available';
  this.name = obj.name ? obj.name : 'No name available';
  this.type = obj.type ? obj.type : 'No type available';
  this.difficulty = obj.difficulty ? obj.difficulty : 'No difficulty available';
  this.stars = obj.stars ? obj.stars : 'No rating available';
  this.latitude = obj.latitude ? obj.latitude : 'No info available';
  this.longitude = obj.longitude ? obj.longitude : 'No info available';
  this.imgMedium = obj.imgMedium ? obj.imgMedium : 'No image available';
  this.summary = obj.summary ? obj.summary : 'No description available';
  this.length = obj.length ? obj.length : 'No length available'
}
