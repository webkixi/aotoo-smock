Aotoo.inject.css(`
  .title-pic img{
    width: 200px;
    border: 2px solid red;
  }
  .title-pic .htitle{
    display: block;
  }
`)
module.exports = function (router) {
  return Aotoo.item({
    data: {
      title: '独角兽高达',
      img: '/images/djsgd.jpeg',
      url: 'http://www.agzgz.com',
      itemClass: 'title-pic'
    }
  })
}
