import createReducer from './utils/createReducer'
import { ProjectEndpoints } from 'api'

const types = {
  GET_PROJECTS_REQUEST: '[project] GET_PROJECTS_REQUEST',
  GET_PROJECTS_SUCCESS: '[project] GET_PROJECTS_SUCCESS',

  GET_PROJECT_TIME_REPORT_REQUEST: '[project] GET_PROJECT_TIME_REPORT_REQUEST',
  GET_PROJECT_TIME_REPORT_SUCCESS: '[project] GET_PROJECT_TIME_REPORT_SUCCESS',
  REMOVE_PROJECT_TIME_REPORT_SUCCESS: '[project] REMOVE_PROJECT_TIME_REPORT_SUCCESS',

  GET_PROJECT_MILESTONE_SUCCESS: '[project] GET_PROJECT_MILESTONE_SUCCESS',

  CREATE_PROJECT_REQUEST: '[project] CREATE_PROJECT_REQUEST',
  CREATE_PROJECT_SUCCESS: '[project] CREATE_PROJECT_SUCCESS',

  DELETE_PROJECT_REQUEST: '[project] DELETE_PROJECT_REQUEST',
  DELETE_PROJECT_SUCCESS: '[project] DELETE_PROJECT_SUCCESS',

  UPDATE_PROJECT_REQUEST: '[project] UPDATE_PROJECT_REQUEST',
  UPDATE_PROJECT_SUCCESS: '[project] UPDATE_PROJECT_SUCCESS',

  UPDATE_PROJECT_TEAM_REQUEST: '[project] UPDATE_PROJECT_TEAM_REQUEST',
  UPDATE_PROJECT_TEAM_SUCCESS: '[project] UPDATE_PROJECT_TEAM_SUCCESS',

  UPDATE_PROJECT_RESOURCES_REQUEST: '[project] UPDATE_PROJECT_RESOURCES_REQUEST',
  UPDATE_PROJECT_RESOURCES_SUCCESS: '[project] UPDATE_PROJECT_RESOURCES_SUCCESS',

  UPDATE_PROJECT_INTEGRATION_REQUEST: '[project] UPDATE_PROJECT_INTEGRATION_REQUEST',
  UPDATE_PROJECT_INTEGRAION_SUCCESS: '[project] UPDATE_PROJECT_INTEGRATION_SUCCESS',

  CREATE_PROJECT_INTEGRAION_SUCCESS: '[project] CREATE_PROJECT_INTEGRAION_SUCCESS',

  REMOVE_PROJECT_INTEGRATION_REQUEST: '[project] REMOVE_PROJECT_INTEGRATION_REQUEST',
  REMOVE_PROJECT_INTEGRAION_SUCCESS: '[project] REMOVE_PROJECT_INTEGRATION_SUCCESS',

  SHOW_INACTIVE_PROJECTS: '[project] SHOW_INACTIVE_PROJECTS',
  SHOW_PROJECTS_WORKING_ON: '[project] SHOW_PROJECTS_WORKING_ON',

  GET_ALL_PROJECTS_INTEGRATIONS_REQUEST: '[project] GET_ALL_PROJECTS_INTEGRATIONS_REQUEST',
  GET_ALL_PROJECTS_INTEGRATIONS_SUCCESS: '[project] GET_ALL_PROJECTS_INTEGRATIONS_SUCCESS'
}

const initialState = {
  list: [],
  count: 0,
  showInactiveProjects: false,
  showProjectsWorkingOn: true,
  projectsIntegrationsList: [],
  projectTimeReportList: {},
  projectMilestonesList: {}
}

