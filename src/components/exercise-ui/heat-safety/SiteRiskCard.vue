<script setup>
// exercise-axios/heat-safety/SiteRiskCard 를 PrimeVue Card 로. 이모지 없음, 상태는 Tag 색상으로.
import { computed } from 'vue'
import Card from 'primevue/card'
import Button from 'primevue/button'
import HeatStageBadge from './HeatStageBadge.vue'
import { computeFeelsLike, getThermalStage } from '@/heat/heatIndex'
import { useFeelsLikeUiStore } from '@/stores/feelsLikeUiStore'

const props = defineProps({
  entry: {
    type: Object,
    required: true, // { worksite, weather|null }
  },
})
const emit = defineEmits(['open-detail', 'remove'])

const store = useFeelsLikeUiStore()
const weather = computed(() => props.entry.weather)
const isDefault = computed(() => props.entry.worksite.source === 'default')

const feelsLike = computed(() =>
  weather.value ? computeFeelsLike(store.season, weather.value) : null,
)
const stage = computed(() => getThermalStage(store.season, feelsLike.value))
</script>

<template>
  <Card
    class="site-card"
    :style="{ borderInlineStartColor: stage.color }"
    @click="emit('open-detail', entry.worksite.id)"
  >
    <template #title>
      <div class="site-title">
        <span class="name">{{ entry.worksite.name }}</span>
        <HeatStageBadge v-if="weather" :stage="stage" />
        <span v-else class="fail">조회 실패</span>
      </div>
    </template>

    <template v-if="weather" #content>
      <p class="feels">
        <template v-if="feelsLike !== null">체감 <strong>{{ feelsLike }}°C</strong></template>
        <template v-else>체감 <strong>산출 불가</strong></template>
        <span class="sub">
          (기온 {{ weather.temp }}°C · 습도 {{ weather.humidity }}% · 풍속 {{ weather.windSpeed }} m/s)
        </span>
      </p>
      <p class="guide">{{ stage.guide }}</p>
    </template>

    <template #footer>
      <div class="actions">
        <Button
          label="시간대별 위험"
          icon="pi pi-chevron-right"
          icon-pos="right"
          size="small"
          text
          @click.stop="emit('open-detail', entry.worksite.id)"
        />
        <Button
          v-if="!isDefault"
          label="삭제"
          icon="pi pi-trash"
          size="small"
          severity="danger"
          text
          @click.stop="emit('remove', entry.worksite.id)"
        />
      </div>
    </template>
  </Card>
</template>

<style scoped>
.site-card {
  cursor: pointer;
  margin-bottom: 10px;
  border-inline-start: 5px solid var(--p-content-border-color);
}

.site-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.name {
  font-weight: 700;
  flex: 1;
}

.fail {
  font-size: 0.8rem;
  color: var(--p-red-500);
}

.feels {
  margin: 0 0 4px;
}

.feels .sub {
  color: var(--p-text-muted-color);
  font-size: 0.8rem;
  margin-left: 4px;
}

.guide {
  margin: 0;
  font-size: 0.85rem;
  color: var(--p-text-muted-color);
}

.actions {
  display: flex;
  justify-content: space-between;
}
</style>
