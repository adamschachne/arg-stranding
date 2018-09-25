const isEqual = require('lodash/isEqual');
const processUrls = require('./imageUtils');

const commandCollection = process.env.NODE_ENV === "production" ? "commands" : "test_commands";

module.exports = async function updateData(_global, rows) {

  const changed = [];
  const added = [];
  const removed = [];
  const rowsMap = {};

  rows.forEach(row => {
    const existingImage = _global.data[row.id];
    if (!existingImage) {
      added.push(row);
    } else {
      if (!(isEqual(existingImage.fannames, row.fannames) &&
        isEqual(existingImage.leadsto, row.leadsto) &&
        isEqual(existingImage.command, row.command))) {
        changed.push(row);
        Object.assign(_global.data[row.id], row);
      }
    }
    rowsMap[row.id] = row;
  });

  Object.values(_global.data).forEach(item => {
    if (!rowsMap[item.id]) {
      removed.push(item);
    }
  });

  const toUpdate = added.concat(changed);
  // process the added commands
  const updatedRows = await processUrls(toUpdate);
  if (updatedRows != null) {
    updatedRows.forEach(imageData => {
      if (_global.data[imageData.id]) {
        Object.assign(_global.data[imageData.id], imageData);
      } else {
        _global.data[imageData.id] = imageData;
      }
    });
  }

  if (removed.length > 0 || added.length > 0 || changed.length > 0) {
    const bulkOp = _global.db.collection(commandCollection).initializeUnorderedBulkOp();
    removed.forEach(command => {
      bulkOp.find({ url: command.url }).updateOne({
        $set: { deleted: Date.now() }
      });
    });
    updatedRows.forEach(command => {
      bulkOp.find({ url: command.url }).upsert().updateOne({
        $set: { ...command, deleted: null }
      });
    });
    bulkOp.execute().then(console.log).catch(console.error);
  }
}
