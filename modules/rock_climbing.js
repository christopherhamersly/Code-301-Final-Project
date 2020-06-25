'use strict';
const queryType = 'climbing';

const express = require('express');
const app = express();

const pg = require('pg');
const superagent = require('superagent');
require('ejs');
require('dotenv').config();

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

client.connect();

const rockClimbing = (location, response) => {
  //START-CONSOLE-TESTING
  // console.log('rockClimbing');
  // console.log(location)
  //END-CONSOLE-TESTING
  let sqlSelect = 'SELECT api_id FROM climbing;';
  client.query(sqlSelect)
    .then(sqlData => {
      //START-CONSOLE-TESTING
      // console.log('rockClimbing, DB api_ids:');
      // console.log(sqlData.rows);
      //END-CONSOLE-TESTING
      getRockClimbingFromAPI(sqlData.rows, location, response);
    })
    .catch(error => {
      console.error('Error checking cache for favorited trails');
      console.error(error);
    });
}

const getRockClimbingFromAPI = (apiIDsFromCache, location, response) => {
  let apiUrl = 'https://www.mountainproject.com/data/get-routes-for-lat-lon';
  let apiParams = {
    lat: location.lat,
    lon: location.lon,
    maxDistance: 30,
    key: process.env.CLIMBING_ROUTES_API_KEY
  };
  superagent.get(apiUrl, apiParams)
    .then(apiData => {
      //START-CONSOLE-TESTING
      // console.log('rockClimbing, apiData.body:');
      // console.log(apiData.body);
      //END-CONSOLE-TESTING
      apiIDsFromCache = apiIDsFromCache.map(sqlObject => sqlObject.api_id);
      let climbingArray = apiData.body.routes.map(oneClimb => {
        let newRockClimb = new Climbs(oneClimb);
        newRockClimb.cached = apiIDsFromCache.includes(oneClimb.id.toString());
        return newRockClimb;
      });
      response.status(200).render('results.ejs',
        {
          queryType: queryType,
          climbResults: climbingArray
        });
    })
    .catch(error => {
      console.error('error', error)
    });
};

module.exports.rockClimbing = rockClimbing;

// constructor
function Climbs(obj) {
  let placeholderImage = './public/images/weekend_warrior_imagenotavailable.png';
  this.api_id = obj.id;
  this.cached = false;
  this.location = obj.location[1] ? obj.location[1] : 'No city available';
  this.name = obj.name ? obj.name : 'No name available';
  this.type = obj.type ? obj.type : 'No type available';
  this.pitches = obj.pitches ? obj.pitches : 'No info available';
  this.stars = obj.stars ? obj.stars : 'No rating available';
  this.latitude = obj.latitude ? obj.latitude : 'No info available';
  this.longitude = obj.longitude ? obj.longitude : 'No info available';
  this.img_medium = obj.imgMedium ? obj.imgMedium : placeholderImage;
}

