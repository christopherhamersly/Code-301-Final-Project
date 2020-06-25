
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



async function getTwoArrays(location, response){
  console.log('in the function');
  console.log('LOCATION', location);
 try{const apiURL1 = 'https://www.hikingproject.com/data/get-trails';
    const apiParams1 = {
       key: process.env.HIKING_ROUTES_API_KEY,
      lat: location.lat,
      lon: location.lon,
      maxDistance: 10
     
  };
  const city = location.search_query;
  const apiURL2 =
    `https://api.openbrewerydb.org/breweries?by_city=${city}`;
  
  //   const apiParams2 = {
  //     lat: location.lat,
  //     lon: location.lon
  // };
  // console.log(location);
  const apiURL3 =
  `http://musicovery.com/api/V6/artist.php?fct=getfromlocation&location=${city}`
  
  
  const url1 = superagent.get(apiURL1).query(apiParams1);
  const url2 = superagent.get(apiURL2);
  const url3 = superagent.get(apiURL3);

  var [data1, data2, data3] = await Promise.all([
    url1,
    url2,
    url3
  ])}catch(error) { console.log('ERROR', error)};
  // .then(result => {
  //   console.log(data1.body, data2.body);
    let rtnTrails = data1.body.trails.map(oneTrail => {
      // let newTrail = 
      return new Trail(oneTrail);
      // newTrail.cached = apiIDsFromCache.includes(oneTrail.id);
      // return newTrail;
    });
      
  //   }).then(brew => {
     let brewArray = data2.body.map(oneBrew => {
    return new Brewery(oneBrew);
    });
 
    let tunesArray = data3.body.artists.artist.map(oneTune => {
      return new Song(oneTune);
    });
    console.log('Results from promise.all', data1.body, data2.body);
  
    // var trailResults = data1.body;
    // var brewery = data2.body;

      response.status(200).render('./partials/testit.ejs', { trailResults: rtnTrails, brewery: brewArray, tunesResults: tunesArray })
   }
 




// Brewery Constructor
function Brewery(obj) {
  this.name = obj.name ? obj.name : 'No name available';
  this.type = obj.brewery_type ? obj.brewery_type : 'No info available';
  this.latitude = obj.latitude ? obj.latitude : 'No info available';
  this.longitude = obj.longitude ? obj.longitude : 'No info available';
  this.webiste = obj.website_url ? obj.website_url : 'No website available';
  // this.tag_list = obj.tag_list ? obj.tag_list : 'No info available';
}


// Hiking Constructor
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

// Music constructor
function Song (obj) {
  this.name = obj.name;
  this.genre = obj.genre
}

module.exports.getTwoArrays = getTwoArrays;