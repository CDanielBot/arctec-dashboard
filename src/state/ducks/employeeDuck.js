import createReducer from './utils/createReducer'
import { UserEndpoints } from 'api'

const types = {
  GET_EMPLOYEES_REQUEST: '[user] GET_EMPLOYEES / REQUEST',
  GET_EMPLOYEES_SUCCESS: '[user] GET_EMPLOYEES / SUCCESS',
  GET_EMPLOYEES_ERROR: '[user] GET_EMPLOYEES / ERROR',

  CREATE_EMPLOYEE_REQUEST: '[user] CREATE_EMPLOYEE_REQUEST',
  CREATE_EMPLOYEE_SUCCESS: '[user} CREATE_EMPLOYEE_SUCCESS',

  GET_PROJECT_MANAGERS_REQUEST: '[user] GET_PROJECT_MANAGERS / REQUEST',
  GET_PROJECT_MANAGERS_SUCCESS: '[user] GET_PROJECT_MANAGERS / SUCCESS',

  GET_PROJECT_MANAGER_FOR_EMPLOYEE_REQUEST: '[user] GET_PROJECT_MANAGER_FOR_EMPLOYEE_REQUEST',
  GET_PROJECT_MANAGER_FOR_EMPLOYEE_SUCCESS: '[user] GET_PROJECT_MANAGER_FOR_EMPLOYEE_SUCCESS',

  SHOW_INACTIVE_USERS: '[user] SHOW_INACTIVE_USERS'
}

const initialState = {
  list: [],
  projectManagersList: [],
  inactiveUsers: false,
  count: 0
}

const reducer = createReducer(initialState)({
  [types.GET_EMPLOYEES_SUCCESS]: (state, { payload: { employees } }) => ({
    ...state,
    list: employees,
    count: employees.length
  }),
  [types.CREATE_EMPLOYEE_SUCCESS]: (state, { payload: { newEmployee } }) => ({
    ...state,
    list: [...state.list, newEmployee]
  }),

  [types.GET_PROJECT_MANAGERS_SUCCESS]: (state, { payload: { projectManagers } }) => ({
    ...state,
    projectManagersList: projectManagers
  }),
  [types.SHOW_INACTIVE_USERS]: (state, { payload: { inactiveUsers } }) => ({
    ...state,
    inactiveUsers: inactiveUsers
  })
})

const thunks = {
  getEmployees: () => async dispatch => {
    try {
      dispatch({ type: types.GET_EMPLOYEES_REQUEST })
      const employees = await UserEndpoints.getEmployees()

      dispatch({
        type: types.GET_EMPLOYEES_SUCCESS,
        payload: { employees }
      })
    } catch (error) {
      dispatch({ type: types.GET_EMPLOYEES_ERROR, payload: { error } })
      return Promise.reject(error)
    }
  },

  createEmployee: newEmployee => async dispatch => {
    try {
      dispatch({ type: types.CREATE_EMPLOYEE_REQUEST })
      const newUser = await UserEndpoints.createUser(newEmployee)
      dispatch({ type: types.CREATE_EMPLOYEE_SUCCESS, payload: { newEmployee } })
      return newUser
    } catch (error) {
      return Promise.reject(error)
    }
  },

  getProjectManagers: () => async dispatch => {
    try {
      dispatch({ type: types.GET_PROJECT_MANAGERS_REQUEST })
      const projectManagers = await UserEndpoints.getProjectManagers()
      dispatch({ type: types.GET_PROJECT_MANAGERS_SUCCESS, payload: { projectManagers } })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  getProjectManager: projectWorkingOn => async dispatch => {
    try {
      dispatch({ type: types.GET_PROJECT_MANAGER_FOR_EMPLOYEE_REQUEST })
      const projectManager = await UserEndpoints.getProjectManagerForEmployee(projectWorkingOn)
      dispatch({ type: types.GET_PROJECT_MANAGER_FOR_EMPLOYEE_SUCCESS })
      return projectManager
    } catch (error) {
      return Promise.reject(error)
    }
  },

  showInactiveUsers: inactiveUsers => async dispatch => {
    dispatch({ type: types.SHOW_INACTIVE_USERS, payload: { inactiveUsers } })
  }
}

export { types as employeeTypes }
export { thunks as employeeThunks }

export default reducer
