const express = require('express');
const fs = require('fs');
const historyApiFallback = require('connect-history-api-fallback');
const mongoose = require('mongoose');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

var https = require('https');

const config = require('../config/config');
const webpackConfig = require('../webpack.config');

var privateKey = fs.readFileSync('server/sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('server/sslcert/server.crt', 'utf8');

const isDev = process.env.NODE_ENV !== 'production';
const port  = process.env.PORT || 8080;


// Configuration
// ================================================================================================

// Set up Mongoose
mongoose.connect(isDev ? config.db_dev : config.db);
mongoose.Promise = global.Promise;

var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


// API routes
require('./routes')(app);

if (isDev) {
  const compiler = webpack(webpackConfig);

  app.use(historyApiFallback({
    verbose: false
  }));

  app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: path.resolve(__dirname, '../client/public'),
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  }));

  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.resolve(__dirname, '../dist')));
} else {
  app.use(express.static(path.resolve(__dirname, '../dist')));
  app.get('*', function (req, res) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
    res.end();
  });
}

var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(8443);

app.listen(port, '0.0.0.0', (err) => {
  if (err) {
    console.log(err);
  }

  console.info('>>> ?? Open http://0.0.0.0:%s/ in your browser.', port);
});

module.exports = app;
