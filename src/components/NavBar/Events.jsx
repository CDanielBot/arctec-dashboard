import React, { useState, useEffect } from 'react'
import { eventThunks } from '../../state/ducks/eventDuck'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Button, Dropdown, Menu, Badge, Avatar } from 'antd'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'

const Events = ({ eventThunks, userProfile, history }) => {
  const [events, setEvents] = useState(null)

  useEffect(() => {
    const getEvents = async () => {
      const events = await eventThunks.getEvents()
      setEvents(events)
    }

    getEvents()
    const interval = setInterval(() => {
      getEvents()
    }, 60000)
    return () => clearInterval(interval)
  }, [eventThunks])

  if (!events) return <Button shape="circle" icon="bell" />

  const unreadNotifications = events.filter(
    event => !Object.keys(event.readBy).includes(userProfile.id)
  )

  const isClicked = event => Object.keys(event).find(e => e === userProfile.id)

  const readEvents = async () => {
    let readedEvents = [...events]

    readedEvents.forEach(item => {
      item.readBy = { ...item.readBy, [userProfile.id]: true }
    })

    await eventThunks.updateEvent(userProfile.id, readedEvents)
    setEvents(readedEvents)
  }

  const onClick = async (e, event) => {
    await eventThunks.updateClickedEvent(userProfile.id, e.key)

    let clickedEvents = [...events]

    clickedEvents.forEach(item => {
      if (item.id === e.key) {
        item.clickedBy = { ...item.clickedBy, [userProfile.id]: true }
      }
    })

    setEvents(clickedEvents)

    if (event.type === 'newEmployee') history.push(`/employee/${event.resources.profileLink}`)
    if (event.type === 'announcement') history.push('/announcements')
    if (event.type === 'newProject') history.push(`/projects/${event.resources.projectId}`)
  }

  const menu = (
    <Menu style={{ maxHeight: '300px', overflowY: 'scroll' }}>
      {events.map(event => {
        if (event.type === 'newEmployee') {
          return (
            <StyledMenuItem
              key={event.id}
              onClick={e => onClick(e, event)}
              style={{ backgroundColor: isClicked(event.clickedBy) ? ' ' : '#e6f7ff' }}
            >
              <AvatarContainer>
                <Avatar icon="user" size="large" />
              </AvatarContainer>
              <EventContainer>
                <EventType>New Employee</EventType>
                <p>{event.message}</p>
              </EventContainer>
            </StyledMenuItem>
          )
        }
        if (event.type === 'announcement') {
          return (
            <StyledMenuItem
              key={event.id}
              onClick={e => onClick(e, event)}
              style={{ backgroundColor: isClicked(event.clickedBy) ? ' ' : '#e6f7ff' }}
            >
              <AvatarContainer>
                <Avatar icon="notification" size="large" />
              </AvatarContainer>
              <EventContainer>
                <EventType>New Announcement</EventType>
                <p>{event.message}</p>
              </EventContainer>
            </StyledMenuItem>
          )
        }

        if (event.type === 'newProject') {
          return (
            <StyledMenuItem
              key={event.id}
              onClick={e => onClick(e, event)}
              style={{ backgroundColor: isClicked(event.clickedBy) ? ' ' : '#e6f7ff' }}
            >
              <AvatarContainer>
                <Avatar icon="project" size="large" />
              </AvatarContainer>
              <EventContainer>
                <EventType>New Project</EventType>
                <p>{event.message}</p>
              </EventContainer>
            </StyledMenuItem>
          )
        }
        return null
      })}
    </Menu>
  )

  return (
    <Dropdown overlay={menu} placement="bottomCenter">
      <Badge count={unreadNotifications.length} showZero={false}>
        <Button shape="circle" icon="bell" onClick={readEvents} />
      </Badge>
    </Dropdown>
  )
}

const mapStateToProps = state => ({
  userProfile: state.auth.profile
})

const mapDispatch = dispatch => ({
  eventThunks: bindActionCreators(eventThunks, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatch
)(withRouter(Events))

const StyledMenuItem = styled(Menu.Item)`
  height: 60px;
  width: 100%;
  display: flex;
`
const AvatarContainer = styled.div`
  width: 50px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const EventContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 5px;
`

const EventType = styled.div`
  height: 20px;
  font-weight: bold;
  display: flex;
  align-items: flex-start;
`
