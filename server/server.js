const express = require('express');
const path = require('path');
const mongo = require('mongodb');
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
const paths = require('../config/paths');
const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const httpsRedirect = require('express-https-redirect');
const processUrls = require('./utils');

const MongoClient = mongo.MongoClient;
const mongo_url = process.env.MONGODB_URI;
const doc = process.env.NODE_ENV === "production" ?
  new GoogleSpreadsheet('1v2R7KnoheXKbceBzJyj9c5n5m2BM1ELNXg8A7xEY0gg')
  :
  new GoogleSpreadsheet('1KaFqCNbLuMRa2prpDzyBITS8Txk9AxZX7nPZzp3WHLE');
const PORT = process.env.PORT || 5000;

// const creds = require('../creds/ds-image-urls.json');
const creds = {
  client_email: process.env.CLIENT_EMAIL,
  private_key: JSON.parse(process.env.PRIVATE_KEY)[0]
};

const _global = {
  sheet: null,
  lastUpdated: null,
  data: null,
  updating: false,
  watchers: [],
  /** @type {?mongo.MongoClient} */
  client: null,
  /** @type {?mongo.Db} */
  db: null
};

function doneUpdating(data) {
  if (_global.watchers.length > 0) {
    while (_global.watchers.length != 0) {
      console.log("resolving");
      _global.watchers.pop()(data);
    }
  }
  _global.updating = false;
}

function fetchSheetData() {
  return new Promise((resolve, reject) => {
    // if (_global.updating == true) {
    //   console.log("pushing resolve to watchers");
    //   _global.watchers.push(resolve);
    //   return;
    // }
    // _global.updating = true;
    async.series([
      /* step 0 */
      step => {
        doc.getInfo(function (err, info) {
          console.log(info.updated);
          // console.log('Loaded doc: ' + info.title + ' by ' + info.author.email + " last updated: " + info.updated);
          if (_global.lastUpdated == info.updated) {
            step('already up to date');
          } else {
            _global.lastUpdated = info.updated;
            _global.sheet = info.worksheets[0];
            step();
          }
          // console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);          
        });
      },
      /* step 1 */
      step => {
        _global.sheet.getRows({
          offset: 1,
        }, function (err, rows) {
          console.log('Read ' + rows.length + ' rows');
          // // the row is an object with keys set by the column headers          
          if (err)
            step(err);
          else
            step(null,
              rows.map(row => {
                return {
                  url: row.url,
                  command: row.command,
                  leadsto: row.leadsto,
                  fannames: row.fannames
                }
              }).filter(row => row.url != null && row.command != null)
            );
        });
      }
    ], (err, result) => {
      if (err) {
        console.log("sheet up to date: " + _global.lastUpdated + " sending existing content.");
        reject(err);
        doneUpdating(_global.data); // maybe send a reject instead of resolving with null
      } else {
        // result[1] is result of step 1
        processUrls(result[1], data => {
          if (data == null) {
            reject();
          } else {
            resolve(data);
            // resolve any additional requests that came in during the update
            doneUpdating(data);
          }
        });
      }
    });
  });
}

function authenticate(cb) {
  console.log("authenticating google sheet...");
  doc.useServiceAccountAuth(creds, cb);
}

const app = express();
app.use('/', httpsRedirect());
// Priority serve any static files.
app.use(express.static(paths.appBuild));

app.use(function (req, res, next) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  addIpAddress(ip);
  next();
})

// Answer API requests.
app.get('/data', function (req, res) {
  // console.log("RECEIVED REQUEST");
  res.set('Content-Type', 'application/json');
  // res.setHeader('Cache-Control', 'public, max-age=31557600'); // one year
  fetchSheetData().then(data => {
    _global.data = data;
    res.send(JSON.stringify({
      items: _global.data,
      updated: _global.lastUpdated
    }));
  }).catch(err => {
    // send existing data
    res.send(JSON.stringify({
      items: _global.data,
      updated: _global.lastUpdated
    }));
  });
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
  response.sendFile(path.resolve(paths.appBuild, 'index.html'));
});

MongoClient.connect(mongo_url, { useNewUrlParser: true }, function (err, client) {
  if (err) {
    console.error(err);
  }

  console.log("connected to mongo database");
  _global.client = client;
  _global.db = client.db();

  authenticate(function () {
    fetchSheetData().then(data => {
      _global.data = data;
      app.listen(PORT, function () {
        console.error(`Server listening on port ${PORT}`);
      });
    }).catch(err => {
      console.debug(err);
      app.listen(PORT, function () {
        console.error(`Server listening on port ${PORT}`);
      });
    });
  });
});

function addIpAddress(ip, callback) {
  console.log(ip);
  const doc = {
    ip,
    timestamp: Date.now()
  };
 
  _global.db.collection('ips').update(
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

process.on('SIGINT', () => {
  console.log("received SIGINT");
  gracefulShutdown();
});

function gracefulShutdown() {
  console.log('Closing mongodb connection');
  _global.client.close();
  process.exit();
}