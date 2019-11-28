import firebase from 'firebase'

const getEvents = async () => {
  const snapshot = await firebase
    .firestore()
    .collection('events')
    .orderBy('date', 'desc')
    .get()

  return snapshot.docs.map(doc => doc.data())
}

const updateClickedEvent = async (userId, eventId) => {
  await firebase
    .firestore()
    .collection('events')
    .doc(eventId)
    .update({
      [`clickedBy.${userId}`]: true
    })
}

const updateEvents = async userId => {
  await firebase
    .firestore()
    .collection('events')
    .get()
    .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {
        var eventRef = firebase
          .firestore()
          .collection('events')
          .doc(doc.id)
        const documentData = doc.data()
        return eventRef.update({
          readBy: {
            ...documentData.readBy,
            [userId]: true
          }
        })
      })
    })
}

const createEvent = async event => {
  const doc = await firebase
    .firestore()
    .collection('events')
    .doc()

  await doc.set({
    id: doc.id,
    type: event.type,
    message: event.message,
    postedBy: event.userId,
    readBy: {
      [event.userId]: true
    },
    clickedBy: {
      [event.userId]: true
    },
    resources: event.resources ? event.resources : {},
    date: firebase.firestore.Timestamp.now()
  })

  const snapshot = await doc.get()
  return snapshot.data()
}

export default {
  getEvents,
  updateEvents,
  createEvent,
  updateClickedEvent
}
