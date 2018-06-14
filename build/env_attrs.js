var webpack = require('webpack')
var _ = require('lodash')
var path = require('path')
  , autoprefix = require('autoprefixer')
  , Memfs = require('webpack-memory2fs-plugin')
  , HtmlWebpackPlugin = require('html-webpack-plugin')
  , getEntryTrunks = require('./util/entry');
  
  // , Memfs = require('./plugins/memfs')

  


function getTrunks(src, opts) {
  let dfts = {
    type: 'js',
  }
  dfts = _.merge(dfts, opts)
  return getEntryTrunks(src, dfts)
}

const isDev = true
const DIST = path.join(__dirname, '../dist')
const DEVDIST = isDev ? path.join(DIST, 'dev') : path.join(DIST, 'pro')
const TARGETDIST = isDev ? DEVDIST : DIST

module.exports = function envConfig(name, param, param1) {

  const isDev = true

  switch (name) {
    case 'mode':
      return 'development'
      break;



      
    case 'entries':
      let trunks = getTrunks(param, param1)
      Object.keys(trunks).forEach((trunkName, ii) => {
        let val = trunks[trunkName]
        if (isDev) {
          trunks[trunkName] = [
            'react-hot-loader/patch',
            'webpack/hot/only-dev-server',
            'webpack-dev-server/client?https://0.0.0.0:3000',
          ].concat(val)
        }
      })
      return trunks
      break;




    case 'watch':
      return false
      break;




    case 'devtool':
      return 'cheap-source-map'
      break;






    case 'output':
      return {
        path: path.join(TARGETDIST),
        filename: 'js/[name].js',
      }
      break;





    case 'stylus': // stylus loader
      const cssInlineLoaders = param
      if (isDev) {
        cssInlineLoaders.unshift('css-hot-loader')
      }
      return cssInlineLoaders
      break;





    case 'styl': // styl loader
      const cssLoaders = param
      if (isDev) {
        cssLoaders.unshift('css-hot-loader')
      }
      return cssLoaders
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
          new Memfs({
            mapfile: {
              js: /\.js(x?)/,
              css: ['.css'],
              html: /\.html/
            }
          })
        ])
      }
      return commonPlugins
      break;




    default:
      break;
  }
}