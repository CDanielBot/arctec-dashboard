import React, { useState } from 'react'
import moment from 'moment'
import { Card, Button, Input, Tooltip } from 'antd'
import styled from 'styled-components'
import IsAdmin from 'shared/IsAdmin'

const { TextArea } = Input

const formatHireDateToTimestamp = date => {
  if (!date) return null
  if (date.seconds) return date

  return { seconds: date / 1000 }
}

const Announcement = ({ title, description, date, updateAnnouncement, deleteAnnouncement, id }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [titleInput, setTitleInput] = useState(title)
  const [descriptionInput, setDescriptionInput] = useState(description)

  const validHiredate = formatHireDateToTimestamp(date)

  const saveChanges = async () => {
    await updateAnnouncement({ title: titleInput, description: descriptionInput, date, id }, id)
    setIsEditing(false)
  }

  const discardChanges = () => {
    setTitleInput(title)
    setDescriptionInput(description)
    setIsEditing(false)
  }

  const deleteAnnounce = async () => {
    await deleteAnnouncement(id)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <Card
        title={
          <StyledInput
            defaultValue={titleInput}
            onChange={({ target: { value } }) => setTitleInput(value)}
          />
        }
        extra={
          <DateContainer>
            <Button
              style={{ marginLeft: '5px' }}
              icon="delete"
              type="danger"
              onClick={deleteAnnounce}
            >
              Delete
            </Button>
            <Tooltip title="Save Changes">
              <SaveChangesButton icon="check" type="primary" onClick={saveChanges} />
            </Tooltip>
            <Tooltip title="Discard Changes">
              <Button
                style={{ marginRight: '5px' }}
                icon="close"
                type="primary"
                onClick={discardChanges}
              />
            </Tooltip>

            <label>{moment.unix(validHiredate.seconds).format('DD MMM YYYY')}</label>
          </DateContainer>
        }
        style={{ width: '100%', marginBottom: '25px' }}
      >
        <TextArea
          defaultValue={descriptionInput}
          onChange={({ target: { value } }) => setDescriptionInput(value)}
        />
      </Card>
    )
  }

  return (
    <Card
      title={title}
      extra={
        <DateContainer>
          <label>{moment.unix(validHiredate.seconds).format('DD MMM YYYY')}</label>
          <IsAdmin>
            <EditButton
              icon="edit"
              props={isEditing ? 1 : 0}
              onClick={() => setIsEditing(!isEditing)}
            />
          </IsAdmin>
        </DateContainer>
      }
      style={{ width: '100%', marginBottom: '25px' }}
    >
      {description}
    </Card>
  )
}

const DateContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
const EditButton = styled(Button)`
  color: ${({ props }) => (props ? '#096dd9' : '')};
  border-color: ${({ props }) => (props ? '#096dd9' : '')};
  :hover {
    cursor: pointer;
    color: #096dd9;
  }
  font-size: 10px;
  height: 25px;
  width: 25px;
  margin-left: 10px;
`
const StyledInput = styled(Input)`
  width: 300px;
`
const SaveChangesButton = styled(Button)`
  background-color: limegreen;
  border: none;
  margin-left: 5px;
  margin-right: 5px;
  :hover {
    background-color: limegreen;
  }
`

export default Announcement
