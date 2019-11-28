import React, { useState } from 'react'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import CalendarEventsModal from './Calendar/CalendarModal'
import { connect } from 'react-redux'

const localizer = BigCalendar.momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(BigCalendar)

const getUserFromUrl = location => {
  const { pathname } = location
  const userFromUrl = pathname.split('/').slice(-1)[0]
  return userFromUrl
}

const Calendar = ({ calendarEvents, employee, updateUser, userProfile, history }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [date, setDate] = useState({})
  const [eventToEdit, setEventToEdit] = useState(null)

  const formatDateEvents = calendarEvents.map(e => {
    return {
      ...e,
      start: e.start.seconds ? e.start.toDate() : e.start,
      end: e.end.seconds ? e.end.toDate() : e.end
    }
  })

  const moveEvent = async ({ event, start, end }) => {
    const idx = formatDateEvents.indexOf(event)
    const updatedEvent = { ...event, start, end }

    const nextEvents = [...formatDateEvents]
    nextEvents.splice(idx, 1, updatedEvent)

    const updatedEventsUser = { ...employee, calendarEvents: nextEvents }
    await updateUser(updatedEventsUser)
  }

  const createEvent = async event => {
    const updatedEventsUser = { ...employee, calendarEvents: [...calendarEvents, event] }
    await updateUser(updatedEventsUser)
  }

  const updateEvent = async event => {
    const removeOldEvent = calendarEvents.filter(e => e.id !== event.id)
    const updatedEventsUser = { ...employee, calendarEvents: [...removeOldEvent, event] }
    await updateUser(updatedEventsUser)
  }

  const deleteEvent = async event => {
    const calendarEventsWithouthDeletedEvent = calendarEvents.filter(e => e.id !== event.id)
    const updatedEventsUser = { ...employee, calendarEvents: calendarEventsWithouthDeletedEvent }
    await updateUser(updatedEventsUser)
    closeEventEditModal()
  }

  const openCreateEventModal = event => {
    setDate(event)
    setIsVisible(true)
  }

  const eventStyleGetter = function(event) {
    var backgroundColor = '#' + event.type
    var style = {
      backgroundColor: backgroundColor,
      borderRadius: '0px',
      opacity: 0.8,
      color: 'black',
      border: '0px',
      display: 'block'
    }
    return {
      style: style
    }
  }

  const openEditEventModal = event => {
    setEventToEdit(event)
    setIsVisible(true)
  }

  const closeEventEditModal = () => {
    setEventToEdit(null)
    setIsVisible(false)
  }

  if (
    userProfile.role === 'admin' ||
    userProfile.id === getUserFromUrl(history.location).toString()
  ) {
    return (
      <React.Fragment>
        <DragAndDropCalendar
          style={{ width: '1000px', height: '800px' }}
          selectable
          events={formatDateEvents}
          onEventDrop={moveEvent}
          localizer={localizer}
          onDoubleClickEvent={e => openEditEventModal(e)}
          defaultView={BigCalendar.Views.MONTH}
          tooltipAccessor={e => e.description}
          defaultDate={new Date()}
          onSelectSlot={e => openCreateEventModal(e)}
          eventPropGetter={eventStyleGetter}
          resizableAccessor="false"
        />
        <CalendarEventsModal
          updateEvent={updateEvent}
          visible={isVisible}
          title="Create a new event"
          onCancel={closeEventEditModal}
          createEvent={createEvent}
          date={date}
          eventToEdit={eventToEdit}
          deleteEvent={deleteEvent}
        />
      </React.Fragment>
    )
  }

  return (
    <DragAndDropCalendar
      style={{ width: '1000px', height: '800px' }}
      events={formatDateEvents}
      defaultView={BigCalendar.Views.MONTH}
      tooltipAccessor={e => e.description}
      defaultDate={new Date()}
      eventPropGetter={eventStyleGetter}
      resizableAccessor="false"
    />
  )
}

const mapStateToProps = state => ({ userProfile: state.auth.profile })

export default connect(
  mapStateToProps,
  null
)(Calendar)
