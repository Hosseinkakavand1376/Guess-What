'use strict';

// importing
const sqlite3 = require('sqlite3');

// connecting to db
let db = new sqlite3.Database('./database/mine.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the database.');
  });

module.exports = db;