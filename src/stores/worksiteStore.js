import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

// 요구사항 3(온열질환 예방) 전용 store.
// - 기본 작업장(주요 도시)은 코드에 박아두고 삭제 불가
// - 사용자가 추가한 작업장 + 오늘의 3대 수칙 체크 기록은 localStorage에 영속 저장
//   (Weather Axios 단계의 일부라 useFavoriteCitiesAxios 옆에 나란히 두는 대신,
//    "현장 관리"라는 별도 관심사라 Pinia store로 분리)

// 기본 작업장: 전국 주요 도시 좌표 (OpenWeatherMap 좌표 조회에 그대로 사용)
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

const USER_KEY = 'heat-safety:user-worksites'
const CHECK_KEY = 'heat-safety:checklist'

const loadJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const todayKey = () => new Date().toISOString().slice(0, 10) // 'YYYY-MM-DD'

export const useWorksiteStore = defineStore('worksite', () => {
  // 사용자가 추가한 작업장 목록
  const userWorksites = ref(loadJSON(USER_KEY, []))
  // { 'YYYY-MM-DD': { siteId: { water: true, shade: false, rest: false } } }
  const checklist = ref(loadJSON(CHECK_KEY, {}))

  // 변경 시 자동으로 localStorage 반영
  watch(userWorksites, (v) => localStorage.setItem(USER_KEY, JSON.stringify(v)), { deep: true })
  watch(checklist, (v) => localStorage.setItem(CHECK_KEY, JSON.stringify(v)), { deep: true })

  // 기본 + 사용자 작업장을 합친 전체 목록
  const allWorksites = computed(() => [...DEFAULT_WORKSITES, ...userWorksites.value])

  const getWorksite = (id) => allWorksites.value.find((w) => w.id === id) ?? null

  // 작업장 추가 (name + 좌표는 필수)
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

  // 사용자 작업장만 삭제 가능 (기본 작업장은 무시)
  const removeWorksite = (id) => {
    userWorksites.value = userWorksites.value.filter((w) => w.id !== id)
  }

  // 오늘 특정 작업장의 3대 수칙 체크 상태
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
