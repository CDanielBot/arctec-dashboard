import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Notfound from '../routes/NotFoundRoute'
import LoginPage from '../pages/LoginPage'
import DashboardPage from 'pages/DashboardPage'
import AppRoute from './AppRoute'
import EmployeeRoute from './EmployeeRoute'
import LoginRoute from './LoginRoute'
import AccountSettingRoute from './AccountSettingsRoute'
import ConfigurationsPage from 'pages/ConfigurationsPage'
import AdminRoute from './AdminRoute'
import ProjectsRoute from './ProjectRoute'
import AnnouncementsPage from '../pages/AnnouncementsPage'
import UsersRoleManagementPage from '../pages/UsersRoleManagementPage'
import ProfilePage from 'pages/ProfilePage'

const Routes = () => (
  <Router>
    <Switch>
      <AppRoute path="/" exact={true} component={DashboardPage} />
      <LoginRoute path="/login" exact={true} component={LoginPage} />
      <AdminRoute path="/configurations" exact={true} component={ConfigurationsPage} />
      <AdminRoute path="/usersrolemanagement" exact={true} component={UsersRoleManagementPage} />
      <AppRoute path="/employee" component={EmployeeRoute} />
      <AppRoute path="/projects" component={ProjectsRoute} />
      <AppRoute path="/announcements" component={AnnouncementsPage} />
      <AppRoute path="/accountsettings" component={AccountSettingRoute} exact />
      <AppRoute path="/accountsettings/:id" component={ProfilePage} exact />
      <Route path="*" exact={true} component={Notfound} />
    </Switch>
  </Router>
)

export default Routes
