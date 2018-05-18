var webpack = require('webpack')
var path = require('path')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
  , HappyPack = require('happypack')
  , os = require('os')
  // 构造一个线程池
  , happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

var DIST = path.join(__dirname, 'dist')

module.exports = {
  entry: {
    common: [
      'babel-polyfill',
      './src/common.js'
    ],
    index: [
      './src/index.js'
    ]
  },
  watch: true,
  devtool: 'cheap-source-map',
  output: {
    path: DIST,
    filename: '[name].js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.js$/,
        use: [
          'cache-loader',
          { loader: 'happypack/loader', options: { id: 'babel' } }
        ],
        exclude: [
          path.resolve(__dirname, "../node_modules")
        ],
      },
      // { test: /(\.ejs|\.html|\.hbs)$/,
      //   use: [{
      //     loader: "ejs-loader",
      //     options: { variable: 'data' }
      //   }]
      // },
      { test: /\.stylus/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          publicPath: '/',
          use: ['css-loader', 'stylus-loader']
        })
      },
      { test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.styl', '.stylus', '.css', '.jsx', '.json', '.md']
  },
  plugins: [
    new ExtractTextPlugin({
      filename: (getPath) => {
        return getPath('[name].css')
      },
      allChunks: true
    }),
    new HappyPack({
      id: "babel",
      verbose: true,
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [ "react", "es2015", "stage-0" ],
          }
        }
      ],
      threadPool: happyThreadPool
    }),
    // new BrowserSyncPlugin({
    //   proxy: {
    //     target: 'http://localhost:8300/',
    //     ws: true
    //   },
    //   logFileChanges: false,
    //   notify: true,
    //   injectChanges: true,
    //   host: 'localhost',
    //   port: 3000
    // }, {
    //   reload: false
    // }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      title: 'Custom template',
      template: 'src/assets/html/my-index.html', // Load a custom template 
      inject: 'body', // Inject all scripts into the body 
      chunks: ['common', 'index'],
      chunksSortMode: function (chunk1, chunk2) {
        var order = ['common', 'index']
        var order1 = order.indexOf(chunk1.names[0])
        var order2 = order.indexOf(chunk2.names[0])
        return order1 - order2
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
