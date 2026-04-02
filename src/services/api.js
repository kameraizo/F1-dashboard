import axios from 'axios'

// L'URL de base commune à tous les appels
const api = axios.create({
  baseURL: 'https://api.jolpi.ca/ergast/f1'
})

// Une fonction par endpoint
export const getDriverStandings = async () => {
  const response = await api.get('/2026/driverStandings.json')
  return response.data
}

export const getConstructorStandings = async () => {
  const response = await api.get('/2026/constructorStandings.json')
  return response.data
}

export const getResults = async () => {
  const response = await api.get('/2026/results.json')
  return response.data
}

export const getRaces = async () => {
  const response = await api.get('/2026/races.json')
  return response.data
}
export const getRaceResults = async (round) => {
  const response = await api.get(`/2026/${round}/results.json`)
  return response.data
}