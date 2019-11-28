import React, { useState } from 'react'
import { Button } from 'antd'
import styled from 'styled-components'
import firebaseConfig from 'firebaseConfig'
import * as firebase from 'firebase'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { authThunks } from 'state/ducks/authDuck'
import { User, Lock } from 'react-feather'
import { useTemporaryMessage } from 'hooks'

firebase.initializeApp(firebaseConfig)

const Login = ({ authThunks }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, showErrorMessage, hideErrorMessage] = useTemporaryMessage()
  const [loading, setLoading] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)

  const login = async () => {
    try {
      hideErrorMessage()
      setLoading(true)

      await authThunks.loginWithEmail(email, password)
    } catch (error) {
      setLoading(false)
      showErrorMessage(error.message)
    }
  }

  const resetPassword = async () => {
    try {
      hideErrorMessage()
      setLoading(true)

      await authThunks.resetPassword(email)
      showErrorMessage(
        `If a matching account was found an email was sent to ${email} to allow you to reset your password.`
      )
      setLoading(false)
      setShowResetPassword(!resetPassword)
    } catch (error) {
      setLoading(false)
      showErrorMessage(error.message)
    }
  }

  return (
    <LoginPageContainer>
      <LoginContainer>
        <Content>
          <TitleContainer>
            <Logo>Company</Logo>
            <PageTitle>Overview</PageTitle>
            <WelcomeTitle>Welcome back,</WelcomeTitle>
            <WelcomeMessage>please login to your account</WelcomeMessage>
          </TitleContainer>

          {!showResetPassword && (
            <React.Fragment>
              <LoginInputContainer>
                <TextContainer>
                  <InputLabel>Email</InputLabel>
                  <User color="#C8C9CD" />
                </TextContainer>
                <InputContainer>
                  <StyledInput
                    placeholder="enter your email address"
                    onChange={({ target: { value } }) => setEmail(value)}
                    value={email}
                    onKeyDown={e => (e.key === 'Enter' ? login() : null)}
                  />
                </InputContainer>
              </LoginInputContainer>

              <LoginInputContainer style={{ marginBottom: '20px' }}>
                <TextContainer>
                  <InputLabel>Password</InputLabel>
                  <Lock color="#C8C9CD" />
                </TextContainer>
                <InputContainer>
                  <StyledInput
                    placeholder="enter your password"
                    onChange={({ target: { value } }) => setPassword(value)}
                    value={password}
                    type="password"
                    onKeyDown={e => (e.key === 'Enter' ? login() : null)}
                  />
                </InputContainer>
              </LoginInputContainer>
            </React.Fragment>
          )}

          {showResetPassword && (
            <LoginInputContainer>
              <TextContainer>
                <InputLabel>Email</InputLabel>
                <User color="#C8C9CD" />
              </TextContainer>
              <InputContainer>
                <StyledInput
                  placeholder="enter your email address"
                  onChange={({ target: { value } }) => setEmail(value)}
                  value={email}
                  onKeyDown={e => (e.key === 'Enter' ? login() : null)}
                />
              </InputContainer>
            </LoginInputContainer>
          )}

          <ErrorContainer>{error && <Error>{error}</Error>}</ErrorContainer>

          <ConfirmButton
            type="primary"
            loading={loading}
            onClick={showResetPassword ? resetPassword : login}
          >
            {showResetPassword ? 'Reset' : 'Log in'}
          </ConfirmButton>

          <ForgotPasswordButton
            type="link"
            onClick={() => setShowResetPassword(!showResetPassword)}
          >
            {showResetPassword ? 'Back to login' : 'Forgot password'}
          </ForgotPasswordButton>
        </Content>
      </LoginContainer>

      {/* <HalfCircle/> */}
    </LoginPageContainer>
  )
}

const mapDispatch = dispatch => ({
  authThunks: bindActionCreators(authThunks, dispatch)
})

export default connect(
  null,
  mapDispatch
)(Login)

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
`

const Content = styled.div`
  margin-bottom: 100px;
  max-width: 500px;
  width: 100%;
`

const LoginPageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`

const LoginInputContainer = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: white;
  -webkit-box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  margin-bottom: 5px;

  :hover {
    -webkit-box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
    cursor: pointer;
  }
`
const TextContainer = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 25px;
`

const InputContainer = styled.div`
  display: flex;
  width: 100%;
  height: 50%;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 25px;
`

const InputLabel = styled.label`
  color: #060814;
  width: 100%;
  font-weight: bold;
  :hover {
    cursor: pointer;
  }
`

const StyledInput = styled.input`
  outline: none;
  border: 0;
  flex: 1;
  font-weight: bold;
  color: #060814;

  ::placeholder {
    font-weight: 600;
    color: #c8c9cd;
  }
  :hover {
    cursor: pointer;
  }
`
const TitleContainer = styled.div`
  height: 40%;
`

const ErrorContainer = styled.div`
  display: flex;
  min-height: 30px;
  margin-bottom: 30px;
`

const Error = styled.p`
  color: red;
  font-weight: bold;
  margin-bottom: 0;
`

const Logo = styled.p`
  color: #c8c9cd;
  font-weight: bold;
  font-size: 70px;
  height: 0px;
  padding-top: 80px;
`
const PageTitle = styled.p`
  padding-bottom: 10px;
  color: #060814;
  font-weight: bold;
  font-size: 70px;
  height: 30px;
`

const WelcomeTitle = styled.p`
  color: #c8c9cd;
  font-weight: bold;
  margin-bottom: -5px;
  font-size: 20px;
`
const WelcomeMessage = styled.p`
  color: #c8c9cd;
  font-weight: bold;
  font-size: 20px;
`

const ConfirmButton = styled(Button)`
  height: 50px;
  width: 150px;
  box-shadow: 0px 4px 20px rgba(120, 156, 243, 1);
  background-color: #0b4aef;
`
const ForgotPasswordButton = styled(Button)`
  height: 50px;
  width: 150px;
  float: right;
`
