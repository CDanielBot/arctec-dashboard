import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ConfigurationsEndpoints } from 'api'
import { Button, Modal } from 'antd'
import Positions from './configurations/Positions'

const ConfigurationsPage = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [jobPositions, setJobPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [formValues, setFormValues] = useState({})
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const getConfigurations = async () => {
      const jobPositions = await ConfigurationsEndpoints.getConfigurations()
      setJobPositions(jobPositions)
      setFormValues(Object.keys(jobPositions).map(jp => jp))
    }
    getConfigurations()
    setLoading(false)
  }, [])

  const updateJobPositions = async () => {
    let jobPositions = {}
    formValues.forEach(id => {
      jobPositions[id] = true
    })

    await ConfigurationsEndpoints.updateConfigurations(jobPositions)
    setJobPositions(jobPositions)
    setIsEditing(false)
  }

  const onChange = newValues => {
    setFormValues(newValues)
  }

  const discardChanges = () => {
    setFormValues(Object.keys(jobPositions).map(jp => jp))
    setIsEditing(false)
  }

  if (loading) return <p>Loading...</p>

  return (
    <Page>
      <Content>
        <LargeSectionTitle>Configurations</LargeSectionTitle>
        <SectionTile>Job Positions</SectionTile>
        <Positions
          isEditing={isEditing}
          jobPositions={formValues}
          setChanges={onChange}
          setIsEditing={setIsEditing}
        />
      </Content>
      <ScrollContent>
        <EditSection>
          {!isEditing && (
            <EditButton
              icon="edit"
              props={isEditing ? 1 : 0}
              onClick={() => setIsEditing(!isEditing)}
            />
          )}

          {isEditing && (
            <React.Fragment>
              <Button type="primary" onClick={() => setIsVisible(true)}>
                Save changes
              </Button>
              <Button onClick={() => discardChanges()}>Discard Changes</Button>
            </React.Fragment>
          )}
        </EditSection>
      </ScrollContent>

      <Modal
        title="Jobs positions save changes"
        visible={isVisible}
        onOk={() => updateJobPositions()}
        onCancel={() => setIsVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsVisible(false)}>
            No
          </Button>,
          <Button key="submit" type="danger" onClick={() => updateJobPositions()}>
            Yes
          </Button>
        ]}
      >
        <p>Are you sure you want to save changes of new positions ?</p>
      </Modal>
    </Page>
  )
}

export default ConfigurationsPage

const Page = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  position: relative;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-top: 50px;
  align-items: flex-start;
  padding-left: 30px;
`
const LargeSectionTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0px;
  padding-right: 10px;
`
const SectionTile = styled.p`
  font-size: 15;
  font-weight: bold;
  margin-bottom: 0px;
`
const ScrollContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 50%;
  overflow: auto;
  padding-top: 25px;
  position: absolute;
  left: 50%;
`

const EditSection = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 45px;
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
`
