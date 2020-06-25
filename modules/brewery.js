'use strict';
const express = require('express');
const app = express();

const pg = require('pg');
const superagent = require('superagent');
require('ejs');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

const getBrewery = (location, response) => {
  console.log('In the function');
  let city = location.search_query;
  let apiUrl = `https://api.openbrewerydb.org/breweries?by_city=${city}`;
  let apiParams = {
    lat: location.lat,
    lon: location.lon
  };
  superagent.get(apiUrl, apiParams)
    .then(apiData => {
      // console.log(apiData.body);
      let brewArray = apiData.body.map(oneBrew => {
        return new Brewery(oneBrew);
      });
      // console.log('Brew Array', brewArray);
      // response.status(200).render('results.ejs',
        {brewery: brewArray});
    }).catch(error => {
      console.error('error', error)
    })
}

module.exports.getBrewery = getBrewery;

function Brewery(obj) {
  this.name = obj.name ? obj.name : 'No name available';
  this.type = obj.brewery_type ? obj.brewery_type : 'No info available';
  this.latitude = obj.latitude ? obj.latitude : 'No info available';
  this.longitude = obj.longitude ? obj.longitude : 'No info available';
  this.webiste = obj.website_url ? obj.website_url : 'No website available';
  // this.tag_list = obj.tag_list ? obj.tag_list : 'No info available';
}

// { id: 247,
//   name: 'Lost Forty Brewing',
//   brewery_type: 'micro',
//   street: '501 Byrd St',
//   city: 'Little Rock',
//   state: 'Arkansas',
//   postal_code: '72202',
//   country: 'United States',
//   longitude: '-92.260019',
//   latitude: '34.742845',
//   phone: '5013197275',
//   website_url: 'http://www.lost40brewing.com/',
//   updated_at: '2018-08-23T23:23:24.018Z',
//   tag_list: [] }\
