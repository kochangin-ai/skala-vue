<script setup>
// 요구사항 2: OpenWeatherMap "Air Pollution" API 결과(대기질 지수 + 오염물질 농도) 표시
defineProps({
  air: {
    type: Object,
    default: null,
  },
})
</script>

<template>
  <div v-if="air" class="air-card">
    <div class="aqi" :style="{ borderColor: air.color }">
      <span class="aqi-num" :style="{ color: air.color }">{{ air.aqi }}</span>
      <span class="aqi-label" :style="{ color: air.color }">{{ air.label }}</span>
    </div>
    <ul class="components">
      <li>초미세먼지 PM2.5 <strong>{{ air.pm2_5 }}</strong> ㎍/㎥</li>
      <li>미세먼지 PM10 <strong>{{ air.pm10 }}</strong> ㎍/㎥</li>
      <li>오존 O₃ <strong>{{ air.o3 }}</strong> ㎍/㎥</li>
      <li>이산화질소 NO₂ <strong>{{ air.no2 }}</strong> ㎍/㎥</li>
    </ul>
  </div>
  <p v-else class="empty">대기질 정보를 불러오지 못했습니다.</p>
</template>

<style scoped>
.air-card {
  display: flex;
  gap: 16px;
  align-items: center;
}

.aqi {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border: 3px solid;
  border-radius: 50%;
  flex: 0 0 auto;
}

.aqi-num {
  font-size: 22px;
  font-weight: bold;
  line-height: 1;
}

.aqi-label {
  font-size: 12px;
  font-weight: bold;
}

.components {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
}

.empty {
  color: #e74c3c;
  font-size: 13px;
}
</style>
