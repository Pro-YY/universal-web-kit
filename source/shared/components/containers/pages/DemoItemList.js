import React, { Component, PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import Layout from '../../layouts/Layout'
import Link from '../../widgets/Link'
import s from './DemoItemList.css'

class DemoItemList extends Component {
  render() {
    const { fetched } = this.props
    const list = fetched
    const listItems = list.map((item) =>
      <li key={item.id}>
        ID: {item.id} NAME: {item.name}
        <Link to={item.url}> LINK: {item.url} </Link>
      </li>
    )
    const listCount = list.length
    return (
      <Layout>
        <div>
          <p className={s.title}>Demo Item List Page</p>
          <p> fetched count: { listCount } </p>
          <ul>{ listItems }</ul>
        </div>
      </Layout>
    )
  }
}

export default withStyles(s)(DemoItemList)
