import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: API_URL,
})

export function queryParams(filters = {}) {
  const params = {}
  for (const [key, value] of Object.entries(filters)) {
    if (value) params[key] = value
  }
  return params
}
