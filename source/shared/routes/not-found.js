import React from 'react'

import config from '../config'
import NotFoundPage from '../components/containers/pages/NotFound'

export default {
  path: '*',
  async action() {
    return {
      component: <NotFoundPage/>
    }
  },
}
