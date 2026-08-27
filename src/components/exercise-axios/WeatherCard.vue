<script setup>
// Weather Store 단계 WeatherCard를 복제.
// 변경점: 아이콘을 status->이미지 매핑 함수 대신 API가 준 iconUrl로 직접 표시하고,
//         API가 계산해준 체감온도(feelsLikeApi)도 함께 보여준다.
import { computed } from 'vue'
import FavoriteButton from './FavoriteButton.vue'
import { useFeelsLikeAxiosStore } from '@/stores/feelsLikeAxiosStore'
import { getThermalStage } from '@/heat/heatIndex'

// 부모(WeatherAxiosHomeView)로부터 표시할 도시 정보를 props로 전달받음
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})
// 카드 선택/상세보기 동작을 부모에게 emit으로 전달 (즐겨찾기는 FavoriteButton이 조상과 직접 통신)
const emit = defineEmits(['select-card', 'click-detail'])

// feelsLikeAxiosStore를 직접 구독해서 계절별 체감온도 표시 (SeasonToggler로 바뀐 계절이 바로 반영됨)
const feelsLikeStore = useFeelsLikeAxiosStore()

// 뱃지도 고정 25℃가 아니라 체감온도 → 온열/한랭 단계 기준으로 표시
const feelsLike = computed(() => feelsLikeStore.calculateFeelsLike(props.item))
const stage = computed(() => getThermalStage(feelsLikeStore.season, feelsLike.value))
</script>

<template>
  <div class="weather-card" @click="emit('select-card', item)">
    <h4>
      <img v-if="item.iconUrl" :src="item.iconUrl" :alt="item.status" class="weather-icon" />
      {{ item.name }} ({{ item.status }})
      <FavoriteButton :id="item.id" />
    </h4>
    <p>현재 기온: {{ item.temp }}°C</p>
    <p class="sub">습도 {{ item.humidity }}% · 풍속 {{ item.windSpeed }}m/s</p>
    <p class="feels-like">
      체감({{ feelsLikeStore.season === 'summer' ? '여름철' : '겨울철' }} 공식):
      <span v-if="feelsLikeStore.calculateFeelsLike(item) !== null">
        {{ feelsLikeStore.calculateFeelsLike(item) }}°C
      </span>
      <span v-else>산출 불가 (겨울철 조건 미충족)</span>
      <span class="api-feels">· API 체감 {{ item.feelsLikeApi }}°C</span>
    </p>

    <span class="badge" :style="{ backgroundColor: stage.color }">
      {{ feelsLikeStore.season === 'summer' ? '🔥' : '🥶' }}
      {{ stage.label }}<template v-if="stage.sub"> · {{ stage.sub }}</template>
    </span>

    <button class="btn-detail" @click.stop="emit('click-detail', item)">상세보기</button>
  </div>
</template>

<style scoped>
.weather-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 10px;
  cursor: pointer;
}

.feels-like {
  color: #666;
  font-size: 13px;
}

.sub {
  color: #888;
  font-size: 13px;
  margin: 2px 0;
}

.api-feels {
  color: #999;
}

.weather-card h4 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 4px;
}

.weather-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: bold;
  color: #fff;
  margin-top: 6px;
}

.btn-detail {
  float: right;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}
</style>
