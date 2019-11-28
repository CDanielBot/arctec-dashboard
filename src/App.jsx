import React, { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import Routes from './routes/index'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { authThunks } from './state/ducks/authDuck'
import { UserEndpoints } from 'api'
import { projectThunks } from 'state/ducks/projectDuck'
import { employeeThunks } from 'state/ducks/employeeDuck'
const App = ({ authThunks, projectThunks, employeeThunks }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const userProfile = await UserEndpoints.getUser(user.email)
        authThunks.authStateChanged(user, userProfile)
        await projectThunks.getAllProjectsIntegrations()
        projectThunks.loadProjectsTimeReportList()
        projectThunks.loadProjectsMilestonesList()
        employeeThunks.getEmployees()
        setLoading(false)
        return
      }

      authThunks.authStateChanged(null)
      setLoading(false)
    })
  }, [authThunks, projectThunks, employeeThunks])

  if (loading)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100vh'
        }}
      >
        Loading...
      </div>
    )

  return <Routes />
}

const mapDispatch = dispatch => ({
  authThunks: bindActionCreators(authThunks, dispatch),
  projectThunks: bindActionCreators(projectThunks, dispatch),
  employeeThunks: bindActionCreators(employeeThunks, dispatch)
})

export default connect(
  null,
  mapDispatch
)(App)
