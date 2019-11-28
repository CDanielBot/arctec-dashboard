import React, { useEffect, useState } from 'react'
import { Table, Icon, Button, Input, Switch } from 'antd'
import styled from 'styled-components'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { projectThunks } from '../state/ducks/projectDuck'
import CreateProjectModal from './project/CreateProjectModal'
import { employeeThunks } from 'state/ducks/employeeDuck'
import IsAdmin from 'shared/IsAdmin'

const renderColumn = (active, component) => ({
  props: {
    style: { backgroundColor: !active && '#f0f0f0', '&:hover': { backgroundColor: 'red' } }
  },
  children: component()
})

const ProjectsPage = ({
  projectThunks,
  projects,
  projectManagers,
  history,
  employeeThunks,
  employees,
  userProfile,
  inactiveProjects,
  showProjectsWorkingOn
}) => {
  const [visible, setVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const activeEmployeesList = employees.filter(employee => employee.active)

  const getNameById = id => {
    const managers = projectManagers.filter(item => {
      if (item.id === id) {
        return item
      }
      return null
    })
    const manager = { ...managers[0] }
    return manager.fullName
  }

  useEffect(() => {
    const getProjectsList = async () => {
      Promise.all([
        projectThunks.getProjects(),
        employeeThunks.getProjectManagers(),
        employeeThunks.getEmployees()
      ])
    }
    getProjectsList()
  }, [projectThunks, employeeThunks])

  const columns = [
    {
      key: 'name',
      title: 'Project Name',
      dataIndex: 'name',
      render: (_, { name, active }) => renderColumn(active, () => <p>{name}</p>),
      sorter: (a, b) => a.name.localeCompare(b.name)
    },
    {
      key: 'manager',
      title: 'Project Manager',
      dataIndex: 'manager',
      render: (_, { manager, active }) => renderColumn(active, () => <p>{getNameById(manager)}</p>)
    }
  ]

  const filterProjects = (projects, searchQuery, userProfile, inactiveProjects) => {
    const list =
      userProfile.role === 'admin'
        ? projects.filter(project => (!inactiveProjects ? project.active : project))
        : projects.filter(project => project.active)

    return list.filter(
      ({ name }) => name.toLowerCase().includes(searchQuery.toLowerCase()) || !searchQuery
    )
  }

  const filteredProjects = filterProjects(projects, searchQuery, userProfile, inactiveProjects)

  const projectsList = filteredProjects.filter(project => {
    if (userProfile.role === 'admin' && showProjectsWorkingOn)
      return (
        Object.keys(project.team).includes(userProfile.id) || project.manager === userProfile.id
      )
    if (userProfile.role === 'admin' && !showProjectsWorkingOn) return filteredProjects

    if (userProfile.jobPosition === 'Developer')
      return Object.keys(project.team).includes(userProfile.id)
    if (userProfile.jobPosition === 'Project Manager') return project.manager === userProfile.id

    return filteredProjects
  })

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
            Show working on projects
            <Switch
              defaultChecked={showProjectsWorkingOn}
              onChange={() => projectThunks.showProjectsWorkingOn(!showProjectsWorkingOn)}
              style={{ margin: '0px 50px 0px 5px' }}
            />
            Show inactive projects
            <Switch
              defaultChecked={inactiveProjects}
              onChange={() => projectThunks.showInactiveProjects(!inactiveProjects)}
              style={{ margin: '0px 50px 0px 5px' }}
            />
            <Button type="primary" onClick={() => setVisible(true)}>
              <Icon type="file-add" />
              Add Project
            </Button>
          </ButtonContainer>
        </IsAdmin>
      </InputContainer>

      <ProjectsTable
        dataSource={projectsList}
        columns={columns}
        onRow={e => {
          return { onClick: () => history.push(`/projects/${e.id}`) }
        }}
        rowKey="name"
        pagination={{
          showSizeChanger: true
        }}
        locale={{
          emptyText: 'No projects found.'
        }}
      />

      <CreateProjectModal
        projectManagers={projectManagers}
        projects={projects}
        employees={activeEmployeesList}
        visible={visible}
        onCancel={() => setVisible(false)}
      />
    </Page>
  )
}

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

const ProjectsTable = styled(Table)`
  .ant-table-row {
    :hover {
      cursor: pointer;
    }
  }
`

const mapStateToProps = state => ({
  projects: state.projects.list,
  projectManagers: state.employees.projectManagersList,
  employees: state.employees.list,
  userProfile: state.auth.profile,
  inactiveProjects: state.projects.showInactiveProjects,
  showProjectsWorkingOn: state.projects.showProjectsWorkingOn
})

const mapDispatch = dispatch => ({
  projectThunks: bindActionCreators(projectThunks, dispatch),
  employeeThunks: bindActionCreators(employeeThunks, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatch
)(ProjectsPage)
