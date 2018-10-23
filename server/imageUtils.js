const axios = require('axios').default;
const sizeOf = require('image-size');
const request = require('request');
const cheerio = require('cheerio');

const NON_IMAGE_COMMANDS = {
  "UNKNOWN COMMAND": true,
  "?welcomehome": true,
  "?unitedspaceventures": true
};

// function getImageMetadata(url) {
//   return new Promise(function (resolve, reject) {
//     axios({
//       url,
//       method: 'get',
//       responseType: 'stream',
//     }).then(function (response) {
//       const metadata = {
//         lastModified: response.headers["last-modified"]
//       };
//       const chunks = [];
//       response.data.on('data', function (chunk) {
//         chunks.push(chunk);
//       }).on('end', function () {
//         try {
//           const buffer = Buffer.concat(chunks);
//           const size = sizeOf(buffer);
//           Object.assign(metadata, size);
//           resolve(metadata);
//         } catch (err) {
//           reject(err.message);
//         }
//       }).on('error', function (error) {
//         reject(error);
//       });
//     })
//   });
// }

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
      console.log(response.headers);
    });
    //   url,
    //   method: 'GET',
    //   followAllRedirects: true,
    //   maxRedirects: 100,
    //   followRedirect: true,
    //   headers: {
    //     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0",
    //     "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    //   }
    // }, (error, response, body) => {
    //   console.log(body);
    // })
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

getImageMetadata("https://s9.postimg.cc/94jkyroq7/fourhundredthirtytwo.png").then(value => {
  console.log(value);
})

// const https = require("https");
// const options = {
//   hostname: 's9.postimg.cc',
//   port: 443,
//   path: '/94jkyroq7/fourhundredthirtytwo.png',
//   method: 'GET',
//   headers: {
//     "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0",
//     Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
//   }
// };

// const req = https.request(options, (res) => {
//   console.log('statusCode:', res.statusCode);
//   console.log('headers:', res.headers);

//   // res.on('data', (d) => {
//   //   process.stdout.write(d);
//   // });
// });

// req.on('error', (e) => {
//   console.error(e);
// });
// req.end();