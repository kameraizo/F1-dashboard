import axios from 'axios'

// L'URL de base commune à tous les appels
const api = axios.create({
  baseURL: 'https://api.jolpi.ca/ergast/f1',
  timeout: 10000
})

// Données simulées, en dev uniquement : http://localhost:5173/?mock=pending (voir mocks.js)
const mockScenario = import.meta.env.DEV && new URLSearchParams(window.location.search).get('mock')
if (mockScenario) {
  api.defaults.adapter = async (config) => {
    const { handleMockRequest } = await import('./mocks')
    return handleMockRequest(mockScenario, config)
  }
  console.info(`[mock] scénario "${mockScenario}" actif`)
}

// Message affiché à l'utilisateur quand un appel échoue
export const getApiErrorMessage = (error) => {
  if (error.response) {
    return `L'API F1 a renvoyé une erreur (HTTP ${error.response.status}). Réessaie dans quelques minutes.`
  }
  return "L'API F1 (Jolpica) ne répond pas. Vérifie ta connexion ou réessaie dans quelques minutes."
}

// Une fonction par endpoint
export const getDriverStandings = async () => {
  const response = await api.get('/current/driverStandings.json')
  return response.data
}

export const getConstructorStandings = async () => {
  const response = await api.get('/current/constructorStandings.json')
  return response.data
}

export const getRaces = async () => {
  const response = await api.get('/current/races.json')
  return response.data
}
export const getRaceResults = async (round) => {
  const response = await api.get(`/current/${round}/results.json`)
  return response.data
}
export const getDriverResults = async (driverId) => {
  const response = await api.get(`/current/drivers/${driverId}/results.json`)
  return response.data
}
// Saison du calendrier en cours, mise en cache (un seul appel par session, relancé en cas d'échec)
let seasonPromise = null
export const getCurrentSeason = () => {
  seasonPromise ??= getRaces()
    .then(data => data.MRData.RaceTable.season)
    .catch(err => {
      seasonPromise = null
      throw err
    })
  return seasonPromise
}
export const getLastRaceResults = async () => {
  const response = await api.get('/current/last/results.json')
  return response.data
}
