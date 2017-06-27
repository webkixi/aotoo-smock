import at from './aotoo'

// class Test extends React.Component {
//   constructor(props){
//     super(props)
//     this.state = {
//       test: '123'
//     }
//     this.handlClick = this::this.handlClick
//   }

//   componentWillMount() {
//     console.log('======== 111222333');
//   }

//   componentWillUpdate(nextProps, nextState){
//     console.log(nextProps, nextState);
//   }

//   handlClick(){
//     this.setState({
//       test: '456'
//     })
//   }

//   render(){
//     return (
//       <div>
//         {this.state.test}
//         <button onClick={this.handlClick}>click</button>
//       </div>
//     )
//   }
// }

// Aotoo.render(<Test />, 'test')









function prepaireData(state){
  /**
   * [
   *   {title, content, idf, parent, attr},
   *   {title, content, idf, parent, attr},
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
        select: this.props.select||0,
        selectData: {}
      }

      this.createMenu = this.createMenu.bind(this)
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

    getContent(){
      const select = this.state.select
      const contents = this.saxer.get().ContentData
      let _contents = []
      let selectContent

      if (this.props.mulitple) {
        contents.forEach( (item, ii) => {
          if (!item.idf) {
            _contents.push({
              title: item.content,
              itemClass: item.index == select ? 'select' : ''
            })
          }
        })
        return this.list({
          data: _contents
        })
      }

      contents.forEach( item => {
        if (item.index == select) {
          selectContent = item.content
        }
      })

      return selectContent
    }

    render(){
      const jsxMenu = this.saxer.get().MenuJsx
      const content = this.getContent()

      const cls = !this.props.tabClass ? 'tabsGroup ' : 'tabsGroup ' + this.props.tabClass
      const boxes_cls = !this.props.mulitple ? 'tabsBoxes' : 'tabsBoxes mulitple'

      return (
        <div className={cls}>
          <div className='tabsMenus'>{jsxMenu}</div>
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
      return state
    },
  }

  return Aotoo(Tabs, Action, dft)

})


const tabs = Aotoo.tabs({
  props: {
    data: [
      {title: 'aaa', content: '什么', idf: 'le1', itemClass: 'aabbcc'},
      {title: 'hello', content: '什么, what', parent: 'le1'},
      {title: 'bbb', content: '来了'},
      {title: 'ccc', content: <div>这个真好吃</div>},
    ]
  }
})


const $ = require('jquery')
tabs.render('test', function(dom){
  $(dom).find('.tabsMenus li:not(.itemroot)').click(function(){
    let index = $(this).attr('data-treeid')
    tabs.$select({
      select: index
    })
  })
})

