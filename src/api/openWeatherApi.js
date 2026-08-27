// OpenWeatherMap 통신 계층. 코드 챌린지(AxiosWeather.vue)에서 연습한 axios 호출 패턴을
// 그대로 확장해서, 화면(View)들이 쓰기 좋은 형태로 응답을 가공(normalize)해서 돌려준다.
//
// 사용하는 OpenWeatherMap API (무료 플랜)
//  1. Current Weather   : /data/2.5/weather        - 실시간 기온/습도/풍속/상태  (요구사항 1)
//  2. 5 day / 3 hour    : /data/2.5/forecast       - 3시간 간격 예보            (요구사항 2)
//  3. Air Pollution     : /data/2.5/air_pollution  - 대기질 지수(AQI)/미세먼지   (요구사항 2)
import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

// baseURL/공통 파라미터를 미리 물려둔 axios 인스턴스 (호출부에서 중복 제거)
const owm = axios.create({
  baseURL: 'https://api.openweathermap.org/data/2.5',
  params: { appid: API_KEY, units: 'metric', lang: 'kr' },
})

// OpenWeatherMap weather[0].main(영문) -> 앱 전체에서 쓰던 한글 상태값으로 매핑
// (이전 단계의 '맑음/비/구름' 어휘와 뱃지/문구를 그대로 재사용하기 위함)
const STATUS_KO = {
  Clear: '맑음',
  Clouds: '구름',
  Rain: '비',
  Drizzle: '비',
  Thunderstorm: '뇌우',
  Snow: '눈',
  Mist: '안개',
  Fog: '안개',
  Haze: '안개',
  Smoke: '연무',
  Dust: '먼지',
  Sand: '먼지',
  Ash: '화산재',
  Squall: '돌풍',
  Tornado: '토네이도',
}

const iconUrl = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`
const round1 = (n) => Math.round(n * 10) / 10

// 요구사항 1: current weather 응답 -> 앱이 쓰던 도시 객체 형태로 변환
// (temp/humidity/windSpeed 키를 그대로 유지해서 feelsLikeStore.calculateFeelsLike를 손 안 대고 재사용)
const normalizeCurrent = (city, data) => {
  const w = data.weather?.[0] ?? {}
  return {
    id: city.id,
    name: city.name,
    region: `${data.name}${data.sys?.country ? `, ${data.sys.country}` : ''}`,
    temp: round1(data.main.temp),
    status: STATUS_KO[w.main] ?? w.main ?? '정보 없음',
    description: w.description ?? '',
    humidity: data.main.humidity,
    windSpeed: round1(data.wind?.speed ?? 0),
    feelsLikeApi: round1(data.main.feels_like), // OpenWeatherMap이 직접 계산해준 체감온도
    iconUrl: w.icon ? iconUrl(w.icon) : null,
    lat: data.coord?.lat,
    lon: data.coord?.lon,
  }
}

// 요구사항 1: 도시 1곳의 실시간 날씨
export const fetchCurrentWeather = async (city) => {
  const { data } = await owm.get('/weather', { params: { q: city.query } })
  return normalizeCurrent(city, data)
}

// 요구사항 1: 도시 여러 곳을 병렬 조회. 일부 도시가 실패해도 나머지는 보여주도록 allSettled 사용
export const fetchCurrentWeatherList = async (cities) => {
  const results = await Promise.allSettled(cities.map((city) => fetchCurrentWeather(city)))
  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value)
}

const mapForecast = (data) =>
  data.list.map((slot) => ({
    time: slot.dt_txt, // 'YYYY-MM-DD HH:mm:ss'
    temp: round1(slot.main.temp),
    humidity: slot.main.humidity, // 요구사항 3: 시간대별 체감온도 재계산에 필요
    windSpeed: round1(slot.wind?.speed ?? 0),
    status: STATUS_KO[slot.weather?.[0]?.main] ?? slot.weather?.[0]?.main ?? '',
    description: slot.weather?.[0]?.description ?? '',
    iconUrl: slot.weather?.[0]?.icon ? iconUrl(slot.weather[0].icon) : null,
  }))

// 요구사항 2: 5일/3시간 예보. 화면에서 바로 v-for 할 수 있게 앞쪽 N개만 잘라 가공
export const fetchForecast = async (city, count = 8) => {
  const { data } = await owm.get('/forecast', { params: { q: city.query, cnt: count } })
  return mapForecast(data)
}

// ── 요구사항 3(온열질환 예방): 좌표 기반 조회 ──
// 사용자가 직접 추가한 작업장은 도시명(q)이 아니라 위·경도로만 식별되므로 lat/lon으로 호출한다.

// 작업장 1곳({ id, name, lat, lon })의 실시간 날씨
export const fetchWorksiteWeather = async (worksite) => {
  const { data } = await owm.get('/weather', { params: { lat: worksite.lat, lon: worksite.lon } })
  return normalizeCurrent(worksite, data)
}

// 작업장 여러 곳 병렬 조회. 실패한 곳도 자리(weather: null)를 유지해서 카드에 '조회 실패'를 띄운다.
export const fetchWorksiteWeatherList = async (worksites) => {
  const results = await Promise.allSettled(worksites.map((w) => fetchWorksiteWeather(w)))
  return worksites.map((worksite, i) => ({
    worksite,
    weather: results[i].status === 'fulfilled' ? results[i].value : null,
  }))
}

// 작업장 좌표의 5일/3시간 예보
export const fetchForecastByCoord = async (lat, lon, count = 16) => {
  const { data } = await owm.get('/forecast', { params: { lat, lon, cnt: count } })
  return mapForecast(data)
}

const AQI_LABEL = {
  1: { text: '좋음', color: '#2ecc71' },
  2: { text: '보통', color: '#f1c40f' },
  3: { text: '나쁨', color: '#e67e22' },
  4: { text: '매우 나쁨', color: '#e74c3c' },
  5: { text: '위험', color: '#8e44ad' },
}

// 요구사항 2: 위경도로 대기질(AQI) + 주요 오염물질 농도 조회
export const fetchAirPollution = async (lat, lon) => {
  const { data } = await owm.get('/air_pollution', { params: { lat, lon } })
  const entry = data.list?.[0]
  if (!entry) return null
  const aqi = entry.main.aqi
  return {
    aqi,
    label: AQI_LABEL[aqi]?.text ?? '알 수 없음',
    color: AQI_LABEL[aqi]?.color ?? '#95a5a6',
    pm2_5: entry.components.pm2_5,
    pm10: entry.components.pm10,
    o3: entry.components.o3,
    no2: entry.components.no2,
  }
}
