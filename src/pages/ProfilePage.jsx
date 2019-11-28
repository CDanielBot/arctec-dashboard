import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Tabs } from 'antd'
import { UserEndpoints } from 'api'
import { ConfigurationsEndpoints } from 'api'
import EmployeeNotFound from 'pages/employee/EmployeeNotFoundPage'
import Calendar from './profile/Calendar'
import { connect } from 'react-redux'
import ProfileDetails from 'pages/profile/ProfileDetails'
import Documents from './profile/Documents'

const { TabPane } = Tabs

const getUserFromUrl = location => {
  const { pathname } = location
  const userFromUrl = pathname.split('/').slice(-1)[0]
  var email = userFromUrl + '@gmail.com'
  return email
}

const ProfilePage = ({ history, loggedUser }) => {
  const [employee, setEmployee] = useState(null)
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [formValues, setFormValues] = useState({})
  const [showBackButton, setShowBackButton] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const getEmployee = async () => {
      try {
        const employee = await UserEndpoints.getUser(getUserFromUrl(history.location))
        const jobPositions = await ConfigurationsEndpoints.getConfigurations()
        setPositions(jobPositions)
        setFormValues(employee)
        setEmployee(employee)
        setLoading(false)
        if (history.action === 'PUSH') {
          setShowBackButton(true)
        }
      } catch (error) {
        setEmployee(null)
        setLoading(false)
      }
    }

    getEmployee()
  }, [history])

  const updateProfilePicture = async updatedUser => {
    if (updatedUser.profilePictureFile) {
      const imgSrc = await UserEndpoints.uploadProfilePicture(
        employee.id,
        updatedUser.profilePictureFile
      )
      const newUser = { ...updatedUser, profilePictureSrc: imgSrc }
      return newUser
    }
    await UserEndpoints.deleteProfilePicture(employee.id)
    return updatedUser
  }

  const updateResume = async updatedUser => {
    if (updatedUser.resumeFile !== null) {
      const resumeSrc = await UserEndpoints.uploadResume(
        employee.id,
        updatedUser.resumeFile.originFileObj
      )
      const newUser = { ...updatedUser, resume: resumeSrc }
      return newUser
    }
    await UserEndpoints.deleteResume(employee.id)
    return updatedUser
  }

  const updateUser = async updatedUser => {
    let newUser = { ...updatedUser }
    if (newUser.profilePictureFile) {
      const updatedProfilePicture = await updateProfilePicture(newUser)
      newUser = { ...newUser, ...updatedProfilePicture }
      delete newUser['profilePictureFile']
    }

    if (newUser.resumeFile) {
      const updatedResume = await updateResume(newUser)
      newUser = { ...newUser, ...updatedResume }
      delete newUser['resumeFile']
    }

    await UserEndpoints.updateUser(newUser, employee.id)
    setFormValues(newUser)
    setEmployee(newUser)
    setIsEditing(false)
  }

  const deleteUser = async () => {
    if (employee.active) {
      await UserEndpoints.updateUser({ active: false, resignationDate: new Date() }, employee.id)
      return history.push('/employee')
    }

    await UserEndpoints.updateUser({ active: true, resignationDate: '' }, employee.id)
    return history.push('/employee')
  }

  const onChange = newChanges => {
    const value = { ...formValues, ...newChanges }
    setFormValues(value)
  }

  const discardChanges = () => {
    setFormValues(employee)
    setIsEditing(false)
  }

  if (loading) {
    return (
      <Page>
        <h1>loading</h1>
      </Page>
    )
  }

  if (!employee) {
    return <EmployeeNotFound employee={getUserFromUrl(history.location)} />
  }

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Profile" key="1">
        <Page>
          <ProfileDetails
            employee={employee}
            history={history}
            formValues={formValues}
            showBackButton={showBackButton}
            positions={positions}
            loggedUser={loggedUser}
            getUserFromUrl={getUserFromUrl}
            setIsEditing={setIsEditing}
            isEditing={isEditing}
            onChange={onChange}
            deleteUser={deleteUser}
            loading={loading}
            updateUser={updateUser}
            discardChanges={discardChanges}
          />
        </Page>
      </TabPane>

      <TabPane tab="Calendar" key="2">
        <CalendarContainer>
          <Calendar
            employee={formValues}
            calendarEvents={formValues.calendarEvents}
            updateUser={updateUser}
            history={history}
          />
        </CalendarContainer>
      </TabPane>

      {loggedUser.role === 'admin' && (
        <TabPane tab="Documents" key="3">
          <Page>
            <Content>
              <Documents
                employee={employee}
                onChange={onChange}
                isEditing={false}
                formValues={formValues}
                updateUser={updateUser}
                documents={formValues.documents || {}}
              />
            </Content>
          </Page>
        </TabPane>
      )}
    </Tabs>
  )
}

const mapStateToProps = state => ({ loggedUser: state.auth.profile })

export default connect(mapStateToProps)(ProfilePage)

const Page = styled.div`
  display: flex;
  flex: 1;
  width: 100%;
  position: relative;
`

const CalendarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  padding-top: 100px;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 50px;
  align-items: flex-start;
  padding-left: 30px;
`
