import React, { Component, PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import Layout from '../../layouts/Layout'
import Link from '../../widgets/Link'
import s from './DemoItem.css'

class DemoItem extends Component {
  render() {
    const { fetched } = this.props
    const item = fetched
    return (
      <Layout>
        <div>
          <p className={s.title}>Demo Item Page</p>
          <p>id: {item.id}</p>
          <p>name: {item.name}</p>
          <p>
            url: <Link to={item.url}>{item.url}</Link>
          </p>
          <p>string: { JSON.stringify(item) }</p>
        </div>
      </Layout>
    )
  }
}

export default withStyles(s)(DemoItem)
