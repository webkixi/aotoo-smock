// const Router = require('./_component/_router')
require('aotoo-mixins-iscroll')
const isClient = typeof window != undefined
const tapsapp = SAX(_.uniqueId('TapsApp_'))

function pushState(props, nohash){
	const flag = props.flag ? (typeof props.flag == 'boolean' ? '#' : props.flag) : ''
	const uri = flag ? props.rootUrl + flag + props.key : props.rootUrl
  window.history.pushState(props, '', uri)
}

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

let _history = []
let _historyCount = 0
let _leftStack = []

class RouterApp extends React.Component {
  constructor(props){
    super(props)
		this.menus
		this.contents = []
		this.direction = 'goto'
		this.prePageContent;
		this.state = {
			data: [],
			select: 0,
			selectData: {},
			menu: false,
			mulitple: false,
      animate: 'right'
		}

		if (this.props.opts) {
			this.state = _.merge({}, this.state, this.props.opts)
		}

    const animateType = this.state.animate  // fade, left, right
    this.animatein = animatecss[animateType]['in']
    this.animaterein = animatecss[animateType]['rein']
    this.animateout = animatecss[animateType]['out']
    this.animateback = animatecss[animateType]['back']


		this.select = this::this.select
		this._menus = this::this._menus
		this.actions = this::this.actions
		this.getContent = this::this.getContent
  }

  _menus(){
    const treeHeader = this.props.opts.treeHeader
		const treeFooter = this.props.opts.treeFooter
		const data = this.state.data.map( (item, ii) => {
			let _item = {
        index: ii, 
        title: item.title, 
        attr: {treeid: ii, path: item.path}, 
        idf: item.idf, 
        parent: item.parent
      }
      
			if (item.idf) delete _item.attr['path']
      else { delete _item['idf'] }

			if (!item.parent) {
				delete _item['parent']
			}

      return _item
		})

		const _menus = Aotoo.tree({
      data: data,
      header: treeHeader,
      footer: treeFooter,
      itemMethod: this.props.itemMethod
		})

    const Xmenus = iscroll(_menus, {})
    this.menus = <Xmenus />
		// tapsapp.append({ menus: this.menus })
	}


