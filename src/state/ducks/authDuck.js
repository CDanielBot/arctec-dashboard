import firebase from 'firebase/app'
import createReducer from './utils/createReducer'
import { UserEndpoints } from 'api'

// Types
const types = {
  LOGIN_WITH_EMAIL_REQUEST: '[auth] LOGIN_WITH_EMAIL / REQUEST',
  LOGIN_WITH_EMAIL_SUCCESS: '[auth] LOGIN_WITH_EMAIL / SUCCESS',

  LOGOUT_REQUEST: '[auth] LOGOUT / REQUEST',
  LOGOUT_SUCCESS: '[auth] LOGOUT / SUCCESS',

  CHANGE_PASSWORD_REQUEST: '[auth] CHANGE_PASSWORD / REQUEST',
  CHANGE_PASSWORD_SUCCESS: '[auth] CHANGE_PASSWORD / SUCCESS',

  AUTH_STATE_CHANGED: '[auth] AUTH_STATE_CHANGED',

  UPDATE_USER_PROFILE_REQUEST: '[auth] UPDATE_USER_PROFILE_REQUEST',
  UPDATE_USER_PROFILE_SUCCESS: '[auth] UPDATE_USER_PROFILE_SUCCESS',

  RESET_PASSWORD_REQUEST: '[auth] RESET_PASSWORD_REQUEST',
  RESET_PASSWORD_SUCCESS: '[auth] RESET_PASSWORD_SUCCESS'
}

const initialState = {
  user: null,
  profile: null
}

const reducer = createReducer(initialState)({
  [types.AUTH_STATE_CHANGED]: (state, { payload: { user, userProfile } }) => ({
    ...state,
    user,
    profile: userProfile
  }),

  [types.LOGOUT_SUCCESS]: (state, _) => ({
    ...state,
    ...initialState
  }),

  [types.SET_USER_PROFILE]: (state, { payload: { userProfile } }) => ({
    ...state,
    profile: userProfile
  }),

  [types.UPDATE_USER_PROFILE_SUCCESS]: (state, { payload: { updatedUser } }) => ({
    ...state,
    profile: { ...state.profile, ...updatedUser }
  })
})

const thunks = {
  loginWithEmail: (email, password) => async dispatch => {
    try {
      dispatch({ type: types.LOGIN_WITH_EMAIL_REQUEST })
      await firebase.auth().signInWithEmailAndPassword(email, password)
      dispatch({ type: types.LOGIN_WITH_EMAIL_SUCCESS })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  logout: () => async dispatch => {
    try {
      dispatch({ type: types.LOGOUT_REQUEST })
      await firebase.auth().signOut()
      dispatch({ type: types.LOGOUT_SUCCESS })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  changePassword: (user, oldPassword, newPassword) => async dispatch => {
    try {
      dispatch({ type: types.CHANGE_PASSWORD_REQUEST })
      await UserEndpoints.changePassword(user, oldPassword, newPassword)
      dispatch({ type: types.CHANGE_PASSWORD_SUCCESS })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  updateUserProfile: (updatedUser, id) => async dispatch => {
    try {
      dispatch({ type: types.UPDATE_USER_PROFILE_REQUEST })
      await UserEndpoints.updateUser(updatedUser, id)
      dispatch({ type: types.UPDATE_USER_PROFILE_SUCCESS, payload: { updatedUser } })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  resetPassword: email => async dispatch => {
    try {
      dispatch({ type: types.RESET_PASSWORD_REQUEST })
      await UserEndpoints.resetPassword(email)
      dispatch({ type: types.RESET_PASSWORD_SUCCESS })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  authStateChanged: (user, userProfile) => ({
    type: types.AUTH_STATE_CHANGED,
    payload: { user, userProfile }
  })
}

export { types as authTypes }
export { thunks as authThunks }
export default reducer
