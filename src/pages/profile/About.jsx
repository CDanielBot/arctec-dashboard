import React from 'react'
import { Input } from 'antd'
import styled from 'styled-components'

const { TextArea } = Input

const About = ({ about, isEditing, setChanges }) => {
  if (!about) {
    return (
      <React.Fragment>
        {!isEditing && <p>No about.</p>}
        {isEditing && (
          <InputContainer>
            <TextArea onChange={({ target: { value } }) => setChanges({ about: value })} />
          </InputContainer>
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!isEditing && <p>{about}</p>}
      {isEditing && (
        <InputContainer>
          <TextArea
            defaultValue={about}
            onChange={({ target: { value } }) => setChanges({ about: value })}
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

export default About
