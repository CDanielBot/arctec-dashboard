import createReducer from './utils/createReducer'
import AnnouncementsEndpoints from 'api/AnnouncementsEndpoints'

const types = {
  GET_ANNOUNCEMENTS: 'GET_ANNOUNCEMENTS',
  GET_ANNOUNCEMENTS_SUCCESS: 'GET_ANNOUNCEMENTS_SUCCESS',

  CREATE_ANNOUNCEMENT: 'CREATE_ANNOUNCEMENT',
  CREATE_ANNOUNCEMENT_SUCCESS: 'CREATE_ANNOUNCEMENT_SUCCESS',

  UPDATE_ANNOUNCEMENT: 'UPDATE_ANNOUNCEMENT',
  UPDATE_ANNOUNCEMENT_SUCCESS: 'UPDATE_ANNOUNCEMENT_SUCCESS',

  DELETE_ANNOUNCEMENT: 'DELETE_ANNOUNCEMENT',
  DELETE_ANNOUNCEMENT_SUCCESS: 'DELETE_ANNOUNCEMENT_SUCCESS'
}

const initialState = {
  list: [],
  count: 0
}

const reducer = createReducer(initialState)({
  [types.GET_ANNOUNCEMENTS_SUCCESS]: (state, { payload: { announcements } }) => ({
    ...state,
    list: announcements
  }),

  [types.CREATE_ANNOUNCEMENT_SUCCESS]: (state, { payload: { announcementFromDb } }) => ({
    ...state,
    list: [...state.list, announcementFromDb]
  }),

  [types.UPDATE_ANNOUNCEMENT_SUCCESS]: (state, { payload: { updated } }) => ({
    ...state,
    list: updated
  }),

  [types.DELETE_ANNOUNCEMENT_SUCCESS]: (state, { payload: { newAnnouncementsList } }) => ({
    ...state,
    list: newAnnouncementsList
  })
})

const thunks = {
  getAnnouncements: () => async dispatch => {
    try {
      dispatch({ type: types.GET_ANNOUNCEMENTS })
      const announcements = await AnnouncementsEndpoints.getAnnouncements()
      dispatch({ type: types.GET_ANNOUNCEMENTS_SUCCESS, payload: { announcements } })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  createAnnouncement: announcement => async dispatch => {
    try {
      dispatch({ type: types.CREATE_ANNOUNCEMENT })
      const announcementFromDb = await AnnouncementsEndpoints.createAnnouncement(announcement)
      dispatch({ type: types.CREATE_ANNOUNCEMENT_SUCCESS, payload: { announcementFromDb } })
    } catch (error) {
      return Promise.reject(error)
    }
  },
  updateAnnouncement: (data, id, announcements) => async dispatch => {
    try {
      dispatch({ type: types.UPDATE_ANNOUNCEMENT })
      await AnnouncementsEndpoints.updateAnnouncement(data, id)
      let updated = announcements.filter(ann => ann.id !== id)
      updated.push(data)

      dispatch({ type: types.UPDATE_ANNOUNCEMENT_SUCCESS, payload: { updated } })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  deleteAnnouncement: (id, announcements) => async dispatch => {
    try {
      dispatch({ type: types.DELETE_ANNOUNCEMENT })
      await AnnouncementsEndpoints.deleteAnnouncement(id)
      let newAnnouncementsList = announcements.filter(ann => ann.id !== id)
      dispatch({ type: types.DELETE_ANNOUNCEMENT_SUCCESS, payload: { newAnnouncementsList } })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export { types as announcementTypes }
export { thunks as announcementThunks }
export default reducer
