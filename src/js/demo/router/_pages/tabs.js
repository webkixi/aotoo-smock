import 'aotoo-react-tabs'
const Tabs = Aotoo.tabs()


function app(router) {
  const tabsData = [
    {title: <a onClick={()=>Tabs.$select(0)}>aaa</a>, content: '什么, what1'},
    {title: <a onClick={()=>Tabs.$select(1)}>bbb</a>, content: <button onClick={()=>router.goto('itemUsageImgs')}>abc</button>},
    {title: <a onClick={()=>Tabs.$select('test')}>abc</a>, path: 'test', content: '<WrapElement />'},
  ]
  return (
    <Tabs.x 
      tabClass="tabs-nornal-top" 
      data={tabsData} 
      showMenu={true}
    />
  ) 
}

export default function index(router) {
  return {
    main: function () {
      return app(router)
    },
    enter: function (data) {
      return this.main()
    },
    leave: function () {
      console.log('======= 3333');
    }
  }
}