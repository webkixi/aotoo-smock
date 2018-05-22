import $ from 'jquery'
import 'aotoo-react-router'

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
    back: ' outHeight block-out-right contentHide'
  }
}

const routerData = require('./routerconfig')

const router = Aotoo.router({
  animatecss: _animatecss,
  props: {
    animate: 'right',
    data: routerData,
    routerClass: 'router-basic',
    showMenu: true,
    itemMethod: function (dom) {
      $(dom).off('click').on('click', function (e) {
        e.stopPropagation()
        const _path = $(this).attr('data-path')
        if (_path) {
          router.goto(_path)
        }
      })
      $(dom).find('.itemCategory ul.property-ul li').off('click').on('click', function (e) {
        e.stopPropagation()
        const _path = $(this).attr('data-path')
        if (_path) {
          router.goto(_path)
        }
      })
    }
  }
})

router.start('a1')
router.render('test')
