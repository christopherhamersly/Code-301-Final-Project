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

const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const search = require('./modules/index.js');
const location = require('./modules/location.js');
const favorites = require('./modules/favorites.js');
const { response } = require('express');
const music = require('./modules/music.js');

app.route('/')
  .get(search.searchPage);

app.route('/location')
  .get((request, response) => location.getLocation(request, response));

app.route('/favorites')
  .post((request, response) => favorites.saveTrail(request, response))
  .get((request, response) => favorites.showFavorites(request, response));

app.route('/favorites/:api_id')
  .put((request, response) => favorites.updateNote(request, response))
  .delete((request, response) => favorites.deleteFavorite(request, response));

app.route('/music')
  .get((request, response) => music.getTunes(request, response));

client.connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on ${PORT}`);
    })
  });


app.get('/testit', getTwoArrays);
function getTwoArrays(request, response){
  response.status(200).render('testit.ejs');
}







