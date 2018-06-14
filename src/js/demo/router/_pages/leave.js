function content(router) {
  const myData = [
    {title: '你好'},
    {title: '你妹'},
    {title: '什么才是美的'},
    {title: '没有什么事情的话就走吧'}
  ]

  let myTreeData = [
    {title: '你好', idf: 'root'},
    {title: '你妹', parent: 'root'},
    {title: '什么才是美的', parent: 'root'},
    {title: '没有什么事情的话就走吧', parent: 'root'}
  ]

  return Aotoo.tree({ data: myTreeData })
  // return <Aotoo.tree data={myTreeData}/>

  const itemData = {
    title: '好好学习',
    url: 'http://www.163.com'
  }

  return <Aotoo.item data={itemData} />

  return <Aotoo.list data={myData}/>
}

function forLeave(router) {
  return {
    main: function () {
      return content(router)
      // return <div>我是ao7</div>
    },
    enter: function (data) {
      return this.main()
    },
    leave: function () {
      console.log('======= 3333');
    }
  }
}

module.exports = forLeave