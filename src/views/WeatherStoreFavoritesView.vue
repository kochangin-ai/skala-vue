<script setup>
import { computed } from 'vue'
import WeatherAppHeader from '@/components/exercise-store/WeatherAppHeader.vue'
import { weatherMockData } from '@/mock/weatherMockData'
import { getWeatherIcon } from '@/mock/weatherIconMap'
import { useFavoriteCities } from '@/composables/useFavoriteCities'

const { favoriteCities } = useFavoriteCities()

const favoriteList = computed(() =>
  weatherMockData.filter((item) => favoriteCities.value.includes(item.id)),
)
</script>

<template>
  <div class="weather-app-page">
    <WeatherAppHeader />

    <h2>⭐ 즐겨찾기한 도시 ({{ favoriteList.length }}곳)</h2>

    <ul v-if="favoriteList.length" class="favorite-list">
      <li v-for="item in favoriteList" :key="item.id">
        <RouterLink :to="`/weather-store/weather/${item.id}`">
          <img :src="getWeatherIcon(item.status)" :alt="item.status" class="weather-icon" />
          {{ item.name }} ({{ item.status }}, {{ item.temp }}°C)
        </RouterLink>
      </li>
    </ul>

    <p v-else class="empty-message">😭 아직 즐겨찾기한 도시가 없습니다. 홈에서 별을 눌러보세요.</p>
  </div>
</template>

<style scoped>
.weather-app-page {
  max-width: 500px;
  margin: 20px auto;
  font-family: sans-serif;
}

.favorite-list {
  list-style: none;
  padding: 0;
}

.favorite-list li {
  margin-bottom: 8px;
}

.favorite-list a {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
}

.weather-icon {
  width: 22px;
  height: 22px;
  object-fit: cover;
  border-radius: 4px;
}

.empty-message {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}
</style>
