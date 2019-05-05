const ngrok = require("ngrok");
const url = require("url");

function startNgrok() {
  return new Promise((resolve, reject) => {
    ngrok.connect({
      addr: process.env.PORT || 5000, // port or network address, defaults to 80
    }).then(ngrokUrl => {
      const redirect = url.resolve(ngrokUrl, "/discord");
      console.log("OAuth2 Redirect URL: ", redirect);
      resolve(redirect);
    }).catch(err => {
      reject(err);
    })
  })
}

module.exports = startNgrok;
