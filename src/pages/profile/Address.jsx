import React from 'react'
import { Input } from 'antd'
import styled from 'styled-components'

const Address = ({ address, isEditing, setChanges }) => {
  const openGoogleMaps = () => {
    window.open('https://maps.google.com/?q=' + address)
  }

  if (!address) {
    return (
      <React.Fragment>
        {!isEditing && <p>No address.</p>}
        {isEditing && (
          <InputContainer>
            <Input onChange={({ target: { value } }) => setChanges({ address: value })} />
          </InputContainer>
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!isEditing && <AddressLink onClick={openGoogleMaps}>{address}</AddressLink>}
      {isEditing && (
        <InputContainer>
          <Input
            defaultValue={address}
            onChange={({ target: { value } }) => setChanges({ address: value })}
          />
        </InputContainer>
      )}
    </React.Fragment>
  )
}

export default Address

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`

const AddressLink = styled.p`
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`
