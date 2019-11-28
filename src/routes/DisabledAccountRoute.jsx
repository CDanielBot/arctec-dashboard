import React from 'react'
import { authThunks } from 'state/ducks/authDuck'
import { Redirect } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const DisabledAccountRoute = ({ authThunks }) => {
  const backToLogin = async () => {
    await authThunks.logout()
    return <Redirect to="/" />
  }

  return (
    <div>
      <h1>This account has been disabled.</h1>
      <button onClick={backToLogin}>Back to login</button>
    </div>
  )
}

const mapDispatch = dispatch => ({
  authThunks: bindActionCreators(authThunks, dispatch)
})

export default connect(
  null,
  mapDispatch
)(DisabledAccountRoute)
