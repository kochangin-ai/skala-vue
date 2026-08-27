<script setup>
// exercise-axios/WeatherCard 를 PrimeVue Card + Tag 로. 이모지 뱃지 대신 색상 Tag.
import { computed } from 'vue'
import Card from 'primevue/card'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import FavoriteButton from './FavoriteButton.vue'
import { stageSeverity } from './stageSeverity'
import { useFeelsLikeUiStore } from '@/stores/feelsLikeUiStore'
import { getThermalStage } from '@/heat/heatIndex'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['select-card', 'click-detail'])

const store = useFeelsLikeUiStore()
const feelsLike = computed(() => store.calculateFeelsLike(props.item))
const stage = computed(() => getThermalStage(store.season, feelsLike.value))
</script>

<template>
  <Card class="weather-card" @click="emit('select-card', item)">
    <template #title>
      <div class="card-title">
        <img v-if="item.iconUrl" :src="item.iconUrl" :alt="item.status" class="weather-icon" />
        <span class="city">{{ item.name }}</span>
        <span class="status">{{ item.status }}</span>
        <FavoriteButton :id="item.id" class="fav" />
      </div>
    </template>

    <template #content>
      <div class="metrics">
        <span class="temp">{{ item.temp }}<span class="unit">°C</span></span>
        <div class="sub">
          <span>습도 {{ item.humidity }}%</span>
          <span>풍속 {{ item.windSpeed }} m/s</span>
        </div>
      </div>

      <div class="feels-row">
        <Tag :value="stage.label" :severity="stageSeverity(stage.level)" />
        <span class="feels-text">
          {{ store.seasonLabel }} 체감
          <strong>{{ feelsLike === null ? '산출 불가' : `${feelsLike}°C` }}</strong>
          <span class="api"> · API {{ item.feelsLikeApi }}°C</span>
        </span>
      </div>
    </template>

    <template #footer>
      <Button
        label="상세 보기"
        icon="pi pi-chevron-right"
        icon-pos="right"
        size="small"
        text
        @click.stop="emit('click-detail', item)"
      />
    </template>
  </Card>
</template>

<style scoped>
.weather-card {
  cursor: pointer;
  margin-bottom: 10px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
}

.weather-icon {
  width: 34px;
  height: 34px;
  object-fit: contain;
}

.city {
  font-weight: 700;
}

.status {
  color: var(--p-text-muted-color);
  font-size: 0.85rem;
}

.fav {
  margin-left: auto;
}

.metrics {
  display: flex;
  align-items: baseline;
  gap: 14px;
}

.temp {
  font-size: 1.7rem;
  font-weight: 700;
}

.unit {
  font-size: 0.9rem;
  font-weight: 400;
}

.sub {
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
}

.feels-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  font-size: 0.85rem;
}

.feels-text {
  color: var(--p-text-color);
}

.api {
  color: var(--p-text-muted-color);
}
</style>
