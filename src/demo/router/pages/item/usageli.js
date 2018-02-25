import $ from 'jquery'

Aotoo.inject.css(`
.title-list .itemCategory .itemrootCkb,
.title-list-dd .itemCategory .itemrootCkb {
  display: none;
}
.title-list .itemCategory .caption,
.title-list-dd .itemCategory .caption {
  font-size: 20px;
}
.title-list .itemCategory a,
.title-list-dd .itemCategory a {
  text-decoration: underline;
  font-weight: 800;
}
.title-list .itemCategory li,
.title-list-dd .itemCategory li {
  padding: 5px;
}
.title-list .itemCategory li:nth-of-type(odd),
.title-list-dd .itemCategory li:nth-of-type(odd) {
  background-color: #f7f7f7;
}
.title-list .itemCategory li:nth-of-type(even),
.title-list-dd .itemCategory li:nth-of-type(even) {
  padding-left: 5px;
}
.title-list-dd .itemCategory {
  position: relative;
}
.title-list-dd .itemCategory .caption {
  font-size: 1em;
  padding: 0.5em;
  display: block;
  margin-bottom: 3px;
  position: relative;
  z-index: 9;
  width: 160px;
  height: 40px;
  padding-right: 2em;
  line-height: 24px;
  box-shadow: 3px 3px 8px #888;
}
.title-list-dd .itemCategory .caption:after {
  content: '+';
  position: absolute;
  right: 1em;
  top: 0.4em;
}
.title-list-dd .itemCategory ul {
  display: none;
  border: 1px solid #000;
  width: 160px;
}
.title-list-dd .itemCategory ul li {
  width: 158px;
  padding: 10px 5px;
}
.title-list-dd .itemCategory .itemrootCkb {
  position: absolute;
  left: 0;
  top: 0;
  width: 160px;
  height: 40px;
  display: block;
  z-index: 10;
  opacity: 0;
}
.title-list-dd .itemCategory >input[type=checkbox]:checked +.caption {
  transform: translate(1px, 1px);
  box-shadow: -2px -2px 4px #888;
  border-bottom: 1px solid #cfcfcf;
  border-left: 1px solid #cfcfcf;
  border-top: 1px solid #cfcfcf;
}
.title-list-dd .itemCategory >input[type=checkbox]:checked +.caption:after {
  content: '-';
}
.title-list-dd .itemCategory >input[type=checkbox]:checked ~ul {
  display: block;
}
`)

/** 
 * with url
*/
module.exports = function (router) {
  return Aotoo.item({
    data: {
      title: '前端必读列表',
      li: [
        'JavaScript权威指南',
        '高流量网站CSS开发技术',
        'CSS权威指南',
        'JavaScript高级程序设计',
        <a href='http://es6.ruanyifeng.com/' target='__blank'>ECMAScript6入门</a>,
        '高性能JavaScript'
      ],
      itemClass: 'title-list'
    }
  })
}
