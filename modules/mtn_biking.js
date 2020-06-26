'use strict';
const queryTypeString = 'mountainbiking';

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

const getMtnBiking = (location, response) => {
  //START-CONSOLE-TESTING
  // console.log('getMtnBiking, location:');
  // console.log(location);
  //END-CONSOLE-TESTING
  let sqlSelect = 'SELECT api_id FROM mtn_biking;';
  client.query(sqlSelect)
    .then(sqlData => {
      //START-CONSOLE-TESTING
      // console.log('getTrails, DB api_ids:');
      // console.log(sqlData.rows);
      //END-CONSOLE-TESTING
      getMtnBikingFromAPI(sqlData.rows, location, response);
    })
    .catch(error => {
      console.error('Error checking cache for favorited mtn biking routes');
      console.error(error);
    });
};

const getMtnBikingFromAPI = (apiIDsFromCache, location, response) => {
  //START-CONSOLE-TESTING
  // console.log('getMtnBikingFromAPI, apisFromCache, location:');
  // console.log(apiIDsFromCache);
  // console.log(location);
  //END-CONSOLE-TESTING
  let apiUrl = 'https://www.mtbproject.com/data/get-trails';
  let apiParams = {
    lat: location.lat,
    lon: location.lon,
    maxDistance: 30,
    key: process.env.MTN_BIKING_API_KEY
  };
  superagent.get(apiUrl, apiParams)
    .then(apiData => {
      //flatten the array from an array of objects with a single key-value pair, to
      //an array of numbers
      apiIDsFromCache = apiIDsFromCache.map(sqlObject => sqlObject.api_id);
      //START-CONSOLE-TESTING
      // console.log('apiData.body:');
      // console.log(apiData.body);
      //END-CONSOLE-TESTING
      let mtnBikeRoutes = apiData.body.trails.map(oneRoute => {
        let newMtnBikeRoute = new MtnBikeRoute(oneRoute);
        newMtnBikeRoute.cached = apiIDsFromCache.includes(oneRoute.id.toString());
        return newMtnBikeRoute;
      });
      //START-CONSOLE-TESTING
      // console.log('mtnBikeRoutes:');
      // console.log(mtnBikeRoutes);
      //END-CONSOLE-TESTING
      response.status(200).render('results.ejs',
        {
          queryType: queryTypeString,
          userName: location.userName,
          mtnBikeResults: mtnBikeRoutes
        });
    })
    .catch(error => {
      console.error('Error getting mtn biking data from API');
      console.error(error);
    });
};

module.exports.getMtnBiking = getMtnBiking;

// constructor
function MtnBikeRoute(obj) {
  let placeholderImage = './public/images/weekend_warrior_imagenotavailable.png'
  this.api_id = obj.id;
  this.cached = false;
  this.location = obj.location ? obj.location : 'No city available';
  this.name = obj.name ? obj.name : 'No name available';
  this.type = obj.type ? obj.type : 'No type available';
  this.difficulty = obj.difficulty ? obj.difficulty : 'No difficulty available';
  this.stars = obj.stars ? obj.stars : 'No rating available';
  this.latitude = obj.latitude ? obj.latitude : 0.0;
  this.longitude = obj.longitude ? obj.longitude : 0.0;
  this.img_medium = obj.imgMedium ? obj.imgMedium : placeholderImage;
  this.summary = obj.summary ? obj.summary : 'No description available';
  this.length = obj.length ? obj.length : 'No length available'
}
