import $ from 'jquery'

Aotoo.inject.css(`
  .attr-pic img{
    width: 100%;
  }
  .attr-pic .htitle{
    display: block;
  }
`)

/** 
 * with url
*/
module.exports = function (router) {
  return Aotoo.item({
    data: {
      title: (
      <div>
        <h4>独角兽高达</h4> 点击下图，查看属性，或者审查元素，查看data-*属性
      </div>
      ),
      img: '/images/djsgd.jpeg',
      attr: {
        id: 'your id',
        name: 'your name'
      }
    },
    itemClass: 'attr-pic',
    itemMethod: function (dom) {
      $(dom).click(function (e) {
        const id = $(dom).attr('data-id')
        const name = $(dom).attr('data-name')
        alert(`
        容器属性
        data-id: "${id}"
        data-name: "${name}"
      `)
      })
    }
  })
}
