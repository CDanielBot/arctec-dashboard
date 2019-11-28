import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/NavBar'
import { connect } from 'react-redux'
import DisabledAccountRoute from './DisabledAccountRoute'

const AppRoute = ({ user, profile, ...restProps }) => {
  if (!user) {
    return <Redirect to="/login" />
  }

  if (!profile) {
    return <div>loading</div>
  }

  if (!profile.active) return <DisabledAccountRoute />

  return (
    <Container>
      <Sidebar user={user} profile={profile} />
      <PageContainer>
        <Navbar />
        <Route {...restProps} />
      </PageContainer>
    </Container>
  )
}

const mapStateToProps = state => ({ user: state.auth.user, profile: state.auth.profile })

export default connect(mapStateToProps)(AppRoute)

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const PageContainer = styled.section`
  display: flex;
  flex-direction: column;
  flex: 1;
`
