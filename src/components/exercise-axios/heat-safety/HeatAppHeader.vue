<script setup>
// 작업장 관리 화면들이 공유하는 헤더.
// 같은 Weather Axios handson이라 최상단은 공통 WeatherAppHeader를 그대로 쓰고,
// 그 아래 작업장 관리 전용 서브 내비만 한 줄 덧붙인다. (계절 토글은 상단 헤더에 이미 있음)
import { computed } from 'vue'
import WeatherAppHeader from '@/components/exercise-axios/WeatherAppHeader.vue'
import { useFeelsLikeAxiosStore } from '@/stores/feelsLikeAxiosStore'

const seasonStore = useFeelsLikeAxiosStore()
const mode = computed(() =>
  seasonStore.season === 'winter' ? '🥶 한랭질환 예방' : '🔥 온열질환 예방',
)
</script>

<template>
  <div>
    <WeatherAppHeader />
    <nav class="heat-subnav">
      <span class="heat-subnav-label">🏗️ 작업장 관리 · {{ mode }}</span>
      <span class="spacer"></span>
      <RouterLink to="/weather-axios/heat-safety">현장 현황</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/weather-axios/heat-safety/about">단계별 기준</RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.heat-subnav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  margin: -6px 0 18px;
}

.heat-subnav-label {
  color: #888;
  font-weight: bold;
}

.spacer {
  flex: 1;
}

.heat-subnav a {
  color: #666;
  text-decoration: none;
  padding-bottom: 3px;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.heat-subnav a.router-link-exact-active {
  color: #2f6fed;
  border-bottom-color: #2f6fed;
  font-weight: bold;
}

.divider {
  color: #ccc;
}
</style>
