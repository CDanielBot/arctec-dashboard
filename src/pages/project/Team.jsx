import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon, Select } from 'antd'
import { Link } from 'react-router-dom'
import trimEmail from 'utils'

const { Option } = Select

const Team = ({ team, setChanges, isEditing, employees }) => {
  const [member, setMember] = useState([])

  const removeMember = async id => {
    const newTeam = Object.keys(team).reduce((object, key) => {
      if (key !== id) {
        object[key] = team[key]
      }
      return object
    }, {})

    setChanges({ team: newTeam })
    setMember([])
  }

  const addMember = async () => {
    let newMembers = { ...team }

    member.forEach(id => {
      newMembers[id] = true
    })

    setChanges({ team: newMembers })
    setMember([])
  }

  const teamInformations = employees.filter(employee => Object.keys(team).includes(employee.id))
  const openEmployeesForProject = employees.filter(
    employee => !Object.keys(team).includes(employee.id) && employee.jobPosition === 'Developer'
  )

  if (Object.keys(team).length) {
    return (
      <Container>
        {!isEditing &&
          teamInformations.map(developer => (
            <Developer to={`/employee/${trimEmail(developer.email)}`} key={developer.id}>
              {developer.fullName}
            </Developer>
          ))}

        {isEditing && (
          <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center', width: '300px' }}>
              <Select
                mode="multiple"
                placeholder="Please select"
                style={{ width: '300px', marginRight: '5px' }}
                value={member}
                onChange={value => setMember(value)}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {openEmployeesForProject.map(user => (
                  <Option key={user.id} value={user.id}>
                    {user.fullName}
                  </Option>
                ))}
              </Select>
              <Icon type="plus-circle" style={{ color: 'grey' }} onClick={addMember} />
            </div>
            {teamInformations.map(developer => (
              <Developer key={developer.id}>
                <DeveloperName>{developer.fullName}</DeveloperName>
                <Icon
                  type="close-circle"
                  style={{ color: 'red' }}
                  key={developer}
                  onClick={() => removeMember(developer.id)}
                />
              </Developer>
            ))}
          </React.Fragment>
        )}
      </Container>
    )
  }

  return (
    <React.Fragment>
      {isEditing && (
        <Container>
          <InputContainer>
            <div style={{ display: 'flex', alignItems: 'center', width: '300px' }}>
              <Select
                mode="multiple"
                placeholder="Please select"
                style={{ width: '300px', marginRight: '5px' }}
                value={member}
                onChange={value => setMember(value)}
                filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {openEmployeesForProject.map(user => (
                  <Option key={user.id} value={user.id}>
                    {user.fullName}
                  </Option>
                ))}
              </Select>
              <Icon type="plus-circle" style={{ color: 'grey' }} onClick={addMember} />
            </div>
          </InputContainer>

          {teamInformations.map(developer => (
            <Developer key={developer.id}>
              <DeveloperName>{developer.fullName}</DeveloperName>
              <Icon
                type="close-circle"
                style={{ color: 'red' }}
                key={developer}
                onClick={() => removeMember(developer.id)}
              />
            </Developer>
          ))}
        </Container>
      )}
      {!isEditing && <p>No team members.</p>}
    </React.Fragment>
  )
}

export default Team

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`

const Developer = styled(Link)`
  font-size: 14px;
  margin-bottom: 0px;
`
const DeveloperName = styled.label`
  margin-right: 5px;
`
