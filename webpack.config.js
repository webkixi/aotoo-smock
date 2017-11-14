var webpack = require('webpack')
var path = require('path')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var DIST = path.join(__dirname, 'dist')

module.exports = {
  entry: {
    common: [
      'babel-polyfill',
      'aotoo',
      'aotoo-web-widgets'
    ],
    index: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?http://localhost:8300/',
      'webpack/hot/only-dev-server',
      "./src/index.js"
    ]
  },
  watch: true,
  devtool: 'cheap-source-map',
  output: {
    path: DIST,
    filename: "[name].js",
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.js$/,
        use:[{
          loader: "babel-loader?cacheDirectory",
          options: {
            presets:["react", "es2015", "stage-0"],
          }
        }]
      },
      { test: /\.stylus/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          publicPath: '/',
          use: ['stylus-loader', 'css-loader']
        })
      },
      { test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader']
        // use: [
        //   'style-loader', 
        //   { 
        //     loader: 'css-loader', 
        //     options: { importLoaders: 1 } 
        //   }, {
        //     loader: 'postcss-loader',
        //     options: {
        //       config: {
        //         path: 'path/to/postcss.config.js'
        //       }
        //     }
        //   },
        //   'stylus-loader'
        // ]
      }
    ]
  },
  resolve:{
    extensions:['.js', '.styl', '.stylus', '.css', '.jsx', '.json', '.md']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename:  (getPath) => {
        return getPath('[name].css')
      },
      allChunks: true
    }),
    new BrowserSyncPlugin({
      proxy: {
        target: 'http://localhost:8300/',
        ws: true
      },
      logFileChanges: false,
      notify: true,
      injectChanges: true,
      host: 'localhost',
      port: 3000
    }),
    new HtmlWebpackPlugin({
      title: 'Custom template',
      template: 'src/assets/html/my-index.html', // Load a custom template 
      inject: 'body', // Inject all scripts into the body 
      chunks: ['common', 'index'],
      chunksSortMode: function (chunk1, chunk2) {
        var order = ['common', 'index'];
        var order1 = order.indexOf(chunk1.names[0]);
        var order2 = order.indexOf(chunk2.names[0]);
        return order1 - order2;
      },

      // template: path.join(__dirname, 'default_index.ejs'),
      // filename: 'index.html',
      // hash: false,
      // inject: true,
      // compile: true,
      // favicon: false,
      // minify: false,
      // cache: true,
      // showErrors: true,
      // chunks: 'all',
      // excludeChunks: [],
      // title: 'Webpack App',
      // xhtml: false
    })
  ]
}
