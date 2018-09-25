const async = require('async');

module.exports = function fetchSheetData(_global) {
  return new Promise((resolve, reject) => {
    async.series([
      /* step 0 */
      step => {
        _global.doc.getInfo(function (err, info) {
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
                const urlParts = row.url.split(/postimg.cc\//)[1].split('/');
                return {
                  url: row.url,
                  command: row.command.split(',').map(cmd => cmd.trim()),
                  leadsto: row.leadsto.split(',').filter(lead => lead !== "").map(lead => lead.trim()),
                  fannames: row.fannames.split(',').filter(name => name !== "").map(name => name.trim()),
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