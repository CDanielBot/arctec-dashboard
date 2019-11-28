import React, { useState, useEffect } from 'react'
import { Drawer, Form, Input, Select, DatePicker, Button, Radio, Col, Row } from 'antd'
import { connect } from 'react-redux'
import { projectThunks } from 'state/ducks/projectDuck'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import { useTemporaryMessage } from 'hooks'
import { authThunks } from 'state/ducks/authDuck'
import { EventEndpoints, GitlabEndpoints } from 'api'

const { Option } = Select
const { TextArea } = Input

const CreateProjectModal = Form.create()(
  ({
    history,
    visible,
    onCancel,
    form,
    projectThunks,
    projectManagers,
    authThunks,
    employees,
    userProfile
  }) => {
    const [loading, setLoading] = useState(false)
    const [error, showErrorMessage, hideErrorMessage] = useTemporaryMessage()
    const [openManagers, setOpenManagers] = useState([])
    const [developersList, setDevelopersList] = useState([])
    const [resourceNameInput, setResourceNameInput] = useState([])
    const [resourceLinkInput, setResourceLinkInput] = useState([])
    const [numberOfFields, setNumberOfFields] = useState(resourceNameInput)
    const [projectType, setProjectType] = useState('General')

    useEffect(() => {
      const openManagers = projectManagers.filter(manager => !manager.projectWorkingOn)
      const developersList = employees.filter(emp => emp.jobPosition === 'Developer')
      setOpenManagers(openManagers)
      setDevelopersList(developersList)
    }, [projectManagers, employees])

    const handleChangeResourceName = (i, event) => {
      const values = [...resourceNameInput]
      values[i] = event.target.value
      setResourceNameInput(values)
    }

    const handleChangeResourceLink = (i, event) => {
      const values = [...resourceLinkInput]
      values[i] = event.target.value
      setResourceLinkInput(values)
    }

    const addInput = () => {
      const values = [...resourceNameInput]
      const values2 = [...resourceLinkInput]

      values.push([])
      values2.push([])

      setResourceNameInput(values)
      setResourceLinkInput(values2)
      setNumberOfFields(values)
    }

    const handleRemove = i => {
      const values = [...resourceNameInput]
      const values2 = [...resourceLinkInput]

      values.splice(i, 1)
      values2.splice(i, 1)

      setResourceNameInput(values)
      setResourceLinkInput(values2)
      setNumberOfFields(values)
    }

    const onProjectTypeChange = e => {
      setProjectType(e.target.value)
    }

    const validateGitlabAccessToken = async (rule, value, callback) => {
      const projectId = form.getFieldValue('projectId')
      const accessToken = value
      try {
        await GitlabEndpoints.getProject(projectId, accessToken)
        callback()
      } catch (error) {
        console.error(error)
        callback('Invalid gitlab project id OR access token')
      }
    }

    const _createGeneralProject = async project => {
      // If fields are undefined firebase throws error.
      Object.keys(project).forEach(key =>
        project[key] === undefined ? (project[key] = null) : project[key]
      )
      if (resourceNameInput.length) {
        const resources = {}
        resourceNameInput.forEach((key, i) => (resources[key] = resourceLinkInput[i]))
        project.resources = resources
      }
      if (project.team) {
        let team = {}
        project.team.forEach(id => {
          team[id] = true
        })
        project.team = team
      }
      const newProject = await projectThunks.createProject(project)
      if (project.manager) {
        await authThunks.updateUserProfile({ projectWorkingOn: newProject.id }, project.manager)
        const newOpenManagers = openManagers.filter(manager => manager.id !== project.manager)
        setOpenManagers(newOpenManagers)
      }
      return newProject
    }

    const _createGitlabProject = async project => {
      const gitlabProjectResp = await GitlabEndpoints.getProject(
        project.projectId,
        project.accessToken
      )
      const gitlabProject =
        gitlabProjectResp && gitlabProjectResp.data ? gitlabProjectResp.data : null
      const projectMembersResp = await GitlabEndpoints.getProjectMembers(
        project.projectId,
        project.accessToken
      )
      const projectMembers =
        projectMembersResp && projectMembersResp.data ? projectMembersResp.data : []

      if (!gitlabProject) {
        throw new Error('Cannot find any gitlab project with id: ' + project.projectId)
      }

      const teamMembers = {}
      if (projectMembers) {
        projectMembers.forEach(member => {
          const dev = developersList.find(d => d.gitlabUsername === member.username)
          if (dev) {
            teamMembers[dev.id] = true
          }
        })
      }

      const newProjectReq = {
        active: true,
        name: gitlabProject.name,
        description: gitlabProject.description,
        team: teamMembers,
        manager: null,
        resources: {
          gitlab: gitlabProject.web_url
        }
      }
      const newProject = await projectThunks.createProject(newProjectReq)

      const newProjectIntegration = {
        gitlabProjectId: project.projectId,
        gitlabToken: project.accessToken
      }
      await projectThunks.createOrUpdateProjectIntegration(newProjectIntegration, newProject.id)

      return newProject
    }

    const _createEvent = async newProject => {
      return await EventEndpoints.createEvent({
        type: 'newProject',
        message: `New Project: ${newProject.name}`,
        userId: userProfile.id,
        resources: {
          projectId: `${newProject.id}`
        }
      })
    }

    const addProject = () => {
      form.validateFields(async (err, project) => {
        if (err) {
          throw error
        }

        try {
          hideErrorMessage()
          setLoading(true)
          const createProjectFunc =
            projectType === 'General' ? _createGeneralProject : _createGitlabProject
          const newProject = await createProjectFunc(project)
          await _createEvent(newProject)
          setLoading(false)
          form.resetFields()
          onCancel()
          history.push(`/projects`)
        } catch (error) {
          setLoading(false)
          showErrorMessage(error)
        }
      })
    }

    return (
      <Drawer visible={visible} title="Create Project" onClose={onCancel} width={500}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Form.Item label="Project Type">
              <Radio.Group onChange={onProjectTypeChange} value={projectType}>
                <Col span={12}>
                  <Radio value={'General'}>General</Radio>
                </Col>
                <Col span={12}>
                  <Radio value={'GitlabIntegrated'}>Gitlab integrated</Radio>
                </Col>
              </Radio.Group>
            </Form.Item>
          </Row>

          {projectType === 'General' && (
            <React.Fragment>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="Project Name">
                    {form.getFieldDecorator('name', {
                      rules: [{ required: true, message: 'Please input the name of project!' }]
                    })(<Input />)}
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Deadline">
                    {form.getFieldDecorator('deadline', {
                      rules: [
                        {
                          type: 'object'
                        }
                      ]
                    })(<DatePicker style={{ width: '100%' }} />)}
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Description">
                {form.getFieldDecorator('description', {
                  rules: [{ required: true, message: 'Please input a description!' }]
                })(<TextArea key="descriprion" rows={4} />)}
              </Form.Item>

              <Form.Item label="Project Manager">
                {form.getFieldDecorator('manager')(
                  <Select>
                    {openManagers.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.fullName}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="Team">
                {form.getFieldDecorator('team')(
                  <Select mode="multiple">
                    {developersList.map(item => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.fullName}
                        </Option>
                      )
                    })}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="Resources">
                {form.getFieldDecorator('resources')(
                  <React.Fragment>
                    <Button icon="plus" style={{ marginBottom: '5px' }} onClick={addInput}>
                      Add Resource
                    </Button>
                    {numberOfFields.map((field, idx) => {
                      return (
                        <div
                          style={{ display: 'flex', alignItems: 'center' }}
                          key={`${field}-${idx}`}
                        >
                          <label>Name:</label>
                          <Input
                            value={resourceNameInput[idx]}
                            onChange={e => handleChangeResourceName(idx, e)}
                          />
                          <label>Link:</label>
                          <Input
                            value={resourceLinkInput[idx]}
                            onChange={e => handleChangeResourceLink(idx, e)}
                          />
                          <Button
                            type="danger"
                            icon="close"
                            onClick={() => handleRemove(idx)}
                          ></Button>
                        </div>
                      )
                    })}
                  </React.Fragment>
                )}
              </Form.Item>
            </React.Fragment>
          )}

          {projectType === 'GitlabIntegrated' && (
            <React.Fragment>
              <Form.Item label="Project id">
                {form.getFieldDecorator('projectId', {
                  rules: [{ required: true, message: 'Please input the gitlab project id!' }]
                })(<Input />)}
              </Form.Item>
              <Form.Item label="Access token">
                {form.getFieldDecorator('accessToken', {
                  rules: [
                    { required: true, message: 'Please input the gitlab access token!' },
                    { validator: validateGitlabAccessToken }
                  ]
                })(<Input />)}
              </Form.Item>
            </React.Fragment>
          )}

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonsContainer>
            <Button onClick={onCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>

            <Button onClick={addProject} type="primary" loading={loading}>
              Submit
            </Button>
          </ButtonsContainer>
        </Form>
      </Drawer>
    )
  }
)

const mapDispatch = dispatch => ({
  projectThunks: bindActionCreators(projectThunks, dispatch),
  authThunks: bindActionCreators(authThunks, dispatch)
})

const mapStateToProps = state => ({ userProfile: state.auth.profile })

export default connect(mapStateToProps, mapDispatch)(withRouter(CreateProjectModal))

const ErrorMessage = styled.p`
  color: red;
`
const ButtonsContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
`
