import createReducer from './utils/createReducer'
import EventEndpoints from 'api/EventEndpoints'

const types = {
  GET_EVENTS_REQUEST: '[project] GET_EVENTS_REQUEST',
  GET_EVENTS_SUCCESS: '[project] GET_EVENTS_SUCCESS',

  UPDATE_EVENTS_REQUEST: '[project] UPDATE_EVENTS_REQUEST',
  UPDATE_EVENTS_SUCCESS: '[project] UPDATE_EVENTS_SUCCESS',

  CREATE_EVENT_REQUEST: '[project] CREATE_EVENT_REQUEST',
  CREATE_EVENT_SUCCESS: '[project] CREATE_EVENT_SUCCESS',

  UPDATE_CLICKED_EVENT_REQUEST: '[project] UPDATE_CLICKED_EVENT_REQUEST',
  UPDATE_CLICKED_EVENT_SUCCESS: '[project] UPDATE_CLICKED_EVENT_SUCCESS'
}

const initialState = {
  list: [],
  count: 0
}

const reducer = createReducer(initialState)({
  [types.GET_EVENTS_SUCCESS]: (state, { payload: { events } }) => ({
    ...state,
    list: events,
    count: events.length
  }),
  [types.UPDATE_EVENT_SUCCESS]: (state, { payload: { readedEvents } }) => ({
    ...state,
    list: [...state.list, readedEvents]
  }),
  [types.CREATE_EVENT_SUCCESS]: (state, { payload: { newEvent } }) => ({
    ...state,
    list: [...state.list, newEvent]
  })
})

const thunks = {
  getEvents: () => async dispatch => {
    try {
      dispatch({ type: types.GET_EVENTS_REQUEST })
      const events = await EventEndpoints.getEvents()
      dispatch({ type: types.GET_EVENTS_SUCCESS, payload: { events } })
      return events
    } catch (error) {
      return Promise.reject(error)
    }
  },

  updateEvent: (userId, readedEvents) => async dispatch => {
    try {
      dispatch({ type: types.UPDATE_EVENTS_REQUEST })
      await EventEndpoints.updateEvents(userId)
      dispatch({ type: types.UPDATE_EVENTS_SUCCESS, payload: { readedEvents } })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  updateClickedEvent: (userId, eventId) => async dispatch => {
    try {
      dispatch({ type: types.UPDATE_CLICKED_EVENT_REQUEST })
      await EventEndpoints.updateClickedEvent(userId, eventId)
      dispatch({ type: types.UPDATE_CLICKED_EVENT_SUCCESS })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  createEvent: event => async dispatch => {
    try {
      dispatch({ type: types.CREATE_EVENT_REQUEST })
      const newEvent = await EventEndpoints.createEvent(event)
      dispatch({ type: types.CREATE_EVENT_SUCCESS, payload: { newEvent } })
    } catch (error) {
      return Promise.reject(error)
    }
  }
}

export { types as eventTypes }
export { thunks as eventThunks }
export default reducer
