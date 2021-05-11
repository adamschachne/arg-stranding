const async = require('async');
const { google } = require('googleapis');
const { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } = require("google-spreadsheet");

const drive = google.drive({
  version: "v3",
  auth: new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: JSON.parse(process.env.PRIVATE_KEY)[0]
    },
    scopes: ['https://www.googleapis.com/auth/drive.metadata']
  })
});

/** @param {{ doc: GoogleSpreadsheet, sheet: GoogleSpreadsheetWorksheet }} _global */
module.exports = function fetchSheetData(_global) {
  return new Promise((resolve, reject) => {
    async.series([
      /* step 0 */
      step => {
        _global.doc.loadInfo().then(() => {
          drive.files.get({ fileId: process.env.SHEET_ID, fields: "modifiedTime" }).then((res) => {

            console.log(_global.doc.title);
            if (_global.lastUpdated == res.data.modifiedTime) {
              // step with error
              step('already up to date');
            } else {
              _global.lastUpdated = res.data.modifiedTime;
              _global.sheet = _global.doc.sheetsByIndex[0]; // first sheet
              step();
            }
          })

        })
        // _global.doc.getInfo(function (err, info) {
        //   // console.log('Loaded doc: ' + info.title + ' by ' + info.author.email + " last updated: " + info.updated);
        //   if (_global.lastUpdated == info.updated) {
        //     // step with error
        //     step('already up to date');
        //   } else {
        //     _global.lastUpdated = info.updated;
        //     _global.sheet = info.worksheets[0];
        //     step();
        //   }
        //   // console.log('sheet 1: ' + sheet.title + ' ' + sheet.rowCount + 'x' + sheet.colCount);          
        // });
      },
      /* step 1 */
      step => {
        console.log("fetching rows")
        _global.sheet.getRows({ offset: 1}).then(rows => {
          console.log('Read ' + rows.length + ' rows');
          // // the row is an object with keys set by the column headers
          step(null,
            rows.filter(row => row["URL"] != null && row["Command"] != null).map(row => {
              const urlParts = row["URL"].split(/postimg.cc\//)[1].split('/');
              return {
                url: row.URL,
                command: row["Command"].split(',').map(cmd => cmd.trim()),
                leadsto: row["Leads To"].split(',').filter(lead => lead !== "").map(lead => lead.trim()),
                fannames: row["Fan Names"].split(',').filter(name => name !== "").map(name => name.trim()),
                bruteforce: row["Brute-Forced Random Guesses"].toUpperCase().startsWith("Y"),
                id: urlParts[0],
                filename: urlParts[1]
              }
            })
          );
        });
      }
    ], (err, result) => {
      if (err) {
        // console.log("sheet up to date: " + _global.lastUpdated);
        reject("sheet up to date " + _global.lastUpdated);
      } else {
        // data was changed or server first init
        // result[1] is result of step 1
        resolve(result[1]);
      }
    });
  });
}