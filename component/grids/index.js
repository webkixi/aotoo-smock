/**
 * 列表
 */
const {
  isString, 
  isObject, 
  isArray
} = Aotoo

class GridsBase extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      data: this.props.data||[]
    }
  }

  render(){
    const itemClassName = this.props.itemClass
    const listClassName = this.props.listClass
    
    const list = this.state.data.map( (item, ii)=>{
      const _key = _.uniqueId('grids_')
      return <li className={"grids_item "+(itemClassName||'')} key={_key}>{item}</li>
    })
    return (
      <div className={"grids_wrap "+(listClassName ? listClassName+'_parent':'')}>
        <ul className={"grids_list "+(listClassName||'')}>
          {list}
        </ul>
      </div>
    )
  }
}

const Actions = {
  REPLACE: function(ostate, opts){   // state = ostate, props=传进来的参数
    let curState = this.curState
    let data = curState.data
    if (isString(opts) || React.isValidElement(opts) || typeof opts == 'number') {
      data[0] = opts
    }

    if (isObject(opts) && opts.index && opts.content) {
      if (data[opts.index]) {
        data[opts.index] = opts.content
      }
    }

    curState.data = data
    return curState
  }
}


function myGrids(opts){
  if (opts.props) {
    opts.props.data = opts.data||[]
  } else {
    opts.props = {
      data: opts.data||[]
    }
  }
  const Gridx = Aotoo(GridsBase, Actions, opts)
  Gridx.extend({
    replace: function(partment){
      this.$replace(partment)
    }
  })
  return Gridx
}

export function grids(opts){
  let noop = function(){}
  let dft = {
    data: [],
    theme: 'grids',
    autoinject: true,
    props: false,
    container: false
  }
  if (typeof opts == 'object') dft = _.merge(dft, opts)
  return myGrids(dft)
}

export function pure(props){
  return grids(props)
}
