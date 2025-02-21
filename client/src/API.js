const SERVER_URL = 'http://localhost:3001/api/';

/**
 * A utility function for parsing the HTTP response.
 */
function getJson(httpResponsePromise) {
    // server API always return JSON, in case of error the format is the following { error: <message> } 
    return new Promise((resolve, reject) => {
      httpResponsePromise
        .then((response) => {
          if (response.ok) {
  
           // the server always returns a JSON, even empty {}. Never null or non json, otherwise the method will fail
           response.json()
              .then( json => resolve(json) )
              .catch( err => reject({ error: "Cannot parse server response" }))
  
          } else {
            // analyzing the cause of error
            response.json()
              .then(obj => 
                reject(obj)
                ) // error msg in the response body
              .catch(err => reject({ error: "Cannot parse server response" })) // something else
          }
        })
        .catch(err => 
          reject({ error: err  })
        ) // connection error
    });
  }


/**
 * This function wants username and password inside a "data" object.
 * It executes the log-in.
 */
const logIn = async (data) => {
  return getJson(
    fetch(SERVER_URL + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
      body: JSON.stringify(data),
    })
  )
};


/**
 * This function wants firstname, lastname, username and password inside a "data" object.
 * It executes the register.
 */
const register = async (data) => {
  return getJson(
    fetch(SERVER_URL + 'register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
      body: JSON.stringify(data),
    })
  )
};

/**
 * It executes the log-out.
 */
const logOut = async () => {
  return getJson(
    fetch(SERVER_URL + 'login/current', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    })
  )
};

/**
 * It gets user's profile data.
 */
const profile = async () => {
  return getJson(
    fetch(SERVER_URL + 'profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    })
  )
  
};

/**
 * It gets user's data.
 */
const userInfo = async () => {
  return getJson(
    fetch(SERVER_URL + 'login/current', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    })
  )
  
};

/**
 * This function wants game difficulty inside a "data" object.
 * It executes the creation of a game.
 */
const startGame = async (data) => {
  return getJson(
    fetch(SERVER_URL + 'startgame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
      body: JSON.stringify(data),
    })
  )  
};


/**
 * It finds current playing game.
 */
const findGame = async () => {
  return getJson(
    fetch(SERVER_URL + 'game', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
    })
  )  
};


/**
 * This function wants question, answer and gameid inside a "data" object.
 * It executes asking a question.
 */
const ask = async (data) => {
  return getJson(
    fetch(SERVER_URL + 'ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
      body: JSON.stringify(data),
    })
  )  
};

/**
 * This function wants gameid and the guess inside a "data" object.
 * It executes making the final guess .
 */
const guess = async (data) => {
  return getJson(
    fetch(SERVER_URL + 'guess', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // this parameter specifies that authentication cookie must be forwared
      body: JSON.stringify(data),
    })
  )  
};

const API = {logIn, profile, logOut, userInfo, register, startGame, findGame, ask, guess};
export default API;
