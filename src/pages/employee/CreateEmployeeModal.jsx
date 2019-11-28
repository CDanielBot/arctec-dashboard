import React, { useState } from 'react'
import { Drawer, Form, Input, Select, DatePicker, Upload, Button, Icon, Row, Col } from 'antd'
import { UserEndpoints, ProjectEndpoints } from 'api'
import { connect } from 'react-redux'
import { employeeThunks } from 'state/ducks/employeeDuck'
import { authThunks } from 'state/ducks/authDuck'
import { bindActionCreators } from 'redux'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import { useTemporaryMessage } from 'hooks'
import { projectThunks } from 'state/ducks/projectDuck'
import trimEmail from 'utils'
import { eventThunks } from 'state/ducks/eventDuck'
const { Option } = Select

const CreateEmployeeModal = Form.create()(
  ({
    history,
    visible,
    onCancel,
    form,
    projects,
    authThunks,
    employeeThunks,
    projectThunks,
    positions,
    userProfile,
    eventThunks
  }) => {
    const [loading, setLoading] = useState(false)
    const [error, showErrorMessage, hideErrorMessage] = useTemporaryMessage()
    const [userJobPosition, setUserJobPosition] = useState('Developer')
    const [userContractType, setUserContractType] = useState('Permanent Position')
    const [file, setFile] = useState(null)

    const createEmployee = async employee => {
      Object.keys(employee).forEach(key =>
        employee[key] === undefined ? (employee[key] = null) : employee[key]
      )

      try {
        const newEmployee = await employeeThunks.createEmployee(employee)
        if (employee.projectWorkingOn && employee.jobPosition === 'Project Manager') {
          await projectThunks.updateProject({ manager: newEmployee.id }, employee.projectWorkingOn)
        }

        if (employee.projectWorkingOn && employee.jobPosition === 'Developer') {
          const projectManager = projects.map(item =>
            item.id === employee.projectWorkingOn ? item.manager : null
          )
          await ProjectEndpoints.updateProject(
            { team: { [newEmployee.id]: true } },
            employee.projectWorkingOn
          )
          await authThunks.updateUserProfile({ projectManager: projectManager[0] }, newEmployee.id)
        }

        if (employee.resume) {
          const resumeSrc = await UserEndpoints.uploadResume(
            newEmployee.fullName,
            employee.resume.originFileObj
          )
          await authThunks.updateUserProfile({ resume: resumeSrc }, newEmployee.id)

          await eventThunks.createEvent({
            type: 'newEmployee',
            message: `${employee.fullName} has joined Arctec.`,
            userId: userProfile.id,
            resources: {
              profileLink: `${trimEmail(newEmployee.email)}`
            }
          })
        }
      } catch (error) {
        throw error
      }
    }

    const validateEmail = async (_, value, callback) => {
      try {
        if (!value.length) return
        if (!/^[a-zA-Z0-9.]+@[A-Za-z]+\.[A-Za-z]+$/.test(value)) {
          throw new Error('Please enter a valid email!')
        }
        if (!/^[a-zA-Z0-9.]+@gmail+\.[A-Za-z]+$/.test(value)) {
          throw new Error(`Only gmail domain is accepted!`)
        }
      } catch (err) {
        callback(err)
      }
    }

    const addEmployee = () => {
      form.validateFields(async (err, employee) => {
        if (err) {
          throw err
        }

        try {
          hideErrorMessage()
          setLoading(true)
          await createEmployee(employee)

          setLoading(false)
          setFile(null)
          form.resetFields()
          onCancel()
          history.push(`/employee`)
        } catch (error) {
          setLoading(false)
          showErrorMessage(error)
        }
      })
    }

    const getFile = e => {
      return e.file
    }

    const customRequest = ({ filelist, onSuccess }) => {
      setFile(filelist)
      setTimeout(() => {
        onSuccess('ok')
      }, 0)
    }

    return (
      <Drawer visible={visible} title="Create employee" width={700} onClose={onCancel}>
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Job Position">
                {form.getFieldDecorator('jobPosition', {
                  rules: [{ required: true, message: 'Please select the Job Position' }],
                  initialValue: 'Developer'
                })(
                  <Select
                    onChange={value => {
                      setUserJobPosition(value)
                      form.resetFields(['projectWorkingOn'])
                    }}
                  >
                    {Object.keys(positions).map(position => (
                      <Option key={position}>{position}</Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Full Name">
                {form.getFieldDecorator('fullName', {
                  rules: [{ required: true, message: 'Please input the name of employee!' }],
                  initialValue: ''
                })(<Input />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="E-mail">
                {form.getFieldDecorator('email', {
                  rules: [
                    { required: true, message: 'Please input a email!' },
                    { validator: validateEmail }
                  ],
                  initialValue: ''
                })(<Input type="textarea" />)}
              </Form.Item>
            </Col>

            <Col span={12}>
              {userJobPosition === 'Project Manager' && (
                <Form.Item label="Project assign">
                  {form.getFieldDecorator('projectWorkingOn', {
                    rules: [{ required: true, message: 'Please asign a project!' }]
                  })(
                    <Select key="projectWorkingOn">
                      {projects.map(item => {
                        if (item.manager) return null
                        return <Option key={item.id}>{item.name}</Option>
                      })}
                    </Select>
                  )}
                </Form.Item>
              )}

              {userJobPosition === 'Developer' && (
                <Form.Item label="Project assign">
                  {form.getFieldDecorator('projectWorkingOn', {
                    rules: [{ required: true, message: 'Please asign a project!' }]
                  })(
                    <Select key="projectWorkingOn">
                      {projects.map(item => {
                        return <Option key={item.id}>{item.name}</Option>
                      })}
                    </Select>
                  )}
                </Form.Item>
              )}
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Salary">
                {form.getFieldDecorator('salary', {
                  rules: [{ required: true, whitespace: true, message: 'Please input a salary!' }]
                })(<Input type="number" />)}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Hire Date">
                {form.getFieldDecorator('hireDate', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'object',
                      message: 'Please select a hire date!'
                    }
                  ]
                })(<DatePicker style={{ width: '100%' }} />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Address">
                {form.getFieldDecorator('address', {
                  rules: [{ required: true, whitespace: true, message: 'Please input a address!' }]
                })(<Input type="textarea" />)}
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Phone Number">
                {form.getFieldDecorator('phoneNumber', {
                  rules: [
                    { required: true, whitespace: true, message: 'Please input a phone number!' }
                  ]
                })(<Input type="textarea" />)}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Top Skills">
                {form.getFieldDecorator('topSkills', {
                  rules: [{ required: true, message: 'Please add few Top Skills!' }]
                })(
                  <Select
                    key="topSkills"
                    mode="tags"
                    dropdownMenuStyle={{ opacity: 0.0, widht: '0px', height: '0px' }}
                  ></Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Upload Resume" name="test">
                {form.getFieldDecorator('resume', {
                  getValueFromEvent: getFile,
                  rules: [{ required: true, message: 'Please upload a resume!' }]
                })(
                  <Upload
                    listType="text"
                    onChange={e => setFile(e.fileList)}
                    fileList={file}
                    customRequest={customRequest}
                  >
                    <Button>
                      <Icon type="upload" /> Click to upload
                    </Button>
                  </Upload>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Contract Type">
                {form.getFieldDecorator('contractType', {
                  rules: [
                    { required: true, whitespace: true, message: 'Please select a contract type!' }
                  ]
                })(
                  <Select onChange={e => setUserContractType(e)}>
                    <Option value="Contractor">Contractor</Option>
                    <Option value="Permanent Position">Permanent Position</Option>
                    <Option value="Limited Position">Limited Position</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>

            {userContractType !== 'Permanent Position' && (
              <Col span={12}>
                <Form.Item label="Contract end date">
                  {form.getFieldDecorator('contractDate', {
                    rules: [
                      {
                        required: true,
                        whitespace: true,
                        type: 'object',
                        message: 'Please select a end date!'
                      }
                    ]
                  })(<DatePicker style={{ width: '100%' }} />)}
                </Form.Item>
              </Col>
            )}
          </Row>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </Form>

        <ButtonsContainer>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>

          <Button onClick={addEmployee} type="primary" loading={loading}>
            Submit
          </Button>
        </ButtonsContainer>
      </Drawer>
    )
  }
)

const mapDispatch = dispatch => ({
  employeeThunks: bindActionCreators(employeeThunks, dispatch),
  authThunks: bindActionCreators(authThunks, dispatch),
  projectThunks: bindActionCreators(projectThunks, dispatch),
  eventThunks: bindActionCreators(eventThunks, dispatch)
})

export default connect(
  null,
  mapDispatch
)(withRouter(CreateEmployeeModal))

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