  componentWillMount() {
		let wheres = {}
    let currentSelect
		const contents = this.state.data.map( (item, ii) => {
			// 第一次访问，将记录存入history
			if (typeof this.state.select == 'number' && ii == this.state.select) {
				this.historyPush({
					index: ii,
					key: item.path,
					data: {}
				})
			}

			if (typeof this.state.select == 'string' && item.path == this.state.select) {
        this.historyPush({
					index: ii,
					key: item.path,
					data: {}
				})
        currentSelect = {select: ii}
				// this.setState({select: ii})
			}

			wheres[item.path] = {index: ii}
			if (typeof item.content == 'function') {
				return item.content(this.props.ctx)    // ?????
			}

			return item.content
		})

		tapsapp.append({
			contents: contents,
			wheres: wheres
		})
		this._menus()
    if (currentSelect) this.setState(currentSelect)
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

  // 根据路径找到数组对应的下标
  getIndex(where){
		let key, data={}, index
		if (typeof where == 'object') {
			key = where.key
			data = where.data||{}
		} else {
			if (typeof where == 'string') key = where
		}
		if (typeof key == 'string') {
			index = tapsapp.get().wheres[key]['index'] || 0
			return {index, data, key}
		}
	}

  getPage(id, boxCls){
		let animatein = this.animatein
		let animateout = this.animateout
		let pre, preId, prePage, preContent

		if (this.direction == 'back') {
			animateout = this.animateback
			animatein =  this.animaterein
			pre = _leftStack.pop()
		} else {
			pre = _leftStack.length ? _leftStack[_leftStack.length-1] : '';
		}

		if (pre && pre.id !== id) {
			this.prePageContent = pre
			preContent = this.enterContent(pre.content)
			prePage = <div key={_.uniqueId('Router_Single_')} className={boxCls+animateout}>{preContent}</div>
		}

		const _content = this.getContent(id)
		const content = this.enterContent(this.getContent(id))
		const curPage = <div key={_.uniqueId('Router_Single_')} className={boxCls+animatein}>{content}</div>

		_leftStack.push({
			id: id,
			content: _content
		})

		return [
			prePage,
			curPage
		]
	}

  getMulityplePages(id, boxCls){
		let animatein = this.animatein
		let animateout = this.animateout
		const tapscontents = tapsapp.get().contents
		let curPage, curContent, pre, preContent, preId

		if (this.direction == 'back') {
			animateout = this.animateback
			animatein =  this.animaterein
			pre = _leftStack.pop()
		} else {
			pre = _leftStack.length ? _leftStack[_leftStack.length-1] : '';
		}

		if (pre && pre.id !== id) {
			this.prePageContent = pre
			preContent = this.enterContent(pre.content)
		}

		const contents = tapscontents.map( (item, ii) => {
			const _key = 'Router_Mulitple_' + ii
			if (ii == id) {
				curContent = item
				curPage = this.enterContent(item)
				return <div key={_key} className={boxCls+animatein}>{curPage}</div>
			} else {
				return pre&&pre.id==ii
				? <div key={_key} className={boxCls+animateout}>{preContent}</div>
				: <div key={_key} className={boxCls}></div>
			}
		})

		_leftStack.push({
			id: id,
			content: curContent
		})

		return contents
	}

  getContent(id){
		const tapscontents = tapsapp.get().contents
		return id == 0 ? tapscontents[0] : tapscontents[(id||this.state.select)]
	}

  enterContent(content, data){
		if (typeof content == 'function') {
			return content(this.state.selectData)
		}
		if (typeof content == 'object') {
			if (content.main) {
				if (typeof content.enter == 'function') return content.enter(data||this.state.selectData)
				else {
					return content.main(data||this.state.selectData)
				}
			}
		}
		return content
	}

	leaveContent(){
		if (this.prePageContent) {
			const _pre = this.prePageContent.content
			if (typeof _pre == 'object') {
				if (_pre.main) {
					if (typeof _pre.leave == 'function') {
						return _pre.leave()
					}
				}
			}
		}
	}

	pageloaded(){
		let dom = React.findDOMNode(this)
		const content = this.getContent()
		if (typeof content == 'object') {
			if (typeof content.loaded == 'function') {
				setTimeout(()=>{ content.loaded(dom) }, 500)
			}
		}
	}

  componentDidMount() {
		this.pageloaded()
	}

	componentDidUpdate(prevProps, prevState) {
		this.pageloaded()
	}

  render(){
		const opts = this.state

		// className
		const routerClass = !opts.routerClass ? 'routerGroup routerGroupX' : 'routerGroup routerGroupX ' + opts.routerClass
    const boxes_cls = !opts.mulitple ? 'routerBoxes' : 'routerBoxes mulitple'

		// content
		let content

		// 多页路由
		if (this.state.mulitple) {
			content = this.getMulityplePages(this.state.select, boxes_cls)
		} else {
			content = this.getPage(this.state.select, boxes_cls)
		}
		this.leaveContent()

		const _menus = this.state.showmenu
		? <div className='routerMenus'>{this.menus}</div>
		: '';

		if (this.props.opts.header || this.props.opts.footer ) {
			return (
				<div className="routerContainer">
					{this.props.opts.header}
					<div className={routerClass}>
						{_menus}
		        {content}
		      </div>
					{this.props.opts.footer}
				</div>
		)}

		return (
      <div className={routerClass}>
				{_menus}
				{content}
      </div>
    )
	}
}

const Actions = {
  SELECT: function(ostate, opts={}){
    let state = this.curState
    state.select = opts.id||0
    state.selectData = opts.data||{}
    return state
  }
}

function App(config){
  const rt = Aotoo(Router, Actions)
}


export default function router(opts){
  var noop = false
  , dft = {
    data: [],
    rootUrl: location.href.split('#')[0],
    flag: true,
    select: 0,
    showmenu: true,
    header: '',
    footer: '',
    treeHeader: '',
    treeFooter: '',
    container: '',
    globalName: _.uniqueId('Tabs_'),   // TabsModule
    theme: 'router', // = /css/m/tabs
    routerClass: '',
    menuMethod: noop,
    itemMethod: noop,
    listMethod: noop,
    listClass: '',
    mulitple: false,
    animate: 'right'  // 参考 https://daneden.github.io/animate.css/ 样式
  }
  dft = _.extend(dft, opts)
  return new App(dft)
}