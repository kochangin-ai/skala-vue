import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { summerFeelsLike, winterFeelsLike } from '@/heat/heatIndex'

// Weather UI Library 단계 전용 계절 store.
// feelsLikeAxiosStore를 그대로 복제(핸즈온이므로 기존 단계와 상태를 섞지 않음).
// 계산식은 공용 @/heat/heatIndex.js 를 그대로 재사용한다.
export const useFeelsLikeUiStore = defineStore('feelsLikeUi', () => {
  const season = ref('summer') // 'summer' | 'winter'

  const seasonLabel = computed(() => (season.value === 'summer' ? '여름철' : '겨울철'))

  const toggleSeason = () => {
    season.value = season.value === 'summer' ? 'winter' : 'summer'
  }
  const setSeason = (value) => {
    if (value === 'summer' || value === 'winter') season.value = value
  }

  const calculateFeelsLike = ({ temp, humidity, windSpeed }) =>
    season.value === 'summer'
      ? summerFeelsLike(temp, humidity)
      : winterFeelsLike(temp, windSpeed)

  return { season, seasonLabel, toggleSeason, setSeason, calculateFeelsLike }
})
