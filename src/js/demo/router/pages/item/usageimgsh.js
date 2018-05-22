Aotoo.inject.css(`
  .title-imgs img{
    width: 130px
    border: 2px solid red
  }
  .title-imgs .htitle{
    display: block
  }
  .horizon .himg{
    display: flex
  }
  .horizon .himg li{
    margin-right: 0.2em;
  }
`)
module.exports = function (router) {
  return Aotoo.item({
    data: {
      title: '反浩克装甲',
      img: [
        'http://picdo.9669.cn/flash/img/14/abf6173203c753ecea2845c6f07739.jpg',
        'http://picdo.9669.cn/flash/img/14/abf6173203c753ecea2845c6f07739.jpg',
        'http://picdo.9669.cn/flash/img/14/abf6173203c753ecea2845c6f07739.jpg'
      ],
      url: 'http://www.agzgz.com',
      itemClass: 'title-imgs horizon'
    }
  })
}
