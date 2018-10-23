const axios = require('axios').default;
const cheerio = require('cheerio');
const sizeOf = require('image-size');

const NON_IMAGE_COMMANDS = {
  "UNKNOWN COMMAND": true,
  "?welcomehome": true,
  "?unitedspaceventures": true
};

function getStaticImageHeaders(url) {
  return new Promise(function (resolve, reject) {
    axios({
      url,
      method: 'get',
      responseType: 'stream',
    }).then(function (response) {
      resolve(response.headers);
    }).catch(err => {
      reject(err);
    })
  });
}

function getImageMetadataStream(url) {
  return new Promise(function (resolve, reject) {
    axios({
      url,
      method: 'get',
      responseType: 'stream',
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

function getImageMetadata(url) {
  return new Promise(function (resolve, reject) {
    axios({
      url,
      method: 'get',
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      }
    }).then(function (response) {
      if (response.status != 200 || response.headers['content-type'] != 'text/html; charset=UTF-8') {
        getImageMetadataStream(url).then(result => {
          resolve(result);
        }).catch(err => {
          reject(err);
        });
        return;
      }
      const $ = cheerio.load(response.data);
      const { 0: width, 2: height, 4: type } = $("#download").attr("title").split(" ");
      getStaticImageHeaders(url).then(({ "last-modified": lastModified }) => {
        resolve({
          lastModified,
          width,
          height,
          type
        });
      });
    });
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