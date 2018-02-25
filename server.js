var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack')
var configs = require('./webpack.config')
var path = require('path')
var fs = require('fs')
const ejs = require('ejs')

var compiler = webpack(configs)
var staticsPath = {
  imgroot: __dirname
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
  contentBase: configs.output.path,
  publicPath: '/',
  hot: true,
  inline: true,
  historyApiFallback: true,
  staticOptions: {
    redirect: false
  },
  setup: function (app) {
    app.engine('html', ejs.renderFile)
    app.set('view engine', 'html')
    // app.set('views', configs.output.path + '/html/')
    app.set('views', configs.output.path)
    app.get(/\/css\/(.*)\.css$/, function (req, res) {
      const staticPath = path.join(configs.output.path, req._parsedUrl._raw)
      if (fs.existsSync(staticPath)) {
        res.sendFile(staticPath)
      } else {
        res.status(404).send('Sorry! file is not exist.')
      }
    })

    app.get(/\/js\/(.*)\.(js|json)$/, function (req, res) {
      const staticPath = path.join(configs.output.path, req._parsedUrl._raw)
      if (fs.existsSync(staticPath)) {
        res.sendFile(staticPath)
      } else {
        res.status(404).send('Sorry! file is not exist.')
      }
    })

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
  },
  host: '0.0.0.0',
  port: 8300,
  clientLogLevel: 'info',
  stats: { colors: true },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  watchContentBase: true
}).listen(8300, 'localhost', function (err, result) {
  if (err) {
    return console.log(err)
  }
  console.log('Listening at http://localhost:3000/')
})
