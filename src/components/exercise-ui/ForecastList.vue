<script setup>
// exercise-axios/ForecastList 를 PrimeVue 토큰 색상으로 정리 (이모지 없음).
defineProps({
  forecast: {
    type: Array,
    default: () => [],
  },
})

const formatTime = (dtText) => {
  const [date, time] = dtText.split(' ')
  return `${Number(date.split('-')[2])}일 ${time.slice(0, 2)}시`
}
</script>

<template>
  <div class="forecast-scroll">
    <div v-for="slot in forecast" :key="slot.time" class="forecast-item">
      <span class="time">{{ formatTime(slot.time) }}</span>
      <img v-if="slot.iconUrl" :src="slot.iconUrl" :alt="slot.status" />
      <span class="temp">{{ slot.temp }}°C</span>
      <span class="desc">{{ slot.status }}</span>
    </div>
  </div>
</template>

<style scoped>
.forecast-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.forecast-item {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 84px;
  padding: 10px 8px;
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;
  font-size: 12px;
}

.forecast-item img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.forecast-item .time {
  color: var(--p-text-muted-color);
}

.forecast-item .temp {
  font-weight: 700;
  font-size: 14px;
}

.forecast-item .desc {
  color: var(--p-text-muted-color);
}
</style>
