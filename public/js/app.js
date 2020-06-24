'use strict';

// const express = require('express');
// const app = express();

// const pg = require('pg');
// const superagent = require('superagent');
// const { saveTrail } = require('../../modules/favorites');
// require('ejs');
// require('dotenv').config();

// const PORT = process.env.PORT || 3001;

// app.use(express.urlencoded({extended: true}));
// app.set('view engine', 'ejs');
// app.use('/public', express.static('public'));

// const client = new pg.Client(process.env.DATABASE_URL);
// client.on('error', err => console.log(err));




$(document).ready(() => {
  $('form.add-favorite').on('submit', (event) => {
    console.log(event.target);
  });
});
