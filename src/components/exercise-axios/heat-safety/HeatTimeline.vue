<script setup>
import { computed } from 'vue'
import { computeFeelsLike, getThermalStage } from '@/heat/heatIndex'
import { useFeelsLikeAxiosStore } from '@/stores/feelsLikeAxiosStore'

// 요구사항 3: OWM 예보(3시간 간격)의 각 시각을 체감온도로 환산해 위험 단계 타임라인으로 보여준다.
const props = defineProps({
  forecast: {
    type: Array,
    default: () => [],
  },
})

const seasonStore = useFeelsLikeAxiosStore()

const slots = computed(() =>
  props.forecast.map((slot) => {
    const feelsLike = computeFeelsLike(seasonStore.season, slot)
    const [date, time] = slot.time.split(' ')
    return {
      key: slot.time,
      dayLabel: `${Number(date.split('-')[2])}일`,
      hour: Number(time.slice(0, 2)),
      hourLabel: `${time.slice(0, 2)}시`,
      feelsLike,
      stage: getThermalStage(seasonStore.season, feelsLike),
    }
  }),
)

// 연속된 '주의(level>=2) 이상' 구간을 묶어 자동 경고 문구 생성
const alerts = computed(() => {
  const runs = []
  let current = null
  for (const s of slots.value) {
    if (s.stage.level >= 2) {
      if (current && current.dayLabel === s.dayLabel) {
        current.endHour = s.hour + 3
        if (s.stage.level > current.stage.level) current.stage = s.stage
      } else {
        if (current) runs.push(current)
        current = { dayLabel: s.dayLabel, startHour: s.hour, endHour: s.hour + 3, stage: s.stage }
      }
    } else if (current) {
      runs.push(current)
      current = null
    }
  }
  if (current) runs.push(current)
  return runs
})
</script>

<template>
  <div>
    <ul v-if="alerts.length" class="alert-list">
      <li v-for="(a, i) in alerts" :key="i" :style="{ borderColor: a.stage.color }">
        <strong :style="{ color: a.stage.color }">{{ a.dayLabel }} {{ a.startHour }}~{{ a.endHour }}시</strong>
        · {{ a.stage.label }}{{ a.stage.sub ? ` (${a.stage.sub})` : '' }} — {{ a.stage.guide }}
      </li>
    </ul>
    <p v-else class="no-alert">향후 예보 구간에 '주의' 이상 시간대는 없습니다.</p>

    <div class="timeline">
      <div v-for="s in slots" :key="s.key" class="slot">
        <span class="t-time">{{ s.dayLabel }} {{ s.hourLabel }}</span>
        <span class="t-bar" :style="{ backgroundColor: s.stage.color }"></span>
        <span class="t-feels">{{ s.feelsLike === null ? '—' : `${s.feelsLike}°` }}</span>
        <span class="t-stage">{{ s.stage.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert-list {
  list-style: none;
  padding: 0;
  margin: 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.alert-list li {
  padding: 8px 10px;
  border-left: 4px solid #ccc;
  background: #fdf5f4;
  border-radius: 4px;
  font-size: 13px;
  line-height: 1.5;
}

.no-alert {
  margin: 0 0 14px;
  font-size: 13px;
  color: #2e7d32;
}

.timeline {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.slot {
  flex: 0 0 auto;
  width: 62px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 11px;
}

.t-time {
  color: #888;
  white-space: nowrap;
}

.t-bar {
  width: 100%;
  height: 26px;
  border-radius: 4px;
  margin: 4px 0;
}

.t-feels {
  font-weight: bold;
  font-size: 13px;
}

.t-stage {
  color: #666;
}
</style>
