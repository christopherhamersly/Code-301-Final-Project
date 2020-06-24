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

const getSnowSports = (location, response) => {
  // console.log('we are in the function')
  let apiUrl = 'https://www.powderproject.com/data/get-trails';
  let apiParams = {
    lat: location.lat,
    lon: location.lon,
    maxDistance: 30,
    key: process.env.POWDER_PROJECT_API_KEY
  };
  console.log('results', results.body);
  // superagent.get(apiUrl, apiParams)
  //   .then(apiData => {
  //     //START-CONSOLE-TESTING
  //     // console.log(apiData.body.routes)
  //     // console.log('We are in');
  //     //END-CONSOLE-TESTING
  //     let snowSportsArray = apiData.body.routes.map(oneSnowSport => {
  //       return new SnowSports(oneSnowSport);
  //     });
  //     response.status(200).render('results.ejs', {snowSportsResults: snowSportsArray});
  //   }) .catch(error => {
  //     console.error('error', error)
  //   })
}

module.exports.snowSports = getSnowSports;

// // constructor
// function SnowSports(obj) {
//   this.location = obj.location[1] ? obj.location[1] : 'No city available';
//   this.name = obj.name ? obj.name : 'No name available';
//   this.type = obj.type ? obj.type : 'No type available';
//   this.pitches = obj.pitches ? obj.pitches : 'No info available';
//   this.stars = obj.stars ? obj.stars : 'No rating available';
//   this.latitude = obj.latitude ? obj.latitude : 'No info available';
//   this.longitude = obj.longitude ? obj.longitude : 'No info available';
//   this.imgMedium = obj.imgMedium ? obj.imgMedium : 'No image available'
// }