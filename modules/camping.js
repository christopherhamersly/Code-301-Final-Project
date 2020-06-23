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

const getCampgrounds = (location, response) => {
  console.log('we are in the function')
  let apiParams = {
    landmarkLat: location.lat,
    landmarkLong: location.lon,
    amenity: 4006,
    key: process.env.CAMPING_API_KEY
  };
  let apiUrl = 'http://api.amp.active.com/camping/campgrounds/search';
  superagent.get(apiUrl, apiParams)
    .query({landmarkLat: location.lat})
    .query({landmarkLong: location.lon})
    .query({amenity: 4060})
    .then(apiData => {
      //START-CONSOLE-TESTING
      console.log(apiData.body);
      console.log('We are in');
      //END-CONSOLE-TESTING
      // let campingArray = apiData.body.map(oneCamp => {
      //   return new Camp(oneCamp);
      // });
      // response.status(200).render('test.ejs', {campResults: campingArray});
    }) .catch(error => {
      console.error('error', error)
    })
}

module.exports.getCampgrounds = getCampgrounds;

// function Camp (obj) {
//   this.location = obj.location[1] ? obj.location[1] : 'No city available';
//   this.name = obj.name ? obj.name : 'No name available';
//   this.type = obj.type ? obj.type : 'No type available';
//   this.pitches = obj.pitches ? obj.pitches : 'No info available';
//   this.stars = obj.stars ? obj.stars : 'No rating available';
//   this.latitude = obj.latitude ? obj.latitude : 'No info available';
//   this.longitude = obj.longitude ? obj.longitude : 'No info available';
//   this.imgMedium = obj.imgMedium ? obj.imgMedium : 'No image available'
// }
