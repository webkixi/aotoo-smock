const transTree = require('./lib/tree')

function $item(props, isreact){
  const Item = require('./itemview/foxdiv')
  if (!props) return Item
  return <Item {...props} />
}

function $list(props, isreact){
  const List = require('./listview')
  if (!props) return List
  return <List {...props} />
}

function $tree(props){
  if ( Array.isArray(props.data) ) {
    props.data = transTree(props.data)
    return $list(props)
  }
}

module.exports = {
  item: $item,
  list: $list,
  tree: $tree,
  transTree: transTree
}




// let isReactNative = false
// const isClient = typeof window !== 'undefined'
// const context = ( C => C ? window : global)(isClient) || {}
// isReactNative = context.regeneratorRuntime ? true : false

// const transTree = require('./lib/tree')

// function $item(props, isreact){
//   const Item = require('./itemview/foxdiv')
//   if (!props) return Item
//   return <Item {...props} />
// }

// // function $nativeItem(item, stys, props) {
// function $nativeItem(opts={}, stys={}) {
//   const item = opts.data||{}
//   const props = opts.props||{}
//   const _item = require('./native/item')
//   return _item(item, stys, props)
// }

// function $list(props, isreact){
//   const List = require('./listview')
//   if (!props) return List
//   return <List {...props} />
// }

// function $nativeList(props, stys) {
//   const _list = require('./native/list')
//   return _list(props, stys)
// }


// function $tree(props, stys){
//   if ( Array.isArray(props.data) ) {
//     props.data = transTree(props.data)
//     return isReactNative ? $nativeItem(props, stys) : $list(props)
//   }
// }

// module.exports = {
//   item: isReactNative ? $nativeItem : $item,
//   list: isReactNative ? $nativeList : $list,
//   tree: $tree,
//   transTree: transTree
// }