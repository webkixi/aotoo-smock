import './router.styl'
import $ from "jquery";
import 'aotoo-react-router'

// page
const WrapElement = Aotoo.wrap(
  <div>
    我是a4
  </div>, {
    rendered: function (dom) { },
    leave: function () {
      console.log('======== 4444');
    }
  }
)

const HelloWrap = (props) => {
  const router = props.inst
  const We = Aotoo.wrap(
    <div>
      {props.info}
    </div>, {
      rendered: function (dom) {
        $(dom).click(function(e) {
          router.back('a3')
        })
      },
      leave: function () {
        console.log('======== 4444');
      }
    }
  )
  return <We />
}

function MyWrap(router) {
  return {
    main: function() {
      return <HelloWrap info="你妹" inst={router} />
    }
  }
}

const Xxx = (props)=>{
  return <div>
    {props.info}
  </div>
}

const forLeave = function (rter) {
  return {
    main: function () {
      return <div>我是a3</div>
    },
    enter: function (data) {
      return this.main()
    },
    leave: function () {
      console.log('======= 3333');
    }
  }
}


const routerData = [
  { 
    title: '我是四级A', 
    content: '我是a1', 
    path: 'a1', attr: { path: 'a1' }},
  { 
    title: '我是四级B', 
    content: '我是a2', 
    path: 'a2', attr: { path: 'a2' }},
  { 
    title: '我是一级B', 
    content: forLeave, 
    path: 'a3', attr: { path: 'a3' } },
  { 
    title: '我是一级C', 
    content: <Xxx info="你好" />, 
    path: 'a4', attr: { path: 'a4' }, itemClass: 'yyy' },
  { 
    title: '我是一级x', 
    content: MyWrap, 
    path: 'a5', attr: { path: 'a5' }, itemClass: 'yyy' },
]

let _animatecss = {
  fade: {
    in: ' fadeIn animated-faster',
    rein: ' fadeIn animated-fastest',
    out: ' fadeOut contentHide animated-fastest',
    back: ' fadeOut contentHide animated-faster'
  },

  left: {
    in: ' fadeInLeft animated-faster',
    rein: ' fadeIn animated-fastest',
    out: ' fadeOut contentHide animated-fastest',
    back: ' fadeOutLeft contentHide animated-faster'
  },

  right: {
    in: ' block-in-right',
    rein: ' fade-in',
    out: ' outHeight fade-out contentHide',
    back: ' outHeight block-out-right contentHide',
  }
}

const router = Aotoo.router({
  animatecss: _animatecss,
  props: {
    animate: 'right',
    data: routerData,
    routerClass: 'router-basic',
    showMenu: true,
    itemMethod: function(dom) {
      const _path = $(dom).attr('data-path')
      $(dom).click(function(e) {
        router.goto(_path)
      })
    }
  }
})

router.start('a1')

router.render('test')