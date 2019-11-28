import firebase from 'firebase'

const getAnnouncements = async () => {
  const snapshot = await firebase
    .firestore()
    .collection('announcements')
    .get()
  return snapshot.docs.map(doc => doc.data())
}

const createAnnouncement = async announcement => {
  const doc = await firebase
    .firestore()
    .collection('announcements')
    .doc()

  await doc.set({
    id: doc.id,
    title: announcement.title,
    description: announcement.description ? announcement.description : null,
    date: firebase.firestore.Timestamp.now()
  })
  const snapshot = await doc.get()
  return snapshot.data()
}

const updateAnnouncement = async (announcement, id) => {
  announcement['date'] = firebase.firestore.Timestamp.now()
  return await firebase
    .firestore()
    .collection('announcements')
    .doc(id)
    .set(announcement, { merge: true })
}

const deleteAnnouncement = async id => {
  return await firebase
    .firestore()
    .collection('announcements')
    .doc(id)
    .delete()
}

export default { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement }
