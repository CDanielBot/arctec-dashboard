import React from 'react'
import styled from 'styled-components'
import { Select } from 'antd'

const { Option } = Select

const JobPosition = ({ jobTitle, isEditing, setChanges, positions }) => {
  return (
    <React.Fragment>
      {!isEditing && <JobTitle>{jobTitle}</JobTitle>}
      {isEditing && (
        <Select
          style={{ width: 200 }}
          defaultValue={jobTitle}
          onChange={value => setChanges({ jobPosition: value })}
        >
          {Object.keys(positions).map(position => (
            <Option key={position}>{position}</Option>
          ))}
        </Select>
      )}
    </React.Fragment>
  )
}

export default JobPosition

const JobTitle = styled.p`
  font-size: 15px;
`
