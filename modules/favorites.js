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

const trails = require('./trails.js');

const saveTrail = (request, response) => {
  //START-CONSOLE-TESTING
  console.log('saveTrail, request:');
  console.log(request.body);
  //END-CONSOLE-TESTING
  let sqlSelect = 'SELECT api_id FROM trails WHERE api_id = ($1);';
  let sqlSafe = [request.body.api_id];
  client.query(sqlSelect, sqlSafe)
    .then(sqlData => {
      //START-CONSOLE-TESTING
      console.log('sqlData.rows:');
      console.log(sqlData.rows);
      //END-CONSOLE-TESTING
      if (sqlData.rows.length === 0)
      {
        addTrailToDB(request, response);
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

const addTrailToDB = (request, response) => {
  //START-CONSOLE-TESTING
  console.log('addToFavorites, request.body:');
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
      let requestPath = request.headers.referer.replace(request.headers.origin, '');
      response.redirect(`${requestPath}#${api_id}`);
    })
    .catch(error => {
      console.error('Error inserting trail into cache');
      console.error(error);
    });
};

const showFavorites = (request, response) => {
  let sqlSelect = 'SELECT * FROM trails;';
  client.query(sqlSelect)
    .then(sqlData => {
      //START-CONSOLE-TESTING
      console.log('showFavorites, sqlData.rows:');
      console.log(sqlData.rows);
      //END-CONSOLE-TESTING
      // sqlData.rows = sqlData.rows.map(oneCachedTrail => {
      //   oneCachedTrail.id = oneCachedTrail.api_id;
      //   oneCachedTrail.imgMedium = oneCachedTrail.img_medium;
      //   return oneCachedTrail;
      // });
      // let favoriteTrails = sqlData.rows.map(oneCachedTrail => {
      //   return new trails.Trail(oneCachedTrail);
      // });
      //START-CONSOLE-TESTING
      // console.log('favoriteTrails:');
      // console.log(favoriteTrails);
      console.log('right before rendering favorites.ejs, sqlData.rows:');
      console.log(sqlData.rows);
      //END-CONSOLE-TESTING
      response.render('favorites.ejs', {trailResults: sqlData.rows});
    })
    .catch(error => {
      console.error('Error getting favorites from cache');
      console.error(error);
    });
};

const updateNote = (request, response) => {
  //START-CONSOLE-TESTING
  console.log('updateNote. request.body:');
  console.log(request.body);
  //END-CONSOLE-TESTING
  let sqlUpdate = 'UPDATE trails SET notes = ($1);';
  let sqlSafe = [request.body.notes];
  client.query(sqlUpdate, sqlSafe)
    .then(() => {
      response.redirect('/favorites');
    })
    .catch(error => {
      console.error('Error updating notes in cache');
      console.error(error);
    });
};

const deleteFavorite = (request, response) => {
  //START-CONSOLE-TESTING
  // console.log('deleteFavorite. request.params:');
  // console.log(request.params);
  //END-CONSOLE-TESTING
  let sqlDelete = 'DELETE FROM trails WHERE api_id = ($1);';
  let sqlSafe = [request.params.api_id];
  client.query(sqlDelete, sqlSafe)
    .then(() => {
      response.redirect('/favorites');
    })
    .catch(error => {
      console.error('Error deleting favorite from cache');
      console.error(error);
    });
}

module.exports.saveTrail = saveTrail;
module.exports.showFavorites = showFavorites;
module.exports.updateNote = updateNote;
module.exports.deleteFavorite = deleteFavorite;
