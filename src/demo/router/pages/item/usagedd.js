import $ from 'jquery'

/** 
 * with url
*/
module.exports = function (router) {
  return Aotoo.item({
    data: {
      title: '前端必读列表-下拉',
      li: [
        'JavaScript权威指南',
        '高流量网站CSS开发技术',
        'CSS权威指南',
        'JavaScript高级程序设计',
        <a href='http://es6.ruanyifeng.com/' target='__blank'>ECMAScript6入门</a>,
        '高性能JavaScript'
      ],
      itemClass: 'title-list-dd'
    }
  })
}
