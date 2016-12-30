import React from 'react'

import HomePage from '../components/containers/pages/Home'

export default {
  path: '/',
  // Note: routes are evaluated in order
  children: [
    {
      path: '/',
      async action() {
        return {
          head: {
            title: 'home',
            description: 'home page',
          },
          element: {
            component: HomePage,
            props: {},
          },
        }
      },
    },
    {
      path: '/home/',
      async action(context) {
        return {
          head: {
            title: 'home',
            description: 'home page',
          },
          component: <HomePage/>,
          element: {
            component: HomePage,
            props: {},
          },
        }
      },
    }
  ],
}
