import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

export async function getNotices(filters = {}) {
  const params = {}
  for (const [key, value] of Object.entries(filters)) {
    if (value) params[key] = value
  }
  const { data } = await api.get('/api/notices', { params })
  return data
}

export async function createNotice(data) {
  const { data: created } = await api.post('/api/notices', data)
  return created
}

export async function closeNotice(id) {
  const { data } = await api.patch(`/api/notices/${id}`)
  return data
}
