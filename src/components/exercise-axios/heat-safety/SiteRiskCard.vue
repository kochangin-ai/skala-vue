<script setup>
import { computed } from 'vue'
import HeatStageBadge from './HeatStageBadge.vue'
import { computeFeelsLike, getThermalStage } from '@/heat/heatIndex'
import { useFeelsLikeAxiosStore } from '@/stores/feelsLikeAxiosStore'

// 부모(HeatSafetyHomeView)로부터 { worksite, weather|null } 한 건을 전달받음
const props = defineProps({
  entry: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['open-detail', 'remove'])

const seasonStore = useFeelsLikeAxiosStore()
const weather = computed(() => props.entry.weather)
const isDefault = computed(() => props.entry.worksite.source === 'default')

// 요구사항 3: 계절(SeasonToggler)에 따라 여름 체감온도→온열 단계 / 겨울 체감온도→한랭 단계
const feelsLike = computed(() =>
  weather.value ? computeFeelsLike(seasonStore.season, weather.value) : null,
)
const stage = computed(() => getThermalStage(seasonStore.season, feelsLike.value))
</script>

<template>
  <div class="site-card" :style="{ borderLeftColor: stage.color }" @click="emit('open-detail', entry.worksite.id)">
    <div class="row">
      <h4>{{ entry.worksite.name }}</h4>
      <HeatStageBadge v-if="weather" :stage="stage" />
      <span v-else class="fail">조회 실패</span>
    </div>

    <template v-if="weather">
      <p class="temps">
        <template v-if="feelsLike !== null">체감 <strong>{{ feelsLike }}°C</strong></template>
        <template v-else>체감 <strong>산출 불가</strong></template>
        <span class="sub">(기온 {{ weather.temp }}°C · 습도 {{ weather.humidity }}% · 풍속 {{ weather.windSpeed }}m/s)</span>
      </p>
      <p class="guide">{{ stage.guide }}</p>
    </template>

    <div class="actions">
      <button class="btn-detail" @click.stop="emit('open-detail', entry.worksite.id)">시간대별 위험 ›</button>
      <button v-if="!isDefault" class="btn-remove" @click.stop="emit('remove', entry.worksite.id)">삭제</button>
    </div>
  </div>
</template>

<style scoped>
.site-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-left: 5px solid #ccc;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 10px;
  cursor: pointer;
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.row h4 {
  margin: 0;
  flex: 1;
}

.fail {
  font-size: 12px;
  color: #e74c3c;
}

.temps {
  margin: 6px 0 2px;
}

.temps strong {
  font-size: 18px;
}

.temps .sub {
  color: #888;
  font-size: 12px;
  margin-left: 4px;
}

.guide {
  margin: 2px 0 8px;
  font-size: 13px;
  color: #555;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-detail {
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}

.btn-remove {
  margin-left: auto;
  padding: 5px 10px;
  border: 1px solid #f5b7b1;
  border-radius: 6px;
  background: #fff;
  color: #c0392b;
  cursor: pointer;
  font-size: 13px;
}
</style>
