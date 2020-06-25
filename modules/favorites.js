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

const saveActivity = (request, response) => {
  //START-CONSOLE-TESTING
  // console.log('saveTrail, request.body:');
  // console.log(request.body);
  //END-CONSOLE-TESTING
  let sqlSelect = `SELECT api_id FROM ${request.body.table_name} WHERE api_id = ($1);`;
  let sqlSafe = [request.body.api_id];
  client.query(sqlSelect, sqlSafe)
    .then(sqlData => {
      //START-CONSOLE-TESTING
      // console.log('sqlData.rows:');
      // console.log(sqlData.rows);
      //END-CONSOLE-TESTING
      if (sqlData.rows.length === 0)
      {
        addActivityToDB(request, response);
      }
      //START-CONSOLE-TESTING
      else
      {
        console.log('Activity already saved to favorites');
      }
      //END-CONSOLE-TESTING
    })
    .catch(error => {
      console.error('Error checking cache for activity before saving');
      console.error(error);
    });
}

const addActivityToDB = (request, response) => {
  //START-CONSOLE-TESTING
  // console.log('addActivityToDB, request.body:');
  // console.log(request.body);
  //END-CONSOLE-TESTING
  let tableName = request.body.table_name;
  let sqlInsert = getSQLInsertQuery(tableName);
  let sqlSafe = getSQLSafeValues(tableName, request);
  //START-CONSOLE-TESTING
  // console.log('SQL insert and safe values:');
  // console.log(sqlInsert);
  // console.log(sqlSafe);
  //END-CONSOLE-TESTING
  client.query(sqlInsert, sqlSafe)
    .then(() => {
      //START-CONSOLE-TESTING
      // console.log('Inserted activity into DB');
      //END-CONSOLE-TESTING
      let requestPath = request.headers.referer.replace(request.headers.origin, '');
      //START-CONSOLE-TESTING
      // console.log('requestPath:');
      // console.log(requestPath);
      //END-CONSOLE-TESTING
      response.redirect(`${requestPath}#${request.body.api_id}`);
    })
    .catch(error => {
      console.error('Error inserting activity into cache');
      console.error(error);
    });
};

const showFavorites = (request, response) => {
  let sqlTrailsSelect = 'SELECT * FROM trails ORDER BY id;';
  let sqlCampingSelect = 'SELECT * FROM camping ORDER BY id;';
  let sqlClimbingSelect = 'SELECT * FROM climbing ORDER BY id;';
  let sqlMtnBikingSelect = 'SELECT * FROM mtn_biking ORDER BY id;';
  client.query(sqlTrailsSelect.concat(sqlCampingSelect, sqlClimbingSelect, sqlMtnBikingSelect))
    .then(sqlData => {
      let renderObject = {
        trailData: sqlData[0].rows,
        campingData: sqlData[1].rows,
        climbingData: sqlData[2].rows,
        mtnBikingData: sqlData[3].rows
      };
      //START-CONSOLE-TESTING
      // console.log('showFavorites, sqlData.rows:');
      // sqlData.forEach(oneResult => {
      //   console.log('oneResult.rows:');
      //   console.log(oneResult.rows);
      // });
      // console.log('renderObject:');
      // console.log(renderObject);
      // console.log('showFavorites, renderObject.climbingData:');
      // console.log(renderObject.climbingData);
      //END-CONSOLE-TESTING
      response.status(200).render('favorites.ejs', renderObject);
    })
    .catch(error => {
      console.error('Error getting favorites from cache');
      console.error(error);
    });
};

const updateNote = (request, response) => {
  //START-CONSOLE-TESTING
  // console.log('updateNote. request.body, request.params:');
  // console.log(request.body);
  // console.log(request.params);
  //END-CONSOLE-TESTING
  let sqlUpdate = `UPDATE ${request.body.table_name} SET notes= ($1) WHERE api_id = ($2);`;
  let sqlSafe = [request.body.notes, request.params.api_id];
  client.query(sqlUpdate, sqlSafe)
    .then(() => {
      let requestPath = request.headers.referer.replace(request.headers.origin, '');
      response.redirect(`${requestPath}#${request.params.api_id}`);
    })
    .catch(error => {
      console.error('Error updating notes in cache');
      console.error(error);
    });
};

const deleteFavorite = (request, response) => {
  //START-CONSOLE-TESTING
  // console.log('deleteFavorite, request.body, request.params:');
  // console.log(request.body);
  // console.log(request.params);
  //END-CONSOLE-TESTING
  let sqlDelete = `DELETE FROM ${request.body.table_name} WHERE api_id = ($1);`;
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

//helper functions
const getSQLInsertQuery = (tableName) => {
  let sqlInsert;
  switch (tableName) {
  case 'trails':
    sqlInsert = 'INSERT INTO trails (api_id, name, summary, img_medium, latitude, longitude, length, ascent, high, difficulty, conditionStatus, stars) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);';
    return sqlInsert;
  case 'camping':
    sqlInsert = 'INSERT INTO camping (api_id, image, name, latitude, longitude, description, entrance_fees, activities) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);';
    return sqlInsert;
  case 'climbing':
    sqlInsert = 'INSERT INTO climbing (api_id, location, name, type, pitches, stars, latitude, longitude, img_medium) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);';
    return sqlInsert;
  case 'mtn_biking':
    sqlInsert = 'INSERT INTO mtn_biking (api_id, location, name, type, difficulty, stars, latitude, longitude, img_medium, summary, length) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);';
    return sqlInsert;
  }
};

const getSQLSafeValues = (tableName, request) => {
  let sqlSafeValues;
  switch (tableName) {
  case 'trails':
  {
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
    sqlSafeValues = [api_id, name, summary, img_medium, latitude, longitude, length, ascent, high, difficulty, conditionStatus, stars];
    return sqlSafeValues;
  }
  case 'camping':
  {
    let {
      api_id,
      image,
      name,
      latitude,
      longitude,
      description,
      entrance_fees,
      activities
    } = request.body;
    sqlSafeValues = [api_id, image, name, latitude, longitude, description, entrance_fees, activities];
    return sqlSafeValues;
  }
  case 'climbing':
  {
    let {
      api_id,
      location,
      name,
      type,
      pitches,
      stars,
      latitude,
      longitude,
      img_medium
    } = request.body;
    sqlSafeValues = [api_id, location, name, type, pitches, stars, latitude, longitude, img_medium];
    return sqlSafeValues;
  }
  case 'mtn_biking':
  {
    let {
      api_id,
      location,
      name,
      type,
      difficulty,
      stars,
      latitude,
      longitude,
      img_medium,
      summary,
      length
    } = request.body;
    sqlSafeValues = [api_id, location, name, type, difficulty, stars, latitude, longitude, img_medium, summary, length];
    return sqlSafeValues;
  }
  }
};

module.exports.saveActivity = saveActivity;
module.exports.showFavorites = showFavorites;
module.exports.updateNote = updateNote;
module.exports.deleteFavorite = deleteFavorite;
