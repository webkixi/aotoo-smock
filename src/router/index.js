// popstate的bug，在ios上popstate首次进入就被执行了
// android 和 iphone上页面刷新就会直接执行popstate，这是一个浏览器的bug
// 参考 http://stackoverflow.com/questions/6421769/popstate-on-pages-load-in-chrome

const Popstate = SAX('Popstate');
(function() {
  var blockPopstateEvent = document.readyState != "complete";
  window.addEventListener("load", function() {
    setTimeout(function(){ blockPopstateEvent = false; }, 0)
  }, false)
  window.addEventListener("popstate", function(evt) {
    if (blockPopstateEvent && document.readyState=="complete") {
      evt.preventDefault()
      evt.stopImmediatePropagation()
    } else {
      Popstate.trigger({})
    }
  }, false)
}())

// import BaseClass from 'component/class/base'
const BaseRouter = require('./_component/_router')
const inject = require('aotoo-inject')()
// inject().css('/css/t/animate.css')
// inject().css(`
//   .outHeight{
//     height: 0;
//   }
// `)

function menuMethod(){
  const that = this
  return function(dom){
    const self = this
    let _path = $(dom).attr('data-path')
    $(dom).click( function(e){
      e.stopPropagation()
      $(self.siblings).removeClass('activeroot').removeClass('active')
      if ($(dom).hasClass('itemroot')) {
        $(dom).addClass('activeroot')
        $(dom).find('.caption:first').toggleClass('fold')
        $(dom).find('ul:first').toggleClass('none')
      } else {
        $(dom).addClass('active')
      }
      that.actions.roll('GOTO', {key: _path})
    })
    // if (typeof this.config.itemMethod == 'function') this.config.itemMethod.call(this, dom)
  }
}


function App(config){
  const rt = Aotoo(BaseRouter, {}, config)
  rt.extend({
    append: function(item){
      const config = this.config
      if (this.stat == 'finish' && config.globalName) {
        this.actions.roll('APPEND_ITEM', item)
      }
    },

    goback: function(key, data){
      let backState
      if (typeof key == 'string') {
        backState = this.actions.roll('BACK', {key: key, data: data})
      } else if (typeof key == 'function') {
        backState = this.actions.roll('BACK')
        key(backState)
      } else {
        backState = this.actions.roll('BACK')
      }
    },

    goto: function(key, data){
      if (typeof key == 'string'){
        const config = this.config
        if (this.stat == 'finish' && config.globalName) {
          this.actions.roll('GOTO', {key: key, data: data})
        }
      }
    }
  })
  return rt
}

class App extends BaseClass {
  constructor(config) {
    super(config)
    this.change = function(){}
    this.goback = this::this.goback
    menuMethod = this::menuMethod
    Popstate.setActions(this.goback)
  }

  componentWill(){
    const dft = this.config
    const Router = BaseRouter(this.config.globalName)   // = this.createList(this.config.globalName)
    this.eles = <Router
      opts={this.config}
      menuMethod={menuMethod()}
      listMethod={this.config.listMethod}
      ctx={this}
    />
  }

  append(item){
    const config = this.config
    if (this.stat == 'finish' && config.globalName) {
      this.actions.roll('APPEND_ITEM', item)
    }
  }

  goback(key, data){
    let backState
    if (typeof key == 'string') {
      backState = this.actions.roll('BACK', {key: key, data: data})
    } else if (typeof key == 'function') {
      backState = this.actions.roll('BACK')
      key(backState)
    } else {
      backState = this.actions.roll('BACK')
    }
  }

  goto(key, data){
    if (typeof key == 'string'){
      const config = this.config
      if (this.stat == 'finish' && config.globalName) {
        this.actions.roll('GOTO', {key: key, data: data})
      }
    }
  }
}

export default function router(opts){
  var noop = false
  , dft = {
    data: [],
    rootUrl: location.href.split('#')[0],
    flag: true,
    select: 0,
    menu: true,
    scrollMenu: false,
    header: '',
    footer: '',
    treeHeader: '',
    treeFooter: '',
    container: '',
    globalName: _.uniqueId('Tabs_'),   // TabsModule
    theme: 'router', // = /css/m/tabs
    routerClass: '',
    itemMethod: noop,
    listMethod: noop,
    listClass: '',
    mulitple: false,
    animate: 'right'  // 参考 https://daneden.github.io/animate.css/ 样式
  }
  dft = _.extend(dft, opts)
  return new App(dft)
}

export function pure(props){
  return router(props)
}
