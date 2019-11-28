import React, { useEffect } from 'react'
import styled from 'styled-components'
import Calendar from './dashboard/Calendar'
import Statistics from './dashboard/Statisctics'
import { calendarThunks } from 'state/ducks/calendarDuck'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { employeeThunks } from 'state/ducks/employeeDuck'
import { projectThunks } from 'state/ducks/projectDuck'
import { Tabs } from 'antd'

const { TabPane } = Tabs

const Dashboard = ({
  calendarThunks,
  projectThunks,
  employeeThunks,
  calendarEvents,
  userProfile,
  employeesList,
  projects
}) => {
  useEffect(() => {
    const getEvents = async () => {
      Promise.all([
        calendarThunks.getCalendarEvents(),
        employeeThunks.getEmployees(),
        projectThunks.getProjects()
      ])
    }
    getEvents()
  }, [calendarThunks, projectThunks, employeeThunks])

  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="Calendar" key="1">
        <CalendarContainer>
          <Calendar
            calendarThunks={calendarThunks}
            calendarEvents={calendarEvents}
            userProfile={userProfile}
            employeesList={employeesList}
            projects={projects}
          />
        </CalendarContainer>
      </TabPane>
      <TabPane tab="Statistics" key="2">
        <Statistics projects={projects} employeesList={employeesList} />
      </TabPane>
    </Tabs>
  )
}

const mapStateToProps = state => ({
  calendarEvents: state.calendarEvents.list,
  userProfile: state.auth.profile,
  employeesList: state.employees.list,
  projects: state.projects.list
})

const mapDispatch = dispatch => ({
  calendarThunks: bindActionCreators(calendarThunks, dispatch),
  employeeThunks: bindActionCreators(employeeThunks, dispatch),
  projectThunks: bindActionCreators(projectThunks, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatch
)(Dashboard)

const CalendarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  padding-top: 100px;
`
