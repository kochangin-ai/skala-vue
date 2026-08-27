import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { summerFeelsLike, winterFeelsLike } from '@/heat/heatIndex'

// Weather Store 단계의 feelsLikeStore.js를 그대로 복제한 Weather Axios 단계 전용 store.
// (단계별로 상태가 섞이지 않도록 store id를 'feelsLikeAxios'로 분리)
// 이전 단계와 달리 temp/humidity/windSpeed 값이 mock이 아니라 OpenWeatherMap 실측치로 채워진다.
// 계산식 자체는 요구사항 3(온열질환 예방)과 공유하므로 @/heat/heatIndex.js로 분리해서 함께 쓴다.
export const useFeelsLikeAxiosStore = defineStore('feelsLikeAxios', () => {
  // state: 현재 적용 중인 계절 공식 ('summer' | 'winter')
  const season = ref('summer')

  // getter: 현재 계절 상태에 맞는 라벨
  const seasonLabel = computed(() =>
    season.value === 'summer' ? '☀️ 여름철 공식' : '❄️ 겨울철 공식',
  )

  // action: 'summer'와 'winter'를 토글(스위칭)
  const toggleSeason = () => {
    season.value = season.value === 'summer' ? 'winter' : 'summer'
  }

  // getter(함수형): 도시 하나({temp, humidity, windSpeed})의 체감온도를 현재 season 기준으로 계산
  // 겨울철은 산출 조건(기온 10℃ 이하, 풍속 1.3m/s 이상)을 만족하지 못하면 null 반환
  const calculateFeelsLike = ({ temp, humidity, windSpeed }) =>
    season.value === 'summer'
      ? summerFeelsLike(temp, humidity)
      : winterFeelsLike(temp, windSpeed)

  return { season, seasonLabel, toggleSeason, calculateFeelsLike }
})
