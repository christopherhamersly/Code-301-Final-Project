'use strict';
const queryType = 'music';
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


const getTunes = (location, response) => {
  console.log('In the music function', location.query);
  let city = location.search_query;
  let tunesUrl = `http://musicovery.com/api/V6/artist.php?fct=getfromlocation&location=${city}`
  superagent.get(tunesUrl)
    .then(request => {
      // console.log(request.body.artists.artist)
      let tunesArray = request.body.artists.artist.map(oneTune => {
        return new Song(oneTune);
      });
      // console.log('Tunes Array', tunesArray);


      response.status(200).render('results.ejs',
        { queryType: queryType,
          tunesResults: tunesArray});
    }).catch(error => {
      console.error('error', error)
    })
}

module.exports.getTunes = getTunes;


function Song (obj) {
  this.name = obj.name;
  this.genre = obj.genre
}
