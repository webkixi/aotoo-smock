var webpack = require('webpack')
var path = require('path')
var DIST = path.join(__dirname, 'dist')

module.exports = {
  entry: {
    index: [
      'webpack-dev-server/client?http://localhost:3000/',
      'webpack/hot/only-dev-server',
      "./index.js"
    ]
  },
  devtool: 'cheap-source-map',
  output: {
    path: DIST,
    filename: "[name].js",
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use:[{
          loader: "babel-loader",
          options: {
            presets:["react", "es2015", "stage-0"],
          }
        }]
      }
    ]
  },
  resolve:{
    extensions:['.js']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
