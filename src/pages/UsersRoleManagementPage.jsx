import React, { useState, useEffect } from 'react'
import { authThunks } from '../state/ducks/authDuck'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { employeeThunks } from '../state/ducks/employeeDuck'
import { Table, Avatar, Icon, Input, Select, Button, Modal } from 'antd'
import styled from 'styled-components'
import { UserEndpoints } from 'api'

const { Option } = Select

const filterEmployees = (employees, searchQuery, userProfile) => {
  const list = employees.filter(employee => employee.id !== userProfile.id && employee.active)

  return list.filter(
    ({ fullName }) => fullName.toLowerCase().includes(searchQuery.toLowerCase()) || !searchQuery
  )
}

const UsersRoleManagementPage = ({
  employeesList,
  employeeThunks,
  userProfile,
  authThunks,
  history
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [usersToUpdate, setUsersToUpdate] = useState([])
  const [isVisible, setIsVisible] = useState(false)

  const addUsersToUpdate = (e, user) => {
    const newUser = [...usersToUpdate.filter(u => u.id !== user.id), { ...user, role: e }]
    setUsersToUpdate(newUser)
  }

  const changeUsersRoles = async () => {
    if (!usersToUpdate.length) return
    for (let user in usersToUpdate) {
      await UserEndpoints.updateUser(usersToUpdate[user], usersToUpdate[user].id)
      setIsVisible(false)
    }
    await employeeThunks.getEmployees()
    setUsersToUpdate([])
  }

  useEffect(() => {
    const getEmployeesList = async () => {
      await employeeThunks.getEmployees()
    }
    getEmployeesList()
  }, [employeeThunks])

  const columns = [
    {
      key: 'pic',
      dataIndex: 'profilePicture',
      width: 50,
      render: (_, { profilePictureSrc }) => {
        return <Avatar icon="user" src={profilePictureSrc} />
      }
    },
    {
      key: 'name',
      title: 'Full Name',
      dataIndex: 'fullName',
      render: (_, { fullName, email }) => {
        return (
          <div>
            <p>{fullName}</p>
            <p style={{ marginBottom: 0 }}>{email}</p>
          </div>
        )
      },

      sorter: (a, b) => a.fullName.localeCompare(b.fullName)
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      render: (_, user) => {
        return (
          <Select
            defaultValue={user.role}
            style={{ width: '200px' }}
            onChange={e => addUsersToUpdate(e, user)}
          >
            <Option value="employee">Employee</Option>
            <Option value="admin">Admin</Option>
          </Select>
        )
      },
      sorter: (a, b) => a.role.localeCompare(b.role)
    }
  ]

  const employees = filterEmployees(employeesList, searchQuery, userProfile)

  return (
    <Page>
      <InputContainer>
        <Input
          placeholder="Search by name"
          style={{ width: 'auto' }}
          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
          onChange={({ target: { value } }) => setSearchQuery(value)}
        />
        <ButtonContainer>
          <Button type="primary" onClick={() => setIsVisible(true)} style={{ marginRight: '5px' }}>
            Save Changes
          </Button>

          <Button onClick={() => history.push('/')}>Discard Changes</Button>
        </ButtonContainer>
      </InputContainer>

      <EmployeeTable
        dataSource={employees}
        authThunks={authThunks}
        columns={columns}
        rowKey="id"
        pagination={{
          showSizeChanger: true
        }}
      />

      <Modal
        title="Change users roles"
        visible={isVisible}
        onOk={changeUsersRoles}
        onCancel={() => setIsVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsVisible(false)}>
            No
          </Button>,
          <Button key="submit" type="danger" onClick={changeUsersRoles}>
            Yes
          </Button>
        ]}
      >
        <p>Are you sure you want to change users roles ?</p>
      </Modal>
    </Page>
  )
}

const mapStateToProps = state => ({
  employeesList: state.employees.list,
  userProfile: state.auth.profile
})

const mapDispatch = dispatch => ({
  employeeThunks: bindActionCreators(employeeThunks, dispatch),
  authThunks: bindActionCreators(authThunks, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatch
)(UsersRoleManagementPage)

const InputContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding-bottom: 20px;
`

const ButtonContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`

const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 40px;
`
const EmployeeTable = styled(Table)``
