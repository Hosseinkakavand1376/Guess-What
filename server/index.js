/*** Importing modules ***/
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

/** Authentication-related imports **/
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)

/** Database Imports **/
const usersDB = require('./database/users-db'); // module for accessing the users table in the DB
const gameDB = require('./database/game-db'); // module for accessing the game and item tables in the DB


/*** init express and set-up the middlewares ***/
const port = 3001; // setting port

const app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUser (i.e., id, username, name).
 **/
passport.use(new LocalStrategy(async function verify(username, password, callback) {
  const user = await usersDB.findUser(username, password)
  if(!user)
    return callback(null, false, 'Incorrect username or password');  
    
  return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUser, i.e, id, username, name)
}));


// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name 
  callback(null, user);
});
  
// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name 
  // if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));

  return callback(null, user); // this will be available in req.user
});
  


/** Creating the session */
const session = require('express-session');

app.use(session({
  secret: "shhhhh... it's a secret!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({error: 'Not authorized'});
}

// CORS Settings
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));
  
// This route is used for performing login.
app.post('/api/login', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => { 
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err)
          return next(err);
        
        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser() in LocalStratecy Verify Fn
        return res.json(req.user);
      });
  })(req, res, next);
});
  
// This route checks whether the user is logged in or not.
app.get('/api/login/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});
  
// This route is used for loggin out the current user.
app.delete('/api/login/current', (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});

// This route is used for registering
app.post('/api/register', (req, res) => {
    console.log(req.body);
    usersDB.createUser(req.body).then(message => {
      res.send(message)
    }).catch(err => {
        console.log(err);
        res.send({'message': 'failed'});
        
    });
});

// This route is used for creating a new game
app.post('/api/startgame', (req, res) => {
    let user;
    if (req.user) {
      user = req.user;
    } else {
      user = {'rowid': -1} // not logged-in user
    }
    gameDB.createGame(req.body, user);
    res.send({'message': 'Done'});
});


// This route is used for finding user's runnig game
app.get('/api/game', (req, res) => {
  let user;
  if (req.user) {
    user = req.user;
  } else {
    user = {'rowid': -1} // not logged-in user
  }
    gameDB.findGame(user).then(message => res.send(message)).catch(err => {
        console.log(err);
        res.send({'message': 'failed'});        
    });
});


// This route is used for asking a question
app.post('/api/ask', (req, res) => {
    let user;
    if (req.user) {
      user = req.user;
    } else {
      user = {'rowid': -1} // not logged-in user
    }
    gameDB.ask(req.body, user).then(message => res.send(message)).catch(err => {
        console.log(err);
        res.send({'message': 'failed'});        
    });
});


// This route is used for making the final guess
app.post('/api/guess', (req, res) => {
    let user;
    if (req.user) {
      user = req.user;
    } else {
      user = {'rowid': -1} // not logged-in user
    }
    gameDB.guess(req.body, user).then(message => res.send(message)).catch(err => {
        console.log(err);
        res.send({'message': 'failed'});        
    });
});


// This route is used for getting user's info for profile
app.get('/api/profile', isLoggedIn, (req, res) => {
    gameDB.profile(req.user).then(message => res.send(message)).catch(err => {
        console.log(err);
        res.send({'message': 'failed'});        
    });
});

app.listen(port, () => console.log("Running!!!"));