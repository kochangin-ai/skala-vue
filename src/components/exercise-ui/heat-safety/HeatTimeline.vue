<script setup>
// exercise-axios/heat-safety/HeatTimeline 를 PrimeVue Message + 색상 막대로. 이모지 없음.
import { computed } from 'vue'
import Message from 'primevue/message'
import { computeFeelsLike, getThermalStage } from '@/heat/heatIndex'
import { useFeelsLikeUiStore } from '@/stores/feelsLikeUiStore'
import { stageSeverity } from '../stageSeverity'

const props = defineProps({
  forecast: {
    type: Array,
    default: () => [],
  },
})

const store = useFeelsLikeUiStore()

const slots = computed(() =>
  props.forecast.map((slot) => {
    const feelsLike = computeFeelsLike(store.season, slot)
    const [date, time] = slot.time.split(' ')
    return {
      key: slot.time,
      dayLabel: `${Number(date.split('-')[2])}일`,
      hour: Number(time.slice(0, 2)),
      hourLabel: `${time.slice(0, 2)}시`,
      feelsLike,
      stage: getThermalStage(store.season, feelsLike),
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
    <div v-if="alerts.length" class="alerts">
      <Message
        v-for="(a, i) in alerts"
        :key="i"
        :severity="stageSeverity(a.stage.level)"
        :closable="false"
        icon="pi pi-exclamation-triangle"
      >
        <strong>{{ a.dayLabel }} {{ a.startHour }}~{{ a.endHour }}시</strong>
        · {{ a.stage.label }}{{ a.stage.sub ? ` (${a.stage.sub})` : '' }} — {{ a.stage.guide }}
      </Message>
    </div>
    <Message v-else severity="success" :closable="false" icon="pi pi-check-circle">
      향후 예보 구간에 '주의' 이상 시간대는 없습니다.
    </Message>

    <div class="timeline">
      <div v-for="s in slots" :key="s.key" class="slot">
        <span class="t-time">{{ s.dayLabel }} {{ s.hourLabel }}</span>
        <span class="t-bar" :style="{ backgroundColor: s.stage.color }" />
        <span class="t-feels">{{ s.feelsLike === null ? '—' : `${s.feelsLike}°` }}</span>
        <span class="t-stage">{{ s.stage.label }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alerts {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.timeline {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  padding: 12px 0 4px;
}

.slot {
  flex: 0 0 auto;
  width: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 11px;
}

.t-time {
  color: var(--p-text-muted-color);
  white-space: nowrap;
}

.t-bar {
  width: 100%;
  height: 26px;
  border-radius: 4px;
  margin: 4px 0;
}

.t-feels {
  font-weight: 700;
  font-size: 13px;
}

.t-stage {
  color: var(--p-text-muted-color);
}
</style>
