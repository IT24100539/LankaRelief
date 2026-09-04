import { api, queryParams } from './api.js'

export async function getNotices(filters = {}) {
  const { data } = await api.get('/api/notices', { params: queryParams(filters) })
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

export async function deleteNotice(id) {
  const { data } = await api.delete(`/api/notices/${id}`)
  return data
}
