const axios = require('axios');
const sizeOf = require('image-size');

const NON_IMAGE_COMMANDS = {
  "UNKNOWN COMMAND": true,
  "?welcomehome": true,
  "?unitedspaceventures": true
};

function getImageMetadata(url) {
  return new Promise(function (resolve, reject) {
    axios({
      url,
      method: 'get',
      responseType: 'stream'
    }).then(function (response) {
      const metadata = {
        lastModified: response.headers["last-modified"]
      };
      const chunks = [];
      response.data.on('data', function (chunk) {
        chunks.push(chunk);
      }).on('end', function () {
        try {
          const buffer = Buffer.concat(chunks);
          const size = sizeOf(buffer);
          Object.assign(metadata, size);
          resolve(metadata);
        } catch (err) {
          reject(err.message);
        }
      }).on('error', function (error) {
        reject(error);
      });
    })
  });
}

module.exports = function processUrls(urls) {
  return new Promise(resolve => {

    if (!urls || urls.length === 0) {
      resolve(null);
      return;
    }

    // const urls = urls.slice();
    let completed = 0;
    console.log("getting postimg information...");
    urls.forEach(async urlItem => {
      try {
        // only do this stuff for real image commands
        if (!NON_IMAGE_COMMANDS[urlItem.command[0]]) {
          const metadata = await getImageMetadata(urlItem.url);
          Object.assign(urlItem, metadata)
          urlItem.lastModifiedUnix = Date.parse(metadata.lastModified);
        }
        if (++completed == urls.length) {
          resolve(urls);
        }
      } catch (error) {
        console.error(error);
        resolve(null);
      }
    });
  });
}
