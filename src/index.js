require('./aotoo')
require('./demo/router')
const $ = require('jquery')

const WrapElement = Aotoo.wrap(
  <div>这个真好吃</div>, {
    rendered: function(dom){ },
    leave: function(){ }
  }
)

const forLeave = function(){
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
    data: [
      // {title: 'aaa', content: '什么', idf: 'le1', itemClass: 'aabbcc'},
      {title: 'aaa', content: '什么, what', path: 'a1', attr:{path: 'a1'}, idf: 'aa1'},
      {title: 'aaa1', content: '什么1', path: 'a-1', attr:{path: 'a1'}, idf: 'aa2', parent: 'aa1'},
      {title: 'aaa2', content: '什么2', path: 'a-2', attr:{path: 'a1'}, idf: 'aa3', parent: 'aa2'},
      {title: 'aaa3', content: '什么3', path: 'a-3', attr:{path: 'a1'}, itemClass: 'yyy',             parent: 'aa3'},
      {title: 'aaa4', content: '什么4', path: 'a-4', attr:{path: 'a1'}, itemClass: 'yyy',             parent: 'aa3'},
      {title: 'bbb', content: forLeave, path: 'a2', attr:{path: 'a2'}},
      {title: 'ccc', content: <WrapElement />, path: 'a3', attr:{path: 'a3'}, itemClass: 'yyy'},
    ],
    itemClass: 'nihao',
    routerClass: 'tabs-nornal-top',
    itemMethod: function(dom){
      if ($(dom).hasClass('itemroot')) {
        const item = $(dom).find("li.nihao:not(.itemroot)")
        const _path = $(item).attr('data-path')
        $(item).click(function(){
          router.goto(_path)
        })
      } else {
        const _path = $(dom).attr('data-path')
        $(dom).click(function(){
          router.goto(_path)
        })
      }
    }
  }
})

router.render('test', function(dom){ })
