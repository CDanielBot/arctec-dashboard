import React, { useState } from 'react'
import HireDate from '../profile/HireDate'
import ProfilePicture from '../profile/ProfilePicture'
import Address from '../profile/Address'
import Salary from '../profile/Salary'
import UserName from '../profile/UserName'
import ProjectsSection from '../profile/ProjectsSection'
import IsAdmin from 'shared/IsAdmin'
import EmployeeIdentifier from 'pages/profile/EmployeeIdentifier'
import About from 'pages/profile/About'
import RadioGroup from 'antd/lib/radio/group'
import PhoneNumber from '../profile/PhoneNumber'
import Skills from '../profile/Skills'
import JobPosition from '../profile/JobPosition'
import ContractType from '../profile/ContractType'
import ResignationDate from '../profile/ResignationDate'
import ChangePassword from '../profile/ChangePassword'
import { Button, Modal, Radio } from 'antd'
import styled from 'styled-components'
import trimEmail from 'utils'
import GitlabUserName from './GitlabUsername'

const ProfileDetails = ({
  employee,
  history,
  formValues,
  showBackButton,
  positions,
  loggedUser,
  getUserFromUrl,
  isEditing,
  setIsEditing,
  onChange,
  deleteUser,
  loading,
  updateUser,
  discardChanges
}) => {
  const [isVisible, setIsVisible] = useState(false)

  const currentUser =
    trimEmail(loggedUser.email) === trimEmail(getUserFromUrl(history.location).toString())
      ? true
      : false

  const isAdmin = loggedUser.role === 'admin' ? true : false

  const havePermissions =
    loggedUser.jobPosition === 'Project Manager' || loggedUser.role === 'admin' ? true : false

  return (
    <React.Fragment>
      {showBackButton && (
        <Button shape="circle" type="primary" icon="arrow-left" onClick={history.goBack} />
      )}
      <Content>
        <ProfilePicture
          profilePicture={formValues.profilePictureSrc}
          profilePictureFile={formValues.profilePictureFile}
          isEditing={isEditing}
          setChanges={onChange}
        />
        <WorkSectionContainer>
          {(isAdmin || currentUser) && (
            <React.Fragment>
              <SectionTile>Hire date</SectionTile>
              <HireDate
                hireDate={employee.hireDate}
                isEditing={isAdmin ? isEditing : false}
                setChanges={onChange}
              />

              <SectionTile>Salary</SectionTile>
              <Salary
                salary={employee.salary}
                isEditing={isAdmin ? isEditing : false}
                setChanges={onChange}
              />
            </React.Fragment>
          )}

          <SectionTile>Address</SectionTile>
          <Address address={employee.address} isEditing={isEditing} setChanges={onChange} />

          <SectionTile>E-mail</SectionTile>
          <label>{employee.email}</label>

          <SectionTile>Phone number</SectionTile>
          <PhoneNumber
            setChanges={onChange}
            phoneNumber={employee.phoneNumber}
            isEditing={isEditing}
          />

          {(havePermissions || currentUser) && (
            <React.Fragment>
              <SectionTile>Top skills</SectionTile>
              <Skills
                skills={formValues.topSkills}
                isEditing={isAdmin ? isEditing : false}
                setChanges={onChange}
              />
            </React.Fragment>
          )}

          {currentUser && isEditing && <ChangePassword />}
        </WorkSectionContainer>
      </Content>
      <ScrollContent>
        <EditSection>
          {(isAdmin || currentUser) && (
            <React.Fragment>
              {employee.active && (
                <React.Fragment>
                  {isEditing && (
                    <IsAdmin>
                      <SectionTile>Account status: </SectionTile>
                      <RadioGroup
                        buttonStyle="solid"
                        value={employee.active ? true : false}
                        onChange={() => setIsVisible(true)}
                      >
                        <Radio.Button value={true}>Active</Radio.Button>
                        <Radio.Button value={false}>Inactive</Radio.Button>
                      </RadioGroup>
                    </IsAdmin>
                  )}

                  {!isEditing && (
                    <EditButton
                      icon="edit"
                      props={isEditing ? 1 : 0}
                      onClick={() => setIsEditing(!isEditing)}
                    />
                  )}
                </React.Fragment>
              )}
              {!employee.active && (
                <IsAdmin>
                  <SectionTile>Account status: </SectionTile>
                  <RadioGroup
                    buttonStyle="solid"
                    value={employee.active ? true : false}
                    onChange={() => setIsVisible(true)}
                  >
                    <Radio.Button value={true}>Active</Radio.Button>
                    <Radio.Button value={false}>Inactive</Radio.Button>
                  </RadioGroup>
                </IsAdmin>
              )}
            </React.Fragment>
          )}
        </EditSection>

        {isEditing && (
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              paddingBottom: '10px',
              paddingTop: '10px'
            }}
          >
            <Button
              style={{ marginRight: '5px' }}
              type="primary"
              onClick={() => updateUser(formValues)}
            >
              Save Changes
            </Button>
            <Button onClick={discardChanges}>Discard Changes</Button>
          </div>
        )}
        <UserNameSection>
          <LargeSectionTitle>Name:</LargeSectionTitle>
          <UserName userName={employee.fullName} setChanges={onChange} isEditing={isEditing} />
        </UserNameSection>

        <SectionTile>Job position:</SectionTile>
        <JobPosition
          jobTitle={employee.jobPosition}
          isEditing={isAdmin ? isEditing : false}
          setChanges={onChange}
          positions={positions}
        />
        {(havePermissions || currentUser) && (
          <ProjectsSection
            isEditing={isEditing}
            jobPosition={employee.jobPosition}
            userProfile={employee}
            userId={employee.id}
          />
        )}

        {(isAdmin || currentUser) && (
          <React.Fragment>
            <SectionTile>Identifier:</SectionTile>
            <EmployeeIdentifier
              identifier={employee.employeeIdentifier}
              isEditing={isEditing}
              setChanges={onChange}
            />
          </React.Fragment>
        )}

        {(isAdmin || currentUser) && (
          <React.Fragment>
            <SectionTile>Gitlab username:</SectionTile>
            <GitlabUserName
              gitlabUserName={employee.gitlabUsername}
              setChanges={onChange}
              isEditing={isEditing}
            />
          </React.Fragment>
        )}

        {(isAdmin || currentUser) && (
          <React.Fragment>
            <SectionTile>Contract Type</SectionTile>
            <ContractType
              isEditing={isEditing}
              contractType={formValues.contractType}
              contractDate={formValues.contractDate}
              onChange={onChange}
            />
          </React.Fragment>
        )}
        {isAdmin && (
          <React.Fragment>
            <SectionTile>Resignation date:</SectionTile>
            <ResignationDate
              date={employee.resignationDate}
              setChanges={onChange}
              isEditing={isEditing}
            />
          </React.Fragment>
        )}

        <SectionTile>About:</SectionTile>
        <About about={employee.about} isEditing={isEditing} setChanges={onChange} />
      </ScrollContent>
      <Modal
        visible={isVisible}
        title="Change status"
        onOk={deleteUser}
        onCancel={() => setIsVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsVisible(false)}>
            No
          </Button>,
          <Button key="submit" type="danger" loading={loading} onClick={deleteUser}>
            Yes
          </Button>
        ]}
      >
        <p>Are you sure you want to change active status to this employee ?</p>
      </Modal>
    </React.Fragment>
  )
}

export default ProfileDetails

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
const SectionTile = styled.p`
  font-size: 15;
  font-weight: bold;
  margin-bottom: 0px;
  margin-right: 10px;
`
const LargeSectionTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 0px;
  padding-right: 10px;
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

const UserNameSection = styled.div`
  display: flex;
  align-items: center;
`

const EditSection = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
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
  margin-left: 25px;
`
