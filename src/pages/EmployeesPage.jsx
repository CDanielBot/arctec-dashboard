import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { employeeThunks } from '../state/ducks/employeeDuck'
import { projectThunks } from '../state/ducks/projectDuck'
import { Table, Avatar, Icon, Button, Input, Switch } from 'antd'
import CreateEmployeeModal from './employee/CreateEmployeeModal'
import trimEmail from 'utils'
import { authThunks } from '../state/ducks/authDuck'
import { ConfigurationsEndpoints } from 'api'
import IsAdmin from 'shared/IsAdmin'

const renderColumn = (active, component) => ({
  props: {
    style: { backgroundColor: !active && '#f0f0f0', '&:hover': { backgroundColor: 'red' } }
  },
  children: component()
})

const columns = [
  {
    key: 'pic',
    dataIndex: 'profilePicture',
    width: 50,
    render: (_, { profilePictureSrc, active }) =>
      renderColumn(active, () => <Avatar icon="user" src={profilePictureSrc} />)
  },
  {
    key: 'name',
    title: 'Full Name',
    dataIndex: 'fullName',
    render: (_, { fullName, email, active }) => {
      return renderColumn(active, () => (
        <div>
          <p>{fullName}</p>
          <p style={{ marginBottom: 0 }}>{email}</p>
        </div>
      ))
    },

    sorter: (a, b) => a.fullName.localeCompare(b.fullName)
  },
  {
    key: 'jobPosition',
    title: 'Job Position',
    dataIndex: 'jobPosition',
    render: (_, { jobPosition, active }) => renderColumn(active, () => <p>{jobPosition}</p>),

    sorter: (a, b) => a.jobPosition.localeCompare(b.jobPosition)
  },
  {
    key: 'phone',
    title: 'Phone Number',
    dataIndex: 'phoneNumber',
    render: (_, { phoneNumber, active }) => renderColumn(active, () => <p>{phoneNumber}</p>)
  }
]

const filterEmployees = (employees, searchQuery, userProfile, hideEmployees) => {
  const list =
    userProfile.role === 'admin'
      ? employees
          .filter(employee => employee.id !== userProfile.id)
          .filter(emp => (!hideEmployees ? emp.active : emp))
      : employees.filter(employee => employee.id !== userProfile.id && employee.active)

  return list.filter(
    ({ fullName }) => fullName.toLowerCase().includes(searchQuery.toLowerCase()) || !searchQuery
  )
}

const EmployeePage = ({
  employeeThunks,
  employeesList,
  userProfile,
  history,
  projectThunks,
  projects,
  inactiveUsers
}) => {
  const [visible, setVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [positions, setPositions] = useState([])

  useEffect(() => {
    const getEmployessList = async () => {
      try {
        await projectThunks.getProjects()
        const jobPositions = await ConfigurationsEndpoints.getConfigurations()
        setPositions(jobPositions)
      } catch (error) {}
    }

    getEmployessList()
  }, [projectThunks])

  const employees = filterEmployees(employeesList, searchQuery, userProfile, inactiveUsers)

  return (
    <Page>
      <InputContainer>
        <Input
          placeholder="Search by name"
          style={{ width: 'auto' }}
          prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
          onChange={({ target: { value } }) => setSearchQuery(value)}
        />
        <IsAdmin>
          <ButtonContainer>
            Show inactive users
            <Switch
              defaultChecked={inactiveUsers}
              onChange={() => employeeThunks.showInactiveUsers(!inactiveUsers)}
              style={{ margin: '0px 50px 0px 5px' }}
            />
            <Button type="primary" onClick={() => setVisible(true)}>
              <Icon type="user-add" />
              Add employee
            </Button>
          </ButtonContainer>
        </IsAdmin>
      </InputContainer>

      <EmployeeTable
        dataSource={employees}
        columns={columns}
        onRow={e => {
          return { onClick: () => history.push(`/employee/${trimEmail(e.email)}`) }
        }}
        rowKey="id"
        pagination={{
          showSizeChanger: true
        }}
        locale={{
          emptyText: 'No employees found.'
        }}
      />

      <CreateEmployeeModal
        visible={visible}
        onCancel={() => setVisible(false)}
        projects={projects}
        positions={positions}
        userProfile={userProfile}
      />
    </Page>
  )
}

const mapStateToProps = state => ({
  employeesList: state.employees.list,
  userProfile: state.auth.profile,
  projects: state.projects.list,
  inactiveUsers: state.employees.inactiveUsers
})

const mapDispatch = dispatch => ({
  employeeThunks: bindActionCreators(employeeThunks, dispatch),
  authThunks: bindActionCreators(authThunks, dispatch),
  projectThunks: bindActionCreators(projectThunks, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatch
)(EmployeePage)

const ButtonContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
`

const InputContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding-bottom: 20px;
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

const EmployeeTable = styled(Table)`
  .ant-table-row {
    :hover {
      cursor: pointer;
    }
  }
`
