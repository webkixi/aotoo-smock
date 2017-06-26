function prepaireData(state){
  /**
   * [
   *   {title, content, idf, parent, attr},
   *   {title, content, idf, parent, attr},
   * ]
   */
  let menuData = []
  let contentData = []
  state.data.forEach( (item, ii) => {
    // 准备菜单数据
    menuData.push({
      index: ii,
      title: item.title,
      idf: item.idf,
      parent: item.parent,
      attr: item.attr
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
      mulitple: false,
      rendered: function(dom){
        console.log('======== 1111');
      }
    }
  }
  opts = utile.merge(dft, opts)

// ============================================================

  class Tabs extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        data: [],
        select: 0,
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


