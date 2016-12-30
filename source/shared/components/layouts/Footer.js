import React, { Component, PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import path from 'path'

import config from '../../../config'
import Link from '../widgets/Link'
import s from './Footer.css'

// a more simple way to define a component
function Footer() {
  return (
    <div>
      <Link className={s.link} to={path.resolve('/', config.WEBAPP_PREFIX, 'home')}>home</Link>
      ##
      <Link className={s.link} to={path.resolve('/', config.WEBAPP_PREFIX, 'about')}>about</Link>
      ##
      <Link className={s.link} to={path.resolve('/', config.WEBAPP_PREFIX, 'demo-items')}>list</Link>
      ##
      <Link className={s.link} to={path.resolve('/', config.WEBAPP_PREFIX, 'demo-items', '1')}>item</Link>
    </div>
  )
}

export default withStyles(s)(Footer)
