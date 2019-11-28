import firebase from 'firebase'

const getEventsForGlobalCalendar = async () => {
  const snapshot = await firebase
    .firestore()
    .collection('globalCalendar')
    .get()
  return snapshot.docs.map(doc => doc.data())
}

const createEventForGlobalCalendar = async event => {
  const doc = await firebase
    .firestore()
    .collection('globalCalendar')
    .doc()

  await doc.set({
    id: doc.id,
    start: event.start,
    end: event.end,
    description: event.description,
    type: event.type,
    title: event.title
  })

  const snapshot = await doc.get()
  return snapshot.data()
}

const updateEventForGlobalCalendar = async event => {
  return await firebase
    .firestore()
    .collection('globalCalendar')
    .doc(event.id)
    .set(event, { merge: true })
}

const deleteEventForGlobalCalendar = async event => {
  await firebase
    .firestore()
    .collection('globalCalendar')
    .doc(event.id)
    .delete()
}

export default {
  getEventsForGlobalCalendar,
  createEventForGlobalCalendar,
  updateEventForGlobalCalendar,
  deleteEventForGlobalCalendar
}
