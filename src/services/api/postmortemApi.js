import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 15_000,
})

export const postmortemApi = {
  get: (incidentId) =>
    api.get(`/incidents/${incidentId}/postmortem`).then(r => r.data),
}
