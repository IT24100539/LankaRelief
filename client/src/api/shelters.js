import { api, queryParams } from './api.js'

export async function getShelters(filters = {}) {
  const { data } = await api.get('/api/shelters', { params: queryParams(filters) })
  return data
}

export async function createShelter(data) {
  const { data: created } = await api.post('/api/shelters', data)
  return created
}

export async function updateShelter(id, data) {
  const { data: updated } = await api.patch(`/api/shelters/${id}`, data)
  return updated
}

export async function deleteShelter(id) {
  const { data } = await api.delete(`/api/shelters/${id}`)
  return data
}
