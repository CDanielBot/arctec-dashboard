import React, { useState, useEffect } from 'react'
import { Table } from 'antd'
import styled from 'styled-components'
import { projectThunks } from '../../state/ducks/projectDuck'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'

const ProjectTimeReport = ({ projectId, allProjectsTimeReports }) => {
  const [timeReports, setTimeReports] = useState([])
  let totalBookedHours = 0
  let bookedHoursPerEmployee = {}

  useEffect(() => {
    const timeReports = allProjectsTimeReports[projectId]
    setTimeReports(timeReports)
  }, [projectId, allProjectsTimeReports])

  const getDate = date => {
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
  }

  const columns = [
    {
      key: 'issueNo',
      title: 'Task No',
      dataIndex: 'issueNo',
      render: text => <p>{text}</p>,
      sorter: (a, b) => a.issueNo - b.issueNo
    },
    {
      key: 'issueTitle',
      title: 'Task title',
      dataIndex: 'issueTitle',
      render: text => <p>{text}</p>
    },
    {
      key: 'assignee',
      title: 'Assignee',
      dataIndex: 'assignee',
      render: (text, record) => <p>{text || 'N/A'}</p>
    },
    {
      key: 'lastUpdated',
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      render: (text, record) => <p>{getDate(new Date(record.lastUpdated))}</p>
    },
    {
      key: 'totalTimeSpent',
      title: 'Total time',
      dataIndex: 'totalTimeSpent',
      render: text => <p>{text || '0h'}</p>
    },
    {
      key: 'webUrl',
      title: 'Gitlab url',
      dataIndex: 'webUrl',
      render: text => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          {' '}
          ...{text.substr(text.lastIndexOf('/issues'))}
        </a>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      render: text => <p>{text}</p>
    }
  ]

  if (timeReports) {
    timeReports.map(e => (totalBookedHours += e.totalTimeSpentSeconds))
    timeReports.map(e => (bookedHoursPerEmployee[e.assignee] = 0))
    timeReports.map(e => (bookedHoursPerEmployee[e.assignee] += e.totalTimeSpentSeconds))
  }

  return (
    <WorkSectionContainer>
      <SectionTile>
        Total booked hours: {Math.round(moment.duration(totalBookedHours, 'second').asHours())}
      </SectionTile>
      <SectionTile>Booked hours per employee:</SectionTile>
      {Object.keys(bookedHoursPerEmployee).map(e => (
        <li key={e}>
          {e}: {Math.round(moment.duration(bookedHoursPerEmployee[e], 'second').asHours())}
        </li>
      ))}

      <TimeReportTable
        dataSource={timeReports}
        columns={columns}
        rowKey="issueNo"
        pagination={{
          showSizeChanger: true
        }}
        locale={{
          emptyText: 'No time report found.'
        }}
      />
    </WorkSectionContainer>
  )
}

const mapDispatch = dispatch => ({
  projectThunks: bindActionCreators(projectThunks, dispatch)
})

const mapStateToProps = state => ({
  allProjectsTimeReports: state.projects.projectTimeReportList
})

export default connect(mapStateToProps, mapDispatch)(ProjectTimeReport)

const TimeReportTable = styled(Table)`
  .ant-table-row {
    :hover {
      cursor: pointer;
    }
  }
`
const SectionTile = styled.p`
  font-size: 15;
  font-weight: bold;
  margin-bottom: 0px;
  margin-right: 5px;
`
const WorkSectionContainer = styled.div`
  height: 100%;
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
`
