import React from 'react'

import NotFoundPage from '../components/containers/pages/NotFound'

export default {
  path: '*',
  async action() {
    return {
      head: {
        title: 'not-found',
        description: 'not-found page',
      },
      element: {
        component: NotFoundPage,
        props: {},
      }
    }
  },
}
