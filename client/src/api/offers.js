import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
})

export async function getOffers(filters = {}) {
  const params = {}
  for (const [key, value] of Object.entries(filters)) {
    if (value) params[key] = value
  }
  const { data } = await api.get('/api/offers', { params })
  return data
}

export async function createOffer(payload) {
  const { data } = await api.post('/api/offers', payload)
  return data
}

export async function updateOfferAvailability(id, status) {
  const { data } = await api.patch(`/api/offers/${id}`, {
    availabilityStatus: status,
  })
  return data
}
