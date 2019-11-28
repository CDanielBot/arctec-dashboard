import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const LoginRoute = ({ user, profile, ...restProps }) => {
  if (user) {
    return <Redirect to="/" />
  }

  return <Route {...restProps} />
}

const mapStateToProps = state => ({ user: state.auth.user, profile: state.auth.profile })

export default connect(mapStateToProps)(LoginRoute)
