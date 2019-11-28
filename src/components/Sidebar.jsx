import React, { useState } from 'react'
import styled from 'styled-components'
import { Menu, Icon, Button, Avatar } from 'antd'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { authThunks } from '../state/ducks/authDuck'
import { withRouter } from 'react-router-dom'
import IsAdmin from '../shared/IsAdmin'

const getSelectedMenuKeyBasedOnPath = location => {
  const { pathname } = location
  const pathWithoutFirstSlash = pathname.slice(1)

  if (pathWithoutFirstSlash.includes('/'))
    return pathWithoutFirstSlash.slice(0, pathWithoutFirstSlash.indexOf('/'))

  return pathWithoutFirstSlash ? pathWithoutFirstSlash : '/'
}

const Sidebar = ({ profile, authThunks, history }) => {
  const [collapsed, setCollapsed] = useState(false)
  const selectedMenuItemKey = getSelectedMenuKeyBasedOnPath(history.location)

  const logout = () => {
    authThunks.logout()
  }

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Container collapsed={collapsed}>
      {collapsed && (
        <AvatarContainer>
          <Avatar size={60} icon="user" src={profile.profilePictureSrc} />
        </AvatarContainer>
      )}

      {!collapsed && (
        <React.Fragment>
          <AvatarContainer>
            <StyledAvatar icon="user" src={profile.profilePictureSrc} />
          </AvatarContainer>

          <UserContainer>
            <h1>{profile.fullName}</h1>
          </UserContainer>
        </React.Fragment>
      )}

      <Menu
        selectedKeys={[selectedMenuItemKey]}
        mode="inline"
        inlineCollapsed={collapsed}
        style={{ flex: 1 }}
      >
        <Menu.Item key="/">
          <Icon type="pie-chart" />
          <span>Dashboard</span>
          <Link to="/" />
        </Menu.Item>

        <Menu.Item key="employee">
          <Icon type="user" />
          <span>Employees</span>
          <Link to="/employee" />
        </Menu.Item>

        <Menu.Item key="projects">
          <Icon type="project" />
          <span>Projects</span>
          <Link to="/projects" />
        </Menu.Item>

        <Menu.Item key="announcements">
          <Icon type="notification" />
          <span>Announcements</span>
          <Link to="/announcements" />
        </Menu.Item>

        <IsAdmin>
          <Menu
            selectedKeys={[selectedMenuItemKey]}
            mode="inline"
            inlineCollapsed={collapsed}
            style={{ flex: 1 }}
          >
            <Menu.Item key="configurations">
              <Icon type="control" />
              <span>Configurations</span>
              <Link to="/configurations" />
            </Menu.Item>
          </Menu>
        </IsAdmin>
      </Menu>

      <Button type="primary" onClick={logout} style={{ marginBottom: 16, width: '100%' }}>
        <Icon type={'logout'} />
        {!collapsed && <span>Logout</span>}
      </Button>

      <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16, width: '100%' }}>
        <Icon type={collapsed ? 'menu-unfold' : 'menu-fold'} />
      </Button>
    </Container>
  )
}

const mapDispatch = dispatch => ({
  authThunks: bindActionCreators(authThunks, dispatch)
})

export default connect(
  null,
  mapDispatch
)(withRouter(Sidebar))

const Container = styled.section`
  @media screen and (max-width: 1400) {
    width: ${({ collapsed }) => (collapsed ? 'auto' : '150px')};
  }
  width: ${({ collapsed }) => (collapsed ? 'auto' : '350px')};
  display: flex;
  flex-direction: column;
`

const StyledAvatar = styled(Avatar)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 150px;

  @media screen and (max-height: 970px) {
    width: 75px;
    height: 75px;
    .anticon {
      font-size: 50px;
    }
  }
  @media screen and (max-height: 500px) {
    width: 50px;
    height: 50px;
    .anticon {
      font-size: 25px;
    }
  }
  @media screen and (max-height: 400px) {
    width: 0px;
    height: 0px;
    .anticon {
      font-size: 70px;
    }
  }
`

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 15%;
`
const UserContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;

  height: 5%;
`
