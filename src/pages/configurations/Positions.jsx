import React, { useEffect, useState } from 'react'
import { Input, Button } from 'antd'
import styled from 'styled-components'

const Positions = ({ isEditing, jobPositions, setChanges }) => {
  const [numberOfInputs, setNumberOfInputs] = useState([])

  useEffect(() => {
    setNumberOfInputs(Object.keys(jobPositions).map(jp => jp))
  }, [jobPositions])

  const handleChange = (i, event) => {
    const values = [...jobPositions]
    values[i] = event.target.value

    setChanges(values)
  }

  const handleRemove = i => {
    const values = [...jobPositions]
    values.splice(i, 1)
    setNumberOfInputs(values)

    setChanges(values)
  }

  const addInput = () => {
    const values = [...jobPositions]
    values.push([])
    setNumberOfInputs(values)
    setChanges(values)
  }

  if (jobPositions.length) {
    return (
      <React.Fragment>
        {!isEditing && (
          <React.Fragment>
            {jobPositions.map(pos => (
              <li key={pos}>{pos}</li>
            ))}
          </React.Fragment>
        )}
        {isEditing && (
          <React.Fragment>
            <ButtonsContainer>
              <Button icon="plus" onClick={addInput}>
                New position
              </Button>
            </ButtonsContainer>
            {numberOfInputs.map((field, idx) => {
              return (
                <div key={`${field}-${idx}`} style={{ paddingBottom: '5px' }}>
                  <JobPositionInput
                    value={jobPositions[idx]}
                    onChange={e => handleChange(idx, e)}
                  />
                  <Button
                    type="danger"
                    onClick={() => handleRemove(idx)}
                    style={{ marginLeft: '5px' }}
                  >
                    X
                  </Button>
                </div>
              )
            })}
          </React.Fragment>
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {isEditing && (
        <React.Fragment>
          <ButtonsContainer>
            <Button icon="plus" onClick={addInput} type="primary">
              New position
            </Button>
          </ButtonsContainer>
          {numberOfInputs.map((field, idx) => {
            return (
              <div key={`${field}-${idx}`}>
                <JobPositionInput value={jobPositions[idx]} onChange={e => handleChange(idx, e)} />
                <Button
                  type="danger"
                  onClick={() => handleRemove(idx)}
                  style={{ marginLeft: '5px' }}
                >
                  X
                </Button>
              </div>
            )
          })}
        </React.Fragment>
      )}
      {!isEditing && <p>No job positions.</p>}
    </React.Fragment>
  )
}

export default Positions

const JobPositionInput = styled(Input)`
  width: 300px;
`
const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  padding-bottom: 10px;
  padding-top: 10px;
`
