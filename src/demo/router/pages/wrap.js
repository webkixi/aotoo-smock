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

function myWrap (router) {
  return {
    main: function () {
      return <HelloWrap info='你妹' inst={router} />
    }
  }
}

module.exports = myWrap
