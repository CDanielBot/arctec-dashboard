import React from 'react'
import { Input } from 'antd'
import styled from 'styled-components'

const EmployeeIdentifier = ({ identifier, isEditing, setChanges }) => {
  if (!identifier) {
    return (
      <React.Fragment>
        {isEditing && (
          <InputContainer>
            <Input
              onChange={({ target: { value } }) => setChanges({ employeeIdentifier: value })}
            />
          </InputContainer>
        )}
        {!isEditing && <p>No identifier.</p>}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!isEditing && <p>{identifier}</p>}
      {isEditing && (
        <InputContainer>
          <Input
            defaultValue={identifier}
            onChange={({ target: { value } }) => setChanges({ employeeIdentifier: value })}
          />
        </InputContainer>
      )}
    </React.Fragment>
  )
}

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
`

export default EmployeeIdentifier
