import React from 'react'
import AboutPage from '../components/containers/pages/About'

export default {
  path: '/about/',
  async action() {
    return {
      head: {
        title: 'about',
        description: 'about page',
      },
      element: {
        component: AboutPage,
        props: {},
      },
    }
  },
}
