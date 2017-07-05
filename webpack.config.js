var webpack = require('webpack')
var path = require('path')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
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
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use:[{
          loader: "babel-loader",
          options: {
            presets:["react", "es2015", "stage-0"],
            plugins: [
              "babel-plugin-transform-decorators-legacy"
            ]
          }
        }]
      },
      {
        test: /\.styl$/,
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
        // use: ExtractTextPlugin.extract({
        //   fallback: "style-loader",
        //   publicPath: '/',
        //   use: ['stylus-loader', 'css-loader']
        // })
      }
    ]
  },
  resolve:{
    extensions:['.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    // new ExtractTextPlugin({
    //   filename:  (getPath) => {
    //     return getPath('[name].css')
    //   },
    //   allChunks: true
    // }),
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
      chunks: ['index'],
      inject: 'body' // Inject all scripts into the body 

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
