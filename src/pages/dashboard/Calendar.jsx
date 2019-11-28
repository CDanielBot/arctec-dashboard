import React, { useState } from 'react'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import CalendarEventsModal from './CalendarEventsModal'

const localizer = BigCalendar.momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(BigCalendar)

const Calendar = ({ calendarEvents, calendarThunks, userProfile, employeesList, projects }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [date, setDate] = useState({})
  const [eventToEdit, setEventToEdit] = useState(null)

  let usersEvents = []
  let projectsDeadLines = []

  const usersWithCalendarEvents = employeesList.filter(e => e.calendarEvents.length !== 0)

  projects.filter(e =>
    !e.deadline
      ? null
      : projectsDeadLines.push({
          title: e.name,
          start: e.deadline,
          end: e.deadline,
          type: 'ff0000',
          nonEdit: true
        })
  )

  usersWithCalendarEvents.map(s =>
    s.calendarEvents.map(e =>
      usersEvents.push({ ...e, nonEdit: true, description: `(${s.fullName}) ${e.description}` })
    )
  )

  const allEvents = [...calendarEvents, ...usersEvents, ...projectsDeadLines]

  const formatDateEvents = allEvents.map(e => {
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

    await calendarThunks.updateCalendarEvent(updatedEvent, calendarEvents)
  }

  const createEvent = async event => {
    await calendarThunks.createCalendarEvent(event)
  }

  const updateEvent = async event => {
    await calendarThunks.updateCalendarEvent(event, calendarEvents)
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

  const deleteEvent = async event => {
    await calendarThunks.deleteCalendarEvent(event, calendarEvents)
    closeEventEditModal()
  }

  if (userProfile.role === 'admin') {
    return (
      <React.Fragment>
        <DragAndDropCalendar
          style={{ width: '1000px', height: '800px' }}
          selectable
          events={formatDateEvents}
          onEventDrop={e => (e.event.nonEdit ? null : moveEvent(e))}
          localizer={localizer}
          onDoubleClickEvent={e => (e.nonEdit ? null : openEditEventModal(e))}
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

export default Calendar
