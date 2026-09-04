import { api, queryParams } from './api.js'

export async function getRequests(filters = {}) {
  const { data } = await api.get('/api/requests', { params: queryParams(filters) })
  return data
}

export async function createRequest(payload) {
  const { data } = await api.post('/api/requests', payload)
  return data
}

export async function updateRequestStatus(id, status) {
  const { data } = await api.patch(`/api/requests/${id}`, { status })
  return data
}

export async function deleteRequest(id) {
  const { data } = await api.delete(`/api/requests/${id}`)
  return data
}
