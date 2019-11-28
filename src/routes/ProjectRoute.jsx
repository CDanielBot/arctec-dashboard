import React from 'react'
import { Route, Switch } from 'react-router-dom'
import ProjectsPage from 'pages/ProjectsPage'
import ProjectPage from 'pages/ProjectPage'

const ProjectsRoute = () => (
  <Route
    path="/projects"
    render={({ match: { url } }) => (
      <React.Fragment>
        <Switch>
          <Route path={`${url}/`} component={ProjectsPage} exact />
          <Route path={`${url}/:id`} component={ProjectPage} exact />
        </Switch>
      </React.Fragment>
    )}
  />
)

export default ProjectsRoute
