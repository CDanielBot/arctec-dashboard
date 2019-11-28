import React from 'react'
import moment from 'moment'
import { DatePicker } from 'antd'

const formatDeadlineToTimestamp = date => {
  if (!date) return null
  if (date.seconds) return date
  return { seconds: Math.abs(date / 1000) }
}

const Deadline = ({ deadline, isEditing, setChanges }) => {
  const validDeadline = formatDeadlineToTimestamp(deadline)

  const getDeadline = () => {
    const dateString = moment.unix(validDeadline.seconds).format('DD MMM YYYY')

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

    return `${dateString} ( ${Math.abs(years)} years, ${Math.abs(months % 12)} ${
      Math.abs(months % 12 === 1) ? 'month )' : 'months )'
    }`
  }

  if (!deadline) {
    return (
      <React.Fragment>
        {!isEditing && <p>No hire date.</p>}

        {isEditing && <DatePicker onChange={value => setChanges({ deadline: value._d })} />}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!isEditing && <p>{getDeadline()}</p>}

      {isEditing && (
        <DatePicker
          defaultValue={moment.unix(validDeadline.seconds)}
          onChange={value => setChanges({ deadline: value._d })}
        />
      )}
    </React.Fragment>
  )
}

export default Deadline
