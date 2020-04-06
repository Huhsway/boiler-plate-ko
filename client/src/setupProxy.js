const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000', // 프론트는 3000인데 백엔드는 5000이기 때문에
      changeOrigin: true,
    })
  );
};