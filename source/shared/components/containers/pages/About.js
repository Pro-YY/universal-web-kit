import React, { Component, PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import Layout from '../../layouts/Layout'
import s from './About.css'

class About extends Component {
  render() {
    return (
      <Layout>
        <p className={s.title}>About Page</p>
      </Layout>
    )
  }
}

export default withStyles(s)(About)
