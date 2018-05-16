import $ from 'jquery'

const HelloWrap = (props) => {
  const router = props.inst
  const We = Aotoo.wrap(
    <div>
      <img src='/images/djsgd.jpeg' />
      {props.info}
    </div>,
    {
      rendered: function (dom) {
        $(dom).click(function (e) {
          router.back('a3')
        })
      },
      leave: function () {
        console.log('======== 5555')
      }
    }
  )
  return <We />
}



/** 
 * Ben测试代码
*/
const { PureComponent, Component } = React
class Test extends Component {
  constructor(props) {
    super(props)
    this.state = this.props || {}
  }

  render() {
    let { msg, arr_data } = this.state
    arr_data.forEach((element, index) => element.attr = {index: index} );
    return (
      <div className="wrap">
        {msg}
        {Aotoo.list({data: arr_data, itemClass: 'my-li'})}
        <button className="btn-test">点我修改</button>
      </div>
    )
  }
}

// 对应的redux
const Actions = {
  CHANGE_CONTENT: function (ostate, opts, ctx) {
    let state = { ...this.curState}
    state.msg = opts.msg
    return state
  },
  // 修改列表中的值
  MODIFY_LI_DATA: function (ostate, opts, ctx) {
    const state = { ...this.curState}
    const current_index = opts.current_index
    let { arr_data } = state
    arr_data[current_index].title = opts.title
    const newData = {
      ...state,
      arr_data
    }
    return newData
  }
}


function test(router) {
  // 生成Aotoo出来对象
  const TestPageInstance = Aotoo(Test, Actions, {
    props: {
      msg: '我是通过Aotoo渲染出来的',
      arr_data: [
        { "title": 66666 },
        { "title": 77777 }
      ]
    }
  })

  TestPageInstance.rendered = function (dom) {
    $(dom).find('.btn-test').on('click', function () {
      TestPageInstance.$change_content({
        msg: 'modify'
      })
    }),
    $(dom).find('.my-li').on('click', function (event) {
      const current_index = $(this).attr('data-index')
      TestPageInstance.$modify_li_data({
        current_index,
        title: '点击LI后被修改的'
      })
    })
  }

  return TestPageInstance.render()
}



function myWrap (router) {
  return {
    main: function () {
      // return <HelloWrap info='你妹' inst={router} />
      return test()
    }
  }
}

module.exports = myWrap
