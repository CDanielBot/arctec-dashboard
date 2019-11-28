import React from 'react'
import { Input } from 'antd'
import styled from 'styled-components'

const UserName = ({ userName, setChanges, isEditing }) => {
  if (!userName) {
    return (
      <React.Fragment>
        {isEditing && (
          <Input
            onChange={({ target: { value } }) => setChanges({ fullName: value })}
            style={{ width: '300px' }}
          />
        )}
        {!isEditing && <p>No Username.</p>}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!isEditing && <User>{userName}</User>}
      {isEditing && (
        <InputContainer>
          <Input
            defaultValue={userName}
            onChange={({ target: { value } }) => setChanges({ fullName: value })}
            style={{ width: '300px' }}
          />
        </InputContainer>
      )}
    </React.Fragment>
  )
}

export default UserName

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`

const User = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0px;
`
