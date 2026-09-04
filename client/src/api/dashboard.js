import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

export async function getSummary() {
  const { data } = await api.get('/api/dashboard/summary')
  return data
}
