const express = require('express');
const httpsRedirect = require('express-https-redirect');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const path = require('path');
const paths = require('../config/paths');
const axios = require('axios').default.create();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URL = encodeURIComponent(process.env.REDIRECT_URL);
const SCOPES = encodeURIComponent("identify");

function addIpAddress(_global, ip, user, callback) {
  const doc = {
    ip,
    user,
    timestamp: Date.now()
  };

  _global.db.collection('ips').updateOne(
    {
      ip: doc.ip, // query for documents with this ip
      user: doc.user
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

  async function authMiddleware(req, res, next) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip);
    try {
      if (req.session.identity && req.session.identity.guest) {
        addIpAddress(_global, ip, "guest");
        return next();
      } else if (req.session.token) {
        const result = await authenticate(req.session.token.access_token);
        const { username, discriminator, id } = result.data;
        console.log("adding user to ip collecting");
        addIpAddress(_global, ip, { username, discriminator, id });
        return next();
      } else {
        throw new Error("no token")
      }
    } catch (err) {
      addIpAddress(_global, ip);
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
    // store: new MongoStore({ db: _global.db }),
    store: new MongoDBStore({
      uri: process.env.MONGODB_URI,
      databaseName: process.env.DATABASE_NAME,
      collection: 'sessions'
    }),
    rolling: true,
    cookie: {
      httpOnly: false,
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
  }));

  // Priority serve any static files.  
  app.use(express.static(paths.appBuild));

  // passes authMiddleware if session has a valid auth_token
  app.get('/profile', authMiddleware, function (req, res) {
    console.log("get profile");
    return res.send(req.session.identity);
  });

  // Answer API requests.
  app.get('/data', async function (req, res) {
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

  // AJAX request for guest account
  app.get('/guest', function (req, res) {

    if (req.session.identity && req.session.identity.guest) {
      return res.send({ guest: req.session.identity });
    }

    req.session.regenerate(function (err) {
      if (err) return console.error(err);

      req.session.identity = {
        guest: Date.now(),
        avatar: Math.floor(Math.random()*5)
      }

      req.session.save(function (err) {
        if (err) return console.error(err);
        return res.send({ guest: req.session.identity });
      })
    });
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
      // const { username, discriminator, avatar, id } = identity.data;

      req.session.regenerate(function (err) {
        if (err) return console.error(err);

        req.session.identity = identity.data;
        req.session.token = token.data;

        req.session.save(function (err) {
          if (err) return console.error(err);
          return res.redirect('/');
        })
      });
      // res.send(identity);
      // console.log(identity);
      // res.send(`Logged in as: ${username}#${discriminator}`);
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