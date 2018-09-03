const express = require('express');
const httpsRedirect = require('express-https-redirect');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const paths = require('../config/paths');
const axios = require('axios').default.create();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = encodeURIComponent('http://d8e0d68e.ngrok.io/discord/code');
const SCOPES = encodeURIComponent("identify");

function addIpAddress(_global, ip, user, callback) {
  const doc = {
    ip,
    user,
    timestamp: Date.now()
  };

  _global.db.collection('ips').updateOne(
    {
      ip: doc.ip // query for documents with this ip
    },
    {
      $setOnInsert: doc // only set doc if an insert
    },
    { upsert: true }, // insert if not exists
    function (err, result) {
      if (err) throw err;
      callback && callback();
    }
  );
}

function authenticate(token) {
  return axios({
    method: 'get',
    url: 'https://discordapp.com/api/users/@me',
    headers: { "authorization": `Bearer ${token}` }
  });
}

module.exports = function configureApp(_global, fetchSheetData) {

  function restrict(req, res, next) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip);
    try {
      if (req.session.guest) {
        addIpAddress(_global, ip, "guest");
        return next();
      } else if (req.session.token) {
        authenticate(req.session.token).then(result => {
          const { username, discriminator, id } = result.data;
          addIpAddress(_global, ip, { username, discriminator, id });
          return next();
        });
      } else {
        throw new Error("no token")
      }
    } catch (err) {
      console.log("bad session", err.message);
      return res.sendStatus(401);      
    }
  }

  const app = express();

  app.use('/', httpsRedirect());

  app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ db: _global.db })
  }));

  app.use(express.static(paths.appBuild));
  // Priority serve any static files.  

  app.get('/profile', function (req, res) {
    console.log("get profile");
    return res.send(req.session);
  });

  // Answer API requests.
  app.get('/data', restrict, async function (req, res) {
    // console.log("RECEIVED REQUEST");
    res.set('Content-Type', 'application/json');
    // res.setHeader('Cache-Control', 'public, max-age=31557600'); // one year
    try {
      const data = await fetchSheetData();
      _global.data = data;
      res.send(JSON.stringify({
        items: _global.data,
        updated: _global.lastUpdated
      }));
    } catch (err) {
      // send existing data
      res.send(JSON.stringify({
        items: _global.data,
        updated: _global.lastUpdated
      }));
    }
  });

  app.get('/auth', function (req, res) {
    res.redirect(`https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&scope=${SCOPES}`);
  });

  // Answer API requests.
  app.get('/discord/code', async function (req, res) {
    const code = req.query.code;
    // No code (user pressed cancel)
    if (!code) {
      return res.redirect("/");
    }

    try {
      const token = await axios({
        method: 'post',
        url: `https://discordapp.com/api/v6/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${REDIRECT_URL}&scopes=${SCOPES}`,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        auth: {
          username: CLIENT_ID,
          password: CLIENT_SECRET
        }
      });

      /* https://discordapp.com/developers/docs/resources/user#user-object */
      const identity = await authenticate(token.data["access_token"]);
      const { username, discriminator, avatar, id } = identity.data;
      // res.send(identity);
      // console.log(identity);
      res.send(`Logged in as: ${username}#${discriminator}`);
    } catch (err) {
      console.error(err);
      return res.redirect("/");
    }
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function (request, response) {
    console.log("sending index");
    response.sendFile(path.resolve(paths.appBuild, 'index.html'));
  });

  return app;
}