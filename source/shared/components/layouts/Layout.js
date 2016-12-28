import React, { Component, PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import config from '../../config'
import Link from './Link'
import s from './Layout.css'

// a more simple way to define a component
function Layout({ children }) {
  return (
    <div>
      <Link to={config.WEBAPP_BASEURL + "/home/"}>home</Link>
      ##
      <Link to={config.WEBAPP_BASEURL + "/about/"}>about</Link>
      {children}
    </div>
  )
}

export default withStyles(s)(Layout)
