import React, { useState, useEffect } from 'react'
import { ProjectEndpoints } from 'api'
import { projectThunks } from '../state/ducks/projectDuck'
import { employeeThunks } from 'state/ducks/employeeDuck'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Button, Tabs } from 'antd'
import styled from 'styled-components'
import ProjectDetails from './project/ProjectsDetails'
import ProjectCalendar from './project/ProjectCalendar'
import ProjectTimeReport from './project/ProjectTimeReport'
import ProjectConfigurations from './project/ProjectConfigurations'
import ProjectFinancials from './project/ProjectFinancials'

const { TabPane } = Tabs

const getProjectIdFromUrl = location => {
  const { pathname } = location
  const projectId = pathname.split('/').slice(-1)[0]
  return projectId
}

const ProjectPage = ({
  history,
  projectThunks,
  employeeThunks,
  employees,
  projectManagersList,
  projectsIntegrationsList,
  projectMilestonesList,
  userProfile
}) => {
  const [isLinkProjectVisible, setIsLinkProjectVisible] = useState(false)
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showBackButton, setShowBackButton] = useState(false)
  const [activeEmployeesList, setActiveEmployeesList] = useState([])
  const [formValues, setFormValues] = useState([])
  const [gitlabIntegration, setGitlabIntegration] = useState(null)

  const projectIntegratedWithGitlab = () => {
    return gitlabIntegration && gitlabIntegration.gitlabProjectId !== null
  }

  useEffect(() => {
    const loadProjectIntegration = project => {
      const projectIntegration = projectsIntegrationsList.find(e => e.id === project.id)
      if (projectIntegration) {
        setGitlabIntegration(projectIntegration)
        setIsLinkProjectVisible(true)
      }
    }
    const getProject = async () => {
      try {
        const project = await ProjectEndpoints.getProject(getProjectIdFromUrl(history.location))

        await employeeThunks.getEmployees()
        await employeeThunks.getProjectManagers()

        setProject(project)
        setFormValues(project)

        if (project.active) {
          loadProjectIntegration(project)
        }

        if (history.action === 'PUSH') {
          setShowBackButton(true)
        }
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }
    getProject()
  }, [employeeThunks, history.location, history.action, projectThunks, projectsIntegrationsList])

  useEffect(() => {
    const activeEmployeesList = employees.filter(employee => employee.active)
    setActiveEmployeesList(activeEmployeesList)
  }, [employees])

  const updateProfilePicture = async updatedProject => {
    if (updatedProject.avatarFile) {
      const imgSrc = await ProjectEndpoints.uploadAvatar(project.id, updatedProject.avatarFile)
      const newUser = { ...updatedProject, avatar: imgSrc }
      return newUser
    }

    await ProjectEndpoints.deleteAvatar(project.id)
    return updatedProject
  }

  const toggleLinkProjectSection = () => {
    setIsLinkProjectVisible(!isLinkProjectVisible)
  }

  const saveChanges = async updatedProject => {
    let newProject = { ...updatedProject }
    if (newProject.avatarFile) {
      const updatedProfilePicture = await updateProfilePicture(newProject)
      newProject = { ...newProject, ...updatedProfilePicture }
      delete newProject['avatarFile']
    }

    await projectThunks.updateProject(newProject, project.id)
    await projectThunks.updateProjectResources(newProject, project.id)
    await projectThunks.updateProjectTeam(newProject, project.id)

    if (isLinkProjectVisible) {
      await projectThunks.createOrUpdateProjectIntegration(gitlabIntegration, project.id)
    } else {
      await projectThunks.removeProjectIntegration(project.id)
    }

    setProject(newProject)
    setFormValues(newProject)
    setIsEditing(false)
  }

  const handleProjectIdChange = newValue => {
    const value = { ...gitlabIntegration, gitlabProjectId: newValue }
    setGitlabIntegration(value)
  }

  const handleProjectTokenChange = newValue => {
    const value = { ...gitlabIntegration, gitlabToken: newValue }
    setGitlabIntegration(value)
  }

  const onChange = newChanges => {
    const value = { ...formValues, ...newChanges }
    setFormValues(value)
  }

  const deleteProject = async () => {
    await ProjectEndpoints.updateProject({ active: !project.active }, project.id)
    history.push('/projects')
  }

  const discardChanges = () => {
    setFormValues(project)
    setIsEditing(false)
  }

  if (loading) return <p> Loading...</p>

  if (!project) return <p> This project doesn't exist!</p>

  return (
    <React.Fragment>
      {showBackButton && (
        <Button shape="circle" type="primary" icon="arrow-left" onClick={history.goBack} />
      )}

      <Page>
        <Tabs
          defaultActiveKey="1"
          type="line"
          animated={false}
          style={{ height: '100%', overflow: 'auto' }}
        >
          <TabPane tab="General" key="1">
            <ProjectDetails
              formValues={formValues}
              project={project}
              isEditing={isEditing}
              onChange={onChange}
              setIsVisible={setIsVisible}
              setIsEditing={setIsEditing}
              saveChanges={saveChanges}
              discardChanges={discardChanges}
              activeEmployeesList={activeEmployeesList}
              projectManagersList={projectManagersList}
              isVisible={isVisible}
              deleteProject={deleteProject}
            />
          </TabPane>
          <TabPane tab="Calendar" key="2">
            <CalendarContainer>
              <ProjectCalendar
                project={formValues}
                activeEmployeesList={activeEmployeesList}
                projectMilestonesList={projectMilestonesList}
                onChange={onChange}
                projectThunks={projectThunks}
                userProfile={userProfile}
              />
            </CalendarContainer>
          </TabPane>
          {projectIntegratedWithGitlab() && (
            <TabPane tab="Tasks" key="3">
              <ProjectTimeReport projectId={project.id} />
            </TabPane>
          )}
          <TabPane tab="Configuration" key="4">
            <ProjectConfigurations
              isLinkProjectVisible={isLinkProjectVisible}
              toggleLinkProjectSection={toggleLinkProjectSection}
              gitlabIntegration={gitlabIntegration}
              handleProjectIdChange={handleProjectIdChange}
              handleProjectTokenChange={handleProjectTokenChange}
              saveChanges={saveChanges}
              formValues={formValues}
            />
          </TabPane>
          {userProfile.role === 'admin' && (
            <TabPane tab="Financials" key="5">
              <ProjectFinancials
                financials={formValues.financials ? formValues.financials : {}}
                onChange={onChange}
                project={project}
              />
            </TabPane>
          )}
        </Tabs>
      </Page>
    </React.Fragment>
  )
}

const mapDispatch = dispatch => ({
  projectThunks: bindActionCreators(projectThunks, dispatch),
  employeeThunks: bindActionCreators(employeeThunks, dispatch)
})

const mapStateToProps = state => ({
  employees: state.employees.list,
  projectManagersList: state.employees.projectManagersList,
  projectsIntegrationsList: state.projects.projectsIntegrationsList,
  projectMilestonesList: state.projects.projectMilestonesList,
  userProfile: state.auth.profile
})

export default connect(mapStateToProps, mapDispatch)(ProjectPage)

const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
`

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-left: 30px;
`
