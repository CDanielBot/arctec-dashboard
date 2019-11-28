import React, { useState } from 'react'
import BigCalendar from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Select, Switch } from 'antd'
import CalendarEventsModal from '../profile/Calendar/CalendarModal'
import ViewEventModal from '../project/ViewEventModal'

const { Option } = Select
const localizer = BigCalendar.momentLocalizer(moment)
const DragAndDropCalendar = withDragAndDrop(BigCalendar)

const ProjectCalendar = ({
  project,
  activeEmployeesList,
  projectMilestonesList,
  projectThunks,
  onChange,
  userProfile
}) => {
  const [viewAllUsersEvents, setViewAllUsersEvents] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [date, setDate] = useState({})
  const [eventToEdit, setEventToEdit] = useState(null)
  const [viewEventModal, setViewEventModal] = useState(false)
  const [eventToView, setEventToView] = useState(null)

  let usersEvents = []
  let allUsersEvents = []
  let projectMilestones = []

  let formattedProject = [
    {
      category: 'Deadline',
      title: project.name,
      start: project.deadline,
      end: project.deadline,
      type: 'ff0000',
      nonEdit: true
    }
  ]

  const calendarEvents = project.calendarEvents.map(e => {
    return {
      ...e,
      start: e.start.seconds ? e.start.toDate() : e.start,
      end: e.end.seconds ? e.end.toDate() : e.end,
      category: 'Event'
    }
  })

  Object.keys(projectMilestonesList).find(e => {
    if (e === project.id) {
      projectMilestonesList[e].data.map(s => {
        return projectMilestones.push({
          category: 'Milestones',
          nonEdit: true,
          title: s.title,
          start: s.start_date,
          end: s.due_date
        })
      })
      return null
    }
    return null
  })

  activeEmployeesList.filter(e => {
    Object.keys(project.team).filter(a => {
      if (a === e.id && e.calendarEvents.length !== 0) {
        e.calendarEvents.map(s => {
          if (s.type === '09ff00') {
            usersEvents.push({
              ...s,
              nonEdit: true,
              description: s.description,
              category: `User: ${e.fullName}`
            })
          }
          allUsersEvents.push({
            ...s,
            nonEdit: true,
            description: s.description,
            category: `User: ${e.fullName}`
          })
          return null
        })
      }
      return null
    })
    return null
  })

  const formatDateEvents = () => {
    const allEvents = [...usersEvents, ...formattedProject, ...projectMilestones, ...calendarEvents]
    const allFilteredEvents = [
      ...allUsersEvents,
      ...formattedProject,
      ...projectMilestones,
      ...calendarEvents
    ]

    if (!viewAllUsersEvents) {
      const events = allEvents.map(e => {
        return {
          ...e,
          start: e.start.seconds ? e.start.toDate() : e.start,
          end: e.end.seconds ? e.end.toDate() : e.end
        }
      })
      return events
    }

    const events = allFilteredEvents.map(e => {
      return {
        ...e,
        start: e.start.seconds ? e.start.toDate() : e.start,
        end: e.end.seconds ? e.end.toDate() : e.end
      }
    })
    return events
  }

  const formatedDateEvents = formatDateEvents()

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

  const moveEvent = async ({ event, start, end }) => {
    const idx = calendarEvents.indexOf(event)
    const updatedEvent = { ...event, start, end }

    const nextEvents = [...calendarEvents]
    nextEvents.splice(idx, 1, updatedEvent)

    const updatedProjectCalendarEvents = { ...project, calendarEvents: nextEvents }
    await projectThunks.updateProject(updatedProjectCalendarEvents, project.id)
    onChange({ calendarEvents: nextEvents })
  }

  const createEvent = async event => {
    const updatedEventProject = { ...project, calendarEvents: [...calendarEvents, event] }
    await projectThunks.updateProject(updatedEventProject, project.id)
    onChange({ calendarEvents: [...calendarEvents, event] })
  }

  const updateEvent = async event => {
    const removeOldEvent = calendarEvents.filter(e => e.id !== event.id)
    const updatedEventsProject = { ...project, calendarEvents: [...removeOldEvent, event] }
    await projectThunks.updateProject(updatedEventsProject, project.id)
    onChange({ calendarEvents: [...removeOldEvent, event] })
  }

  const deleteEvent = async event => {
    const calendarEventsWithouthDeletedEvent = calendarEvents.filter(e => e.id !== event.id)
    const updatedEventsCalendar = { ...project, calendarEvents: calendarEventsWithouthDeletedEvent }
    await projectThunks.updateProject(updatedEventsCalendar, project.id)
    onChange({ calendarEvents: calendarEventsWithouthDeletedEvent })
    closeEventEditModal()
  }

  const openCreateEventModal = event => {
    setDate(event)
    setIsVisible(true)
  }

  const openEditEventModal = event => {
    setEventToEdit(event)
    setIsVisible(true)
  }

  const closeEventEditModal = () => {
    setEventToEdit(null)
    setIsVisible(false)
  }

  const openViewEventModal = e => {
    setEventToView(e)
    setViewEventModal(true)
  }

  const closeViewEventModal = e => {
    setEventToView(null)
    setViewEventModal(false)
  }

  if (userProfile.jobPosition === 'Project Manager' || userProfile.role === 'admin') {
    return (
      <React.Fragment>
        <label>All users events: </label>
        <Switch onChange={() => setViewAllUsersEvents(!viewAllUsersEvents)} />
        <DragAndDropCalendar
          style={{ width: '800px', height: '800px' }}
          events={formatedDateEvents}
          defaultView={BigCalendar.Views.MONTH}
          tooltipAccessor={e => e.description}
          defaultDate={new Date()}
          components={{
            toolbar: CustomToolbar
          }}
          onSelectEvent={e => openViewEventModal(e)}
          eventPropGetter={eventStyleGetter}
          onSelectSlot={e => openCreateEventModal(e)}
          resizableAccessor="false"
          localizer={localizer}
          selectable
          onEventDrop={e => (e.event.nonEdit ? null : moveEvent(e))}
          onDoubleClickEvent={e => (e.nonEdit ? null : openEditEventModal(e))}
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
        <ViewEventModal
          viewEventModal={viewEventModal}
          onCancel={closeViewEventModal}
          event={eventToView}
        />
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <label>All users events: </label>
      <Switch onChange={() => setViewAllUsersEvents(!viewAllUsersEvents)} />
      <DragAndDropCalendar
        style={{ width: '800px', height: '800px' }}
        events={formatedDateEvents}
        defaultView={BigCalendar.Views.MONTH}
        tooltipAccessor={e => e.description}
        defaultDate={new Date()}
        onSelectEvent={e => openViewEventModal(e)}
        components={{
          toolbar: CustomToolbar
        }}
        eventPropGetter={eventStyleGetter}
        resizableAccessor="false"
        localizer={localizer}
      />
      <ViewEventModal
        viewEventModal={viewEventModal}
        onCancel={closeViewEventModal}
        event={eventToView}
      />
    </React.Fragment>
  )
}

export default ProjectCalendar

const CustomToolbar = toolbar => {
  const [viewState, setViewState] = useState('month')

  const goToDayView = () => {
    toolbar.onViewChange('day')
    setViewState('day')
  }
  const goToWeekView = () => {
    toolbar.onViewChange('week')
    setViewState('week')
  }
  const goToMonthView = () => {
    toolbar.onViewChange('month')
    setViewState('month')
  }
  const goToBack = () => {
    let view = viewState
    let mDate = toolbar.date
    let newDate
    if (view === 'month') {
      newDate = new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1)
    } else if (view === 'week') {
      newDate = new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate() - 7, 1)
    } else {
      newDate = new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate() - 1, 1)
    }
    toolbar.onNavigate('prev', newDate)
  }
  const goToNext = () => {
    let view = viewState
    let mDate = toolbar.date
    let newDate
    if (view === 'month') {
      newDate = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1)
    } else if (view === 'week') {
      newDate = new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate() + 7, 1)
    } else {
      newDate = new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate() + 1, 1)
    }
    toolbar.onNavigate('next', newDate)
  }

  const goToBackYear = () => {
    let mDate = toolbar.date
    let newDate = new Date(mDate.getFullYear() - 1, 1)
    toolbar.onNavigate('prev', newDate)
  }

  const goToNextYear = () => {
    let mDate = toolbar.date
    let newDate = new Date(mDate.getFullYear() + 1, 1)
    toolbar.onNavigate('next', newDate)
  }

  const calendarNavigator = () => {
    let view = viewState
    const date = moment(toolbar.date)
    let year = date.format('YYYY')
    let month = date.format('MMMM')
    let day
    if (view === 'day') {
      day = date.format('ddd') + ' ' + date.format('Do')
    }
    return (
      <span
        className="rbc-btn-group"
        style={{ display: 'flex', alignItems: 'center', paddingRight: '130px' }}
      >
        <React.Fragment>
          <button type="button" onClick={goToBackYear}>
            <span className="prev-icon">&#8249;&#8249;</span>
          </button>
          <button type="button" onClick={goToBack}>
            <span className="prev-icon">&#8249;</span>
          </button>
        </React.Fragment>

        <span className="rbc-toolbar-label">{year}</span>
        <span className="rbc-toolbar-label">{month}</span>
        <span className="rbc-toolbar-label">{day}</span>

        <React.Fragment>
          <button type="button" onClick={goToNext}>
            <span className="next-icon">&#8250;</span>
          </button>
          <button type="button" onClick={goToNextYear}>
            <span className="prev-icon">&#8250;&#8250;</span>
          </button>
        </React.Fragment>
      </span>
    )
  }

  return (
    <div className="rbc-toolbar" style={{ justifyContent: 'flex-end' }}>
      {calendarNavigator()}

      <div>
        <Select defaultValue={viewState}>
          <Option value="month" onClick={goToMonthView}>
            Month
          </Option>
          <Option value="day" onClick={goToDayView}>
            Day
          </Option>
          <Option value="week" onClick={goToWeekView}>
            Week
          </Option>
        </Select>
      </div>
    </div>
  )
}
