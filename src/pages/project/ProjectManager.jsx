import React from 'react'
import { Select } from 'antd'
import trimEmail from 'utils'
import { Link } from 'react-router-dom'

const { Option } = Select

const ProjectManager = ({ projectManager, setChanges, isEditing, projectManagersList }) => {
  const getProjectManagerData = projectManagersList.find(pm => pm.id === projectManager)
  const openProjectManagers = projectManagersList.filter(pm => !pm.projectWorkingOn)

  if (projectManager) {
    return (
      <React.Fragment>
        {!isEditing && (
          <Link to={`/employee/${trimEmail(getProjectManagerData.email)}`}>
            {getProjectManagerData.fullName}
          </Link>
        )}
        {isEditing && (
          <Select
            style={{ width: 200 }}
            placeholder="Select a person"
            defaultValue={getProjectManagerData.fullName}
            onChange={managerId => setChanges({ manager: managerId })}
          >
            {openProjectManagers.map(pm => (
              <Option key={pm.id}>{pm.fullName}</Option>
            ))}
          </Select>
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {isEditing && (
        <Select
          style={{ width: 200 }}
          placeholder="Select a person"
          onChange={managerId => setChanges({ manager: managerId })}
        >
          {openProjectManagers.map(pm => (
            <Option key={pm.id}>{pm.fullName}</Option>
          ))}
        </Select>
      )}
      {!isEditing && <p>No project manager.</p>}
    </React.Fragment>
  )
}

export default ProjectManager
