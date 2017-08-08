const uniqueId = require('lodash.uniqueid')
const merge = require('lodash.merge')
const { View, Text, FlatList } = require('react-native')

const item = require('./item')

function getKey(){
  return uniqueId('foxkey_')
}

var views = []

var $listStyle = {
  "list-v": {},
  "list-h": {},
  itemText: {}
}

function _list(props, stys){
  views = []

  function dealWithItem(obj){
    if (React.isValidElement(obj.item)) {
      return obj.item
    } else {
      if (typeof obj.item == 'string' || typeof obj.item == 'number') {
        obj.item = { title: obj.item }
      }
      obj.item._index = obj.index
      return item(obj.item, stys, props)
    }
  }

  var $props = {
    animated: false,
    data: props.data,
    renderItem: dealWithItem,
    key: 'fox_',
    horizontal: false,
    numColumns: 1,
    refreshing: false,
    keyExtractor: getKey,
    initialNumToRender: 40,
    ItemSeparatorComponent: undefined  //试试再写，这个需要为默认值
    // ref: uniqueId('list_'),   ????
  }

  if (props.horizontal) {
    $props.numColumns = 1
    $props.horizontal = true
  }

  if (props.getItemLayout) {
    $props.getItemLayout = props.getItemLayout
  }

  if (props.renderItem) {
    $props.renderItem = props.renderItem
  }

  if (props.ItemSeparatorComponent) {
    $props.ItemSeparatorComponent = props.ItemSeparatorComponent
  }

  if (props.header) {
    $props.ListHeaderComponent = props.header
  }

  if (props.footer) {
    $props.ListFooterComponent = props.footer
  }

  if (props.key) {
    $props.key = $props.key + props.key
  }

  if (props.numColumns) {
    $props.numColumns = props.numColumns
  }

  // 兼容aotoo的写法
  if (props.onEndReached || props.onscrollend) {
    $props.onEndReached = (props.onEndReached || props.onscrollend)
  }

  // 兼容aotoo的写法
  if (props.onRefresh || props.onpulldown) {
    $props.onRefresh = (props.onRefresh||props.onpulldown)
    $props.refreshing = true
  }

  // 兼容aotoo的写法
  if (props.onScroll || props.onscroll) {
    $props.animated = true
    $props.onScroll = (props.onScroll || props.onscroll)
  }

  if (props.onViewableItemsChanged) {
    $props.onViewableItemsChanged = props.onViewableItemsChanged
  }

  var element = ''
  var getElement = e => element=e

  var listSty = $props.horizontal ? 'list-h' : 'list-v'
  listSty = stys[listSty]
  if (props.listStyle || stys.listStyle) {
    var _listStyle = merge(props.listStyle, stys.listStyle)
    listSty = [listSty, _listStyle]
  }

  return <View style={listSty}><FlatList ref={getElement} {...$props} /></View>
}

module.exports = function list(props, stys){
  stys = merge( {}, $listStyle, stys)
  return _list(props, stys)
}
