'use strict';
const queryType = 'brewery';
const express = require('express');
const app = express();

const pg = require('pg');
const superagent = require('superagent');
require('ejs');
require('dotenv').config();

// const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

client.connect();

const getBreweries = (location, response) => {
  //START-CONSOLE-TESTING
  // console.log('getBreweries, location:');
  // console.log(location);
  //END-CONSOLE-TESTING
  let sqlSelect = 'SELECT api_id FROM breweries;';
  client.query(sqlSelect)
    .then(sqlData => {
      //START-CONSOLE-TESTING
      // console.log('getTrails, DB api_ids:');
      // console.log(sqlData.rows);
      //END-CONSOLE-TESTING
      getBreweriesFromAPI(sqlData.rows, location, response);
    })
    .catch(error => {
      console.error('Error checking cache for favorited breweries');
      console.error(error);
    });
}

const getBreweriesFromAPI = (apiIDsFromCache, location, response) => {
  let apiUrl = 'https://api.openbrewerydb.org/breweries';
  let apiParams = {
    by_city: location.search_query
  };
  superagent.get(apiUrl, apiParams)
    .then(apiData => {
      //START-CONSOLE-TESTING
      // console.log('getBreweriesFromAPI, apiData.body:');
      // console.log(apiData.body);
      //END-CONSOLE-TESTING
      //flatten the array from an array of objects with a single key-value pair, to
      //an array of numbers
      apiIDsFromCache = apiIDsFromCache.map(sqlObject => sqlObject.api_id);
      let brewArray = apiData.body.map(oneBrew => {
        let newBrewery = new Brewery(oneBrew);
        newBrewery.cached = apiIDsFromCache.includes(oneBrew.id.toString());
        return newBrewery;
      });
      //START-CONSOLE-TESTING
      // console.log('getBreweriesFromAPI, brewArray:');
      // console.log(brewArray);
      //END-CONSOLE-TESTING
      response.status(200).render('results.ejs',
        {
          queryType: queryType,
          userName: location.userName,
          brewery: brewArray
        });
    })
    .catch(error => {
      console.error('Error getting brewery data from API');
      console.error(error);
    });
};

module.exports.getBreweries = getBreweries;

function Brewery(obj) {
  this.api_id = obj.id;
  this.cached = false;
  this.name = obj.name ? obj.name : 'No name available';
  this.type = obj.brewery_type ? obj.brewery_type : 'No info available';
  this.latitude = obj.latitude ? obj.latitude : 0.0;
  this.longitude = obj.longitude ? obj.longitude : 0.0;
  this.website = obj.website_url ? obj.website_url : 'No website available';
}
