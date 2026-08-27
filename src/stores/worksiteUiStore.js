import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

// Weather UI Library 단계 전용 작업장 store (worksiteStore 복제).
// localStorage 키를 'weather-ui:' 로 분리해서 이전 단계(heat-safety)와 데이터가 섞이지 않게 한다.

export const DEFAULT_WORKSITES = [
  { id: 'default-seoul', name: '서울', lat: 37.5665, lon: 126.978, source: 'default' },
  { id: 'default-busan', name: '부산', lat: 35.1796, lon: 129.0756, source: 'default' },
  { id: 'default-incheon', name: '인천', lat: 37.4563, lon: 126.7052, source: 'default' },
  { id: 'default-daegu', name: '대구', lat: 35.8714, lon: 128.6014, source: 'default' },
  { id: 'default-daejeon', name: '대전', lat: 36.3504, lon: 127.3845, source: 'default' },
  { id: 'default-gwangju', name: '광주', lat: 35.1595, lon: 126.8526, source: 'default' },
  { id: 'default-ulsan', name: '울산', lat: 35.5384, lon: 129.3114, source: 'default' },
  { id: 'default-suwon', name: '수원', lat: 37.2636, lon: 127.0286, source: 'default' },
  { id: 'default-jeju', name: '제주', lat: 33.4996, lon: 126.5312, source: 'default' },
]

const USER_KEY = 'weather-ui:user-worksites'
const CHECK_KEY = 'weather-ui:checklist'

const loadJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const todayKey = () => new Date().toISOString().slice(0, 10)

export const useWorksiteUiStore = defineStore('worksiteUi', () => {
  const userWorksites = ref(loadJSON(USER_KEY, []))
  const checklist = ref(loadJSON(CHECK_KEY, {}))

  watch(userWorksites, (v) => localStorage.setItem(USER_KEY, JSON.stringify(v)), { deep: true })
  watch(checklist, (v) => localStorage.setItem(CHECK_KEY, JSON.stringify(v)), { deep: true })

  const allWorksites = computed(() => [...DEFAULT_WORKSITES, ...userWorksites.value])
  const getWorksite = (id) => allWorksites.value.find((w) => w.id === id) ?? null

  const addWorksite = ({ name, lat, lon, source = 'user' }) => {
    const worksite = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      lat: Number(lat),
      lon: Number(lon),
      source,
    }
    userWorksites.value = [...userWorksites.value, worksite]
    return worksite
  }

  const removeWorksite = (id) => {
    userWorksites.value = userWorksites.value.filter((w) => w.id !== id)
  }

  const getTodayChecks = (siteId) => checklist.value[todayKey()]?.[siteId] ?? {}

  const toggleCheck = (siteId, ruleKey) => {
    const day = todayKey()
    const dayMap = { ...checklist.value[day] }
    const siteMap = { ...dayMap[siteId] }
    siteMap[ruleKey] = !siteMap[ruleKey]
    dayMap[siteId] = siteMap
    checklist.value = { ...checklist.value, [day]: dayMap }
  }

  return {
    userWorksites,
    allWorksites,
    getWorksite,
    addWorksite,
    removeWorksite,
    getTodayChecks,
    toggleCheck,
  }
})
