import React from 'react'
import { Input } from 'antd'
import styled from 'styled-components'

const GitlabUserName = ({ gitlabUserName, setChanges, isEditing }) => {
  if (!gitlabUserName) {
    return (
      <React.Fragment>
        {isEditing && (
          <Input
            onChange={({ target: { value } }) => setChanges({ gitlabUsername: value })}
            style={{ width: '300px' }}
          />
        )}
        {!isEditing && <p>No Username.</p>}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!isEditing && <p>{gitlabUserName}</p>}
      {isEditing && (
        <InputContainer>
          <Input
            defaultValue={gitlabUserName}
            onChange={({ target: { value } }) => setChanges({ gitlabUsername: value })}
            style={{ width: '300px' }}
          />
        </InputContainer>
      )}
    </React.Fragment>
  )
}

export default GitlabUserName

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`
