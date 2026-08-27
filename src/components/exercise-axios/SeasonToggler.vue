<script setup>
// Weather Store 단계 SeasonToggler를 복제, store만 feelsLikeAxiosStore로 교체
import { useFeelsLikeAxiosStore } from '@/stores/feelsLikeAxiosStore'

const feelsLikeStore = useFeelsLikeAxiosStore()
</script>

<template>
  <div style="display: inline-flex; align-items: center; gap: 8px; margin-left: 10px; white-space: nowrap">
    <span
      >체감 공식: <strong>{{ feelsLikeStore.season === 'summer' ? '☀️ 여름철' : '❄️ 겨울철' }}</strong></span
    >
    <button @click="feelsLikeStore.toggleSeason" class="toggle-btn">계절변경</button>
  </div>
</template>

<style scoped>
.toggle-btn {
  padding: 6px 10px;
  background-color: #4b6584;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}
</style>
