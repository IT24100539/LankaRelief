import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

export async function getShelters(filters = {}) {
  const params = {}
  for (const [key, value] of Object.entries(filters)) {
    if (value) params[key] = value
  }
  const { data } = await api.get('/api/shelters', { params })
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
