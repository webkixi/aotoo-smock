// import grids from 'component/grids'

function content(router) {
  var Kyy = <button onClick={()=>console.log('========= 123')}>234</button>
  return Kyy
  const Abc = Aotoo.wrap(
    <div>
      <button onClick={()=>this.onHandleClick()}>AAAAA</button>
    </div>,
    {
      onHandleClick: function(e) {
        alert(3)
      }
    }
  )
  return <Abc />
}


function myclick(e) {
  alert(3)
}
export default function index(router) {
  return {
    main: function () {
      return <button onClick={()=>console.log('========= 123')}>234</button>
    },
    enter: function (data) {
      return this.main()
    },
    leave: function () {
      console.log('======= 3333');
    }
  }
}