import React, { Component, PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import s from './NotFound.css'

class NotFound extends Component {
  render() {
    return (
      <p className={s.title}>Not Found Page</p>
    )
  }
}

export default withStyles(s)(NotFound)
