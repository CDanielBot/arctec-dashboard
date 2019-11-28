import React from 'react'
import { Input } from 'antd'
import styled from 'styled-components'

const PhoneNumber = ({ phoneNumber, isEditing, setChanges }) => {
  if (!phoneNumber) {
    return (
      <React.Fragment>
        {!isEditing && <p>No phone number.</p>}
        {isEditing && (
          <InputContainer>
            <Input onChange={({ target: { value } }) => setChanges({ phoneNumber: value })} />
          </InputContainer>
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!isEditing && <p>{phoneNumber}</p>}
      {isEditing && (
        <InputContainer>
          <Input
            defaultValue={phoneNumber}
            onChange={({ target: { value } }) => setChanges({ phoneNumber: value })}
          />
        </InputContainer>
      )}
    </React.Fragment>
  )
}

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`

export default PhoneNumber
