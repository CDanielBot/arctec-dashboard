import firebase from 'firebase'
import axios from 'axios'
import FileSaver from 'file-saver'
import generator from 'generate-password'
import firebaseConfig from 'firebaseConfig'
import moment from 'moment'

const getEmployees = async () => {
  const snapshot = await firebase
    .firestore()
    .collection('users')
    .get()

  const usersList = snapshot.docs.map(doc => doc.data())
  const updatedUsersList = usersList.map(user => {
    if (
      user.active &&
      user.resignationDate &&
      moment.unix(user.resignationDate.seconds) < Date.now()
    ) {
      return {
        ...user,
        active: false
      }
    }
    return user
  })

  usersList.map(async user => {
    if (
      user.active &&
      user.resignationDate &&
      moment.unix(user.resignationDate.seconds) < Date.now()
    ) {
      updateUser({ ...user, active: false }, user.id)
    }
  })
  return updatedUsersList
}

const getProjectManagerForEmployee = async projectWorkingOn => {
  const projectSnapshot = await firebase
    .firestore()
    .collection('projects')
    .where('id', '==', projectWorkingOn)
    .get()

  const project = projectSnapshot.docs[0].data()

  const projectManagerSnapshot = await firebase
    .firestore()
    .collection('users')
    .where('id', '==', project.manager)
    .get()

  const projectManager = projectManagerSnapshot.docs[0].data()
  return projectManager.fullName
}

const getProjectManagers = async () => {
  const snapshot = await firebase
    .firestore()
    .collection('users')
    .where('jobPosition', '==', 'Project Manager')
    .get()

  return snapshot.docs.map(doc => doc.data())
}

const updateUser = async (user, id) => {
  return await firebase
    .firestore()
    .collection('users')
    .doc(id)
    .set(user, { merge: true })
}

const updateDocument = async (doc, id) => {
  return await firebase
    .firestore()
    .collection('users')
    .doc(id)
    .update(doc)
}

const getUser = async email => {
  const snapshot = await firebase
    .firestore()
    .collection('users')
    .where('email', '==', email)
    .get()

  return snapshot.docs[0].data()
}

const createUser = async user => {
  const exists = await checkUserAlreadyExists(user.email)
  if (exists) {
    return Promise.reject(`User with email ${user.email} already exists`)
  }

  const password = generator.generate({
    length: 10,
    numbers: true
  })

  const userAccount = await createUserFirebaseAccount(user.email, password)
  const newUser = await createUserInDb(user, userAccount.uid)
  await sendPasswordResetEmail(newUser.email)

  return newUser
}

const downloadDocument = async resume => {
  const response = await axios.get(resume, { crossdomain: true, responseType: 'blob' })
  FileSaver.saveAs(response.data)
}

const deleteDocument = async (documentName, userId) => {
  await firebase
    .storage()
    .ref()
    .child(`users/usersDocuments/${userId}/${documentName}`)
    .delete()
}

const deleteProfilePicture = async id => {
  await firebase
    .storage()
    .ref()
    .child(`users/profilePictures/${id}.jpg`)
    .delete()
}

const uploadProfilePicture = async (id, imageFile) => {
  const { ref } = await firebase
    .storage()
    .ref()
    .child(`users/profilePictures/${id}.jpg`)
    .put(imageFile)

  const imgSrc = await ref.getDownloadURL()
  return imgSrc
}

const uploadDocument = async (name, id, document) => {
  const { ref } = await firebase
    .storage()
    .ref()
    .child(`users/usersDocuments/${id}/${name}`)
    .put(document)

  const documentSrc = await ref.getDownloadURL()
  return documentSrc
}

const changePassword = async (user, oldPassword, newPassword) => {
  const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword)

  try {
    await user.reauthenticateWithCredential(credential)
    await user.updatePassword(newPassword)
  } catch (error) {
    return Promise.reject({ message: 'Wrong old password!' })
  }
}

const resetPassword = async email => {
  await firebase.auth().sendPasswordResetEmail(email)
}

// UTILS

const checkUserAlreadyExists = async email => {
  const snapshot = await firebase
    .firestore()
    .collection('users')
    .where('email', '==', email)
    .get()

  return snapshot.docs.length
}

const createUserFirebaseAccount = async (email, password) => {
  var authApp = firebase.initializeApp(firebaseConfig, 'createAccount').auth()
  const { user } = await authApp.createUserWithEmailAndPassword(email, password)
  await firebase.app('createAccount').delete()
  return user
}

const createUserInDb = async (user, accountUid) => {
  const doc = await firebase
    .firestore()
    .collection('users')
    .doc(accountUid)

  await doc.set({
    active: true,
    fullName: user.fullName,
    employeeIdentifier: null,
    email: user.email,
    jobPosition: user.jobPosition,
    phoneNumber: user.phoneNumber,
    profilePictureSrc: null,
    hireDate: user.hireDate ? user.hireDate._d : null,
    id: accountUid,
    address: user.address,
    role: 'employee',
    salary: user.salary,
    topSkills: user.topSkills === null ? [] : user.topSkills,
    calendarEvents: [],
    gitlabUsername: null
  })

  const snapshot = await doc.get()
  return snapshot.data()
}

const sendPasswordResetEmail = async emailAddress => {
  return firebase.auth().sendPasswordResetEmail(emailAddress)
}

export default {
  getEmployees,
  getUser,
  getProjectManagers,
  getProjectManagerForEmployee,

  updateUser,
  createUser,
  changePassword,
  resetPassword,

  uploadProfilePicture,
  deleteProfilePicture,

  uploadDocument,
  downloadDocument,
  deleteDocument,
  updateDocument
}
