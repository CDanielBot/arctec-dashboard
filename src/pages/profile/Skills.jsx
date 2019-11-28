import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon, Input } from 'antd'

const Skills = ({ skills, setChanges, isEditing }) => {
  const [skill, setSkill] = useState(null)

  const removeSkill = async index => {
    const newSkillList = skills.filter(skill => skill !== index)
    await setChanges({ topSkills: newSkillList })
  }

  const addSkill = async () => {
    const newSkillList = skills.concat(skill)
    await setChanges({ topSkills: newSkillList })
  }

  if (skills.length) {
    return (
      <Container>
        {!isEditing &&
          skills.map((value, index) => {
            return (
              <Skill key={index} value={value}>
                {value}
              </Skill>
            )
          })}

        {isEditing && (
          <React.Fragment>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Input
                onChange={({ target: { value } }) => setSkill(value)}
                onPressEnter={addSkill}
                style={{ marginRight: '5px' }}
              />
              <Icon type="plus-circle" style={{ color: 'grey' }} onClick={addSkill} />
            </div>

            {skills.map((value, index) => {
              return (
                <Skill key={index} value={value}>
                  <SkillName>{value}</SkillName>
                  <Icon
                    type="close-circle"
                    style={{ color: 'red', marginRight: '5px' }}
                    key={index}
                    onClick={() => removeSkill(value)}
                  />
                </Skill>
              )
            })}
          </React.Fragment>
        )}
      </Container>
    )
  }

  return (
    <Container>
      {isEditing && (
        <React.Fragment>
          <InputContainer>
            <Input
              style={{ marginRight: '5px' }}
              onChange={({ target: { value } }) => setSkill(value)}
              onPressEnter={addSkill}
            />
            <Icon type="plus-circle" style={{ color: 'grey' }} onClick={addSkill} />
          </InputContainer>

          {skills.map((value, index) => {
            return (
              <Skill key={index} value={value}>
                <SkillName>{value}</SkillName>
                <Icon
                  type="close-circle"
                  style={{ color: 'red' }}
                  key={index}
                  onClick={() => removeSkill(value)}
                />
              </Skill>
            )
          })}
        </React.Fragment>
      )}
      {!isEditing && <p>No top skills.</p>}
    </Container>
  )
}

export default Skills

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
`

const Skill = styled.div``
const SkillName = styled.label`
  font-size: 14px;
  margin-bottom: 3px;
  margin-right: 5px;
`
