import React from 'react'
import moment from 'moment'
import { DatePicker } from 'antd'

const formatResignationDateToTimestamp = date => {
  if (!date) return null
  if (date.seconds) return date

  return { seconds: date / 1000 }
}

const ResignationDate = ({ date, isEditing, setChanges }) => {
  const validResignationDate = formatResignationDateToTimestamp(date)

  const getResignationDate = () => {
    const dateString = moment.unix(validResignationDate.seconds).format('DD MMM YYYY')

    const todaysDate = moment().utc()
    const years = moment
      .utc(todaysDate, 'DD MMM YYYY')
      .diff(moment.utc(dateString, 'DD MMM YYYY'), 'years')

    const months = moment
      .utc(todaysDate, 'DD MMM YYYY')
      .diff(moment.utc(dateString, 'DD MMM YYYY'), 'months')

    if (years === 0) {
      if (months === 0) {
        return `${dateString} ( this month )`
      }

      if (months === 1) {
        return `${dateString} ( 1 month )`
      }

      return `${dateString} ( ${months} months )`
    }

    if (months % 12 === 0) {
      return `${dateString}  ( ${years} ${years === 1 ? 'year )' : 'years )'}`
    }

    return `${dateString} ( ${years} years, ${months % 12} ${
      months % 12 === 1 ? 'month )' : 'months )'
    }`
  }

  if (!date) {
    return (
      <React.Fragment>
        {!isEditing && <p>No date.</p>}

        {isEditing && (
          <DatePicker
            onChange={value => setChanges({ resignationDate: value._d })}
            style={{ width: '300px' }}
          />
        )}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!isEditing && <p>{getResignationDate()}</p>}

      {isEditing && (
        <DatePicker
          defaultValue={moment.unix(validResignationDate.seconds)}
          onChange={value => setChanges({ resignationDate: value._d })}
          style={{ width: '300px' }}
        />
      )}
    </React.Fragment>
  )
}

export default ResignationDate
