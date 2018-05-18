var webpack = require('webpack')
var path = require('path')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
  , HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
  , CleanWebpackPlugin = require('clean-webpack-plugin')
  , MiniCssExtractPlugin = require('mini-css-extract-plugin')
  , HappyPack = require('happypack')
  , os = require('os')
  // 构造一个线程池
  , happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

var DIST = path.join(__dirname, 'dist')
var DEVDIST = path.join(DIST, 'dev')

let pathsToClean = [
  'dist',
  'build',
  'dev'
]

// the clean options to use
let cleanOptions = {
  root: DIST,
  exclude: [],
  verbose: true,
  dry: false
}

function envConfig(name, param) {
  const isDev = true

  switch (name) {
    case 'mode':
      return 'development'
      break;
    case 'watch':
      return true
      break;
    case 'devtool':
      return 'cheap-source-map'
      break;
    case 'output':
      return {
        path: path.join(DEVDIST, '/js'),
        filename: '[name].js',
        publicPath: '/js'
      }
      break;
    case 'stylus': // stylus loader
      const cssLoaders = param
      if (isDev) {
        cssLoaders.unshift('css-hot-loader')
      } 
      return cssLoaders
      break;
    case 'styl':  // styl loader
      const cssInlineLoaders = param
      if (isDev) {
        cssInlineLoaders.unshift('css-hot-loader')
      }
      return cssInlineLoaders
      break;
    case 'plugins':
      const commonPlugins = param
      if(isDev) {
        return commonPlugins.concat([
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NamedModulesPlugin(),
          new HtmlWebpackHarddiskPlugin({
            outputPath: path.join(DEVDIST, 'html')
          })
        ])
      } else {
        return commonPlugins
      }
      break;
    
    default:
      break;
  }
}

module.exports = {
  mode: envConfig('mode'),
  entry: {
    index: [
      'babel-polyfill',
      './src/index.js'
    ]
  },
  watch: envConfig('watch'),
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  devtool: envConfig('devtool'),
  output: envConfig('output'),
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: { // 抽离第三方插件
          test: /node_modules/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          name: 'common', // 打包后的文件名，任意命名    
          priority: 10 // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
        }
      }
    },
    occurrenceOrder: true
  },
  module: {
    rules: [{
      test: /\.html/,  // 配合htmlwebpackplugin
      use: [{
        loader: 'html-loader',
        options: {
          interpolate: true
        }
      }]
    }, { 
      test: /\.js(x?)$/,
      use: [
        { loader: 'happypack/loader', options: { id: 'babel' } }
      ],
      exclude: /node_modules/,
    }, { 
      test: /\.stylus/,
      use: envConfig('stylus', [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'stylus-loader'
      ])
    }, { 
      test: /\.styl$/,
      use: envConfig('styl', [
        'style-loader', 
        'css-loader', 
        'stylus-loader'
      ])
    }]
  },
  resolve: {
    extensions: ['.js', '.styl', '.stylus', '.css', '.jsx', '.json', '.md']
  },
  plugins: envConfig('plugins', [
    new CleanWebpackPlugin(pathsToClean, cleanOptions),
    new MiniCssExtractPlugin({
      filename: "../css/[name].css",
      chunkFilename: "../css/[id].css"
    }),
    new HappyPack({
      id: "babel",
      verbose: true,
      loaders: [
        {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: ["env", "react", "stage-0"],
          }
        }
      ],
      threadPool: happyThreadPool
    }),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
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
  ])
}
