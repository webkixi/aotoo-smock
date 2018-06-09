const fs = require('fs')
const ejs = require('ejs')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const path = require('path')
const configs = require('./build/webpack.config')
const React = require('react')
const ReactDomServer = require('react-dom/server')
const isDev = true
const DIST = isDev ? path.join(__dirname, 'dist/dev') : path.join(__dirname, 'dist/pro')
const DISTHTML = path.join(DIST, 'html')
const DISTCSS = path.join(DIST, 'css')
const DISTJS = path.join(DIST, 'js')
const DISTIMG = path.join(__dirname, 'src')

const openBrowser = () => {
  return new BrowserSyncPlugin({
    proxy: {
      target: 'http://localhost:8300/',
      ws: true
    },
    logFileChanges: false,
    notify: false,
    // injectChanges: true,
    host: 'localhost',
    port: 3000
  }, {
    reload: false
  })
}


configs.plugins.push(openBrowser())
const compiler = webpack(configs)
new WebpackDevServer(compiler, {
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
  contentBase: DIST,
  publicPath: '/',
  hot: true,
  inline: true,
  historyApiFallback: true,
  disableHostCheck: true,
  staticOptions: {
    redirect: false
  },
  clientLogLevel: 'info',
  // progress: true,
  stats: {
    assets: false,
    cached: false,
    cachedAssets: false,
    children: false,
    chunks: false,
    chunkModules: false,
    chunkOrigins: false,
    colors: true,
    depth: false,
    entrypoints: true,
    excludeAssets: /app\/assets/,
    hash: false,
    maxModules: 15,
    modules: false,
    performance: true,
    reasons: false,
    source: false,
    timings: true,
    version: false,
    warnings: true,
  },
  host: 'localhost',
  watchContentBase: true,
  // open: true
  before: function (app) {
    app.engine('html', ejs.renderFile)
    app.set('view engine', 'html')
    app.set('views', DISTHTML)

    app.get(/\/img\/(.*)\.(ico|jpg|jpeg|png|gif)$/, function (req, res) {
      const staticPath = path.join(DISTIMG, req._parsedUrl._raw)
      if (fs.existsSync(staticPath)) {
        res.sendFile(staticPath)
      } else {
        res.status(404).send('Sorry! file is not exist.')
      }
    })

    app.get(/\/images\/(.*)\.(ico|jpg|jpeg|png|gif)$/, function (req, res) {
      const staticPath = path.join(DISTIMG, req._parsedUrl._raw)
      if (fs.existsSync(staticPath)) {
        res.sendFile(staticPath)
      } else {
        res.status(404).send('Sorry! file is not exist.')
      }
    })

    app.get('/', function(req, res) {
      const testJsx = require('./server/index')()
      res.render('index', {
        // bbcc: ReactDomServer.renderToString(<div>aabbb</div>),
        bbcc: ReactDomServer.renderToString(testJsx),
        htmlWebpackPlugin: {
          options: {title: 'smock棒棒的'}
        }
      })
    })
  },
}).listen(8300, 'localhost', function (err, result) {
  if (err) {
    return console.log(err)
  }
  console.log('Listening at http://localhost:3000/')
})
