import at from './aotoo'





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
      Popstate.trigger()
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









function prepaireData(state){
  /**
   * [
   *   {title, content, idf, parent, attr, path},
   *   {title, content, idf, parent, attr, path},
   * ]
   */
  const that = this
  let menuData = []
  let contentData = []
  state.data.forEach( (item, ii) => {
    const itemCls = ii == state.select ? item.itemClass ? item.itemClass+' select' : 'select' : ''
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




require('./tabs.styl')
Aotoo.extend('tabs', function(opts, utile){

  let dft = {
    props: {
      tabClass: 'tabsGroupX',
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

      this.createMenu = this.createMenu.bind(this)
      this.getContent = this.getContent.bind(this)
      this.findPath = this.findPath.bind(this)
      this.getRealContent = this.getRealContent.bind(this)
    }

    componentWillMount() {
      prepaireData.call(this, this.state)
    }

    componentWillUpdate(nextProps, nextState){
      prepaireData.call(this, nextState)
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

    findPath(where){
      const type = typeof where
      const menu_data = this.saxer.get().MenuData
      if (type == 'string') {
        return utile.find(menu_data, {path: where})
      }
    }

    getRealContent(cnt){
      if (!cnt) return ' '
      const selectData = this.state.selectData
      const type = typeof cnt
      switch (type) {
        case 'function':
          return cnt(selectData)
          break;
        case 'object':
          if (cnt['$$typeof']){
            return cnt
          }
          // enter, leave, main, loaded
          if (typeof cnt.enter == 'function') {
            return cnt.enter(selectData)
          }
          break;
        default:
          return cnt
          
      }
      if (typeof cnt == 'function') {
        return cnt()
      }
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
              title: this.getRealContent(item.content),
              itemClass: item.index == select ? 'select' : ''
            })
          }
        })
        return this.list({
          data: _contents
        })
      }
      
      if (id && id == select) {
        selectContent = contents[select]
      } else {
        contents.forEach( item => {
          if (item.path&&item.path == id) {
            selectContent = item.content
          } else {
            if (item.index == select) {
              selectContent = item.content
            }
          }
        })
      }
      return this.getRealContent(selectContent)
    }

    render(){
      const jsxMenu = this.saxer.get().MenuJsx
      const content = this.getContent()

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
        direction: 'goto'
      })

      this.historyPush = this.historyPush.bind(this)
    }
    
    componentWillMount() {
      super.componentWillMount()
      const menuData = this.saxer.get().MenuData
      const contentData = this.saxer.get().ContentData
      const selectItem = menuData[this.state.select]

      this.historyPush({
        index: selectItem.index,
        key: selectItem.path,
        data: {}
      })
    }

    historyPop(){
      let state = _history.pop()
      let rightState;
      if (!state) return false
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

    getPage(){
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
        this.prePageContent = pre
        preContent = this.enterContent(pre.content)
        prePage = <div key={_.uniqueId('Router_Mulitple_')} className={boxCls+animateout}>{preContent}</div>
      }

      const _content = this.getContent(id)
      const content = this.enterContent(this.getContent(id))
      const curPage = <div key={_.uniqueId('Router_Mulitple_')} className={boxCls+animatein}>{content}</div>

      _leftStack.push({
        id: id,
        content: _content
      })

      return [
        prePage,
        curPage
      ]
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
        state.direction = opts.direction
      }
      
      if (typeof opts.cb == 'function') {
        setTimeout(function() { opts.cb() }, 100);
      }

      return state
    },
  }

  const router = Aotoo(Router, Action, dft)
  router.extend({
    getWhereInfo: function(where){
      const menu_data = this.saxer.get().MenuData
      return utile.find(menu_data, {path: where})
    },
    goto: function(where, data){
      const target = this.getWhereInfo(where)
      this.$select({
        select: target.index,
        selectData: data,
        direction: 'goto'
      })
    },
    back: function(where, data){
      if (where) {
        const target = this.getWhereInfo(where)
        this.$select({
          select: target.index,
          selectData: data,
          direction: 'back'
        })
      } else {
        const whereBack = this.historyPop()
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

})


const WrapElement = Aotoo.wrap(
  <div>这个真好吃</div>, {
    rendered: function(dom){
      console.log('========= rendered');
    },
    leave: function(){
      console.log('========= leave');
    }
  }
)

const tabs = Aotoo.tabs({
  props: {
    mulitple: true,         //默认为false ,为true时，组件里所有content都会显示
    // tabClass: 'tabs-nornal',
    // tabClass: 'tabs-floor-left',
    tabClass: 'tabs-nornal-top',
    data: [
      // {title: 'aaa', content: '什么', idf: 'le1', itemClass: 'aabbcc'},
      {title: 'aaa', content: '什么, what'},
      {title: 'bbb', content: '来了'},
      {title: 'ccc', content: <WrapElement />},
    ]
  }
})


const $ = require('jquery')
// //用于tabs-floor-left
// tabs.render('test', function(dom){
//   $(dom).find('.tabsMenus li:not(.itemroot)').click(function(){
//     let index = $(this).attr('data-treeid')
//     let num = parseInt(index) + 1
//     tabs.$select({
//       select: index
//     })
//     let target_top = $(this).parents('.tabsMenus').next('.mulitple').find('>ul>li:nth-child('+num+')').offset().top
//     $("html,body").animate({scrollTop: target_top}, 500)
//   })
// })
tabs.render('test', function(dom){
  $(dom).find('.tabsMenus li:not(.itemroot)').click(function(){
    let index = $(this).attr('data-treeid')
    let num = parseInt(index) + 1     // mlitple = false  ,tabClass: 'tabs-nornal-top',
    tabs.$select({
      select: index,
      cb: function(){ }
    })
    // let target_top = $(this).parents('.tabsMenus').next('.tabsBoxes').offset().top     //适合于 mlitple = true，tabClass: 'tabs-nornal-top',
    let target_top = $(this).parents('.tabsMenus').next('.mulitple').find('>ul>li:nth-child('+num+')').offset().top - 50   // mlitple = false    50是tabsMenus的高度，tabClass: 'tabs-nornal-top',
    $("html,body").animate({scrollTop: target_top}, 500)  //适合于 mlitple = true与false，tabClass: 'tabs-nornal-top',
  })
})
