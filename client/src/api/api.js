import axios from 'axios'

export const FRONTEND_URL = 'https://lanka-relief-eight.vercel.app'
export const DEPLOYED_API_URL = 'https://lankarelief-production.up.railway.app'
export const LOCAL_API_URL = 'http://localhost:5000'

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? LOCAL_API_URL : DEPLOYED_API_URL)

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
