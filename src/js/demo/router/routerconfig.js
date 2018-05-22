import leaveDemoPage from './pages/leave'
import mywrap from './pages/wrap'

import itemUsage from './pages/item/usage'
import itemUsageJsx from './pages/item/usagejsx'
import itemUsageLink from './pages/item/usagelink'
import itemUsageImg from './pages/item/usageimg'
import itemUsageImgs from './pages/item/usageimgs'
import itemUsageImgsh from './pages/item/usageimgsh'
import itemUsageAttr from './pages/item/usageattr'
import itemUsageLi from './pages/item/usageli'
import itemUsageDd from './pages/item/usagedd'

import stateComponent from './pages/statecomponent'

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
