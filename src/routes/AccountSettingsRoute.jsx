import React from 'react'
import { Redirect } from 'react-router-dom'
import trimEmail from 'utils'
import { connect } from 'react-redux'
import ProfilePage from 'pages/ProfilePage'

const AccountSettingsRoute = ({ user, match: { path } }) => {
  return <Redirect to={`${path}/${trimEmail(user.email)}`} component={ProfilePage} exact />
}

const mapStateToProps = state => ({ user: state.auth.user })

export default connect(mapStateToProps)(AccountSettingsRoute)
