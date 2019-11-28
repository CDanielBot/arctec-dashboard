import React from 'react'
import { Input } from 'antd'
import styled from 'styled-components'

const Name = ({ projectName, setChanges, isEditing }) => {
  if (!projectName) {
    return (
      <React.Fragment>
        {isEditing && (
          <Input
            defaultValue={projectName}
            onChange={({ target: { value } }) => setChanges({ name: value })}
            style={{ width: '300px' }}
          />
        )}
        {!isEditing && <p>No name.</p>}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!isEditing && <ProjectName>{projectName}</ProjectName>}
      {isEditing && (
        <Input
          defaultValue={projectName}
          onChange={({ target: { value } }) => setChanges({ name: value })}
          style={{ width: '300px' }}
        />
      )}
    </React.Fragment>
  )
}

export default Name

const ProjectName = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0px;
`
