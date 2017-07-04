require('./aotoo')
require('./demo/router')
const $ = require('jquery')

const WrapElement = Aotoo.wrap(
  <div>这个真好吃</div>, {
    rendered: function(dom){ },
    leave: function(){ }
  }
)

const forLeave = function(rter){
  console.log(rter);
  return {
    main: function(){
      return <div>来了, forLeave</div>
    },
    enter: function(){
      return this.main()
    },
    leave: function(){
      console.log('======= 3333');
    }
  }
}

const router = Aotoo.router({
  props: {
    animate: 'fade',
    data: [
      {title: '我是一级', idf: 'aa1'},
      {title: '我是二级', idf: 'aa2', parent: 'aa1'},
      {title: '我是三级', idf: 'aa3', parent: 'aa2'},
      {title: '我是四级A', content: '什么3', path: 'a4', attr:{path: 'a4'}, parent: 'aa3'},
      {title: '我是四级B', content: '什sssssss么4', path: 'a5', attr:{path: 'a5'}, parent: 'aa3'},
      {title: '我是一级B', content: forLeave, path: 'a2', attr:{path: 'a2'}},
      {title: '我是一级C', content: <WrapElement />, path: 'a3', attr:{path: 'a3'}, itemClass: 'yyy'},
    ],
    itemClass: 'nihao',
    routerClass: 'router-basic',
    // treeHeader: <div><a href="#"><img src="http://pic.c-ctrip.com/common/c_logo2013.png" /></a></div>,
    // treeFooter: <div className='xx'>你个妹妹</div>,
    itemMethod: function(dom){
      if($(dom).hasClass('itemroot')) {
        $(dom).find("li.nihao:not(.itemroot)").click(function(e){
          e.stopPropagation()
          const _path = $(this).attr('data-path')
          router.goto(_path)
        })
      } else {
        $(dom).click(function(e){
          e.stopPropagation()
          const _path = $(dom).attr('data-path')
          router.goto(_path)
        })
      }
    }
  }
})

router.render('test', function(dom){ })
