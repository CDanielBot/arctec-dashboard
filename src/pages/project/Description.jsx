import React from 'react'
import { Input } from 'antd'

const { TextArea } = Input

const Description = ({ projectDescription, setChanges, isEditing }) => {
  if (!projectDescription) {
    return (
      <React.Fragment>
        {isEditing && (
          <TextArea
            defaultValue={projectDescription}
            onChange={({ target: { value } }) => setChanges({ description: value })}
            style={{ width: '300px' }}
            rows={4}
          />
        )}
        {!isEditing && <p>No description.</p>}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!isEditing && <p>{projectDescription}</p>}
      {isEditing && (
        <React.Fragment>
          <TextArea
            defaultValue={projectDescription}
            onChange={({ target: { value } }) => setChanges({ description: value })}
            style={{ width: '300px' }}
            rows={4}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default Description
