<script setup>
import { ref, watch } from 'vue'
import WeatherAppHeader from '@/components/exercise-axios/WeatherAppHeader.vue'
import { axiosCityList } from '@/mock/axiosCityList'
import { fetchCurrentWeatherList } from '@/api/openWeatherApi'
import { useFavoriteCitiesAxios } from '@/composables/useFavoriteCitiesAxios'

const { favoriteCities } = useFavoriteCitiesAxios()

// Weather Store 단계 WeatherStoreFavoritesView와 동일 역할.
// 단, 즐겨찾기한 도시의 날씨를 mock에서 읽는 대신 OpenWeatherMap에서 실시간으로 받아온다. (요구사항 1)
const favoriteList = ref([])
const isLoading = ref(false)

watch(
  favoriteCities,
  async (ids) => {
    const targets = axiosCityList.filter((city) => ids.includes(city.id))
    if (targets.length === 0) {
      favoriteList.value = []
      return
    }
    isLoading.value = true
    try {
      favoriteList.value = await fetchCurrentWeatherList(targets)
    } finally {
      isLoading.value = false
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="weather-app-page">
    <WeatherAppHeader />

    <h2>⭐ 즐겨찾기한 도시 ({{ favoriteList.length }}곳)</h2>

    <p v-if="isLoading" class="info-message">⏳ 불러오는 중...</p>

    <ul v-else-if="favoriteList.length" class="favorite-list">
      <li v-for="item in favoriteList" :key="item.id">
        <RouterLink :to="`/weather-axios/weather/${item.id}`">
          <img v-if="item.iconUrl" :src="item.iconUrl" :alt="item.status" class="weather-icon" />
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
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.info-message {
  text-align: center;
  color: #2f6fed;
  padding: 10px 0;
}

.empty-message {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}
</style>
