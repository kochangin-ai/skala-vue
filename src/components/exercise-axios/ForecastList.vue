<script setup>
// 요구사항 2: OpenWeatherMap "5 day / 3 hour forecast" API 결과를 카드 형태로 나열
defineProps({
  forecast: {
    type: Array,
    default: () => [],
  },
})

// '2026-08-27 15:00:00' -> '27일 15시'
const formatTime = (dtText) => {
  const [date, time] = dtText.split(' ')
  const day = date.split('-')[2]
  const hour = time.slice(0, 2)
  return `${Number(day)}일 ${hour}시`
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
  min-width: 82px;
  padding: 8px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 12px;
}

.forecast-item img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.forecast-item .temp {
  font-weight: bold;
  font-size: 14px;
}

.forecast-item .desc {
  color: #888;
}
</style>
