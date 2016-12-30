import React, { Component, PropTypes } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import config from '../../../config'
import Header from './Header'
import Footer from './Footer'
import s from './Layout.css'

// a more simple way to define a component
function Layout({ children }) {
  return (
    <div>
      <Header/>
      {children}
      <Footer/>
    </div>
  )
}

export default withStyles(s)(Layout)
