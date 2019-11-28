import React from 'react'
import styled from 'styled-components'

const EmployeeNotFound = ({ employee }) => {
  return (
    <Page>
      <h1>Angajatul {employee} nu exista</h1>
    </Page>
  )
}

export default EmployeeNotFound

const Page = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`
