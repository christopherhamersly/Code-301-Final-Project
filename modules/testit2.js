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

async function getThreeArrays(location, response){
  console.log('in the function');
  console.log('LOCATION', location);
 try{const apiURL1 = 'https://www.mountainproject.com/data/get-routes-for-lat-lon';
    const apiParams1 = {
      lat: location.lat,
      lon: location.lon,
      maxDistance: 30,
      key: process.env.CLIMBING_ROUTES_API_KEY
     
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
  let climbingArray = data1.body.routes.map(oneClimb => {
    let newRockClimb = new Climbs(oneClimb);
    return newRockClimb;
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
    // console.log('Results from promise.all', data1.body, data2.body);
  
      response.status(200).render('./partials/testit2.ejs', { climbResults: climbingArray, brewery: brewArray, tunesResults: tunesArray })
   }
 


//Climbing Constructor
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
// Brewery Constructor
function Brewery(obj) {
  this.name = obj.name ? obj.name : 'No name available';
  this.type = obj.brewery_type ? obj.brewery_type : 'No info available';
  this.latitude = obj.latitude ? obj.latitude : 'No info available';
  this.longitude = obj.longitude ? obj.longitude : 'No info available';
  this.webiste = obj.website_url ? obj.website_url : 'No website available';
  // this.tag_list = obj.tag_list ? obj.tag_list : 'No info available';
}

// Music constructor
function Song (obj) {
  this.name = obj.name;
  this.genre = obj.genre
}

module.exports.getThreeArrays = getThreeArrays;