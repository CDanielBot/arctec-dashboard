import React from 'react'
import { withRouter } from 'react-router-dom'

const Notfound = withRouter(({ history }) => {
  const navigateToApp = () => {
    history.push('/')
  }

  return (
    <div>
      <h1>404, Page not found</h1>
      <button onClick={navigateToApp}>Back to app</button>
    </div>
  )
})

export default Notfound
