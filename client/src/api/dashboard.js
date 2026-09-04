import { api } from './api.js'

export async function getSummary() {
  const { data } = await api.get('/api/dashboard/summary')
  return data
}
