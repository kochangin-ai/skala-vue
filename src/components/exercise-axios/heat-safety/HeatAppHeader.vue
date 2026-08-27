<script setup>
// 작업장 관리 화면들이 공유하는 헤더.
// Weather Axios 단계의 일부라, SeasonToggler(여름=온열질환 / 겨울=한랭질환)와
// Weather Axios 대시보드로 돌아가는 링크를 같이 둔다.
import { computed } from 'vue'
import SeasonToggler from '../SeasonToggler.vue'
import { useFeelsLikeAxiosStore } from '@/stores/feelsLikeAxiosStore'

const seasonStore = useFeelsLikeAxiosStore()
const mode = computed(() =>
  seasonStore.season === 'winter' ? '🥶 한랭질환 예방' : '🔥 온열질환 예방',
)
</script>

<template>
  <header class="heat-header">
    <p class="badge">🏗️ Weather Axios · 작업장 관리 — {{ mode }}</p>
    <nav class="heat-nav">
      <RouterLink to="/weather-axios/heat-safety">🏗️ 현장 현황</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/weather-axios/heat-safety/about">ℹ️ 단계별 기준</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/weather-axios">↩︎ 날씨 대시보드</RouterLink>
      <SeasonToggler />
    </nav>
  </header>
</template>

<style scoped>
.heat-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}

.badge {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: bold;
  color: #c0392b;
}

.heat-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.heat-nav a {
  color: #666;
  text-decoration: none;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.heat-nav a.router-link-exact-active {
  color: #c0392b;
  border-bottom-color: #c0392b;
  font-weight: bold;
}

.divider {
  color: #ccc;
}
</style>
