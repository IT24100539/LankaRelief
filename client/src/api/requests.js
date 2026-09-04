import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

export async function getRequests(filters = {}) {
  const params = {}
  for (const [key, value] of Object.entries(filters)) {
    if (value) params[key] = value
  }
  const { data } = await api.get('/api/requests', { params })
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
