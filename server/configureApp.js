const express = require('express');
const httpsRedirect = require('express-https-redirect');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const paths = require('../config/paths');

module.exports = function configureApp(_global, fetchSheetData) {

  const app = express();

  app.use('/', httpsRedirect());

  app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ db: _global.db })
  }));

  // Priority serve any static files.
  app.use(express.static(paths.appBuild));

  app.use(function (req, res, next) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    addIpAddress(ip);
    next();
  })

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

  // Answer API requests.
  app.get('/auth', function (req, res) {
    const code = req.query.code;
    console.log(code);
    // do things with code
    // res.redirect('/');
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function (request, response) {
    console.log("hows it goin");
    response.sendFile(path.resolve(paths.appBuild, 'index.html'));
  });

  return app;
}