import axios from 'axios'

const GITLAB_BASE_URL =  'https://gitlab.com/api/v4/projects'

const getProject = async (projectId, accessToken) => {
  return await axios.get(`${GITLAB_BASE_URL}/${projectId}`, {
    headers: { 'Private-Token': accessToken }
  })
}

const getProjectIssues = async (projectId, accessToken, pageNo) => {
  return await axios.get(`${GITLAB_BASE_URL}/${projectId}/issues?per_page=100&page=${pageNo}&sort=asc`, {
    headers: { 'Private-Token': accessToken }
  })
}

const getProjectMembers = async (projectId, accessToken) => {
  return await axios.get(`${GITLAB_BASE_URL}/${projectId}/members`, {
    headers: { 'Private-Token': accessToken }
  })
}

const getProjectMilestones = async (projectId, accessToken) => {
  return await axios.get(`${GITLAB_BASE_URL}/${projectId}/milestones`, {
    headers: { 'Private-Token': accessToken }
  })
}

export default {
  getProject,
  getProjectIssues,
  getProjectMembers,
  getProjectMilestones
}