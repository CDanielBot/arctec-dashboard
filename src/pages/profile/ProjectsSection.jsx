import React, { useEffect } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { projectThunks } from '../../state/ducks/projectDuck'
import { bindActionCreators } from 'redux'
import { employeeThunks } from '../../state/ducks/employeeDuck'
import ProjectWorkingOn from './ProjectWorkingOn'

const ProjectsSection = ({
  userProfile,
  projects,
  employeeThunks,
  projectThunks,
  isEditing,
  jobPosition,
  projectManagers
}) => {
  useEffect(() => {
    const getProjectsList = async () => {
      try {
        await employeeThunks.getProjectManagers()
        await projectThunks.getProjects()
      } catch (error) {}
    }
    getProjectsList()
  }, [projectThunks, employeeThunks, userProfile.projectWorkingOn, userProfile.jobPosition])

  return (
    <React.Fragment>
      <SectionTile>Projects working on:</SectionTile>
      {isEditing && <label>For project editing go to projects page.</label>}
      {!isEditing && (
        <ProjectWorkingOn
          projectManagers={projectManagers}
          projects={projects}
          userId={userProfile.id}
          jobPosition={jobPosition}
        />
      )}
    </React.Fragment>
  )
}

const SectionTile = styled.p`
  font-size: 10;
  font-weight: bold;
  margin-bottom: 0px;
`

const mapStateToProps = state => ({
  projects: state.projects.list,
  projectManagers: state.employees.projectManagersList
})

const mapDispatch = dispatch => ({
  projectThunks: bindActionCreators(projectThunks, dispatch),
  employeeThunks: bindActionCreators(employeeThunks, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatch
)(ProjectsSection)
