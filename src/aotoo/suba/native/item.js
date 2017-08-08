const uniqueId = require('lodash.uniqueid')
const merge = require('lodash.merge')

const {
  FlatList,
  View,
  Text,
  Linking,
  TouchableHighlight,
  Image
} = require('react-native')

const {
  Ul, 
  Li, 
  A, 
  Img, 
  Div
} = require('../lib/htmltags')

const $uuid = function(prefix='native_') {
  const _time = new Date().getTime().toString().substring(1)
  return prefix + _time
}

function dealWithLis(lis, $stys){
  const _sty_ul = $stys['itemLi-ul']||{}
  const _sty_li = $stys['itemLi-li']||{}
  const _sty_text = $stys.itemText ||{}

  var $lis = []
  if (lis && Array.isArray(lis)) {
    $lis = lis.map( (item, ii) => {
      const $key = $uuid('lis_'+ii+'_')
      const _typeof = typeof item
      switch (_typeof) {
        case 'string':
          item = <Text style={_sty_text}>{item}</Text>
          return <Li key={$key} style={_sty_li}>{item}</Li>
          break;
        case 'number':
          item = <Text style={_sty_text}>{item}</Text>
          return <Li key={$key} style={_sty_li}>{item}</Li>
          break;
        case 'object':
          if (Array.isArray(item)) {
            return dealWithLis(item, $stys)
          } else {
            if (React.isValidElement(item)) {
              return React.cloneElement(item, {key: $key})
            } else {
              const tempItem = myItemHeader(item, $stys)
              return React.cloneElement(tempItem, {key: $key})
            }
          }
          break;
      }
    })
  }
  
  return <Ul style={_sty_ul}>{$lis}</Ul>
}

function myItemHeader(item, _stys){
  let $header
  let $lis
  let $stys = JSON.parse(JSON.stringify(_stys))

  if(React.isValidElement(item)){
    $header = item
  } 
  else
  if (typeof item == 'string' || typeof item == 'number') {
    const $sty = $stys&&$stys.itemText || {}
    $header = <Text style={$sty}>{item}</Text>
  }
  else {
    let { title, url, img, id, li, itemStyle, attr } = item
    $stys = merge($stys, itemStyle)
    const _sty_a = $stys.itemA || {}
    const _sty_text = $stys.itemText ||{}
    const _sty_img = $stys.itemImg ||{}
    const _sty_box = $stys.itemBox ||{}
    

    if (title) {
      if (typeof title == 'number' || typeof title == 'string') {
        title = <Text style={_sty_text}>{title}</Text>
      }
      // if (url&&typeof url == 'string') {
      if (url) {
        // title url
        $header = <A href={url} style={_sty_a}>{title}</A>
        if (typeof img=='string') {
          if (li) {
            $lis = dealWithLis(li, $stys)
            // title url img li
            $header = <Div style={_sty_box}>{title}<A href={url} style={_sty_a}><Img src={img} style={_sty_img}/></A>{$lis}</Div>
          } else {
            // title url img
            $header = <A href={url} style={_sty_a}>{title}<Img src={img} style={_sty_img}/></A>
          }
        }
        else
        if (li) {
          $lis = dealWithLis(li, $stys)
          // title url li
          $header = <Div style={_sty_box}><A href={url} style={_sty_a}>{title}</A>{$lis}</Div>
        }
      }
      else
      if (img) {
        // if (typeof img=='string') {
        if (li) {
          $lis = dealWithLis(li, $stys)
          // title img li 
          $header = <Div style={_sty_box}>{title}<Img src={img} style={_sty_img} />{$lis}</Div>
        } else {
          // title img
          $header = <Div style={_sty_box}>{title}<Img src={img} style={_sty_img}/></Div>
        }
      }
      else
      if (li) {
        $lis = dealWithLis(li, $stys)
        // title li
        $header = <Div style={_sty_box}>{title}{$lis}</Div>
      } else {
        // title
        // $header = <Div>{title}</Div>
        $header = title
      }
    }

    //  ===== 

    else
    if (typeof img=='string') {
      if (url&&typeof url == 'string') {
        if (li) {
          $lis = dealWithLis(li, $stys)
          // img url li
          $header = <Div style={_sty_box}><A href={url} style={_sty_a}><Img src={img} style={_sty_img} /></A>{$lis}</Div>
        } else {
          // img url
          $header = <A href={url} style={_sty_a}><Img src={img} style={_sty_img} /></A>
        }
      }
      else
      if (li) {
        $lis = dealWithLis(li, $stys)
        // img li
        $header = <Div style={_sty_box}><Img src={img} style={_sty_img} />{$lis}</Div>
      } else {
        // img
        $header = <Img src={img} style={_sty_img} />
      }
    }

    // ======

    else
    if (li) {
      $lis = dealWithLis(li, $stys)
      // li
      $header = $lis
    }

    // ======

    else {
      $header = title
    }
  }
  
  return $header
}

/**
 * type  ?
 * title
 * id
 * img
 * url
 * value
 * content
 *
 *
 * body: []
 * footer: []
 * dot:: []
 */
class Fox extends React.Component {
  constructor(props) {
    super(props)
    this.sty = this.props.style
    this.stys = this.props.styles
  }

  componentDidMount() {
    const element = this.element
    const props = this.props
    const item = props

    if (item.item.attr) {
      element.attr = item.item.attr
    }
    if (this.props.itemMethod) {
      this.props.itemMethod.call(element)
    }
  }

  preRender(){
    return myItemHeader(this.props.item, this.stys)
  }

  render(){
    const $key = $uuid('header_item_'+'_')
    const fill = this.preRender()
    return (
      <View style={this.sty} ref={ e=>this.element=e } key={$key}>{fill}</View>
    )
  }
}

var $itemStyle = {
  item: {   // view
    opacity: 1
  },
  itemText: {
    color: '#3c73b9'
  },
  itemA: {
    backgroundColor: '#15ee6c',
    underlayColor: '#e3e3e3',
    activeOpacity: 0.5
  }, // view
  itemImg: {
    width: 40,
    height: 40
  },
  'itemLi-ul': {
    marginLeft: 15
  },
  'itemLi-li': {
    
  }
}

module.exports = function(item, stys, props){
  const theMethod = item.itemMethod || props&&props.itemMethod
  delete item.itemMethod

  var $$itemStyle = merge({}, $itemStyle, stys)
  var itemSty = $$itemStyle.item
  delete $$itemStyle.item
  if (props&&props.itemStyle) {
    const _itemSty = props.itemStyle.item||{}
    itemSty = [itemSty, _itemSty]
    delete props.itemStyle.item
    if (item.itemStyle) {
      const __itemSty = item.itemStyle.item
      itemSty.push(__itemSty)
      delete item.itemStyle.item
    }
  } else {
    if (item.itemStyle) {
      const __itemSty = item.itemStyle.item
      itemSty = [itemSty, __itemSty]
      delete item.itemStyle.item
    }
  }

  return <Fox style={itemSty} styles={$$itemStyle} itemMethod={theMethod} item={item} />
}
