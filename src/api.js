import axios from 'axios'

const API_BASE = 'http://127.0.0.1:8000'

const api = axios.create({ baseURL: API_BASE, timeout: 10000 })

export const fetchDashboard   = () => api.get('/api/dashboard').then(r => r.data)
export const fetchWell        = () => api.get('/api/well').then(r => r.data)
export const fetchMEM         = () => api.get('/api/mem').then(r => r.data)
export const fetchDFIT        = () => api.get('/api/dfit').then(r => r.data)
export const fetchPressure    = () => api.get('/api/pressure').then(r => r.data)
export const fetchGeometry    = () => api.get('/api/fracture-geometry').then(r => r.data)
export const fetchDesign      = () => api.get('/api/design-summary').then(r => r.data)
export const fetchSchedule    = () => api.get('/api/pumping-schedule').then(r => r.data)
export const fetchStress      = () => api.get('/api/stress-profile').then(r => r.data)
export const fetchContainment = () => api.get('/api/containment').then(r => r.data)
export const fetchUncertainty = () => api.get('/api/uncertainty').then(r => r.data)
export const fetchSensitivity = () => api.get('/api/sensitivity').then(r => r.data)
export const fetchRisk        = () => api.get('/api/risk').then(r => r.data)

export default api
