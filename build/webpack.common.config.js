var webpack = require('webpack')
var path = require('path')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
  , envAttributs = require('./env_attrs')


module.exports = commonConfig = {
  mode: envAttributs('mode'),
  entry: {
    precommon: ['./src/js/common']
  },
  devtool: envAttributs('devtool'),
  output: envAttributs('output'),
  module: {
    rules: [{
      test: /\.js(x?)$/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ["env", "react", "stage-0"],
        }
      },
      exclude: /node_modules/,
    }]
  }
}