import React from 'react'
import path from 'path'

import config from '../../config'

import DemoItemListPage from '../components/containers/pages/DemoItemList'
import DemoItemPage from '../components/containers/pages/DemoItem'

import fetch from '../../utils/fetch'

export default {
  path: '/demo-items',
  // Note: routes are evaluated in order
  children: [
    {
      path: '/',
      async action(context) {
        let fetched = null
        if (context.fetch === true) {
          const res = await fetch(config.EXTERNAL_URL + path.resolve('/', config.WEBAPP_PREFIX, 'demo-mock-api/demo-items'))
          fetched = await res.json()
        }
        return {
          head: {
            title: 'demo-items',
            description: 'demo item list page',
          },
          element: {
            component: DemoItemListPage,
            props: {fetched: fetched},
          },
        }
      },
    },
    {
      path: '/:id/',
      async action(context) {
        let fetched = null
        if (context.fetch === true) {
          const res = await fetch(config.EXTERNAL_URL + path.resolve('/', config.WEBAPP_PREFIX, 'demo-mock-api/demo-items', context.params.id))
          fetched = await res.json()
        }
        return {
          head: {
            title: 'demo item',
            description: 'demo item page',
          },
          element: {
            component: DemoItemPage,
            props: {fetched: fetched},
          },
        }
      },
    }
  ],
}
