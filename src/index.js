import './index.styl'
import 'aotoo'
import 'aotoo-web-widgets'
import $ from 'jquery/dist/jquery.min'
import 'aotoo-react-tabs'
import treex from 'aotoo-react-treex'

const treex_a_data = { props: { data: ['1','2','3','4'] } }

const treex_b_data = { props: { data: [] } }

const treex_c_data = { props: { data: [] } }

const updata_data = {
  a: {data: ['a','b','c']},
  b: {data: ['44','55','66']},
  c: {data: ['xx','yy','zz']}
}

const trees = {
  a: treex(treex_a_data),
  b: treex(treex_b_data),
  c: treex(treex_c_data)
}

// {title: 'ccc', content: <WrapElement />},

const Tabs = Aotoo.tabs({
  props: {
    tabClass: 'tabs-normal-top',
    data: [
      {title: 'aaa', content: trees['a'].render() },
      {title: 'bbb', content: trees['b'].render() },
      {title: 'ccc', content: trees['c'].render() },
    ],
    tabItemMethod: function(dom, index){
      $(dom).off().one('click', function(){
        Tabs.$select({ select: index })
        switch (index) {
          case 0:
            trees['a'].$update(updata_data['a'])
            break;
          case 1:
          trees['b'].$update(updata_data['b'])
            break;
          case 2:
          trees['c'].$update(updata_data['c'])
            break;
        }
      })
    }
  }
})

Tabs.render('test')

// import 'aotoo'
// import 'aotoo-web-widgets'
// import treex from 'aotoo-react-treex'

// const treeList = treex({
//   props: {
//     data: [
//       {title: '典型页面', content: '123', idf: 'aaa'},
//       {title: '典型页面1', content: 'aaa', idf: 'bbb', parent: 'aaa'},
//       {title: '典型页面2', content: 'bbb', parent: 'aaa', attr: {"href":'http://www.163.com'}},
//       {title: '典型页面3', content: 'ccc', parent: 'aaa'},
//       {title: '典型页面4', content: 'ddd', parent: 'bbb'},
//       {title: '典型页面5', content: 'eee', parent: 'bbb'},
//       {title: '导航', content: '111'},
//       {title: '表单', content: '333'},
//       {title: '列表', content: '444'},
//       {title: '高级搜索', content: '5555'}
//     ]
//   }
// })

// Aotoo.render(treeList.render(), 'test')

// require('./aotoo')
// require('./demo/router')
// const $ = require('jquery')

// const WrapElement = Aotoo.wrap(
//   <div>这个真好吃</div>, {
//     rendered: function(dom){ },
//     leave: function(){ }
//   }
// )

// const forLeave = function(rter){
//   console.log(rter);
//   return {
//     main: function(){
//       return <div>来了, forLeave</div>
//     },
//     enter: function(){
//       return this.main()
//     },
//     leave: function(){
//       console.log('======= 3333');
//     }
//   }
// }

// const routerData = [
//   {title: '我是一级', idf: 'aa1'},
//   {title: '我是二级', idf: 'aa2', parent: 'aa1'},
//   {title: '我是三级', idf: 'aa3', parent: 'aa2'},
//   {title: '我是四级A', content: '什么3', path: 'a4', attr:{path: 'a4'}, parent: 'aa3'},
//   {title: '我是四级B', content: '什sssssss么4', path: 'a5', attr:{path: 'a5'}, parent: 'aa3'},
//   {title: '我是一级B', content: forLeave, path: 'a2', attr:{path: 'a2'}},
//   {title: '我是一级C', content: <WrapElement />, path: 'a3', attr:{path: 'a3'}, itemClass: 'yyy'},
// ]

// const router = Aotoo.router({
//   props: {
//     animate: 'fade',
//     data: routerData,
//     itemClass: 'nihao',
//     routerClass: 'router-basic',
//     // treeHeader: <div><a href="#"><img src="http://pic.c-ctrip.com/common/c_logo2013.png" /></a></div>,
//     // treeFooter: <div className='xx'>你个妹妹</div>,
//     itemMethod: function(dom){
//       if($(dom).hasClass('itemroot')) {
//         $(dom).find("li.nihao:not(.itemroot)").click(function(e){
//           e.stopPropagation()
//           const _path = $(this).attr('data-path')
//           router.goto(_path)
//         })
//       } else {
//         $(dom).click(function(e){
//           e.stopPropagation()
//           const _path = $(dom).attr('data-path')
//           router.goto(_path)
//         })
//       }
//     }
//   }
// })
// router.start('a4')
// router.render('test', function(dom){ })
