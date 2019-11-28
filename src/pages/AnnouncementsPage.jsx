import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { announcementThunks } from '../state/ducks/announcementDuck'
import { bindActionCreators } from 'redux'
import { Button } from 'antd'
import styled from 'styled-components'
import Announcement from './announcements/Announcement'
import CreateAnnouncementModal from './announcements/CreateAnnouncementModal'
import IsAdmin from 'shared/IsAdmin'
import { eventThunks } from 'state/ducks/eventDuck'

const AnnouncementsPage = ({ announcements, announcementThunks, userProfile, eventThunks }) => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const getAnnouncements = async () => {
      await announcementThunks.getAnnouncements()
    }
    getAnnouncements()
  }, [announcementThunks])

  const updateAnnouncement = async (data, id) => {
    await announcementThunks.updateAnnouncement(data, id, announcements)
  }

  const deleteAnnouncement = async id => {
    await announcementThunks.deleteAnnouncement(id, announcements)
  }

  let sortedAnnouncements = announcements.sort(function(a, b) {
    return new Date(b.date.seconds) - new Date(a.date.seconds)
  })

  return (
    <Page>
      <InputContainer>
        <ButtonContainer>
          <IsAdmin>
            <Button type="primary" icon="plus-square" onClick={() => setVisible(true)}>
              Add announcement
            </Button>
          </IsAdmin>
        </ButtonContainer>
      </InputContainer>

      {!announcements.length && <h1>No announcements</h1>}

      {sortedAnnouncements.map(ann => (
        <Announcement
          key={ann.id}
          id={ann.id}
          title={ann.title}
          date={ann.date}
          description={ann.description}
          deleteAnnouncement={deleteAnnouncement}
          updateAnnouncement={updateAnnouncement}
        />
      ))}

      <CreateAnnouncementModal
        visible={visible}
        title="Create a new announcement"
        onCancel={() => setVisible(false)}
        createAnnouncement={announcementThunks.createAnnouncement}
        userProfile={userProfile}
        createEvent={eventThunks.createEvent}
      />
    </Page>
  )
}

const mapDispatch = dispatch => ({
  announcementThunks: bindActionCreators(announcementThunks, dispatch),
  eventThunks: bindActionCreators(eventThunks, dispatch)
})
const mapStateToProps = state => ({
  announcements: state.announcements.list,
  userProfile: state.auth.profile
})

export default connect(
  mapStateToProps,
  mapDispatch
)(AnnouncementsPage)

const Page = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  padding-left: 40px;
  padding-right: 40px;
  padding-bottom: 40px;
`
const InputContainer = styled.div`
  display: flex;
  align-items: flex-start;
  padding-bottom: 20px;
`
const ButtonContainer = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`
