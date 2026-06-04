import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10_000,
})

export const incidentsApi = {
  list: (params = {}) =>
    api.get('/incidents', { params }).then(r => r.data),

  get: (id) =>
    api.get(`/incidents/${id}`).then(r => r.data),

  create: (payload) =>
    api.post('/incidents', payload).then(r => r.data),

  closeIncident: (id) =>
    api.post(`/incidents/${id}/close`).then(r => r.data),
}
