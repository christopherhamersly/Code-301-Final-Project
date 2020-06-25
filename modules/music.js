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


const getTunes = (request, response) => {
  console.log('In the music function', request.query);
  // let city = 'kalispell';
  let tunesUrl = `http://musicovery.com/api/V6/track.php?=new&track=false`
  superagent.get(tunesUrl)
    .then(request => {
      // console.log(request.body.artists.artist)
      let tunesArray = request.body.artists.artist.map(oneTune => {
        return new Song(oneTune);
      });
      // console.log('Tunes Array', tunesArray);


      response.status(200).render('resultsFromMusic.ejs',
    {tunesResults: tunesArray});
    }).catch(error => {
      console.error('error', error)
    })
}

module.exports.getTunes = getTunes;


function Song (obj) {
  this.name = obj.name;
  this.genre = obj.genre
}
