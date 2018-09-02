const mongo = require('mongodb');
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const processUrls = require('./imageUtils');
const configureApp = require('./configureApp');

const MongoClient = mongo.MongoClient;
const mongo_url = process.env.MONGODB_URI;
const ss_key = process.env.NODE_ENV === "production" ? '1v2R7KnoheXKbceBzJyj9c5n5m2BM1ELNXg8A7xEY0gg' : '1KaFqCNbLuMRa2prpDzyBITS8Txk9AxZX7nPZzp3WHLE';
const doc = new GoogleSpreadsheet(ss_key);
const PORT = process.env.PORT || 5000;

// const creds = require('../creds/ds-image-urls.json');
const creds = {
  client_email: process.env.CLIENT_EMAIL,
  private_key: JSON.parse(process.env.PRIVATE_KEY)[0]
};

const _global = {
  /** @type {any} */
  sheet: null,
  /** @type {?String} */
  lastUpdated: null,
  /** @type {any} */
  data: null,
  /** @type {?String} */
  updating: false,
  /** @type {Array} */
  watchers: [],
  /** @type {?mongo.MongoClient} */
  client: null,
  /** @type {?mongo.Db} */
  db: null,
  app: null
};

function fetchSheetData() {
  return new Promise((resolve, reject) => {
    async.series([
      /* step 0 */
      step => {
        doc.getInfo(function (err, info) {
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
        resolve(_global.data);
      } else {
        // result[1] is result of step 1
        processUrls(result[1], data => {
          if (data == null) {
            resolve(_global.data);
          } else {
            resolve(data);
          }
        });
      }
    });
  });
}

function authenticate(cb) {
  console.log("authenticating google sheet...");
  doc.useServiceAccountAuth(creds, cb, fetchSheetData);
}

MongoClient.connect(mongo_url, { useNewUrlParser: true }, function (err, client) {
  if (err) {
    console.error(err);
  }

  console.log("connected to mongo database");
  _global.client = client;
  _global.db = client.db();

  _global.app = configureApp(_global, fetchSheetData);

  authenticate(function () {
    fetchSheetData().then(data => {
      _global.data = data;
      _global.app.listen(PORT, function () {
        console.error(`Server listening on port ${PORT}`);
      });
    }).catch(err => {
      console.debug(err);
      _global.app.listen(PORT, function () {
        console.error(`Server listening on port ${PORT}`);
      });
    });
  });
});

function restrict(req, res, next) {
  if (req.session.uid) {
    next();
  } else {
    // console.log("no user");
    res.redirect('/landing');
  }
} 

function addIpAddress(ip, callback) {
  console.log(ip);
  const doc = {
    ip,
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

process.on('SIGINT', () => {
  console.log("received SIGINT");
  gracefulShutdown();
});

function gracefulShutdown() {
  console.log('Closing mongodb connection');
  _global.client.close();
  process.exit();
}