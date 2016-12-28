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
          component: <HomePage/>
        }
      },
    },
    {
      path: '/home/',
      async action(context) {
        return {
          component: <HomePage/>
        }
      },
    }
  ],
}
