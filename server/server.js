const mongo = require("mongodb");
const GoogleSpreadsheet = require("google-spreadsheet");
const configureApp = require("./configureApp");
const fetchSheetData = require("./fetchSheetData");
const updateData = require("./updateData");

const isProductionEnv = process.env.NODE_ENV === "production";
const MongoClient = mongo.MongoClient;
const mongo_url = process.env.MONGODB_URI;
const commandCollection = isProductionEnv ? "commands" : "test_commands";
const ss_key = process.env.SHEET_ID;
const PORT = process.env.PORT || 5000;
const creds = {
  client_email: process.env.CLIENT_EMAIL,
  private_key: JSON.parse(process.env.PRIVATE_KEY)[0]
};

const _global = {
  doc: new GoogleSpreadsheet(ss_key),
  /** @type {any} */
  sheet: null,
  /** @type {String} */
  lastUpdated: "",
  /** @type {Object} */
  data: null,
  /** @type {Array} */
  sortedData: null,
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

function authenticateGoogleSheet(cb) {
  console.log("authenticating google sheet...");
  _global.doc.useServiceAccountAuth(creds, cb);
}

MongoClient.connect(mongo_url, { useNewUrlParser: true }, (err, client) => {
  if (err) {
    console.error("Failed to connect to mongodb.\n", err);
    return;
  }

  console.log("connected to mongo database");
  _global.client = client;
  _global.db = client.db();

  const query = { deleted: { $in: [null, false] } };
  const options = { projection: { '_id': 0, 'deleted': 0 } };
  _global.db.collection(commandCollection).find(query, options).toArray().then((data) => {
    _global.data = {};
    data.forEach(image => {
      _global.data[image.id] = image;
    });
    _global.app = configureApp(_global, fetchSheetData);

    authenticateGoogleSheet(async function () {
      const rows = await fetchSheetData(_global);
      // const existing = Object.values(_global.data);

      await updateData(_global, rows);

      _global.app.listen(PORT, function () {
        console.error(`Server listening on port ${PORT}`);
      });
    });
  });
});

process.on("SIGINT", () => {
  console.log("received SIGINT");
  console.log("Closing mongodb connection");
  if (_global.client) {
    _global.client.close();
  }
  process.exit();
});
