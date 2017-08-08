import combinex, {CombineClass, _wrap} from 'react-combinex'
const path = require('path')
const React = (typeof React != 'undefined' ? React : require('react'))

let isReactNative = false
var noop = function(){}
var isClient = typeof window !== 'undefined'
var context = ( C => C ? window : global)(isClient) || {}
if (context.process) isClient = false
if (context.__BUNDLE_START_TIME__) isReactNative = true
// if (context.regeneratorRuntime && context.nativeCallSyncHook) isReactNative = true

if (isReactNative) {
  if (!context.React) {
    context.React = React
  }
  var render = function(jsx){return jsx}
} else {
  var reactDom = ( C => typeof ReactDOM != 'undefined' ? ReactDOM : typeof ReactDom != 'undefined' ? ReactDom : C ? require('react-dom') : require('react-dom/server'))(isClient)
  var render   = ( C => C ? reactDom.render : reactDom.renderToString)(isClient)
  var pureRender   = ( C => C ? reactDom.render : reactDom.renderToStaticMarkup)(isClient)
  if (!context.React) {
    context.React = React
    context.ReactDom = context.ReactDOM = reactDom
  }
}

if (!context.Aotoo) {
  context.Aotoo = aotoo
}

var utile = require('./suba/lib')
var extension = {plugins: {}}


// 前端render
function fedRender(element, id){
  if (typeof id == 'object') {
    if (id.nodeType) render(element, id)
  }
  if (typeof id == 'string') {
    return render(element, document.getElementById(id))
  }
  return element
}

// node端render
function nodeRender(element){
  return render(element)
}

// node端render
function nodePureRender(element){
  return pureRender(element)
}


export default function aotoo(rctCls, acts, opts){
  let keynames = Object.keys(acts)
  const lowKeyNames = keynames.map( item => item.toLowerCase() )
  const upKeyNames = keynames

  class Temp extends CombineClass {
    constructor(config={}) {
      super(config)
      let ext = {}
      const plugins = extension.plugins
      Object.keys(plugins).map( item => {
        if (typeof plugins[item] == 'function') {
          ext[item] = this::plugins[item]
        }
      })
      this.extension.plugins = ext
      this.combinex(rctCls, acts)
    }
  }

  return new Temp(opts)
}


function wrap(ComposedComponent, opts, cb){
  return _wrap(ComposedComponent, opts, cb)
}

aotoo.wrapEx = function(key, cb){
  aotoo[key] = function(ComposedComponent, opts){
    return wrap(ComposedComponent, function(dom){
      cb(dom, opts, utile)
    })
  }
}

// 支持plugins插件，可同时外挂在aotoo及在react class内部中使用
aotoo.plugins = function(key, fun){
  aotoo[key] = fun
  extension.plugins[key] = fun
}

// 扩展aotoo的静态方法
aotoo.extend = function(key, cb){
  aotoo[key] = function(opts){
    return cb(opts, utile)
  }
}


// 绑定助手方法
aotoo.combinex = combinex
aotoo.CombineClass = CombineClass
aotoo.render = isReactNative ? render : isClient ? fedRender : nodeRender
aotoo.html = isReactNative ? render : isClient ? fedRender : nodePureRender
for (let item in utile) {
  aotoo[item] = utile[item]
}

// 绑定内部插件
aotoo.plugins('wrap', wrap)

export {combinex, CombineClass, wrap}
