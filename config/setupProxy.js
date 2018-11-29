
const proxy = require('http-proxy-middleware')(
  [
    "/data",
    "/profile",
    "/guest",
    "/updated",
    "/auth",
  ],
  {
    target: "http://localhost:5000"
  }
);

module.exports = function (app) {
  app.use(proxy);
}
