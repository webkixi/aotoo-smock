import at from 'aotoo'
require('./tabs.styl')


/**
 * [
 *   {title, content, idf, parent, attr, path},
 *   {title, content, idf, parent, attr, path},
 * ]
 */
function prepaireData(state){
  const that = this
  const props = this.props
  const propsItemClass = props.itemClass ? props.itemClass + ' ' : ''
  let menuData = []
  let contentData = []
  state.data.forEach( (item, ii) => {
    // console.log(item);
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
        select: this.props.select||this.props.start||0,
        selectData: {},
        showMenu: this.props.showMenu||true,
      }

      this.prepaireData = this.prepaireData.bind(this)
      this.createMenu = this.createMenu.bind(this)
      this.getContent = this.getContent.bind(this)
    }

    componentWillMount() {
      this.prepaireData(this.state)
    }

    componentWillUpdate(nextProps, nextState){
      this.prepaireData(nextState)

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


  const Action = {
    UPDATE: function(ostate, opts){
      let state = this.curState
      state.data = opts.data
      return state
    },
    SELECT: function(ostate, opts){
      let state = this.curState
      state.select = opts.select
      if (typeof opts.cb == 'function') {
        setTimeout(function() {
          opts.cb()
        }, 100);
      }
      return state
    },
  }

  return Aotoo(Tabs, Action, dft)

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

function mkTabs(opts){
  const dft = {
    props: {
      mulitple: false,
      data: [],
      tabClass: 'tabs-nornal-top'
    }
  }
  // if (){}
}

// const tabs = Aotoo.tabs({
//   props: {
//     mulitple: true,         //默认为false ,为true时，组件里所有content都会显示
//     // tabClass: 'tabs-nornal',
//     // tabClass: 'tabs-floor-left',
//     tabClass: 'tabs-nornal-top',
//     data: [
//       // {title: 'aaa', content: '什么', idf: 'le1', itemClass: 'aabbcc'},
//       {title: 'aaa', content: '什么, what'},
//       {title: 'bbb', content: '来了'},
//       {title: 'ccc', content: <WrapElement />},
//     ]
//   }
// })


// const $ = require('jquery')
// // //用于tabs-floor-left
// // tabs.render('test', function(dom){
// //   $(dom).find('.tabsMenus li:not(.itemroot)').click(function(){
// //     let index = $(this).attr('data-treeid')
// //     let num = parseInt(index) + 1
// //     tabs.$select({
// //       select: index
// //     })
// //     let target_top = $(this).parents('.tabsMenus').next('.mulitple').find('>ul>li:nth-child('+num+')').offset().top
// //     $("html,body").animate({scrollTop: target_top}, 500)
// //   })
// // })
// tabs.render('test', function(dom){
//   $(dom).find('.tabsMenus li:not(.itemroot)').click(function(){
//     let index = $(this).attr('data-treeid')
//     let num = parseInt(index) + 1     // mlitple = false  ,tabClass: 'tabs-nornal-top',
//     tabs.$select({
//       select: index,
//       cb: function(){ }
//     })
//     // let target_top = $(this).parents('.tabsMenus').next('.tabsBoxes').offset().top     //适合于 mlitple = true，tabClass: 'tabs-nornal-top',
//     let target_top = $(this).parents('.tabsMenus').next('.mulitple').find('>ul>li:nth-child('+num+')').offset().top - 50   // mlitple = false    50是tabsMenus的高度，tabClass: 'tabs-nornal-top',
//     $("html,body").animate({scrollTop: target_top}, 500)  //适合于 mlitple = true与false，tabClass: 'tabs-nornal-top',
//   })
// })
