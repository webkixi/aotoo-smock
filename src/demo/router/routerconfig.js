import leaveDemoPage from './pages/leave'
import mywrap from './pages/wrap'

import itemUsage from './pages/item/usage'
import itemUsageJsx from './pages/item/usagejsx'

const Xxx = props => {
  return (
    <div>
      {props.info}
    </div>
  )
}

const routerData = [
  {
    title: '字符串',
    content: '内容为字符串',
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
  }
]

const itemRouter = [
  {
    title: 'Item',
    path: 'itemFather',
    idf: 'item'
  },
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
]

module.exports = routerData
