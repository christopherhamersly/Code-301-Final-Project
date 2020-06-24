'use strict';
const queryType = 'climbing';

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

const rockClimbing = (location, response) => {
  // console.log('we are in the function')
  let apiUrl = 'https://www.mountainproject.com/data/get-routes-for-lat-lon';
  let apiParams = {
    lat: location.lat,
    lon: location.lon,
    maxDistance: 30,
    key: process.env.CLIMBING_ROUTES_API_KEY
  };
  superagent.get(apiUrl, apiParams)
    .then(apiData => {
      let climbingArray = apiData.body.routes.map(oneClimb => {
        return new Climbs(oneClimb);
      });
      response.status(200).render('results.ejs',
        {
          queryType: queryType,
          climbResults: climbingArray
        });
    })
    .catch(error => {
      console.error('error', error)
    })
}

module.exports.rockClimbing = rockClimbing;

// constructor
function Climbs(obj) {
  let placeholderImage = './public/images/weekend_warrior_imagenotavailable.png'
  this.location = obj.location[1] ? obj.location[1] : 'No city available';
  this.name = obj.name ? obj.name : 'No name available';
  this.type = obj.type ? obj.type : 'No type available';
  this.pitches = obj.pitches ? obj.pitches : 'No info available';
  this.stars = obj.stars ? obj.stars : 'No rating available';
  this.latitude = obj.latitude ? obj.latitude : 'No info available';
  this.longitude = obj.longitude ? obj.longitude : 'No info available';
  this.imgMedium = obj.imgMedium ? obj.imgMedium : placeholderImage;
}

