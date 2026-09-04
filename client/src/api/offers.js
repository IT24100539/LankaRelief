import { api, queryParams } from './api.js'

export async function getOffers(filters = {}) {
  const { data } = await api.get('/api/offers', { params: queryParams(filters) })
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

export async function deleteOffer(id) {
  const { data } = await api.delete(`/api/offers/${id}`)
  return data
}