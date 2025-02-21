'use strict';

// importing
const db = require('./config-db');
const usersDB = require('./users-db');

// creating game querys
exports.createGame = (data, user) => {
    let limit = 12;
    if (data.difficulty == 1) {
        limit = 24;
    } else if (data.difficulty == 2) {
        limit = 36;
    }

    const sql = 'SELECT rowid FROM item ORDER BY RANDOM() LIMIT ?';
    db.all(sql, [limit], (err, items_list) => {
      if (err)
        console.log(err);
      else {
        const secret_item = items_list[Math.floor(Math.random()*items_list.length)].rowid;
        let items_list_str = "";
        items_list.forEach(element => {
          items_list_str += element.rowid;
          items_list_str += ",";
        });
        items_list_str = items_list_str.slice(0, -1);
        return new Promise((resolve, reject) => {
          const sql2 = 'INSERT INTO game (id, difficulty, secret_id, user_id, state, items) VALUES (?, ?, ?, ?, ?, ?)';
          db.run(sql2, [1, data.difficulty, secret_item, user.rowid, 2, items_list_str], (err, row) => {
            if (err)
              reject(err);
            else {
              resolve({"message": "DONE!"});
            };
          });
        });
      };
    });
};
  

// finding the running game querys
exports.findGame = (user) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT items, rowid FROM game WHERE user_id=? AND state=2 ORDER BY rowid DESC';
    db.get(sql, [user.rowid], (err, row) => {
      if (err)
        reject(err);
      else {
        const sql2 = 'SELECT rowid AS id, pic FROM item WHERE rowid IN (' + row.items + ") ORDER BY RANDOM()";
        db.all(sql2, [], (err, items) => {
          if (err)
            reject(err);
          else {
            resolve({'game': row.rowid, 'items': items});        
          };
        });
      };
    });
  });
};

// asking a question querys
exports.ask = (data, user_data) => {  
  return new Promise((resolve, reject) => {    
    const sql = 'SELECT secret_id FROM game WHERE rowid=?'; // find secret
    db.get(sql, [data.game_id], (err, secret) => {
      if (err)
        reject(err);
      else {
        const sql2 = 'SELECT '+ data.q +' FROM item WHERE rowid=?'; // find answer
        db.get(sql2, [ secret.secret_id ], (err, prop) => {
          if (err)
            reject(err);
          else {
            const answer = (data.a == prop[data.q]); // compare answers
            const sql3 = 'SELECT items FROM game WHERE rowid=?'; // getting current game items 
            db.get(sql3, [data.game_id], (err, row) => {
              if (err)
                reject(err);
              else {
                let sql4;
                if (answer) 
                  sql4 = 'SELECT rowid AS id FROM item WHERE ' + data.q + ' != ' + data.a + ' AND rowid IN (' + row.items + ")"; // getting wrong items
                else
                  sql4 = 'SELECT rowid AS id FROM item WHERE ' + data.q + ' = ' + data.a + ' AND rowid IN (' + row.items + ")"; // getting wrong items

                db.all(sql4, [], (err, items) => {
                  if (err)
                    reject(err);
                  else {
                    const sql5 = 'UPDATE game SET score=score-1 WHERE rowid=?'; // modify game score
                    db.run(sql5, [data.game_id], (err, row5) => {
                      if (err)
                        reject(err);
                      else {
                        resolve({'answer': answer, 'false_items': items});
                      };
                    });
                  };
                });
              };
            });
    
          };
        });
      };
    });
  });
};  


// final guess querys
exports.guess = (data, user) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT secret_id, item.id AS secret, game.difficulty, game.score, user_id FROM game INNER JOIN item ON game.secret_id=item.rowid WHERE game.rowid=?'; // getting game data
    db.get(sql, [data.game_id], (err, row) => {
      if (err)
        reject(err);
      else {
        const guess = (data.guess == row.secret_id);
        if (guess) {
          let i_count;
          if (row.difficulty == '0') {
            i_count = 12;
          } else if (row.difficulty == '1') {
            i_count = 24;
          } else {
            i_count = 36;
          } 
          const sql2 = 'UPDATE game SET state=1, score=score+? WHERE rowid=?'; // end game and set game score
          db.run(sql2, [i_count, data.game_id], (err, row2) => {
            if (err)
              reject(err);
            else {
              if (user.rowid === -1)
                resolve({'guess': true})
              const sql3 = 'UPDATE users SET xp=xp+? WHERE rowid=?'; // modify user's XP
              console.log(i_count + row.score);
              db.run(sql3, [i_count + row.score, row.user_id], (err, row3) => {
                if (err)
                  reject(err);
                else {
                  resolve({'guess': true})
                };
              });
            };
          });
        } else {
          const sql3 = 'UPDATE game SET state=0, score=0 WHERE rowid=?'; // end game and set game score
          db.run(sql3, [data.game_id], (err, row3) => {
            if (err)
              reject(err);
            else {
              resolve({'guess': false, 'secret': row.secret})
            };
          });
        }
      };
    });
  });
};


// getting user's games and info querys
exports.profile = (user) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT item.id AS secret, game.difficulty, game.state, game.score FROM game INNER JOIN item ON game.secret_id = item.rowid WHERE user_id=? AND state!=2'; // getting user's games
    db.all(sql, [user.rowid], (err, rows) => {
      if (err)
        reject(err);
      else {
        usersDB.getUser(user.rowid).then((user2) => {
          resolve({'user': user2, 'games': rows});        
        });
      };
    });
  });
};