const reducer = createReducer(initialState)({
  [types.GET_PROJECTS_SUCCESS]: (state, { payload: { projects } }) => ({
    ...state,
    list: projects,
    count: projects.length
  }),

  [types.GET_PROJECT_INTEGRATION_SUCCESS]: (state, { payload: { projectIntegration } }) => ({
    ...state,
    projectIntegration: projectIntegration
  }),

  [types.GET_PROJECT_TIME_REPORT_SUCCESS]: (state, { payload: { projectTimeReport } }) => ({
    ...state,
    projectTimeReportList: {
      ...state.projectTimeReportList,
      [projectTimeReport.projectId]: projectTimeReport.timeReport
    }
  }),

  [types.GET_PROJECT_MILESTONE_SUCCESS]: (state, { payload: { projectMilestone } }) => ({
    ...state,
    projectMilestonesList: {
      ...state.projectMilestonesList,
      [projectMilestone.projectId]: projectMilestone.milestones
    }
  }),

  [types.REMOVE_PROJECT_TIME_REPORT_SUCCESS]: (state, { payload: { projectId } }) => ({
    ...state,
    projectTimeReportList: {
      ...state.projectTimeReportList,
      [projectId]: undefined
    }
  }),

  [types.CREATE_PROJECT_SUCCESS]: (state, { payload: { newProjectDocument } }) => ({
    ...state,
    list: [...state.list, newProjectDocument]
  }),
  [types.UPDATE_PROJECT_SUCCESS]: (state, { payload: { newData } }) => ({
    ...state,
    list: [...state.list, newData]
  }),

  [types.SHOW_INACTIVE_PROJECTS]: (state, { payload: { inactiveProjects } }) => ({
    ...state,
    showInactiveProjects: inactiveProjects
  }),
  [types.SHOW_PROJECTS_WORKING_ON]: (state, { payload: { showProjectsWorkingOn } }) => ({
    ...state,
    showProjectsWorkingOn: showProjectsWorkingOn
  }),

  [types.GET_ALL_PROJECTS_INTEGRATIONS_SUCCESS]: (
    state,
    { payload: { projectsIntegrationsList } }
  ) => ({
    ...state,
    projectsIntegrationsList: projectsIntegrationsList
  }),
  [types.UPDATE_PROJECT_INTEGRAION_SUCCESS]: (state, { payload: { projectIntegration } }) => ({
    ...state,
    projectsIntegrationsList: state.projectsIntegrationsList.map(content =>
      content.id === projectIntegration.id ? projectIntegration : content
    )
  }),
  [types.CREATE_PROJECT_INTEGRAION_SUCCESS]: (state, { payload: { newProjectIntegration } }) => ({
    ...state,
    projectsIntegrationsList: [...state.projectsIntegrationsList, newProjectIntegration]
  }),
  [types.REMOVE_PROJECT_INTEGRAION_SUCCESS]: (state, { payload: { projectId } }) => ({
    ...state,
    projectsIntegrationsList: state.projectsIntegrationsList.filter(
      content => content.id !== projectId
    )
  })
})

