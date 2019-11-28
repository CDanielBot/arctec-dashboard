import React from 'react'
import { connect } from 'react-redux'
import AppRoute from './AppRoute'
import { Redirect } from 'react-router-dom'

const AdminRoute = ({ profile, ...restProps }) => {
  if (!profile) return <Redirect to="/" />
  if (profile.role !== 'admin') return <h1>Unauthorized</h1>
  return <AppRoute {...restProps} />
}

const mapStateToProps = state => ({ profile: state.auth.profile })

export default connect(mapStateToProps)(AdminRoute)
