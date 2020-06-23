'use strict';

const express = require('express');
const app = express();

const pg = require('pg');
const superagent = require('superagent');
require('ejs');
require('dotenv').config();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', err => console.log(err));

const search = require('./modules/index.js');
const location = require('./modules/location.js');
const favorites = require('./modules/favorites.js');
// const trails = require('./modules/trails.js');


app.route('/')
  .get(search.searchPage);

app.route('/location')
  .get((request, response) => location.getLocation(request, response));

app.route('/favorites')
  .post((request, response) => favorites.saveTrail(request, response));

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    })
  });

