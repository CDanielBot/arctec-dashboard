import React from 'react'
import styled from 'styled-components'
import { Button, Dropdown, Menu } from 'antd'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Events from './NavBar/Events'

const Navbar = ({ userProfile }) => {
  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/accountsettings">Personal details</Link>
      </Menu.Item>

      {userProfile.role === 'admin' && (
        <Menu.Item>
          <Link to="/usersrolemanagement">Users role management</Link>
        </Menu.Item>
      )}
    </Menu>
  )

  return (
    <NavbarContainer>
      <NotificationContainer>
        <Events />
      </NotificationContainer>
      <SettingsContainer>
        <Dropdown overlay={menu} placement="bottomCenter">
          <Button shape="circle" icon="setting" />
        </Dropdown>
      </SettingsContainer>
    </NavbarContainer>
  )
}

const mapStateToProps = state => ({ userProfile: state.auth.profile })

export default connect(
  mapStateToProps,
  null
)(withRouter(Navbar))

const NavbarContainer = styled.nav`
  display: flex;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 40px;
  padding-right: 40px;
  align-items: center;
`
const NotificationContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`
const SettingsContainer = styled.div`
  padding-left: 25px;
`
