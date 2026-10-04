// Données simulées pour tester les cas difficiles à reproduire avec la vraie API.
// Chargé uniquement en dev, via l'URL : http://localhost:5173/?mock=<scénario>
//
//   pending     R1 terminé, R2 disputé il y a 2 h sans résultats, R3 à venir
//   new-season  Saison 2027 : R1 disputé, mais /current/last renvoie encore Abu Dhabi 2026
//   last-down   Comme "pending", mais /current/last/results renvoie une erreur 500
//   api-down    Toute l'API est injoignable
//
// Les dates sont calculées par rapport à maintenant, les scénarios restent valables dans le temps.

import { AxiosError } from 'axios'

const HOUR = 60 * 60 * 1000

// date + time au format Jolpica ("2026-10-04" / "07:00:00Z"), décalés de `hours` par rapport à maintenant
const raceTime = (hours) => {
  const iso = new Date(Date.now() + hours * HOUR).toISOString()
  return { date: iso.slice(0, 10), time: `${iso.slice(11, 19)}Z` }
}

const CIRCUITS = {
  monza:      { circuitId: 'monza', circuitName: 'Autodromo Nazionale di Monza', Location: { locality: 'Monza', country: 'Italy' } },
  baku:       { circuitId: 'baku', circuitName: 'Baku City Circuit', Location: { locality: 'Baku', country: 'Azerbaijan' } },
  marina_bay: { circuitId: 'marina_bay', circuitName: 'Marina Bay Street Circuit', Location: { locality: 'Marina Bay', country: 'Singapore' } },
  yas_marina: { circuitId: 'yas_marina', circuitName: 'Yas Marina Circuit', Location: { locality: 'Abu Dhabi', country: 'United Arab Emirates' } },
  albert_park: { circuitId: 'albert_park', circuitName: 'Albert Park Grand Prix Circuit', Location: { locality: 'Melbourne', country: 'Australia' } },
}

const CONSTRUCTORS = {
  mercedes: { constructorId: 'mercedes', name: 'Mercedes', nationality: 'German' },
  ferrari:  { constructorId: 'ferrari', name: 'Ferrari', nationality: 'Italian' },
  red_bull: { constructorId: 'red_bull', name: 'Red Bull', nationality: 'Austrian' },
}

const DRIVERS = [
  { driver: { driverId: 'antonelli', permanentNumber: '12', givenName: 'Andrea Kimi', familyName: 'Antonelli', nationality: 'Italian', dateOfBirth: '2006-08-25' }, team: 'mercedes' },
  { driver: { driverId: 'russell', permanentNumber: '63', givenName: 'George', familyName: 'Russell', nationality: 'British', dateOfBirth: '1998-02-15' }, team: 'mercedes' },
  { driver: { driverId: 'hamilton', permanentNumber: '44', givenName: 'Lewis', familyName: 'Hamilton', nationality: 'British', dateOfBirth: '1985-01-07' }, team: 'ferrari' },
  { driver: { driverId: 'max_verstappen', permanentNumber: '3', givenName: 'Max', familyName: 'Verstappen', nationality: 'Dutch', dateOfBirth: '1997-09-30' }, team: 'red_bull' },
]

const POINTS = ['25', '18', '15', '12']

const makeRace = (season, round, raceName, circuitId, hours) => ({
  season, round: String(round), raceName, Circuit: CIRCUITS[circuitId], ...raceTime(hours),
})

// Résultats : `order` = indices dans DRIVERS, du P1 au dernier
const withResults = (race, order) => ({
  ...race,
  Results: order.map((idx, pos) => ({
    position: String(pos + 1),
    points: POINTS[pos],
    Driver: DRIVERS[idx].driver,
    Constructor: CONSTRUCTORS[DRIVERS[idx].team],
  })),
})

const driverStandings = [
  { position: '1', points: '43', wins: '1', Driver: DRIVERS[0].driver, Constructors: [CONSTRUCTORS.mercedes] },
  { position: '2', points: '33', wins: '0', Driver: DRIVERS[2].driver, Constructors: [CONSTRUCTORS.ferrari] },
  { position: '3', points: '30', wins: '1', Driver: DRIVERS[1].driver, Constructors: [CONSTRUCTORS.mercedes] },
  { position: '4', points: '24', wins: '0', Driver: DRIVERS[3].driver, Constructors: [CONSTRUCTORS.red_bull] },
]

