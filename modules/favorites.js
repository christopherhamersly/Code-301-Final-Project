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
  console.log('saveTrail, request:');
  console.log(request.body);
  //END-CONSOLE-TESTING
  let sqlSelect = 'SELECT api_id FROM trails WHERE api_id = ($1);';
  let sqlSafe = [parseInt(request.body.api_id, 10)];
  client.query(sqlSelect, sqlSafe)
    .then(sqlData => {
      //START-CONSOLE-TESTING
      console.log('sqlData.rows:');
      console.log(sqlData.rows);
      //END-CONSOLE-TESTING
      if (sqlData.rows.length === 0)
      {
        insertIntoDB(request, response);
      }
      //START-CONSOLE-TESTING
      else
      {
        console.log('Trail already saved to favorites');
      }
      //END-CONSOLE-TESTING
    })
    .catch(error => {
      console.error('Error checking cache for trail before saving');
      console.error(error);
    });
}

const insertIntoDB = (request, response) => {
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
      let requestPath = request.headers.referer.replace(request.headers.origin, '');
      response.redirect(`${requestPath}#${api_id}`);
    })
    .catch(error => {
      console.error('Error inserting trail into cache');
      console.error(error);
    });
};

const showFavorites = (request, response) => {
  response.render('favorites.ejs', {testKey: 'Favorites time!'});
};

module.exports.saveTrail = saveTrail;
module.exports.showFavorites = showFavorites;
