import React from 'react'
import { Modal } from 'antd'
import moment from 'moment'
import styled from 'styled-components'

const ViewEventModal = ({ viewEventModal, event, onCancel }) => {
  const getEventType = () => {
    if (event.type === '09ff00') return 'Meeting'
    if (event.type === '0004ff') return 'Review'
    if (event.type === 'ff6a00') return 'Time off'

    return 'unknown'
  }

  if (event) {
    return (
      <Modal visible={viewEventModal} onCancel={onCancel} title={event.category} footer={[]}>
        <Content>
          <SectionContainer>
            <SectionTitle>Title:</SectionTitle>
            <label>{event.title}</label>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Start:</SectionTitle>
            <label>{moment(event.start).format('DD-MMM-YYYY')}</label>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>End:</SectionTitle>
            <label>{moment(event.end).format('DD-MMM-YYYY')}</label>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Type:</SectionTitle>
            <label>{getEventType()}</label>
          </SectionContainer>

          <SectionContainer>
            <SectionTitle>Description:</SectionTitle>
            <label>{event.description}</label>
          </SectionContainer>
        </Content>
      </Modal>
    )
  }
  return null
}

export default ViewEventModal

const SectionTitle = styled.label`
  font-weight: bold;
  font-size: 18px;
  margin-right: 4px;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
`
const SectionContainer = styled.div``
