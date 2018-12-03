const axios = require('axios').default;
const cheerio = require('cheerio');
const sizeOf = require('image-size');

const NON_IMAGE_COMMANDS = {
  "UNKNOWN COMMAND": true,
  "?welcomehome": true,
  "?unitedspaceventures": true,
  "?vd4u08lhb": true,
  "?transcendingdeath": true,
  "?lookaroundyoujack": true
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

function formatBytes(bytes, decimals) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
      } else {
        const $ = cheerio.load(response.data);
        const { 0: width, 2: height, 4: type, 5: size, 6: unit } = $("#download").attr("title").split(" ");
        const downloadURL = $("#download").attr("href");
        // getStaticImageHeaders(url).then(({
        getStaticImageHeaders(downloadURL).then(({
          "last-modified": lastModified,
          "content-length": contentLength
        }) => {
          resolve({
            lastModified,
            width: parseInt(width),
            height: parseInt(height),
            type,
            postimgSize: `${size} ${unit}`,
            actualSize: formatBytes(contentLength, 1)
          });
        });
      }
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