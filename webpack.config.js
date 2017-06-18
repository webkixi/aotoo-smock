var webpack = require('webpack')
var path = require('path')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var DIST = path.join(__dirname, 'dist')

module.exports = {
  entry: {
    index: [
      'webpack-dev-server/client?http://localhost:3000/',
      'webpack/hot/only-dev-server',
      "./src/index.js"
    ]
  },
  watch: true,
  devtool: 'cheap-source-map',
  output: {
    path: DIST,
    filename: "[name].js",
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use:[{
          loader: "babel-loader",
          options: {
            presets:["react", "es2015", "stage-0"],
          }
        }]
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          publicPath: '/',
          use: ['css-loader', 'stylus-loader']
        })
      }
    ]
  },
  resolve:{
    extensions:['.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename:  (getPath) => {
        return getPath('[name].css')
      },
      allChunks: true
    }),
    new BrowserSyncPlugin(
      {
        proxy: {
          target: 'http://localhost:8300/',
          ws: true
        },
        host: 'localhost',
        port: 3000
      }
    )
  ]
}
