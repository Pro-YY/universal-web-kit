import React from 'react'
import AboutPage from '../components/containers/pages/About'

export default {
  path: '/about/',
  async action() {
    return {
      component: <AboutPage/>
    }
  },
}
