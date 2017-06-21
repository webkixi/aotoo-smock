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
  Aotoo.extend('iscroll', function(container, _opts, utile){
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


    var os = (function( ua ) {
      let ret = {},
      android = ua.match( /(?:Android);?[\s\/]+([\d.]+)?/ ),
      ios = ua.match( /(?:iPad|iPod|iPhone).*OS\s([\d_]+)/ );
      ret.mobile = (() => !!(android||ios))()
      return ret;
    })( navigator.userAgent )

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
    function getDiff(iscrl, opts){
      var direction
      if (!opts.direction) opts.direction = 'Y'

      if (opts.direction == 'Y') {
        direction = iscrl.y < oriPositionY ? 'down' : 'up'
        oriPositionY = iscrl.y
        return [iscrl.y, direction];
      }

      if (opts.direction == 'X') {
        direction = iscrl.x < oriPositionX ? 'left' : 'right'
        oriPositionX = iscrl.x
        return [iscrl.x, direction]
      }
      else {
        return [iscrl.x, iscrl.y]
      }
    }


    var scrollState = { ttt: '' }


    function bindScrollAction(dom, opts){

      var onscroll = opts.onscroll
      var onscrollend = opts.onscrollend
      var onpulldown = opts.onpulldown

      opts.disableTouch = os.mobile ? false : true
      opts.disablePointer = os.mobile ? true : false
      
      preventDefault(opts.preventDefault)

      const iscr = new isc(dom, opts)
      iscr.refresh()

      if (typeof onscroll == 'function' || typeof onpulldown == 'function') {
        iscr.on('scroll', ()=>{
          // distY
          clearTimeout(scrollState.ttt)
          const diff = getDiff(iscr, opts)
          onscroll ? onscroll.apply(iscr, diff) : ''
          onpulldown ? onpulldown.apply(iscr, diff) : ''
        })
      }
      iscr.on('scrollEnd', ()=>{
        const diff = getDiff(iscr, opts)
        scrollState.ttt = setTimeout(()=>{
          lazyLoad(this.layzblocks, dom)
        }, 1200)
        if (typeof onscrollend == 'function') {
          onscrollend.apply(iscr, diff)
          setTimeout(()=>{
            iscr.refresh()
          },300)
        }
      })

      return iscr
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
    function noop(cb) {
      return function (elem) {
        if (typeof cb == 'function') {
          cb.call(this, elem);
        }
        this.elock = false;
      };
    }

    var _container = $id(_opts.container) || container;
    var def = {
      container: _container,
      elements: '',
      mode: 'v',
      onscroll: _opts.ondataload,
      oninview: noop(_opts.oninview),
      onfinish: noop(_opts.onfinish)
    };
    var _options = utile.merge(def, _opts || {});

    if (typeof _options.elements == 'string') {
      _options.elems = getSiblingElements(_container, _options.elements) || _container.getElementsByTagName('img')
    }
    _options.ondataload = _options.oninview
    _options.ondataend = _options.onfinish
    new LazyloadClass(_options);
  })

  module.exports = {}
} catch (error) {
  console.error('依赖全局变量Aotoo，请参考 https://github.com/webkixi/aotoo');
}

