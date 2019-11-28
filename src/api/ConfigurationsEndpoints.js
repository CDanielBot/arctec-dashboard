import firebase from 'firebase'

const getConfigurations = async () => {
  const snapshot = await firebase
    .firestore()
    .collection('configurations')
    .doc('positions')
    .get()

  return snapshot.data()
}

const updateConfigurations = async updatedJobPositions => {
  await firebase
    .firestore()
    .collection('configurations')
    .doc('positions')
    .delete()

  await firebase
    .firestore()
    .collection('configurations')
    .doc('positions')
    .set(updatedJobPositions)
}

export default {
  getConfigurations,
  updateConfigurations
}
