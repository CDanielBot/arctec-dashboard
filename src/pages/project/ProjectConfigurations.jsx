import React from 'react'
import { Input, Switch, Button } from 'antd'
import styled from 'styled-components'
import { useTemporaryMessage } from '../../hooks'

const SUCCESS_MESSAGE = 'Configurations successfully saved.'

const ProjectConfigurations = ({
  isLinkProjectVisible,
  toggleLinkProjectSection,
  gitlabIntegration,
  handleProjectIdChange,
  handleProjectTokenChange,
  saveChanges,
  formValues
}) => {
  const [message, showMessage, hideMessage] = useTemporaryMessage()

  const saveConfigurations = () => {
    try {
      hideMessage()
      saveChanges(formValues)
      showMessage(SUCCESS_MESSAGE)
    } catch (error) {
      showMessage(error.message)
    }
  }
  return (
    <WorkSectionContainer>
      <React.Fragment>
        <ButtonContainer>
          Link project:
          <Switch
            defaultChecked={isLinkProjectVisible}
            onChange={() => toggleLinkProjectSection()}
          />
        </ButtonContainer>
        {isLinkProjectVisible && (
          <LinkProjectSectionContainer>
            <React.Fragment>
              <SectionTile>Gitlab project id: </SectionTile>
              <Input
                defaultValue={gitlabIntegration ? gitlabIntegration.gitlabProjectId : null}
                onChange={e => handleProjectIdChange(e.target.value)}
                style={{ width: '300px', marginBottom: '20px' }}
              />

              <SectionTile>Gitlab project token: </SectionTile>
              <Input
                value={gitlabIntegration ? gitlabIntegration.gitlabToken : null}
                onChange={e => handleProjectTokenChange(e.target.value)}
                style={{ width: '300px', marginBottom: '20px' }}
              />
            </React.Fragment>
          </LinkProjectSectionContainer>
        )}
      </React.Fragment>

      <Button
        style={{ marginRight: '5px', marginTop: '10px' }}
        type="primary"
        onClick={saveConfigurations}
      >
        Save Changes
      </Button>

      <Message message={message}>{message}</Message>
    </WorkSectionContainer>
  )
}

export default ProjectConfigurations

const ButtonContainer = styled.div``

const LinkProjectSectionContainer = styled.div`
  height: 100%;
  padding-top: 30px;
  width: 300px;
`
const WorkSectionContainer = styled.div`
  height: 100%;
  padding-top: 30px;
  width: 300px;
  padding-left: 30px;
`
const SectionTile = styled.p`
  font-size: 15;
  font-weight: bold;
  margin-bottom: 0px;
  margin-right: 5px;
`

const Message = styled.p`
  padding-top: 10px;
  color: ${({ message }) => (message === SUCCESS_MESSAGE ? 'green' : 'red')};
  width: 300px;
`
