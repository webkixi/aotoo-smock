var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack');
var configs = require('./webpack.config');
var path = require('path')

var compiler = webpack(configs)

new WebpackDevServer( compiler, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  },
  compress: true,
  noInfo: false,
  overlay: {
    warnings: true,
    errors: true
  },
  contentBase: configs.output.path,
  publicPath: '/',
  hot: true,
  inline: true,
  historyApiFallback: true,
  staticOptions: {
    redirect: false
  },
  host: '0.0.0.0',
  port: 8300,
  clientLogLevel: "info",
  stats: { colors: true },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  watchContentBase: true
}).listen(8300, 'localhost', function (err, result) {
  if (err) {
　　return console.log(err);
　}
　console.log('Listening at http://localhost:3000/');
});
