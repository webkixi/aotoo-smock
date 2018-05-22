var webpack = require('webpack')
var path = require('path')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  HappyPack = require('happypack'),
  Concat = require('./plugins/concat'),
  Memfs = require('webpack-memory2fs-plugin'),
  os = require('os'),
  happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length }) // 构造一个线程池

const isDev = true
const DIST = path.join(__dirname, '../dist')
const DEVDIST = path.join(DIST, 'dev')
const TARGETDIST = isDev ? DEVDIST : DIST

module.exports = function envConfig(name, param) {

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
        path: path.join(TARGETDIST),
        filename: 'js/[name].js',
        // publicPath: '/'
      }
      break;





    case 'stylus': // stylus loader
      const cssLoaders = param
      if (isDev) {
        cssLoaders.unshift('css-hot-loader')
      }
      return cssLoaders
      break;





    case 'styl': // styl loader
      const cssInlineLoaders = param
      if (isDev) {
        cssInlineLoaders.unshift('css-hot-loader')
      }
      return cssInlineLoaders
      break;





    case 'plugins':
      const commonPlugins = param
      if (isDev) {
        return commonPlugins.concat([
          new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            '__DEV__': true
          }),
          // new webpack.NamedModulesPlugin(),
          new webpack.HotModuleReplacementPlugin(),
          new Memfs()
        ])
      }
      return commonPlugins
      break;




    default:
      break;
  }
}