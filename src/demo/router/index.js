require('./router.styl')
require('aotoo-mixins-iscroll')
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
      Popstate.emit('goback')
      // Popstate.trigger()
    }
  }, false)
}())

function pushState(props, nohash){
	const flag = props.flag ? (typeof props.flag == 'boolean' ? '#' : props.flag) : ''
	const uri = flag ? props.rootUrl + flag + props.key : props.rootUrl
  window.history.pushState(props, '', uri)
}

let _history = []
let _historyCount = 0
let _leftStack = []
const animatecss = {
	fade: {
		in: ' fadeIn animated-faster',
		rein: ' fadeIn animated-fastest',
		out: ' fadeOut contentHide animated-fastest',
		back: ' fadeOut contentHide animated-faster'
	},

	left: {
		in: ' fadeInLeft animated-faster',
		rein: ' fadeIn animated-fastest',
		out: ' fadeOut contentHide animated-fastest',
		back: ' fadeOutLeft contentHide animated-faster'
	},

	right: {
		in: ' fadeInRight animated-faster',
		rein: ' fadeIn animated-fastest',
		out: ' outHeight fadeOut contentHide animated-fastest',
		back: ' outHeight fadeOutRight contentHide animated-faster',
	}
}

Aotoo.extend('router', function(opts, utile){

  let dft = {
    props: {
      routerClass: 'routerGroup',
      mulitple: false
    }
  }
  opts = utile.merge(dft, opts)

// ============================================================

  class Tabs extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        data: this.props.data||[],
        select: this.props.select||0,
        selectData: {},
        showMenu: this.props.showMenu||true,
      }

      this.prepaireData = this.prepaireData.bind(this)
      this.createMenu = this.createMenu.bind(this)
      this.getContent = this.getContent.bind(this)
    }

    componentWillMount() {
      // prepaireData.call(this, this.state)
      this.prepaireData(this.state)
    }

    componentWillUpdate(nextProps, nextState){
      // prepaireData.call(this, nextState)
      this.prepaireData(nextState)
    }

    /**
     * [
     *   {title, content, idf, parent, attr, path},
     *   {title, content, idf, parent, attr, path},
     * ]
     */
    prepaireData(state){
      const that = this
      const props = this.props
      const propsItemClass = props.itemClass ? props.itemClass + ' ' : ''
      let menuData = []
      let contentData = []
      state.data.forEach( (item, ii) => {
        const itemCls = ii == state.select 
          ? item.itemClass ? propsItemClass+item.itemClass+' select' : propsItemClass+'select' 
          : item.itemClass ? propsItemClass+item.itemClass : propsItemClass
        
        // 准备菜单数据
        menuData.push({
          index: ii,
          path: item.path,
          title: item.title,
          idf: item.idf,
          parent: item.parent,
          attr: item.attr,
          itemClass: itemCls,
          itemMethod: item.itemMethod
        })

        // 准备内容数据
        contentData.push({
          index: ii,
          path: item.path,
          idf: item.idf,
          content: item.content
        })
      })

      this.saxer.append({
        MenuData: menuData,
        ContentData: contentData
      })

      this.createMenu()
    }

    createMenu(){
      const menu_data = this.saxer.get().MenuData
      const treeMenu = this.tree({
        data: menu_data,
        itemClass: this.props.itemClass,
        itemMethod: this.props.itemMethod,
        header: this.props.treeHeader,
        footer: this.props.treeFotter
      })

      this.saxer.append({
        MenuJsx: treeMenu
      })
    }

    getContent(id){
      const select = this.state.select
      const contents = this.saxer.get().ContentData
      let _contents = []
      let selectContent

      if (this.props.mulitple) {
        contents.forEach( (item, ii) => {
          if (!item.idf) {
            _contents.push({
              title: item.content,
              itemClass: (id&&item.path&&item.path == id) ? 'select' : item.index == id ? 'select' : item.index == select ? 'select' : ''
            })
          }
        })
        return this.list({
          data: _contents
        })
      }

      contents.forEach( item => {
        if ( (id||id==0)) {
          if (item.path == id || item.index == id) {
            selectContent = item.content
          }
        } else {
          if (item.index == select) {
            selectContent = item.content
          }
        }
      })
      return selectContent
    }

    render(){
      const jsxMenu = this.saxer.get().MenuJsx
      let content = this.getContent()
      if (typeof content == 'function') {
        content = content(this.state.selectData)
      }

      const cls = !this.props.tabClass ? 'tabsGroup ' : 'tabsGroup ' + this.props.tabClass
      const boxes_cls = !this.props.mulitple ? 'tabsBoxes' : 'tabsBoxes mulitple'

      return (
        <div className={cls}>
          { this.state.showMenu ? <div className='tabsMenus'>{jsxMenu}</div> : '' }
          <div className={boxes_cls}>{content}</div>
        </div>
      )
    }
  }


  const rootUrl = location.href.split('#')[0]
  class Router extends Tabs {
    constructor(props){
      super(props)
      this.state = utile.merge(this.state, {
        flag: true,
        rootUrl: this.props.rootUrl || rootUrl,
        direction: 'goto',
        animate: this.props.animate || 'right'
      })
      this.prePageInfo

      if (this.state.animate) {
				const animateType = this.state.animate  // fade, left, right
				this.animatein = animatecss[animateType]['in']
				this.animaterein = animatecss[animateType]['rein']
				this.animateout = animatecss[animateType]['out']
				this.animateback = animatecss[animateType]['back']
			}

      this.historyPush = this.historyPush.bind(this)
      this.getRealContent = this.getRealContent.bind(this)
      this.findPath = this.findPath.bind(this)
    }
    
    componentWillMount() {
      super.componentWillMount()
      const that = this
      const menuData = this.saxer.get().MenuData
      const contentData = this.saxer.get().ContentData
      const selectItem = menuData[this.state.select]
      

      this.on('historypush', function(opts){
        const _path = opts.path
        const _data = opts.data
        const historyItem = that.findPath(_path)

        that.historyPush({
          index: historyItem.index,
          key: historyItem.path,
          data: _data||{}
        })
      })

      this.on('historypop', function(opts){
        return that.historyPop(opts)
      })

      this.emit('historypush', {
        path: this.state.select,
        data: {}
      })
    }

    findPath(where){
      const type = typeof where
      const menu_data = this.saxer.get().MenuData
      if (type == 'number') {
        return menu_data[where]
      }
      if (type == 'string') {
        return utile.find(menu_data, {path: where})
      }
    }

    historyPush(props){
      if (this.state.flag) {
        const curHistoryState = window.history.state
        pushState({
          index: props.index,
          key: props.key,
          data: props.data,
          rootUrl: this.state.rootUrl,
          preState: curHistoryState,
          timeLine: _historyCount,
          flag: this.state.flag
        })
      } else {
        pushState({rootUrl: this.state.rootUrl, flag: this.state.flag}, true)
      }

      const preState = _history[_history.length-1]
      _history.push({
        index: props.index,
        key: props.key,
        data: props.data,
        preState: preState,
        timeLine: _historyCount
      })

      _historyCount++
    }

    historyPop(){
      let state = _history.pop()
      if (!state) return false
      let rightState;
      if (this.state.flag) {
        rightState = (state && state.preState)
        if (rightState) {
          pushState({
            index: rightState.index,
            key: rightState.key,
            data: rightState.data,
            rootUrl: this.state.rootUrl,
            preState: "curHistoryState",
            flag: this.state.flag
          })
        }
      } else {
        rightState = _history.pop()
        pushState({rootUrl: this.state.rootUrl, flag: this.state.flag}, true)
      }

      return rightState
    }

    getRealContent(cnt){
      if (!cnt) return ' '
      const InstanceContext = this.saxer.get().InstanceContext
      const selectData = this.state.selectData
      if (typeof cnt == 'function') {
        let result = cnt(InstanceContext)
        if (typeof result == 'object') {
          if (result['$$typeof']) return result

          // enter, leave, main, loaded
          if (typeof result.enter == 'function') return result.enter(selectData)  
          else if(typeof result.main == 'function') {
            return result.main(selectData)
          }
        }
      }
      return cnt
    }

    getPage(boxCls){
      const id = this.state.select
      let animatein = this.animatein
      let animateout = this.animateout
      let pre, preId, prePage, preContent

      if (this.state.direction == 'back') {
        animateout = this.animateback
        animatein =  this.animaterein
        pre = _leftStack.pop()
      } else {
        pre = _leftStack.length ? _leftStack[_leftStack.length-1] : '';
      }
      
      if (pre && pre.id !== id) {
        this.prePageInfo = pre
        preContent = this.getRealContent(this.getContent(pre.id))
        prePage = <div key={utile.uniqueId('Router_Single_')} className={boxCls+animateout}>{preContent}</div>
      }
      
      const oriContent = this.getContent(id)
      const content = this.getRealContent(oriContent)
      const curPage = <div key={utile.uniqueId('Router_Single_')} className={boxCls+animatein}>{content}</div>

      _leftStack.push({
        id: id,
        content: content,
        origin: oriContent
      })

      return [
        prePage,
        curPage
      ]
    }

    leaveContent(){
      if (this.prePageInfo) {
        const InstanceContext = this.saxer.get().InstanceContext
        const _pre = this.prePageInfo.origin
        if (typeof _pre == 'function') {
          let result = _pre(InstanceContext)
          if (typeof result == 'object') {
            if (typeof result.leave == 'function') return result.leave()  
          }
        }
      }
    }

    componentDidMount() {
      this.leaveContent()
    }

    componentDidUpdate(prevProps, prevState) {
      this.leaveContent()
    }

    render(){
      const cls = !this.props.routerClass ? 'routerGroup ' : 'routerGroup ' + this.props.routerClass
      const boxes_cls = !this.props.mulitple ? 'routerBoxes' : 'routerBoxes mulitple'

      const jsxMenu = this.saxer.get().MenuJsx
      const content = this.getPage(boxes_cls)
      const IscrollTreeMenu = Aotoo.iscroll(<div className='routerMenus'>{jsxMenu}</div>, {
        onscroll: function(){},
        onscrollend: function(){}
      })

      return (
        <div className={cls}>
          { this.state.showMenu ? <IscrollTreeMenu /> : '' }
          {content}
        </div>
      )
    }
  }

  const Action = {
    UPDATE: function(ostate, opts, ctx){
      let state = this.curState
      state.data = opts.data
      return state
    },

    SELECT: function(ostate, opts, ctx){
      let state = this.curState

      // select
      state.select = opts.select

      // selectData
      if (opts.data) {
        state.selectData = opts.data
      }

      if (opts.direction) {
        state.direction = opts.direction || 'goto'
      }

      if (state.direction == 'goto') {
        ctx.emit('historypush', {
          path: state.select,
          data: state.selectData
        })
      }
      
      if (typeof opts.cb == 'function') {
        setTimeout(function() { opts.cb() }, 100);
      }

      return state
    },
  }

  // const router = Aotoo(Tabs, Action, dft)
  const router = Aotoo(Router, Action, dft)
  
  router.saxer.append({
    InstanceContext: router
  })

  Popstate.on('goback', function(){
    return router.back()
  })

  router.extend({
    getWhereInfo: function(where){
      const menu_data = this.saxer.get().MenuData
      return utile.find(menu_data, {path: where})
    },
    goto: function(where, data){
      if (typeof where != 'string') return 
      const target = this.getWhereInfo(where)
      this.$select({
        select: target.index,
        selectData: data,
        direction: 'goto'
      })
    },
    back: function(where, data){
      if (where) {
        if (typeof where != 'string') return 
        const target = this.getWhereInfo(where)
        this.$select({
          select: target.index,
          selectData: data,
          direction: 'back'
        })
      } else {
        const whereBack = this.emit('historypop')
        // whereBack: {
          // index: props.index,
          // key: props.key,
          // data: props.data,
          // rootUrl: this.state.rootUrl,
          // preState: curHistoryState,
          // timeLine: _historyCount,
          // flag: this.state.flag
        //}
        if (whereBack) {
          this.$select({
            select: whereBack.index,
            selectData: whereBack.data,
            direction: 'back'
          })
          return whereBack
        } else {
          pushState({rootUrl: rootUrl}, true)
        }
      }
    }
  })

  return router
})