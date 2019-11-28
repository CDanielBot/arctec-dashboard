import React from 'react'
import { Select, DatePicker } from 'antd'
import styled from 'styled-components'
import moment from 'moment'

const { Option } = Select

const formatHireDateToTimestamp = date => {
  if (!date) return null
  if (date.seconds) return date

  return { seconds: date / 1000 }
}

const ContractType = ({ contractType, isEditing, onChange, contractDate }) => {
  const validContractDate = formatHireDateToTimestamp(contractDate)

  return (
    <React.Fragment>
      {isEditing && (
        <React.Fragment>
          <Select
            defaultValue={contractType}
            onChange={e => onChange({ contractType: e })}
            style={{ width: '300px' }}
          >
            <Option value="Contractor">Contractor</Option>
            <Option value="Permanent Position"> Permanent Position</Option>
            <Option value="Limited Position"> Limited Position</Option>
          </Select>

          {contractType !== 'Permanent Position' && (
            <React.Fragment>
              <SectionTile>Contract end date: </SectionTile>
              <DatePicker
                onChange={value => onChange({ contractDate: value._d })}
                style={{ width: '300px' }}
                defaultValue={contractDate ? moment.unix(validContractDate.seconds) : null}
              />
            </React.Fragment>
          )}
        </React.Fragment>
      )}

      {!isEditing && (
        <React.Fragment>
          <p>{contractType}</p>

          {contractType !== 'Permanent Position' && (
            <React.Fragment>
              <SectionTile>Contract end date: </SectionTile>
              <p>
                {contractDate
                  ? moment.unix(validContractDate.seconds).format('DD MMM YYYY')
                  : 'no date'}
              </p>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

export default ContractType

const SectionTile = styled.p`
  font-size: 15;
  font-weight: bold;
  margin-bottom: 0px;
  margin-right: 10px;
`
