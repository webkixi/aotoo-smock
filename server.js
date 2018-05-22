var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var configs = require('./build/webpack.config')
var path = require('path')
var fs = require('fs')
const ejs = require('ejs')

const DIST = path.join(__dirname, 'dist/dev')
const DISTHTML = path.join(DIST, 'html')
const DISTCSS = path.join(DIST, 'css')
const DISTJS = path.join(DIST, 'js')
const staticsPath = {
  imgroot: path.join(__dirname, 'src')
}

function queryParams (uri) {
  let [cat, title, id, ...other] = uri.substring(1).split('/')
  return { cat, title, id, other}
}

function valideExt (filename) {
  const exts = ['.html']
  let accessExt = false
  const ext = path.extname(filename)
  if (exts.indexOf(ext) > -1) {
    accessExt = true
  }
  if (!ext) accessExt = true
  return accessExt
}

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
  watchOptions: {
    ignored: /\/node_modules\/.*/,
    aggregateTimeout: 300,
    poll: 1000
  },
  host: 'localhost',
  watchContentBase: true,
  // open: true
  before: function (app) {
    app.engine('html', ejs.renderFile)
    app.set('view engine', 'html')
    app.set('views', DISTHTML)
    // app.get(/\/css\/(.*)\.css$/, function (req, res) {
    //   const staticPath = path.join(DIST, req._parsedUrl._raw)
    //   if (fs.existsSync(staticPath)) {
    //     res.sendFile(staticPath)
    //   } else {
    //     res.status(404).send('Sorry! file is not exist.')
    //   }
    // })

    // app.get(/\/js\/(.*)\.(js|json)$/, function (req, res) {
    //   const staticPath = path.join(DIST, req._parsedUrl._raw)
    //   if (fs.existsSync(staticPath)) {
    //     res.sendFile(staticPath)
    //   } else {
    //     res.status(404).send('Sorry! file is not exist.')
    //   }
    // })

    app.get(/\/img\/(.*)\.(ico|jpg|jpeg|png|gif)$/, function (req, res) {
      const staticPath = path.join(staticsPath.imgroot, req._parsedUrl._raw)
      if (fs.existsSync(staticPath)) {
        res.sendFile(staticPath)
      } else {
        res.status(404).send('Sorry! file is not exist.')
      }
    })

    app.get(/\/images\/(.*)\.(ico|jpg|jpeg|png|gif)$/, function (req, res) {
      const staticPath = path.join(staticsPath.imgroot, req._parsedUrl._raw)
      if (fs.existsSync(staticPath)) {
        res.sendFile(staticPath)
      } else {
        res.status(404).send('Sorry! file is not exist.')
      }
    })

    app.get('/', function(req, res) {
      res.render('index', {
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
