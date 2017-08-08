const transTree = require('./tree')

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

Aotoo.plugins('item', $item)
Aotoo.plugins('list', $list)
Aotoo.plugins('tree', $tree)
Aotoo.plugins('transTree', transTree)

module.exports = {}