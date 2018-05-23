var os = require('os')
var fs = require('fs')
var del = require('del')
var chalk = require('chalk')
var webpack = require('webpack')
var path = require('path')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
  , MiniCssExtractPlugin = require('mini-css-extract-plugin')
  , HappyPack = require('happypack')
  , envAttributs = require('./env_attrs')
  , alias = require('./webpack.alias.config')
  , Concat = require('./plugins/concat')
  , Memfs = require('./plugins/memfs')
  // , Memfs = require('webpack-memory2fs-plugin')
  , happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });  // 构造一个线程池

const isDev = true
const DIST = path.join(__dirname, '../dist')
const DEVDIST = path.join(DIST, 'dev')
const SRC = path.join(__dirname, '../src')
const TARGETDIST = isDev ? DEVDIST : DIST

del.sync([
  TARGETDIST + '/css/***',
  TARGETDIST + '/html/**',
  TARGETDIST + '/js/*',
  TARGETDIST + '/*.hot-update.*',
  '!' + (TARGETDIST + '/js/precommon.*'),
])


const normallizeConfig = {
  mode: envAttributs('mode'),
  entry: envAttributs('entries', [path.join(SRC, 'js/index.js')]),
  watch: envAttributs('watch'),
  cache: true,
  watchOptions: {
    ignored: /\/node_modules\/.*/,
    aggregateTimeout: 300,
    poll: 1000
  },
  devtool: envAttributs('devtool'),
  output: envAttributs('output'),
  optimization: {
    noEmitOnErrors: true,
    namedModules: true,
    splitChunks: {
      cacheGroups: {
        // common: { // 抽离第三方插件
        //   test: /node_modules/, // 指定是node_modules下的第三方包
        //   chunks: 'initial',
        //   name: 'common', // 打包后的文件名，任意命名    
        //   priority: 10 // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
        // },
        // utils: { // 抽离自己写的公共代码，utils这个名字可以随意起
        //   chunks: 'all',
        //   name: 'utils', // 任意命名
        //   minChunks: 2, // 只要超出0字节就生成一个新包
        //   priority: 5
        // },
        common: { // 抽离自己写的公共代码，utils这个名字可以随意起
          test: /\.js(x?)/,
          chunks: 'all',
          name: 'common', // 任意命名
          minSize: 0, // 只要超出0字节就生成一个新包
          priority: 10
        }
      }
    },
    occurrenceOrder: true
  },
  module: {
    rules: [
    {
      test: /\.html/,  // 配合htmlwebpackplugin
      use: {
        loader: 'html-loader',
        options: { interpolate: true }
      }
    }, 
    { 
      test: /\.js(x?)$/,
      use: [{ 
        loader: 'happypack/loader', 
        options: { id: 'babel' } 
      }],
      exclude: /node_modules/,
    }, 
    { 
      test: /\.stylus/,
      use: envAttributs('stylus', [
        MiniCssExtractPlugin.loader,
        { loader: 'css-loader',
          options: { importLoaders: 2 }
        }, 
        'postcss-loader',
        'stylus-loader'
      ])
    }, 
    { 
      test: /\.styl$/,
      use: envAttributs('styl', [
        'style-loader', 
        { loader: 'css-loader',
          options: { importLoaders: 2 }
        }, 
        'postcss-loader',
        'stylus-loader'
      ])
    }]
  },
  resolve: {
    alias: alias,
    extensions: ['.js', '.styl', '.stylus', '.css', '.jsx', '.json', '.md']
  },
  plugins: envAttributs('plugins', [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/[id].css"
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
    new Concat(),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      title: 'Custom template',
      template: 'src/assets/html/my-index.html', // Load a custom template 
      inject: 'body', // Inject all scripts into the body 
      chunks: ['common', 'index'],
      filename: 'html/index.html',
    }),
  ])
}

if (!fs.existsSync(TARGETDIST+'/js/precommon.js')){
  console.error(chalk.yellow.bold('common.js文件不存在，请运行 yarn start'));
  process.exit()
}

module.exports = normallizeConfig
