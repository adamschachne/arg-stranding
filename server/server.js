const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const paths = require('../config/paths');
const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const processUrls = require('./utils');

const doc = new GoogleSpreadsheet('1v2R7KnoheXKbceBzJyj9c5n5m2BM1ELNXg8A7xEY0gg');
const PORT = process.env.PORT || 5000;

// const creds = require('../creds/ds-image-urls.json');
const creds = {
  client_email: process.env.CLIENT_EMAIL,
  private_key: JSON.parse(process.env.PRIVATE_KEY)[0]
};

const store = {
  sheet: null,
  lastUpdated: null,
  data: null,
  updating: false,
  watchers: []
};

function doneUpdating(data) {
  if (store.watchers.length > 0) {
    while (store.watchers.length != 0) {
      store.watchers.pop()(data);
    }
  }
  store.updating = false;
  console.log("set store updating to false");
}

function fetchSheetData() {
  return new Promise((resolve, reject) => {
    if (store.updating == true) {
      console.log("pushing resolve to watchers");
      store.watchers.push(resolve);
      return;
    }
    store.updating = true;

    async.series([
      step => doc.useServiceAccountAuth(creds, step),
      step => {
        doc.getInfo(function (err, info) {
          // console.log('Loaded doc: ' + info.title + ' by ' + info.author.email + " last updated: " + info.updated);
          if (store.lastUpdated == info.updated) {
            step('already up to date');
          } else {
            store.lastUpdated = info.updated;
            store.sheet = info.worksheets[0];
            step();
          }
          // console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);          
        });
      },
      step => {
        store.sheet.getRows({
          offset: 1,
        }, function (err, rows) {
          console.log('Read ' + rows.length + ' rows');
          // // the row is an object with keys set by the column headers          
          if (err)
            step(err);
          else
            step(null, rows.map(row => {
              return {
                url: row.url,
                command: row.command
              }
            })
            .filter(row => row.url != null && row.command != null)
          );
        });
      }
    ], (err, result) => {
      if (err) {
        reject(err);
        doneUpdating(store.data);
      } else {
        processUrls(result[2], data => {
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

const app = express();

// Priority serve any static files.
// app.use(express.static(paths.appBuild));

// Answer API requests.
app.get('/data', function (req, res) {
  // res.set('Content-Type', 'application/json');
  // res.send(JSON.stringify(store.data));
  res.set('Content-Type', 'application/json');
  fetchSheetData()
    .then(data => {
      store.data = data;
      res.send(JSON.stringify(store.data));
    })
    .catch(err => {
      // send existing data
      res.send(JSON.stringify(store.data));
    })
});

// All remaining requests return the React app, so it can handle routing.
app.get('*', function (request, response) {
  response.redirect('/data');
  // response.sendFile(path.resolve(paths.appBuild, 'index.html'));
});

fetchSheetData()
  .then(data => {
    store.data = data;
    app.listen(PORT, function () {
      console.error(`Server listening on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error(err);
  });
