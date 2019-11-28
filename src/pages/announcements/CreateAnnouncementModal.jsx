import React, { useState } from 'react'
import { Form, Input, Drawer, Button } from 'antd'
import styled from 'styled-components'
const { TextArea } = Input

const CreateAnnouncementModal = Form.create()(
  ({ form, visible, onCancel, createAnnouncement, userProfile, createEvent }) => {
    const [loading, setLoading] = useState(false)

    const addAnnouncement = async () => {
      form.validateFields(async (err, announcement) => {
        if (err) {
          throw err
        }

        try {
          setLoading(true)
          await createAnnouncement(announcement)
          await createEvent({
            type: 'announcement',
            message: announcement.title,
            userId: userProfile.id
          })
          form.resetFields()
          onCancel()

          setLoading(false)
        } catch (error) {
          setLoading(false)
        }
      })
    }

    return (
      <Drawer
        visible={visible}
        title="Create announcement"
        onOk={addAnnouncement}
        onClose={onCancel}
        width={500}
      >
        <Form layout="vertical">
          <Form.Item label="Title">
            {form.getFieldDecorator('title', {
              rules: [{ required: true, message: 'Please input the title of announcement!' }]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Description">
            {form.getFieldDecorator('description')(
              <TextArea type="textarea" style={{ height: '600px' }} />
            )}
          </Form.Item>
        </Form>

        <ButtonsContainer>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>

          <Button onClick={addAnnouncement} type="primary" loading={loading}>
            Submit
          </Button>
        </ButtonsContainer>
      </Drawer>
    )
  }
)

export default CreateAnnouncementModal

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