const constructorStandings = [
  { position: '1', points: '73', wins: '2', Constructor: CONSTRUCTORS.mercedes },
  { position: '2', points: '33', wins: '0', Constructor: CONSTRUCTORS.ferrari },
  { position: '3', points: '24', wins: '0', Constructor: CONSTRUCTORS.red_bull },
]

// --- Scénarios ---

const pendingScenario = () => {
  const r1 = makeRace('2026', 1, 'Azerbaijan Grand Prix', 'baku', -8 * 24)
  const r2 = makeRace('2026', 2, 'Italian Grand Prix', 'monza', -2)
  const r3 = makeRace('2026', 3, 'Singapore Grand Prix', 'marina_bay', 7 * 24)
  const r1Done = withResults(r1, [1, 3, 0, 2])
  return {
    season: '2026',
    races: [r1, r2, r3],
    results: { 1: r1Done },
    last: r1Done,
  }
}

const newSeasonScenario = () => {
  const abuDhabi2026 = withResults(makeRace('2026', 24, 'Abu Dhabi Grand Prix', 'yas_marina', -100 * 24), [0, 1, 2, 3])
  const r1 = makeRace('2027', 1, 'Australian Grand Prix', 'albert_park', -2)
  const r2 = makeRace('2027', 2, 'Azerbaijan Grand Prix', 'baku', 7 * 24)
  return {
    season: '2027',
    races: [r1, r2],
    results: {},
    last: abuDhabi2026,
  }
}

const SCENARIOS = {
  pending: pendingScenario,
  'new-season': newSeasonScenario,
  'last-down': () => ({ ...pendingScenario(), failLast: true }),
  'api-down': () => ({ ...pendingScenario(), down: true }),
}

// --- Routage des requêtes ---

const mrData = (payload) => ({ MRData: { limit: '30', offset: '0', ...payload } })

const routeRequest = (data, url) => {
  if (url.endsWith('/current/last/results.json')) {
    if (data.failLast) return { status: 500 }
    return { body: mrData({ total: '1', RaceTable: { season: data.last.season, Races: [data.last] } }) }
  }

  const driverMatch = url.match(/\/drivers\/([^/]+)\/results\.json$/)
  if (driverMatch) {
    const races = Object.values(data.results)
      .map(race => ({ ...race, Results: race.Results.filter(r => r.Driver.driverId === driverMatch[1]) }))
      .filter(race => race.Results.length > 0)
    return { body: mrData({ total: String(races.length), RaceTable: { season: data.season, Races: races } }) }
  }

  const roundMatch = url.match(/\/(\d+)\/results\.json$/)
  if (roundMatch) {
    const race = data.results[roundMatch[1]]
    return { body: mrData({ total: race ? String(race.Results.length) : '0', RaceTable: { season: data.season, Races: race ? [race] : [] } }) }
  }

  if (url.endsWith('/races.json')) {
    return { body: mrData({ total: String(data.races.length), RaceTable: { season: data.season, Races: data.races } }) }
  }

  if (url.endsWith('/driverStandings.json')) {
    return { body: mrData({ StandingsTable: { season: data.season, StandingsLists: [{ season: data.season, round: '1', DriverStandings: driverStandings }] } }) }
  }

  if (url.endsWith('/constructorStandings.json')) {
    return { body: mrData({ StandingsTable: { season: data.season, StandingsLists: [{ season: data.season, round: '1', ConstructorStandings: constructorStandings }] } }) }
  }

  return { status: 404 }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Adaptateur axios : renvoie la réponse simulée au lieu d'appeler le réseau
export const handleMockRequest = async (scenarioName, config) => {
  const scenario = SCENARIOS[scenarioName]
  if (!scenario) {
    throw new Error(`[mock] Scénario inconnu "${scenarioName}". Disponibles : ${Object.keys(SCENARIOS).join(', ')}`)
  }

  await delay(300)
  const data = scenario()

  if (data.down) {
    throw new AxiosError('Network Error', AxiosError.ERR_NETWORK, config)
  }

  const { status = 200, body = {} } = routeRequest(data, config.url)
  const response = { data: body, status, statusText: String(status), headers: {}, config, request: {} }

  if (status >= 400) {
    throw new AxiosError(`Request failed with status code ${status}`, AxiosError.ERR_BAD_RESPONSE, config, null, response)
  }
  return response
}
