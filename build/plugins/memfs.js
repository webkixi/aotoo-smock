
const fs = require('fs');
const path = require('path');
const md5 = require('blueimp-md5');
const mkdirp = require('mkdirp')
const _ = require('lodash')
const { ConcatSource } = require("webpack-sources");

/**
 * opts
 * outputPath    输出根目录
 * exclude = RegExp || ['.html', '.js', '.css']
 * extractTo = {}    {html: ['.html', '.css']}
 * mapfile = {}     [js, css, image, html]
 */
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
      const _mapfile = opts.mapfile
      const mapfile = _mapfile || {}
      let mapAsset = {}
      
      _.map(assets, (file, filename) => {
        let directory = path.dirname(file.existsAt)
        let extname   = path.extname(file.existsAt)
        let existsAt  = file.existsAt
        let profile = path.parse(existsAt)
        let newProfile

        let willWrite = true
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

          if (_mapfile) {
            newProfile = path.parse(existsAt)
            _.map(mapfile, (paramValue, section) => {
              let relativePath = newProfile.dir.replace(outputPath+'/', '')
              let relativeKeyname
              let relativeFilename
              if (relativePath.indexOf(section)===0) {
                relativePath = relativePath.replace(section+'/', '').replace(section, '')
                relativeKeyname = path.join(relativePath, newProfile.name).replace(/\-/g, path.sep)
                relativeFilename = path.join(relativePath, newProfile.base)

                if (_.isArray(paramValue)) {
                  if (paramValue.indexOf(extname) > -1) {
                    mapAsset[section] = (mapAsset[section]||[]).concat({
                      [relativeKeyname]: relativeFilename
                    })
                  }
                }
    
                if (_.isRegExp(paramValue)) {
                  if (paramValue.test(extname)) {
                    mapAsset[section] = (mapAsset[section] || []).concat({
                      [relativeKeyname]: relativeFilename
                    })
                  }
                }
              }
            })
          }

          mkdirp(directory, function (err) {
            if (err) console.log(err);
            fs.writeFile(existsAt, file.source(), function (err) {
              if (err) console.log(err);
            })
          })
        }
      })

      if (_mapfile) {
        _.map(mapAsset, (assets, sectionName)=>{
          let assetsJson = {}
          _.map(assets, (obj, index) => {
            const entries = Object.entries(obj)
            assetsJson[entries[0][0]] = entries[0][1]
          })
          mapAsset[sectionName] = assetsJson
        })
        fs.writeFileSync(path.join(outputPath, 'mapfile.json'), JSON.stringify(mapAsset), {encoding: 'utf8'})
      }
    })
  }
}
