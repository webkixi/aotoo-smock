/*
	* $lazy 懒加载
	* @container {Object} dom 对象
	* @opts {Object} 配置文件
  * utile {object} 助手方法
	* return {null}
	* Sample: lazy(dom, {
	*   elems: 'img .block',
	*   ondataload: function(dom){
	* 		do some thing ...
	*   }
	* })
	*/
try {
  Aotoo.wrapEx('iscroll', function(container, _opts, utile){
    function isWindow(c){
      return c==window||c==document||c==null||!c.tagName||/body|html/i.test(c.tagName);/*判断容器是否是window*/
    }

    /*getElementById
    * @param {String} id ID值
    */
    function $id(c){
      if (isWindow(c) ) return document.documentElement;
      if(/string|object/.test(typeof c)) {
        return typeof c == 'string' ? document.getElementById(c) : c.nodeType ? c : ''
      }
    }

    function currentStyle(element){
      return element.currentStyle || document.defaultView.getComputedStyle(element, null);
    }

    function scrollView(ele){
      var isWin = isWindow((ele||window))
      if (isWin){
        var top  = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
          left = window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0,
          height = document.documentElement.scrollHeight || document.body.scrollHeight || 0,
          width = document.documentElement.scrollWidth || document.body.scrollWidth || 0;
        
        var visualWidth = window.innerHeight||document.documentElement.offsetHeight||document.body.clientHieght
        var visualHeight = window.innerWidth||document.documentElement.offsetWidth||document.body.clientWidth

        return { scrolltop: top, scrollleft: left, scrollwidth: width, scrollheight: height, range: {
          width: visualWidth,
          height: visualHeight
        }}
      }
      else{
        var _ele = typeof ele == 'string' ? document.getElementById(ele) : ele.nodeType ? ele : false
        if (_ele){
          var curStyle = currentStyle(_ele)
          return { scrolltop: _ele.scrollTop, scrollleft: _ele.scrollleft, scrollwidth: _ele.scrollWidth, scrollheight: _ele.scrollHeight, range: {
            width: curStyle.width,
            height: curStyle.height
          }}
        }
      }
    }

    /*根据className获取dom集合
    * @node {Object} dom 对象
    * @classname {String} 选择对象，基于className
    * demo: var elements = getElementsByClassName(document, className)
    */
    function getElementsByClassName(node, classname) {
      if (node.getElementsByClassName) { // use native implementation if available
        return node.getElementsByClassName(classname);
      } else {
        return (function getElementsByClass(searchClass,node) {
            if ( node == null ) node = document;
            var classElements = [],
                els = node.getElementsByTagName("*"),
                elsLen = els.length,
                pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)"), i, j;
            for (i = 0, j = 0; i < elsLen; i++) {
              if ( pattern.test(els[i].className) ) {
                  classElements[j] = els[i];
                  j++;
              }
            }
            return classElements;
        })(classname, node);
      }
    }

    /*获取互不为子的元素集合
    * @node {Object} dom对象
    * @select {String} 选择器
    * Sample: getSiblingElements(doument, '.aaa #bbb img div')
    */
    function getSiblingElements(node, select){
      if (isWindow(node) ) node = document.documentElement;
      var targets = []
      var temp = []
      if (!select) return 
      if (typeof select == 'string') {
        temp = select.split(' ')
      }
      if (utile.isArray(select)) {
        temp = select
      }
      temp.forEach( function(item){
        var char0 = item.charAt(0)
        if (char0 == '#') {
          targets = targets.concat(document.getElementById(item.substring(1)))
        } else 
        if (char0 == '.') {
          targets = targets.concat(utile.toArray( getElementsByClassName(node, item.substring(1))) )
        } else  {
          targets = targets.concat(utile.toArray( node.getElementsByTagName(item)) )
        }
      })
      if (targets.length) return targets
    }

    /*注销事件
    * @param {Object} oTarget 对象
    * @param {String} sEventType 事件类型
    * @param {Function} fnHandler 事件方法
    */
    var removeEventHandler = function(oTarget, sEventType, fnHandler) {
      if(oTarget.listeners && oTarget.listeners[sEventType]){
        var listeners = oTarget.listeners[sEventType];
        for(var i = listeners.length-1;i >= 0 && fnHandler;i--){
          if(listeners[i] == fnHandler){
            listeners.splice(i,1);
          }
        }
        if((!listeners.length || !fnHandler) && listeners["_handler"]){
          oTarget.removeEventListener ? oTarget.removeEventListener(sEventType, listeners["_handler"], false) : oTarget.detachEvent('on' + sEventType, listeners["_handler"]);		
          delete oTarget.listeners[sEventType];
        }
      }	
    }
    /*添加事件
    * @param {Object} oTarget 对象
    * @param {String} sEventType 事件类型
    * @param {Function} fnHandler 事件方法
    */
    var addEventHandler = function(oTarget, sEventType, fnHandler) {
      oTarget.listeners = oTarget.listeners || {};
      var listeners = oTarget.listeners[sEventType] = oTarget.listeners[sEventType] || [];
      listeners.push(fnHandler);
      if(!listeners["_handler"]){
        listeners["_handler"] = function(e){
          var e = e || window.event;
          for(var i = 0,fn;fn = listeners[i++];){
            fn.call(oTarget,e)
          }
        }
        oTarget.addEventListener ? oTarget.addEventListener(sEventType, listeners["_handler"], false) : oTarget.attachEvent('on' + sEventType, listeners["_handler"]);
      }	
    }

    function isFunction(fun){
      return typeof fun == 'function'
    }


    var os = (function( ua ) {
      var ret = {},
      android = ua.match( /(?:Android);?[\s\/]+([\d.]+)?/ ),
      ios = ua.match( /(?:iPad|iPod|iPhone).*OS\s([\d_]+)/ );
      ret.mobile = (() => !!(android||ios))()
      return ret;
    })( navigator.userAgent )

    function isPassive() {
      var supportsPassiveOption = false;
      try {
        addEventListener("test", null, Object.defineProperty({}, 'passive', {
          get: function () {
            supportsPassiveOption = true;
          }
        }));
      } catch(e) {}
      return supportsPassiveOption;
    }

    function preventDefault(pred){
      document.addEventListener('touchmove', function (e) {
        pred ? e.preventDefault() : ''
      }, isPassive() ? {
        capture: false,
        passive: false
      } : false);
    }

    var oriPositionY = 0
    var oriPositionX = 0
    function getScrollDirection(iscrl, opts){
      var direction
      if (!opts.direction) opts.direction = 'Y'

      if (opts.direction == 'Y') {
        direction = iscrl.y < oriPositionY ? 'down' : 'up'
        oriPositionY = iscrl.y
        return direction
        // return [iscrl.y, direction];
      }

      if (opts.direction == 'X') {
        direction = iscrl.x < oriPositionX ? 'left' : 'right'
        oriPositionX = iscrl.x
        return direction
        // return [iscrl.x, direction]
      }
      else {
        var _directionY = iscrl.y < oriPositionY ? 'down' : 'up'
        var _directionX = iscrl.x < oriPositionX ? 'left' : 'right'
        oriPositionY = iscrl.y
        oriPositionX = iscrl.x
        return _directionX + ' ' + _directionY
        // return [iscrl.x, iscrl.y]
      }
    }

    function getBlocks(container, elems){
      if (elems){
        return getSiblingElements(container, elems)
      }
    }

    function getRange(c){
      return isWindow(c)&&window.innerWidth?function(){
        return {top:0,left:0,right:window.innerWidth,bottom:window.innerHeight}
      }:function(){
        return getRect(c);
      }
    }

    function getRect(elem){
      var r=elem.getBoundingClientRect();/*元素到窗口左上角距离*/
      return {top:r.top,left:r.left,bottom:r.bottom,right:r.right}
    }

    function isRange(side, mode){
      /*1：加载 -1：跳出循环 0：不加载执行下一个*/
      return {
        v:side.v ? side.v=="in"?1:-1 : 0,
        h:side.h ? side.h=="in"?1:-1 : 0,
        c:side.v&&side.h ? side.v=="in"&&side.h=="in"? 1:side.v!="in"?-1:0 : 0
      }[mode||"c"]
    }

    function inRange(range, rect){
      return {
        v : rect.top<=range.bottom ? rect.bottom>=range.top ? "in" : "" : "bottom",/*垂直位置*/
        h : rect.left<=range.right ? rect.right>=range.left ? "in" : "" : "right" /*水平位置*/
      }
    }

    var $iscroll = require('iscroll/build/iscroll-probe')
    function Iscroll(dom, opts){
      preventDefault(opts.preventDefault)
      this.blocks = getBlocks(dom, opts.elements)
      this.container = dom
      this.opts = utile.cloneDeep( opts||{} )
      this.timer = ''
      
      this.onscroll = this.opts.onscroll
      this.onscrollend = this.opts.onscrollend
      this.onpulldown = this.opts.onpulldown

      delete opts.onscroll
      delete opts.onscrollend
      delete opts.onpulldown
      this.iscr = new $iscroll(dom, opts)
      this.run()
    }

    Iscroll.prototype = {

      lazyLoad: function(blks, cb) {
        var that = this
        if (isFunction(blks)) {
          cb = blks
          blks = undefined
        }
        this.blocks = blks || this.blocks;
        var blocks = this.blocks;
        var range = getRange(this.container)()
        if (blocks && blocks.length) {
          blocks.map(function(elem, ii){
            var rect = getRect(elem)
            var side = isRange(inRange(range, rect))
            if(side&&side!=0){
              // if(side==1&&!this.elock){
              if(side==1){
                if (isFunction(cb)) cb.call(that, elem)
                blocks.splice(ii--,1); /*加载完之后将该对象从队列中删除*/
              }
            }
          })
        }
      },

      run: function(){
        var opts = this.opts
        var blocks = this.blocks
        var iscr = this.iscr
        var onscroll = this.onscroll
        var onpulldown = this.onpulldown
        var onscrollend = this.onscrollend
        var that = this
        var lazy = function(blks, cb){
          clearTimeout(that.timer)
          that.timer = setTimeout(function() {
            that.lazyLoad(blks, cb)
            iscr.refresh()
          }, 600);
        }
        iscr.refresh()

        if (isFunction(onscroll) || isFunction(onpulldown) ) {
          iscr.on('scroll', function(){
            var direction = getScrollDirection(iscr, opts)
            onscroll ? onscroll.call(iscr, lazy, direction) : ''
            onpulldown ? onpulldown.call(iscr, direction, lazy) : ''
          })
        }

        iscr.on('scrollEnd', function(){
          if (isFunction(onscrollend)) {
            onscrollend.call(iscr, lazy)
            setTimeout(function(){ iscr.refresh() },200)
          }
        })
      }
    }

    /*
    * $lazy 懒加载
    * @container {Object} dom 对象
    * @opts {Object} 配置文件
    * return {null}
    * Sample: lazy(dom, {
    *   elems: 'img .block',
    *   ondataload: function(dom){
    * 		do some thing ...
    *   }
    * })
    */

    var _container = $id(_opts.container || container);
    var def = {
      mouseWheel:true,
      click: true,
      probeType: 3,
      disableTouch: os.mobile ? false : true,
      disablePointer: os.mobile ? true : false,
      container: _container,
      elements: '',
      preventDefault: false,
      direction: 'Y',
      onscroll: _opts.onscroll,
      onpulldown: _opts.onpulldown,
      onscrollend: _opts.onscrollend
    };
    var _options = utile.merge(def, _opts || {});
    return new Iscroll(_container, _options)
  })

  module.exports = {}
} catch (error) {
  console.error(error)
  console.error('依赖全局变量Aotoo，请参考 https://github.com/webkixi/aotoo');
}

