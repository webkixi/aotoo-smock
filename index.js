import aotoo from 'aotoo'

class Abc extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      content: 'no zuo no die'
    }
  }
  render(){
    return (
      <div className="myContainer">
        { this.state.content }
        <button id='change'>改变</button>
      </div>
    )
  }
}

const Actions = {
  CONTENT: function(ostate, opts){
    ostate.content = opts
    return ostate
  }
}

const abc = aotoo(Abc, Actions)

abc.render('test', function(dom, intent, ctx){
  const btn = document.querySelector('#change')
  btn.addEventListener('click', function(){
    abc.$content('u can u up')
  })
})
