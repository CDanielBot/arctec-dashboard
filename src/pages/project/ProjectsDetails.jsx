import React from 'react'
import { Button, Modal, Radio } from 'antd'
import styled from 'styled-components'
import ProjectAvatar from '../profile/Avatar'
import Name from '../project/Name'
import Deadline from '../project/Deadline'
import Description from '../project/Description'
import Team from '../project/Team'
import Resources from '../project/Resources'
import ProjectManager from '../project/ProjectManager'
import IsAdmin from 'shared/IsAdmin'
import RadioGroup from 'antd/lib/radio/group'
import StartDate from './StartDate'

const ProjectDetails = ({
  formValues,
  isEditing,
  project,
  onChange,
  setIsVisible,
  setIsEditing,
  saveChanges,
  discardChanges,
  activeEmployeesList,
  projectManagersList,
  isVisible,
  deleteProject
}) => {
  return (
    <Page>
      <ProjectContentContainer>
        <Content>
          <ProjectAvatar
            avatar={formValues.avatar}
            avatarFile={formValues.avatarFile}
            id={project.id}
            isEditing={isEditing}
            setChanges={onChange}
          />
          <WorkSectionContainer>
            <SectionTile>Start date:</SectionTile>
            <StartDate startDate={project.startDate} setChanges={onChange} isEditing={isEditing} />

            <SectionTile>Deadline:</SectionTile>
            <Deadline deadline={project.deadline} setChanges={onChange} isEditing={isEditing} />

            <SectionTile>Description:</SectionTile>
            <Description
              projectDescription={project.description}
              setChanges={onChange}
              isEditing={isEditing}
            />
            <SectionTile>Resources:</SectionTile>
            <Resources
              resources={formValues.resources}
              setChanges={onChange}
              isEditing={isEditing}
            />
          </WorkSectionContainer>
        </Content>
        <Content>
          <IsAdmin>
            <EditSection>
              {project.active && (
                <React.Fragment>
                  {isEditing && (
                    <React.Fragment>
                      <SectionTile>Project status: </SectionTile>
                      <RadioGroup
                        buttonStyle="solid"
                        value={project.active ? true : false}
                        onChange={() => setIsVisible(true)}
                      >
                        <Radio.Button value={true}>Active</Radio.Button>
                        <Radio.Button value={false}>Inactive</Radio.Button>
                      </RadioGroup>
                    </React.Fragment>
                  )}
                  {!isEditing && (
                    <EditButton
                      icon="edit"
                      isactive={isEditing ? 1 : 0}
                      onClick={() => setIsEditing(!isEditing)}
                    />
                  )}
                </React.Fragment>
              )}
              {!project.active && (
                <React.Fragment>
                  <SectionTile>Project status: </SectionTile>
                  <RadioGroup
                    buttonStyle="solid"
                    value={project.active ? true : false}
                    onChange={() => setIsVisible(true)}
                  >
                    <Radio.Button value={true}>Active</Radio.Button>
                    <Radio.Button value={false}>Inactive</Radio.Button>
                  </RadioGroup>
                </React.Fragment>
              )}
            </EditSection>
          </IsAdmin>

          <SectionTitleContainer>
            <WorkSectionContainer>
              {isEditing && (
                <React.Fragment>
                  <Button
                    style={{ marginRight: '5px', marginBottom: '10px' }}
                    type="primary"
                    onClick={() => saveChanges(formValues)}
                  >
                    Save Changes
                  </Button>
                  <Button onClick={discardChanges}>Discard Changes</Button>
                </React.Fragment>
              )}
              <ProjectNameSection>
                <LargeSectionTitle>Name:</LargeSectionTitle>
                <Name projectName={project.name} setChanges={onChange} isEditing={isEditing} />
              </ProjectNameSection>

              <SectionTile>Team:</SectionTile>
              <Team
                team={formValues.team}
                setChanges={onChange}
                isEditing={isEditing}
                employees={activeEmployeesList}
              />

              <SectionTile>Project Manager:</SectionTile>
              <ProjectManager
                setChanges={onChange}
                projectManager={project.manager}
                isEditing={isEditing}
                projectManagersList={projectManagersList}
              />
              <Modal
                title="Change status"
                visible={isVisible}
                onOk={deleteProject}
                onCancel={() => setIsVisible(false)}
                footer={[
                  <Button key="back" onClick={() => setIsVisible(false)}>
                    No
                  </Button>,
                  <Button key="submit" type="danger" onClick={deleteProject}>
                    Yes
                  </Button>
                ]}
              >
                <p>Are you sure you want to change status of this project?</p>
              </Modal>
            </WorkSectionContainer>
          </SectionTitleContainer>
        </Content>
      </ProjectContentContainer>
    </Page>
  )
}

export default ProjectDetails

const SectionTile = styled.p`
  font-size: 15;
  font-weight: bold;
  margin-bottom: 0px;
  margin-right: 5px;
`
const Page = styled.div`
  width: 100%;
  position: relative;
`
const ProjectContentContainer = styled.div`
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

const WorkSectionContainer = styled.div`
  height: 100%;
  padding-top: 30px;
  width: 300px;
`
const SectionTitleContainer = styled.div`
  display: flex;
  width: 100%;
`
const EditButton = styled(Button)`
  color: ${({ isactive }) => (isactive ? '#096dd9' : 'initial')};
  border-color: ${({ isactive }) => (isactive ? '#096dd9' : 'initial')};
  :hover {
    cursor: pointer;
    color: #096dd9;
  }
  font-size: 10px;
  height: 25px;
  width: 25px;
  margin-left: 20px;
`
const EditSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  padding-right: 40px;
`
const ProjectNameSection = styled.div`
  display: flex;
  align-items: center;
`
const LargeSectionTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0px;
  padding-right: 10px;
`