const thunks = {
  getProjects: () => async dispatch => {
    try {
      dispatch({ type: types.GET_PROJECTS_REQUEST })
      const projects = await ProjectEndpoints.getProjects()
      dispatch({ type: types.GET_PROJECTS_SUCCESS, payload: { projects } })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  loadProjectsTimeReportList: () => async (dispatch, state) => {
    try {
      const projectsIntegrationsList = state().projects.projectsIntegrationsList

      projectsIntegrationsList.map(async project => {
        let projectTimeReport = {}
        const timeReport = await ProjectEndpoints.getProjectTimeReport(
          project.gitlabProjectId,
          project.gitlabToken
        )
        projectTimeReport.projectId = project.id
        projectTimeReport.timeReport = timeReport

        dispatch({
          type: types.GET_PROJECT_TIME_REPORT_SUCCESS,
          payload: {
            projectTimeReport
          }
        })
      })
    } catch (error) {
      console.log(error)
    }
  },

  loadProjectsMilestonesList: () => async (dispatch, state) => {
    try {
      const projectsIntegrationsList = state().projects.projectsIntegrationsList

      projectsIntegrationsList.map(async project => {
        let projectMilestone = {}
        const milestones = await ProjectEndpoints.getProjectMilestone(
          project.gitlabProjectId,
          project.gitlabToken
        )
        projectMilestone.projectId = project.id
        projectMilestone.milestones = milestones

        dispatch({
          type: types.GET_PROJECT_MILESTONE_SUCCESS,
          payload: {
            projectMilestone
          }
        })
      })
    } catch (error) {
      console.log(error)
    }
  },

  createProject: newProject => async dispatch => {
    try {
      dispatch({ type: types.CREATE_PROJECT_REQUEST })
      const newProjectDocument = await ProjectEndpoints.createProject(newProject)
      dispatch({ type: types.CREATE_PROJECT_SUCCESS, payload: { newProjectDocument } })
      return newProjectDocument
    } catch (error) {
      return Promise.reject(error)
    }
  },

  deleteProject: id => async dispatch => {
    try {
      dispatch({ type: types.DELETE_PROJECT_REQUEST })
      await ProjectEndpoints.deleteProject(id)
      dispatch({ type: types.DELETE_PROJECT_SUCCESS })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  updateProject: (newData, id) => async dispatch => {
    try {
      dispatch({ type: types.UPDATE_PROJECT_REQUEST })
      await ProjectEndpoints.updateProject(newData, id)
      dispatch({ type: types.UPDATE_PROJECT_SUCCESS, payload: { newData } })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  updateProjectTeam: (newData, id) => async dispatch => {
    try {
      dispatch({ type: types.UPDATE_PROJECT_TEAM_REQUEST })
      await ProjectEndpoints.updateProjectTeam(newData, id)
      dispatch({ type: types.UPDATE_PROJECT_TEAM_SUCCESS })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  updateProjectResources: (newData, id) => async dispatch => {
    try {
      dispatch({ type: types.UPDATE_PROJECT_RESOURCES_REQUEST })
      await ProjectEndpoints.updateProjectResources(newData, id)
      dispatch({ type: types.UPDATE_PROJECT_RESOURCES_SUCCESS })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  getAllProjectsIntegrations: () => async dispatch => {
    try {
      dispatch({ type: types.GET_ALL_PROJECTS_INTEGRATIONS_REQUEST })
      const projectsIntegrationsList = await ProjectEndpoints.getAllProjectIntegrations()
      dispatch({
        type: types.GET_ALL_PROJECTS_INTEGRATIONS_SUCCESS,
        payload: { projectsIntegrationsList }
      })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  createOrUpdateProjectIntegration: (gitlabIntegrationValues, projectId) => async dispatch => {
    try {
      dispatch({ type: types.UPDATE_PROJECT_INTEGRATION_REQUEST })
      const projectIntegration = await ProjectEndpoints.getProjectIntegration(projectId)
      if (projectIntegration) {
        const projectIntegration = await ProjectEndpoints.updateProjectIntegration(
          gitlabIntegrationValues,
          projectId
        )
        dispatch({ type: types.UPDATE_PROJECT_INTEGRAION_SUCCESS, payload: { projectIntegration } })
      } else {
        const newProjectIntegration = await ProjectEndpoints.createProjectIntegration(
          gitlabIntegrationValues,
          projectId
        )
        dispatch({
          type: types.CREATE_PROJECT_INTEGRAION_SUCCESS,
          payload: { newProjectIntegration }
        })
      }
    } catch (error) {
      return Promise.reject(error)
    }
  },

  removeProjectIntegration: projectId => async dispatch => {
    try {
      dispatch({ type: types.REMOVE_PROJECT_INTEGRATION_REQUEST })
      await ProjectEndpoints.removeProjectIntegration(projectId)
      dispatch({ type: types.REMOVE_PROJECT_INTEGRAION_SUCCESS, payload: { projectId } })
      dispatch({ type: types.REMOVE_PROJECT_TIME_REPORT_SUCCESS, payload: { projectId } })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  showInactiveProjects: inactiveProjects => dispatch => {
    dispatch({ type: types.SHOW_INACTIVE_PROJECTS, payload: { inactiveProjects } })
  },
  showProjectsWorkingOn: showProjectsWorkingOn => dispatch => {
    dispatch({ type: types.SHOW_PROJECTS_WORKING_ON, payload: { showProjectsWorkingOn } })
  }
}

export { types as projectTypes }
export { thunks as projectThunks }
export default reducer
