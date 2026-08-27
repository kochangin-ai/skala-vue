<script setup>
import { useFeelsLikeStore } from '@/stores/feelsLikeStore'

// Navigation Bar 옆에 배치되는 계절 공식 토글: feelsLikeStore의 상태를 바꾸기만 함
const feelsLikeStore = useFeelsLikeStore()
</script>

<template>
  <div class="season-toggler">
    <button
      class="season-btn"
      :class="{ active: feelsLikeStore.season === 'summer' }"
      @click="feelsLikeStore.setSeason('summer')"
    >
      ☀️ 여름철 공식
    </button>
    <button
      class="season-btn"
      :class="{ active: feelsLikeStore.season === 'winter' }"
      @click="feelsLikeStore.setSeason('winter')"
    >
      ❄️ 겨울철 공식
    </button>
  </div>
</template>

<style scoped>
.season-toggler {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.season-btn {
  padding: 4px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  color: #666;
  font-size: 13px;
  cursor: pointer;
}

.season-btn.active {
  background: #2f6fed;
  border-color: #2f6fed;
  color: #fff;
  font-weight: bold;
}
</style>
