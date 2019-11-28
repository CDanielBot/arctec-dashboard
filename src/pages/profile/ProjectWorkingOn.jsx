import React from 'react'

const ProjectWorkingOn = ({ jobPosition, projects, userId, projectManagers }) => {
  const projectsWorkingOnList = []
  const projectsWorkingOnListForManagers = projects.filter(proj => proj.manager === userId)
  const projectsWorkingOnFiltered = projects.filter(proj => Object.keys(proj.team).includes(userId))
  projectsWorkingOnFiltered.map(project => {
    if (!project.manager) {
      projectsWorkingOnList.push({ project: project.name, manager: 'No project manager.' })
    }
    projectManagers.filter(pm => {
      if (pm.id === project.manager) {
        projectsWorkingOnList.push({ project: project.name, manager: pm.fullName })
      }

      return null
    })
    return null
  })

  if (jobPosition === 'Project Manager') {
    return (
      <React.Fragment>
        {!projectsWorkingOnListForManagers.length && <p>No projects assigned.</p>}
        {projectsWorkingOnListForManagers.map(project => (
          <p key={project.id}>{project.name}</p>
        ))}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!projectsWorkingOnList.length && <p>No projects assigned.</p>}
      {projectsWorkingOnList.map(project => (
        <p key={project.project}>
          {project.project} - {project.manager}
        </p>
      ))}
    </React.Fragment>
  )
}

export default ProjectWorkingOn
