import treex from 'aotoo-react-treex'
// import treex from '../../../atree'

function getInput(val) {
  if (val) {
    return <input type="text" defaultValue={val}/>
  } else {
    return <input type="text" />
  }
}

const treexData = [
  {title: ' ', body:[<div>这是哪里</div>], itemClass: 'xxx-123'},
  {title: getInput('aaa')},
  {title: getInput()},
  {title: getInput()},
  {title: getInput('ccc')},
  {title: getInput()},
  {title: getInput()},
  {title: getInput()}
]

const updateData = [
  {title: getInput('xxx')},
  {title: getInput()},
  {title: getInput('yyy')}
]

const updateData1 = [
  {title: 'xxx'},
  {title: '222'},
  {title: '333'},
  {title: 'yyy'},
]

function demo(router) {
  const TreexDemo = treex({
    props: {
      data: []
    }
  })
  TreexDemo.$update({data: treexData})
  // TreexDemo.setProps({ data: treexData })
  const Demo = Aotoo.wrap(
    <div>
      {TreexDemo.render()}
      <button>AAAA</button>
    </div>,
    function (dom) {
      $(dom).find('button').click(function(e) {
        // TreexDemo.$update({data: updateData})
        // TreexDemo.$append({data: updateData})
        TreexDemo.$update({index: 2, data: {title: '===xxx'}})
      })
      // setTimeout(() => {
      //   TreexDemo.$update({data: updateData1})
      // }, 5000);
    }
  )
  return <Demo />
}

export default function index(router) {
  return {
    main: function () {
      return demo(router)
    },
    enter: function (data) {
      return this.main()
    },
    leave: function () {
      console.log('======= 3333');
    }
  }
}