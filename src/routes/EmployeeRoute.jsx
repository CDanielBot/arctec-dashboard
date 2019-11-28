import React from 'react'
import { Route, Switch } from 'react-router-dom'
import EmployeePage from 'pages/EmployeesPage'
import ProfilePage from 'pages/ProfilePage'

const EmployeeRoute = () => (
  <Route
    path="/employee"
    render={({ match: { url } }) => (
      <React.Fragment>
        <Switch>
          <Route path={`${url}/`} component={EmployeePage} exact />
          <Route path={`${url}/:id`} component={ProfilePage} exact />
        </Switch>
      </React.Fragment>
    )}
  />
)

export default EmployeeRoute
