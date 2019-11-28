import React from 'react'
import { Input, Radio } from 'antd'
import styled from 'styled-components'

const Salary = ({ salary, setChanges, isEditing }) => {
  const displaySalary = salary => {
    return salary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  if (!salary) {
    return (
      <React.Fragment>
        {isEditing && (
          <Input
            type="number"
            onChange={({ target: { value } }) => setChanges({ salary: value })}
          />
        )}
        {!isEditing && <p>No salary.</p>}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!isEditing && (
        <SalaryContainer>
          <SalaryP>{displaySalary(salary)}</SalaryP>
          <Radio.Group defaultValue="ron" size="small">
            <Radio.Button value="ron">RON</Radio.Button>
            <Radio.Button value="eur">EUR</Radio.Button>
          </Radio.Group>
        </SalaryContainer>
      )}
      {isEditing && (
        <React.Fragment>
          <Input
            type="number"
            defaultValue={salary}
            onChange={({ target: { value } }) => setChanges({ salary: value })}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const SalaryContainer = styled.div`
  display: flex;
`

const SalaryP = styled.p`
  margin-right: 5px;
`

export default Salary
