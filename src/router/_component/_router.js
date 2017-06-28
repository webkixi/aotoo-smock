/**
* list 通用组件
* 返回 div > (ul > li)*n
*/
import store from 'component/mixins/storehlc'
import {tree} from 'component'
import iscrollHlc from 'component/mixins/iscrollhlc'

function pushState(props, nohash){
	const flag = props.flag ? (typeof props.flag == 'boolean' ? '#' : props.flag) : ''
	const uri = flag ? props.rootUrl + flag + props.key : props.rootUrl
	// let uri = props.rootUrl + flag + props.key
	// if (nohash) {
	// 	uri = props.rootUrl
	// }
  window.history.pushState(props, '', uri)
}

/*
 * 清除掉url中的指定params，并重写url，并不跳转url
 * 如 ?tag=xxx，清除掉tag
 * clearState('tag')
 * @tag {String} url中的query的指定key值
*/
function clearState(tag){
  // var url = libs.urlparse(location.href);
  // var params = url.params;
  // if (params[tag]){
  //   var _src = url.relative.replace(tag+'='+url.params[tag], '')
  //   .replace('?&', '')
  //   .replace('?#','#')
  //   .replace('&&', '&')
  //   .replace('&#', '#')
  //   .replace('?', '')
	//
  //   history.replaceState(null, null, _src)
  //   setTimeout(function(){
  //     history.replaceState(null, null, _src)
  //   }, 0)
  // }
}

/*
 * 重置url中的指定params，并重写url，并不跳转url
 * 如 ?tag=xxx，重置tag的值为yyy
 * reState('tag', 'yyy')
 * @tag {String} url中的query的指定key值
 * @value {String}  key对应的值
*/
function resetState(tag, value){
  // var url = libs.urlparse(location.href);
  // var params = url.params;
  // params[tag] = value;
  // var rct = queryString.stringify(params)
  // rct = url.relative.replace(url.path, url.path+'?'+rct)
  // history.replaceState(null, null, rct)
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
const tapsapp = SAX(_.uniqueId('TapsApp_'), {})

class TapsApp extends React.Component {
	constructor(props){
		super(props)
		this.menus
		this.contents = []
		this.direction = 'goto'
		this.prePageContent;
		this.client = (()=>{
      if (typeof window == 'undefined') return false
      return true
    })()
		this.state = {
			data: [],
			selectData: [],
			menu: false,
			mulitple: false,
			select: 0
		}

		if (this.props.opts) {
			this.state = _.merge({}, this.state, this.props.opts)

			if (this.state.animate) {
				const animateType = this.state.animate  // fade, left, right
				this.animatein = animatecss[animateType]['in']
				this.animaterein = animatecss[animateType]['rein']
				this.animateout = animatecss[animateType]['out']
				this.animateback = animatecss[animateType]['back']
			}
		}

		this.select = this::this.select
		this._menus = this::this._menus
		this.actions = this::this.actions
		this.getContent = this::this.getContent
	}

	_menus(){
		let data = []
		this.state.data.forEach( (item, ii) => {
			let _item = {index: ii, title: item.title, attr: {treeid: ii, path: item.path}, idf: item.idf, parent: item.parent}
			if (item.idf) {
				delete _item.attr['path']
			} else {
				delete _item['idf']
			}

			if (!item.parent) {
				delete _item['parent']
			}

			data.push(_item)
		})

		const treeHeader = this.props.opts.treeHeader
		const treeFooter = this.props.opts.treeFooter

		const _menus = tree({
			data: data,
			header: treeHeader,
			footer: treeFooter,
			autoinject: false,
			fold: false,
			itemMethod: this.props.menuMethod,
			listMethod: this.props.listMethod
		})

		let xmenus = _menus.render()
		if (this.state.scrollMenu) {
			const Xmenus = iscrollHlc(xmenus)
			xmenus = <Xmenus />
		}
		this.menus = xmenus
		tapsapp.append({ menus: this.menus })
	}

	componentWillMount() {
		if (this.props.opts.globalName) this.actions()
		let wheres = {}
		let contents = this.state.data.map((item, ii)=> {
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
				this.setState({select: ii})
			}

			wheres[item.path] = {index: ii}
			if (typeof item.content == 'function') {
				return item.content(this.props.ctx)
			}

			return item.content
		})
		tapsapp.append({
			contents: contents,
			wheres: wheres
		})
		this._menus()
	}

	actions(){
		const that = this
		const key = this.props.opts.globalName
		SAX.set(key, null, {
			APPEND_ITEM: function(data) {
				const menus = _.cloneDeep(that.state.menus)
				menus.push(data.title)
				const gdata = SAX.get(that.props.opts.globalName)
				gdata.contents.push(data.content)
				SAX.append(that.props.opts.globalName, {contents: gdata.contents})
				this.setState({ data: menus })
			},

			SELECT: function(page, data) {
				if (typeof page == 'object') {
					let index = page._index
					let data = page.data
					that.select(index, data)
				} else {
					that.select(page)
				}
			},

			BACK: function(where){
				that.direction = 'back'
				const len = Object.keys(where).length
				if (len) {
					const _tmp = that.getIndex(where)
					if (_tmp) {
						const {index, data, key} = _tm;
						that.select(index, data, key)
					}
				} else {
					const whereBack = that.historyPop()
					if (whereBack) {
						const _tmp = that.getIndex(whereBack)
						if (_tmp) {
							const {index, data, key} = _tmp
							that.select(index, data, key)
						}
						return whereBack
					} else {
						pushState({rootUrl: this.state.rootUrl}, true)
					}
				}
			},

			GOTO: function(where) {
				that.direction = 'goto'
				const _tmp = that.getIndex(where)
				if (_tmp) {
					const {index, data, key} = that.getIndex(where)
					that.historyPush({
						index: index,
						key: key,
						data: data
					})
					that.select(index, data, key)
				}
			}
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

	select(id, data, key){
		this.setState({
			select: (id||0),
			selectData: (data||{})
		})
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

		const _menus = this.state.menu
		? <div className='routerMenus'>{this.menus}</div>
		: '';

		if (this.props.opts.header ||
			this.props.opts.footer ) {
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

function storeIt(key){
	return store(key, TapsApp)
}

module.exports = storeIt
