<script setup>
// exercise-axios/AirQualityCard 를 PrimeVue Knob + Tag 로. 이모지 없음.
import Knob from 'primevue/knob'
import Tag from 'primevue/tag'

defineProps({
  air: {
    type: Object,
    default: null,
  },
})

const aqiSeverity = (aqi) => {
  if (aqi >= 4) return 'danger'
  if (aqi === 3) return 'warn'
  return 'success'
}
</script>

<template>
  <div v-if="air" class="air-card">
    <Knob :model-value="air.aqi" :min="0" :max="5" :size="88" readonly :value-template="`${air.aqi}`" />
    <div class="air-body">
      <Tag :value="`대기질 ${air.label}`" :severity="aqiSeverity(air.aqi)" />
      <ul class="components">
        <li>초미세먼지 PM2.5 <strong>{{ air.pm2_5 }}</strong> ㎍/㎥</li>
        <li>미세먼지 PM10 <strong>{{ air.pm10 }}</strong> ㎍/㎥</li>
        <li>오존 O₃ <strong>{{ air.o3 }}</strong> ㎍/㎥</li>
        <li>이산화질소 NO₂ <strong>{{ air.no2 }}</strong> ㎍/㎥</li>
      </ul>
    </div>
  </div>
  <p v-else class="empty">대기질 정보를 불러오지 못했습니다.</p>
</template>

<style scoped>
.air-card {
  display: flex;
  gap: 16px;
  align-items: center;
}

.air-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.components {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
}

.empty {
  color: var(--p-text-muted-color);
  font-size: 13px;
}
</style>
