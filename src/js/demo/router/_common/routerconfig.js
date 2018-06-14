import leaveDemoPage from '../_pages/leave'
import mywrap from '../_pages/wrap'

import itemUsage from '../_pages/item/usage'
import itemUsageJsx from '../_pages/item/usagejsx'
import itemUsageLink from '../_pages/item/usagelink'
import itemUsageImg from '../_pages/item/usageimg'
import itemUsageImgs from '../_pages/item/usageimgs'
import itemUsageImgsh from '../_pages/item/usageimgsh'
import itemUsageAttr from '../_pages/item/usageattr'
import itemUsageLi from '../_pages/item/usageli'
import itemUsageDd from '../_pages/item/usagedd'

import stateComponent from '../_pages/statecomponent'
import gridsComponent from "../_pages/grids";
import treexComponent from "../_pages/treexdemo";
import tabsComponent from "../_pages/tabs";

const Xxx = props => {
  return (
    <div>
      {props.info}
    </div>
  )
}

let routerData = [
  {
    title: '字符串',
    content: '内容为字符串bbb',
    path: 'a1',
    attr: {
      path: 'a1'
    }
  },

  {
    title: 'leave demo',
    content: leaveDemoPage,
    path: 'leave',
    attr: {
      path: 'leave'
    }
  },

  {
    title: 'react fun',
    content: <Xxx info='你好' />,
    path: 'rfun',
    attr: {
      path: 'rfun'
    },
    itemClass: 'yyy'
  },

  {
    title: 'wrap demo',
    content: mywrap,
    path: 'wrap',
    attr: {
      path: 'wrap'
    },
    itemClass: 'yyy'
  },
  {
    title: '状态组件',
    path: 'stateComponent',
    content: stateComponent,
    attr: { path: 'stateComponent' }
  },
  {
    title: '栅格组件',
    path: 'gridsComponent',
    content: gridsComponent,
    attr: { path: 'gridsComponent' }
  },
  {
    title: 'treex组件',
    path: 'treexComponent',
    content: treexComponent,
    attr: { path: 'treexComponent' }
  },
  {
    title: 'tabs组件',
    path: 'tabsComponent',
    content: tabsComponent,
    attr: { path: 'tabsComponent' }
  },
]

let itemRouter = [
  { title: 'Item', path: 'itemFather', idf: 'item' },
  {
    title: '简单使用',
    path: 'usage',
    parent: 'item',
    content: itemUsage,
    attr: { path: 'usage' }
  },
  {
    title: '简单使用JSX',
    path: 'usagejsx',
    parent: 'item',
    content: itemUsageJsx,
    attr: { path: 'usagejsx' }
  },
  {
    title: '链接',
    path: 'usagelink',
    parent: 'item',
    content: itemUsageLink,
    attr: { path: 'usagelink' }
  },
  {
    title: '图文',
    path: 'itemUsageImg',
    parent: 'item',
    content: itemUsageImg,
    attr: { path: 'itemUsageImg' }
  },
  {
    title: '图文集',
    path: 'itemUsageImgs',
    parent: 'item',
    content: itemUsageImgs,
    attr: { path: 'itemUsageImgs' }
  },
  {
    title: '图文集-横向',
    path: 'itemUsageImgsh',
    parent: 'item',
    content: itemUsageImgsh,
    attr: { path: 'itemUsageImgsh' }
  },
  {
    title: '自定义属性',
    path: 'itemUsageAttr',
    parent: 'item',
    content: itemUsageAttr,
    attr: { path: 'itemUsageAttr' }
  },
  {
    title: 'li结构',
    path: 'itemUsageLi',
    parent: 'item',
    content: itemUsageLi,
    attr: { path: 'itemUsageLi' }
  },
  {
    title: '下拉菜单',
    path: 'itemUsageDd',
    parent: 'item',
    content: itemUsageDd,
    attr: { path: 'itemUsageDd' }
  },
]

routerData = itemRouter.concat(routerData)

module.exports = routerData
