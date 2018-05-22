
const fs = require('fs');
const path = require('path');
const md5 = require('blueimp-md5');
const mkdirp = require('mkdirp')
const _ = require('lodash')
const { ConcatSource } = require("webpack-sources");

module.exports = class memeryTofs {
  constructor(opts){
    this.opts = opts || {}
  }
  apply(compiler){
    compiler.hooks.done.tap('memeryTofs', stats => {
      const opts = this.opts
      const assets = stats.compilation.assets
      const compilation = stats.compilation
      const outputPath = opts.outputPath || compilation.compiler.outputPath

      _.map(assets, (file, filename) => {
        let directory = path.dirname(file.existsAt)
        let extname   = path.extname(file.existsAt)
        let existsAt  = file.existsAt
        let profile = path.parse(existsAt)

        const willWrite = true
        if (opts.exclude) {
          if (opts.exclude instanceof RegExp) {
            willWrite = opts.exclude.test(file.existsAt)
          }
          
          if (Array.isArray(opts.exclude)) {
            willWrite = opts.exclude.indexOf(extname) > -1 ? false : true
          }
        }

        if (willWrite) {
          let targetDist
          if (_.isPlainObject(opts.extractTo)) {
            _.map(opts.extractTo, (checks, dist) => {
              checks = [].concat(checks)
              if (checks.indexOf(extname) > -1){
                targetDist = dist
              }
            })
          }

          if (targetDist) {
            directory = path.join(outputPath, targetDist)
            existsAt = path.join(directory, profile.base)
          }

          mkdirp(directory, function (err) {
            if (err) console.log(err);
            fs.writeFile(existsAt, file.source(), function (err) {
              if (err) console.log(err);
            })
          })
        }
      })
    })
  }
}
