import React from 'react'
import moment from 'moment'

import { DatePicker } from 'antd'

const formatStartDateToTimeStamp = date => {
  if (!date) return null
  if (date.seconds) return date

  return { seconds: date / 1000 }
}

const StartDate = ({ startDate, isEditing, setChanges }) => {
  const validStartDate = formatStartDateToTimeStamp(startDate)

  if (!startDate) {
    return (
      <React.Fragment>
        {!isEditing && <p>No hire date.</p>}

        {isEditing && <DatePicker onChange={value => setChanges({ startDate: value._d })} />}
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      {!isEditing && <p>{moment.unix(validStartDate.seconds).format('DD MMM YYYY')}</p>}

      {isEditing && (
        <DatePicker
          defaultValue={moment.unix(validStartDate.seconds)}
          onChange={value => setChanges({ startDate: value._d })}
        />
      )}
    </React.Fragment>
  )
}

export default StartDate
