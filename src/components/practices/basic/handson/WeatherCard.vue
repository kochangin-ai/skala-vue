<script setup>
import FavoriteButton from './FavoriteButton.vue'

// 1. 부모(WeatherParent)로부터 표시할 도시 정보와 아이콘 매핑 함수를 props로 전달받음
defineProps({
  item: {
    type: Object,
    required: true,
  },
  getWeatherIcon: {
    type: Function,
    required: true,
  },
})
// 2. 카드 선택/상세보기 동작을 부모에게 emit으로 전달 (즐겨찾기는 FavoriteButton이 조상과 직접 통신)
const emit = defineEmits(['select-card', 'click-detail'])
</script>

<template>
  <div class="weather-card" @click="emit('select-card', item)">
    <h4>
      <img :src="getWeatherIcon(item.status)" :alt="item.status" class="weather-icon" />
      {{ item.name }} ({{ item.status }})
      <FavoriteButton :id="item.id" />
    </h4>
    <p>현재 기온: {{ item.temp }}°C</p>

    <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
    <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

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

.weather-card h4 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 4px;
}

.weather-icon {
  width: 24px;
  height: 24px;
  object-fit: cover;
  border-radius: 4px;
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  color: #fff;
  margin-top: 6px;
}

.badge.hot {
  background: #ff6b6b;
}

.badge.cool {
  background: #4d96ff;
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
