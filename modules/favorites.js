'use strict';

const express = require('express');
const app = express();

const pg = require('pg');
// const superagent = require('superagent');
require('ejs');
require('dotenv').config();

// const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

client.connect();

const saveTrail = (request, response) => {
  //START-CONSOLE-TESTING
  console.log('saveTrail, request.body:');
  console.log(request.body);
  //END-CONSOLE-TESTING
  let sqlInsert = 'INSERT INTO trails (api_id, name, summary, img_medium, latitude, longitude, length, ascent, high, difficulty, conditionStatus, stars) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);';
  let {
    api_id,
    name,
    summary,
    img_medium,
    latitude,
    longitude,
    length,
    ascent,
    high,
    difficulty,
    conditionStatus,
    stars
  } = request.body;
  let sqlSafe = [api_id, name, summary, img_medium, latitude, longitude, length, ascent, high, difficulty, conditionStatus, stars];
  client.query(sqlInsert, sqlSafe)
    .then(() => {
      //START-CONSOLE-TESTING
      console.log('Inserted trail into DB');
      //END-CONSOLE-TESTING
    })
    .catch(error => {
      console.error('Error inserting trail into cache');
      console.error(error);
    });
}

module.exports.saveTrail = saveTrail;
