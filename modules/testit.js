
'use strict';
const express = require('express');
const app = express();

const pg = require('pg');
const superagent = require('superagent');
const { response } = require('express');
require('ejs');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));



async function getTwoArrays(location, response) {
  let apiURL1 = 'https://www.hikingproject.com/data/get-trails';
  let apiParams1 = {
    lat: location.lat,
    lon: location.lon,
    maxDistance: 10,
    key: process.env.HIKING_ROUTES_API_KEY
  };
  let city = location.search_query;
  let apiURL2 =
    `https://api.openbrewerydb.org/breweries?by_city=${city}`;
  
  let apiParams2 = {
    lat: location.lat,
    lon: location.lon
  };
  console.log(location);
  const url1 = superagent.get(apiURL1, apiParams1);
  const url2 = superagent.get(apiURL2, apiParams2);

  const [data1, data2] = await Promise.all([
    url1,
    url2
  ]).then(result => {
    console.log(data1.body, data2.body);
    let rtnTrails = data1.body.trails.map(oneTrail => {
      let newTrail = new Trail(oneTrail);
      newTrail.cached = apiIDsFromCache.includes(oneTrail.id);
      return newTrail;
    });
    let brewArray = apiData.body.map(oneBrew => {
      return new Brewery(oneBrew);
    });
    let trailResults = data1.body;
    let brewery = data2.body;

    response.status(200).render('/testit', { trailResults: oneTrail, brewery: oneBrew })
  }).catch(error => {
    console.error('error', error)
  })
}

module.exports.getTwoArrays = getTwoArrays;

function Brewery(obj) {
  this.name = obj.name ? obj.name : 'No name available';
  this.type = obj.brewery_type ? obj.brewery_type : 'No info available';
  this.latitude = obj.latitude ? obj.latitude : 'No info available';
  this.longitude = obj.longitude ? obj.longitude : 'No info available';
  this.webiste = obj.website_url ? obj.website_url : 'No website available';
  // this.tag_list = obj.tag_list ? obj.tag_list : 'No info available';
}

function Trail(object) {
  let placeholderImage = './public/images/weekend_warrior_imagenotavailable.png'
  this.api_id = object.id;
  this.cached = false;
  this.name = object.name ? object.name : 'No name available';
  this.summary = object.summary ? object.summary : 'No summary available';
  this.img_medium = object.imgMedium ? object.imgMedium : placeholderImage;
  this.latitude = object.latitude ? object.latitude : 'No latitude available';
  this.longitude = object.longitude ? object.longitude : 'No longitude available';
  this.length = object.length ? object.length : 'No trail length available';
  this.ascent = object.ascent ? object.ascent : 'No total ascent available';
  this.high = object.high ? object.high : 'No max height available';
  this.difficulty = object.difficulty ? object.difficulty : 'No trail difficulty available';
  this.conditionStatus = object.conditionStatus ? object.conditionStatus : 'No trail condition available';
  this.stars = object.stars ? object.stars : 'No trail rating available';
}
