const mongo = require('mongodb');
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
const GoogleSpreadsheet = require('google-spreadsheet');
const async = require('async');
const processUrls = require('./imageUtils');
const configureApp = require('./configureApp');
const isEqual = require('lodash/isEqual');

const MongoClient = mongo.MongoClient;
const mongo_url = process.env.MONGODB_URI;
const commandCollection = process.env.NODE_ENV === "production" ? "commands" : "test_commands";
const ss_key = process.env.NODE_ENV === "production" ? '1v2R7KnoheXKbceBzJyj9c5n5m2BM1ELNXg8A7xEY0gg' : '1KaFqCNbLuMRa2prpDzyBITS8Txk9AxZX7nPZzp3WHLE';
const doc = new GoogleSpreadsheet(ss_key);
const PORT = process.env.PORT || 5000;
const creds = {
  client_email: process.env.CLIENT_EMAIL,
  private_key: JSON.parse(process.env.PRIVATE_KEY)[0]
};

const _global = {
  /** @type {any} */
  sheet: null,
  /** @type {String} */
  lastUpdated: "",
  /** @type {Object} */
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
              rows.filter(row => row.url != null && row.command != null).map(row => {
                return {
                  url: row.url,
                  command: row.command.split(',').map(cmd => cmd.trim()),
                  leadsto: row.leadsto.split(',').filter(lead => lead !== "").map(lead => lead.trim()),
                  fannames: row.fannames.split(',').filter(name => name !== "").map(name => name.trim()),
                  id1: row.url.split("/image/")[1].replace("/", ""),
                }
              })
            );
        });
      }
    ], (err, result) => {
      if (err) {
        console.log("sheet up to date: " + _global.lastUpdated);
        resolve(_global.data);
      } else {
        // data was changed or server first init
        // result[1] is result of step 1
        resolve(result[1]);
      }
    });
  });
}

function authenticateGoogleSheet(cb) {
  console.log("authenticating google sheet...");
  doc.useServiceAccountAuth(creds, cb, fetchSheetData);
}

// function itemsEqual(item1, item2) {
//   return isEqual(item1.fannames, item2.fannames) &&
//     isEqual(item1.leadsto, item2.leadsto) &&
//     isEqual(item1.command, item2.command) &&
//     isEqual(item1.url, item2.url);
// }

MongoClient.connect(mongo_url, { useNewUrlParser: true }, function (err, client) {
  if (err) {
    console.error(err);
  }

  console.log("connected to mongo database");
  _global.client = client;
  _global.db = client.db();

  const query = { deleted: { $in: [null, false] } };
  const options = { projection: { '_id': 0, 'deleted': 0 } };
  _global.db.collection(commandCollection).find(query, options).toArray().then(data => {
    _global.data = {};
    data.forEach(image => {
      _global.data[image.id1] = image;
    });

    _global.app = configureApp(_global, fetchSheetData);

    authenticateGoogleSheet(async function () {
      const rows = await fetchSheetData();
      // const existing = Object.values(_global.data);

      const changed = [];
      const added = [];
      const removed = [];

      const rowsMap = {};
      rows.forEach(row => {
        const existingImage = _global.data[row.id1];
        if (!existingImage) {
          added.push(row);
        } else {
          if (!(isEqual(existingImage.fannames, row.fannames) &&
            isEqual(existingImage.leadsto, row.leadsto) &&
            isEqual(existingImage.command, row.command))) {
            changed.push(row);
            Object.assign(_global.data[row.id1], row);
          }
        }
        rowsMap[row.id1] = row;
      });

      Object.values(_global.data).forEach(item => {
        if (!rowsMap[item.id1]) {
          removed.push(item);
        }
      });

      const toUpdate = added.concat(changed);
      // process the added commands
      const updatedRows = await processUrls(toUpdate);
      if (updatedRows != null) {
        updatedRows.forEach(imageData => {
          if (_global.data[imageData.id1]) {
            Object.assign(_global.data[imageData.id1], imageData);
          } else {
            _global.data[imageData.id1] = imageData;
          }
        });
      }

      if (removed.length > 0 || added.length > 0 || changed.length > 0) {
        
        const bulkOp = _global.db.collection(commandCollection).initializeUnorderedBulkOp();
        removed.forEach(command => {
          bulkOp.find({ url: command.url }).updateOne({ deleted: Date.now() });
        });
        updatedRows.forEach(command => {
          bulkOp.find({ url: command.url }).upsert().updateOne({ 
            $set: { ...command, deleted: null } 
          });
        });
        bulkOp.execute().then(console.log).catch(console.error);
      }

      _global.app.listen(PORT, function () {
        console.error(`Server listening on port ${PORT}`);
      });
    });
  });
});

process.on('SIGINT', () => {
  console.log("received SIGINT");
  gracefulShutdown();
});

function gracefulShutdown() {
  console.log('Closing mongodb connection');
  _global.client.close();
  process.exit();
}