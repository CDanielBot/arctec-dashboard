import React, { useState } from 'react'
import { Form, Input, Drawer, DatePicker, Select, Button } from 'antd'
import styled from 'styled-components'
import moment from 'moment'

const { TextArea } = Input
const { RangePicker } = DatePicker
const { Option } = Select

const CalendarEventsModal = Form.create()(
  ({ form, visible, onCancel, createEvent, date, eventToEdit, updateEvent, deleteEvent }) => {
    const [loading, setLoading] = useState(false)

    const addEvent = async () => {
      form.validateFields(async (err, event) => {
        if (err) {
          throw err
        }

        try {
          setLoading(true)
          if (!eventToEdit) {
            createEvent({
              id: Math.random()
                .toString(36)
                .substr(2, 9),
              start: event.date[0]._d,
              end: event.date[1]._d,
              title: event.title,
              type: event.type,
              description: event.description
            })
          }
          if (eventToEdit) {
            updateEvent({
              id: eventToEdit.id,
              start: event.date[0]._d,
              end: event.date[1]._d,
              title: event.title,
              type: event.type,
              description: event.description ? event.description : null
            })
          }

          form.resetFields()
          onCancel()

          setLoading(false)
        } catch (error) {
          setLoading(false)
        }
      })
    }

    return (
      <Drawer visible={visible} title="Create Event" onClose={onCancel} width={500}>
        <Form layout="vertical">
          <Form.Item label="Title">
            {form.getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input the title of event!' }],
              initialValue: eventToEdit ? eventToEdit.title : null
            })(<Input />)}
          </Form.Item>

          <Form.Item label="Date">
            {form.getFieldDecorator('date', {
              rules: [{ required: true, message: 'Please input the title of event!' }],
              initialValue: eventToEdit
                ? [moment(eventToEdit.start), moment(eventToEdit.end)]
                : [moment(date.start), moment(date.end)]
            })(
              <RangePicker
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment(), moment()],
                  'This Month': [moment().startOf('month'), moment().endOf('month')]
                }}
                showTime
                format="YYYY/MM/DD HH:mm:ss"
              />
            )}
          </Form.Item>

          <Form.Item label="Type">
            {form.getFieldDecorator('type', {
              rules: [{ required: true, message: 'Please input the title of event!' }],
              initialValue: eventToEdit ? eventToEdit.type : null
            })(
              <Select style={{ width: '100%' }}>
                <Option value="09ff00">Meeting</Option>
                <Option value="0004ff">Review</Option>
                <Option value="ff6a00">Time off</Option>
              </Select>
            )}
          </Form.Item>

          <Form.Item label="description">
            {form.getFieldDecorator('description', {
              initialValue: eventToEdit ? eventToEdit.description : null
            })(<TextArea type="textarea" style={{ height: '600px' }} />)}
          </Form.Item>
        </Form>

        <ButtonsContainer>
          {eventToEdit && (
            <Button
              type="danger"
              onClick={() => deleteEvent(eventToEdit)}
              style={{ marginRight: '10px' }}
            >
              Delete
            </Button>
          )}
          <Button onClick={onCancel} style={{ marginRight: '10px' }}>
            Cancel
          </Button>
          <Button onClick={addEvent} type="primary" loading={loading}>
            {eventToEdit ? 'Update' : 'Create'}
          </Button>
        </ButtonsContainer>
      </Drawer>
    )
  }
)

export default CalendarEventsModal

const ButtonsContainer = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e9e9e9;
  padding: 10px 16px;
  background: #fff;
  text-align: right;
`
