import at from './aotoo'
import treex from 'aotoo-react-treex'
import style from './index.styl'

const inject = require('aotoo-inject')()

inject.css([
  '/index.css',
  '/hello.css'
], function(){
  inject.js('/hello.js', function(){
    console.log('========= 3333eeee');
  })
});

inject.css(
  `
    .item{
      width: 300px;
      height: 120px;
    }
    .img{
      font-size: 2em;
      font-weight: bold;
    }
  `
)

const treeTest = treex({
  props: { 
    data: [
      {title: '1111'},
      {title: '2222'},
      {title: '1111'},
      {title: '2222'},
      {title: '1111'},
      {title: '2222'},
      {title: '1111'},
      {title: '2222'},
      {title: '1111'},
      {title: '2222'},
      {title: '1111'},
      {title: '2222'},
      {title: <div className="img">abcdefg</div>},
      {title: '2222'},
      {title: '1111'},
      {title: '2222'},
      {title: '3333'} 
    ]
  }
})

const btns = Aotoo.list({
  data: [
    <button id="update" className="btn">update</button>,
    <button id="append" className="btn">append</button>,
    <button id="prepend" className="btn">prepend</button>,
    <button id="delete" className="btn">delete</button>
  ]
})

const LazyList = Aotoo.lazy(treeTest.render(), {
  container: window,
  elems: '.img',
  ondataload: function(dom) {
    console.log(dom);
  }
})


const Box = Aotoo.wrap(
  <div>
    {/*{treeTest.render()}*/}
    <LazyList />
    {btns}
  </div>
  , function(dom){
    $('#update').click(function(){
      treeTest.$update({
        data: [
          {title: 'aaaaaa'},
          {title: 'bbbbbb'},
          {title: 'cccccc'}
        ]
      })
    })
    $('#append').click(function(){
      treeTest.$append({
        data: {title: '1111'}
      })
    })
    $('#prepend').click(function(){
      treeTest.$prepend({
        data: {title: '1111'}
      })
    })
    $('#delete').click(function(){
      treeTest.$delete({
        query: {title: '1111'}
      })
    })
  }
)


Aotoo.render(<Box />, 'test')