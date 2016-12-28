import React, { Component, PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import Layout from '../../layouts/Layout'
import s from './Home.css'

class Home extends Component {
  render() {
    return (
      <Layout>
        <p className={s.title}>Home Page</p>
      </Layout>
    )
  }
}

export default withStyles(s)(Home)
