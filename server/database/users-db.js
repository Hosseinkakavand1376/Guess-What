'use strict';

// importing
const db = require('./config-db');
const crypto = require('crypto');

// finding user base on username and password for loging in
exports.findUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT rowid, password, salt, username, xp FROM users WHERE username=?';
    db.get(sql, [username], (err, row) => {
      if (err)
        resolve(false);
      else if (row === undefined)
        resolve(false);
      else {         
        const user = {xp: row.xp, username: row.username, rowid: row.rowid };
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
        if (err)
          resolve(false);
        
        if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
          resolve(false);
        else
          resolve(user);   
      }
      )};
    });
  });
};
  

// get updated user's data
exports.getUser = (rowid) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT rowid, password, salt, username, xp FROM users WHERE rowid=?';
    db.get(sql, [rowid], (err, row) => {
      if (err)
        resolve(false);
      else {         
        const user = {xp: row.xp, username: row.username, rowid: row.rowid };
        resolve(user);   
      }
    });
  });
};
  

// create a user in the db
exports.createUser = (user_data) => {  
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (firstname, lastname, username, password, salt) VALUES(?, ?, ?, ?, ?)';
    crypto.scrypt(user_data.username, 'register_secret', 32, function (err, salt) {
      if (err)
        reject(err);
      crypto.scrypt(user_data.password, salt, 32, function (err, hashedPassword) {
        if (err)
          reject(err);
        db.run(sql, [user_data.firstname, user_data.lastname, user_data.username, hashedPassword, salt], function (err) {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve({"message": "Account Registered!"});
          }
        });
      });
    });
  });
};
  