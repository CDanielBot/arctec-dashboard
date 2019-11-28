import firebase from 'firebase'
import GitlabEndpoints from './GitlabEndpoints'
import axios from 'axios'
import FileSaver from 'file-saver'

const getProjects = async () => {
  const snapshot = await firebase
    .firestore()
    .collection('projects')
    .get()
  return snapshot.docs.map(doc => doc.data())
}

const getProject = async id => {
  const snapshot = await firebase
    .firestore()
    .collection('projects')
    .doc(id)
    .get()

  return snapshot.data()
}

const getProjectIntegration = async projectId => {
  const snapshot = await firebase
    .firestore()
    .collection('projectIntegrations')
    .doc(projectId)
    .get()

  return snapshot.data()
}

const getAllProjectIntegrations = async () => {
  const snapshot = await firebase
    .firestore()
    .collection('projectIntegrations')
    .get()

  return snapshot.docs.map(doc => doc.data())
}

const getProjectTimeReport = async (gitlabProjectId, gitlabToken) => {
  const getPages = async () => {
    const response = await GitlabEndpoints.getProjectIssues(gitlabProjectId, gitlabToken, 1)
    const pages = response.headers['x-total-pages']

    return pages
  }

  const getTimeReport = async pages => {
    let times = []
    for (let i = 1; i <= pages; i++) {
      let responsePerPage = await GitlabEndpoints.getProjectIssues(gitlabProjectId, gitlabToken, i)
      times.push(...responsePerPage.data)
    }
    times.sort((a, b) => {
      return new Date(b.updated_at) - new Date(a.updated_at)
    })
    return times
  }

  const pages = await getPages()
  const timeReport = await getTimeReport(pages)

  return timeReport.map(time => ({
    issueNo: time.iid,
    issueTitle: time.title,
    assignee: time.assignee ? time.assignee.name : 'N/A',
    lastUpdated: time.updated_at,
    webUrl: time.web_url,
    totalTimeSpent: time.time_stats.human_total_time_spent,
    status: time.state,
    totalTimeSpentSeconds: time.time_stats.total_time_spent
  }))
}

const updateProject = async (data, id) => {
  return await firebase
    .firestore()
    .collection('projects')
    .doc(id)
    .set(data, { merge: true })
}

const updateProjectTeam = async (data, id) => {
  return await firebase
    .firestore()
    .collection('projects')
    .doc(id)
    .update({
      team: data.team
    })
}

const updateProjectIntegration = async (data, projectId) => {
  const doc = firebase
    .firestore()
    .collection('projectIntegrations')
    .doc(projectId)
  await doc.update({
    gitlabProjectId: data.gitlabProjectId,
    gitlabToken: data.gitlabToken
  })
  const snapshot = await doc.get()
  return snapshot.data()
}

const createProjectIntegration = async (data, projectId) => {
  const newIntegration = {
    gitlabProjectId: data.gitlabProjectId,
    gitlabToken: data.gitlabToken,
    id: projectId
  }
  await firebase
    .firestore()
    .collection('projectIntegrations')
    .doc(projectId)
    .set(newIntegration)

  return newIntegration
}

const removeProjectIntegration = async projectId => {
  return await firebase
    .firestore()
    .collection('projectIntegrations')
    .doc(projectId)
    .delete()
}

const updateProjectResources = async (data, id) => {
  return await firebase
    .firestore()
    .collection('projects')
    .doc(id)
    .update({
      resources: data.resources
    })
}

const createProject = async newProject => {
  const project = await firebase
    .firestore()
    .collection('projects')
    .where('name', '==', newProject.name)
    .get()

  if (project.docs.length) {
    return Promise.reject('A project with this name already exists!')
  }

  const doc = await firebase
    .firestore()
    .collection('projects')
    .doc()

  await doc.set({
    name: newProject.name,
    manager: newProject.manager,
    id: doc.id,
    deadline: newProject.deadline ? newProject.deadline._d : null,
    description: newProject.description,
    resources: newProject.resources ? newProject.resources : {},
    team: newProject.team ? newProject.team : {},
    active: true,
    calendarEvents: [],
    financials: {
      contract: {},
      extras: {},
      invoices: {}
    }
  })
  const snapshot = await doc.get()
  return snapshot.data()
}

const deleteProject = async id => {
  await firebase
    .firestore()
    .collection('projects')
    .doc(id)
    .delete()
}

const uploadDocument = async (document, type, name, projectId) => {
  const { ref } = await firebase
    .storage()
    .ref()
    .child(`projects/${projectId}/${type}/${name}`)
    .put(document)

  const documentSrc = await ref.getDownloadURL()
  return documentSrc
}

const updateDocuments = async (document, projectId) => {
  return await firebase
    .firestore()
    .collection('projects')
    .doc(projectId)
    .update(document)
}

const deleteDocument = async (documentName, projectId, type) => {
  await firebase
    .storage()
    .ref()
    .child(`projects/${projectId}/${type}/${documentName}`)
    .delete()
}

const downloadDocument = async (document, documentName) => {
  const response = await axios.get(document, { crossdomain: true, responseType: 'blob' })
  FileSaver.saveAs(response.data, `${documentName} CV`)
}

const uploadAvatar = async (id, imageFile) => {
  const { ref } = await firebase
    .storage()
    .ref()
    .child(`projects/avatars/${id}`)
    .put(imageFile)

  const imgSrc = await ref.getDownloadURL()
  return imgSrc
}

const deleteAvatar = async id => {
  await firebase
    .storage()
    .ref()
    .child(`projects/avatars/${id}`)
    .delete()
}

const getProjectMilestone = async (gitlabProjectId, gitlabToken) => {
  return await GitlabEndpoints.getProjectMilestones(gitlabProjectId, gitlabToken)
}

export default {
  getProjects,
  createProject,
  updateProject,
  getProject,
  deleteProject,
  getProjectIntegration,
  getProjectTimeReport,

  uploadDocument,
  updateDocuments,
  deleteDocument,
  downloadDocument,

  updateProjectTeam,
  updateProjectResources,

  updateProjectIntegration,
  createProjectIntegration,
  removeProjectIntegration,
  getAllProjectIntegrations,

  uploadAvatar,
  deleteAvatar,
  getProjectMilestone
}
