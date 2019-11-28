import createReducer from './utils/createReducer'
import { CalendarEndpoints } from 'api'

const types = {
  GET_EVENTS_REQUEST: 'GET_EVENTS_REQUEST',
  GET_EVENTS_SUCCESS: 'GET_EVENTS_SUCCESS',

  CREATE_EVENT_REQUEST: 'CREATE_EVENT_REQUEST',
  CREATE_EVENT_SUCCESS: 'CREATE_EVENT_SUCCESS',

  UPDATE_EVENT_REQUEST: 'UPDATE_EVENT_REQUEST',
  UPDATE_EVENT_SUCCESS: 'UPDATE_EVENT_SUCCESS',

  DELETE_EVENT_REQUEST: 'DELETE_EVENT_REQUEST',
  DELETE_EVENT_SUCCESS: 'DELETE_EVENT_SUCCESS'
}

const initialState = {
  list: [],
  count: 0
}

const reducer = createReducer(initialState)({
  [types.GET_EVENTS_SUCCESS]: (state, { payload: { events } }) => ({
    ...state,
    list: events
  }),
  [types.UPDATE_EVENT_SUCCESS]: (state, { payload: { newEventsList } }) => ({
    ...state,
    list: newEventsList
  }),
  [types.CREATE_EVENT_SUCCESS]: (state, { payload: { newEvent } }) => ({
    ...state,
    list: [...state.list, newEvent]
  }),
  [types.DELETE_EVENT_SUCCESS]: (state, { payload: { updatedEventsList } }) => ({
    ...state,
    list: updatedEventsList
  })
})

const thunks = {
  getCalendarEvents: () => async dispatch => {
    try {
      dispatch({ type: types.GET_EVENTS_REQUEST })
      const events = await CalendarEndpoints.getEventsForGlobalCalendar()
      dispatch({ type: types.GET_EVENTS_SUCCESS, payload: { events } })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  updateCalendarEvent: (event, eventsList) => async dispatch => {
    try {
      dispatch({ type: types.UPDATE_EVENT_REQUEST })
      await CalendarEndpoints.updateEventForGlobalCalendar(event)
      const filteredEvents = eventsList.filter(e => e.id !== event.id)
      const newEventsList = [...filteredEvents, event]
      dispatch({ type: types.UPDATE_EVENT_SUCCESS, payload: { newEventsList } })
    } catch (error) {
      return Promise.reject(error)
    }
  },

  createCalendarEvent: event => async dispatch => {
    try {
      dispatch({ type: types.CREATE_EVENT_REQUEST })
      const newEvent = await CalendarEndpoints.createEventForGlobalCalendar(event)
      dispatch({ type: types.CREATE_EVENT_SUCCESS, payload: { newEvent } })
    } catch (error) {}
  },
  deleteCalendarEvent: (event, eventsList) => async dispatch => {
    try {
      dispatch({ type: types.DELETE_EVENT_REQUEST })
      await CalendarEndpoints.deleteEventForGlobalCalendar(event)
      const updatedEventsList = eventsList.filter(e => e.id !== event.id)
      dispatch({ type: types.DELETE_EVENT_SUCCESS, payload: { updatedEventsList } })
    } catch (error) {}
  }
}

export { types as eventTypes }
export { thunks as calendarThunks }
export default reducer
