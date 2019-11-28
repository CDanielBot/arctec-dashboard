import React, { useState } from 'react'
import { Input, Button } from 'antd'
import { useTemporaryMessage } from 'hooks'
import styled from 'styled-components'
import * as Yup from 'yup'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { authThunks } from 'state/ducks/authDuck'

const SUCCESS_MESSAGE = 'Password successfully changed.'

const ChangePassword = ({ user, authThunks }) => {
  const [oldPassword, setOldPassword] = useState(null)
  const [newPassword, setNewPassword] = useState(null)
  const [confirmNewPassword, setConfirmNewPassword] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [message, showMessage, hideMessage] = useTemporaryMessage()

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, 'Password must be at least 6 characters long!')
      .required('Password is required!'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
  })

  const validatePassword = async () => {
    try {
      hideMessage()
      setIsLoading(true)
      await validationSchema.validate({ oldPassword, newPassword, confirmNewPassword })
      await authThunks.changePassword(user, oldPassword, newPassword)
      setIsLoading(false)

      setOldPassword(null)
      setNewPassword(null)
      setConfirmNewPassword(null)

      showMessage(SUCCESS_MESSAGE)
    } catch (error) {
      setIsLoading(false)
      showMessage(error.message)
    }
  }

  return (
    <React.Fragment>
      <ChangePasswordForm>
        <label>Old Password</label>
        <StyledInput
          type="password"
          value={oldPassword}
          onChange={({ target: { value } }) => setOldPassword(value)}
        />

        <label>New Password</label>
        <StyledInput
          type="password"
          value={newPassword}
          onChange={({ target: { value } }) => setNewPassword(value)}
        />

        <label>Confirm New Password</label>
        <StyledInput
          type="password"
          value={confirmNewPassword}
          onChange={({ target: { value } }) => setConfirmNewPassword(value)}
          onPressEnter={validatePassword}
        />
      </ChangePasswordForm>

      <SavePasswordButton loading={isLoading} onClick={validatePassword}>
        Change Password
      </SavePasswordButton>

      <Message message={message}>{message}</Message>
    </React.Fragment>
  )
}

const mapDispatch = dispatch => ({
  authThunks: bindActionCreators(authThunks, dispatch)
})

export default connect(
  null,
  mapDispatch
)(ChangePassword)

const SavePasswordButton = styled(Button)`
  width: 300px;
  margin-top: 10px;
  background-color: #1890ff;
  border-color: #1890ff;
  color: white;
  :hover {
    color: #fff;
    background-color: #40a9ff;
    border-color: #40a9ff;
  }
`

const StyledInput = styled(Input)`
  width: 300px;
`
const ChangePasswordForm = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`

const Message = styled.label`
  padding-top: 10px;
  color: ${({ message }) => (message === SUCCESS_MESSAGE ? 'green' : 'red')};
  width: 300px;
`
