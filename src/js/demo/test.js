// import 'aotoo'
// import 'aotoo-web-widgets'
// import treex from 'aotoo-react-treex'
// import 'aotoo-mixins-iscroll'

// const inject = Aotoo.inject

// inject.css([
//   '/hello.css'
// ], function(){
//   inject.js('/hello.js', function(){
//     console.log('========= 3333eeee');
//   })
// });

// inject.css(
//   `
//     .item{
//       width: 300px;
//       height: 120px;
//     }
//     .img{
//       font-size: 2em;
//       font-weight: bold;
//     }
//   `
// )


// const treeTest = treex({
//   props: { 
//     data: [
//       {title: '1111'},
//       {title: '2222'},
//       {title: '1111'},
//       {title: '2222'},
//       {title: '1111'},
//       {title: '2222'},
//       {title: '1111'},
//       {title: '2222'},
//       {title: '1111'},
//       {title: '2222'},
//       {title: '1111'},
//       {title: '2222'},
//       {title: <div className="img">abcdefg</div>},
//       {title: '2222'},
//       {title: '1111'},
//       {title: '2222'},
//       {title: '3333'} 
//     ]
//   }
// })

// const btns = Aotoo.list({
//   data: [
//     <button id="update" className="btn">update</button>,
//     <button id="append" className="btn">append</button>,
//     <button id="prepend" className="btn">prepend</button>,
//     <button id="delete" className="btn">delete</button>
//   ]
// })

// // const LazyList = Aotoo.scroll(treeTest.render(), {
// //   container: window,
// //   elements: '.img',
// //   onscroll: function(cur){
// //     console.log(cur.toBottom);
// //   },
// //   oninrange: function(dom) {
// //     console.log(dom);
// //   }
// // })





// function IscrollBox(props){
//   return <div className='iscrollBox'>{treeTest.render()}</div>
// }

// const IscrollList = Aotoo.iscroll(<IscrollBox />, {
//   elements: '.img',
//   onscroll: function(lazy, direction){
//     lazy(function(ele){
//       console.log(ele);
//     })
//     // console.log('====== 1111');
//   },
//   onscrollend: function(lazy) {
//     console.log('====== 2222');
//   }
// })

// inject.css(`
//   .iscrollBox{
//     height: 400px;
//     overflow: hidden;
//   }
// `, 
// function(){
//   const Box = Aotoo.wrap(
//     <div>
//       <IscrollList />
//     </div>
//     , function(dom){
//       // $('#update').click(function(){
//       //   treeTest.$update({
//       //     data: [
//       //       {title: 'aaaaaa'},
//       //       {title: 'bbbbbb'},
//       //       {title: 'cccccc'}
//       //     ]
//       //   })
//       // })
//       // $('#append').click(function(){
//       //   treeTest.$append({
//       //     data: {title: '1111'}
//       //   })
//       // })
//       // $('#prepend').click(function(){
//       //   treeTest.$prepend({
//       //     data: {title: '1111'}
//       //   })
//       // })
//       // $('#delete').click(function(){
//       //   treeTest.$delete({
//       //     query: {title: '1111'}
//       //   })
//       // })
//     }
//   )

//   Aotoo.render(<Box />, 'test')
// })


class Aaa extends React.Component {
  render(){
    return (
      <div>
        {this.props.content}
      </div>
    )
  }
}
console.log('======== n111dee');
Aotoo.render(<Aaa content="什么呀kkk0900" />, 'test')