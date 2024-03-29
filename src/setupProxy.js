const { createProxyMiddleware } = require("http-proxy-middleware");

const proxy = createProxyMiddleware(
  ["/data", "/profile", "/guest", "/updated", "/auth", "/signout"],
  {
    target: "http://localhost:5000"
  }
);

module.exports = function (app) {
  app.use(proxy);
};
