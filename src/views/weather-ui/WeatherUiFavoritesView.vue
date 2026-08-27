<script setup>
// WeatherAxiosFavoritesView 를 PrimeVue 로 재스킨. 로직 동일, 이모지 제거.
import { ref, watch } from 'vue'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import WeatherAppHeader from '@/components/exercise-ui/WeatherAppHeader.vue'
import { axiosCityList } from '@/mock/axiosCityList'
import { fetchCurrentWeatherList } from '@/api/openWeatherApi'
import { useFavoriteCitiesUi } from '@/composables/useFavoriteCitiesUi'
import { useSeasonTheme } from '@/composables/useSeasonTheme'

useSeasonTheme()

const { favoriteCities } = useFavoriteCitiesUi()

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
  <div class="weather-ui-page weather-ui-surface">
    <WeatherAppHeader />

    <h2 class="page-title">즐겨찾기한 도시 ({{ favoriteList.length }}곳)</h2>

    <div v-if="isLoading" class="loading">
      <ProgressSpinner style="width: 40px; height: 40px" stroke-width="4" />
      <span>불러오는 중...</span>
    </div>

    <ul v-else-if="favoriteList.length" class="favorite-list">
      <li v-for="item in favoriteList" :key="item.id">
        <RouterLink :to="`/weather-ui/weather/${item.id}`" class="favorite-link">
          <img v-if="item.iconUrl" :src="item.iconUrl" :alt="item.status" class="weather-icon" />
          <span>{{ item.name }} ({{ item.status }}, {{ item.temp }}°C)</span>
          <i class="pi pi-chevron-right" />
        </RouterLink>
      </li>
    </ul>

    <Message v-else severity="secondary" :closable="false" icon="pi pi-star">
      아직 즐겨찾기한 도시가 없습니다. 대시보드에서 별 아이콘을 눌러보세요.
    </Message>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 1.2rem;
  margin: 0 0 12px;
}

.favorite-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.favorite-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;
  text-decoration: none;
  color: var(--p-text-color);
}

.favorite-link span {
  flex: 1;
}

.favorite-link:hover {
  background: var(--p-content-hover-background);
}

.weather-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--p-text-muted-color);
  padding: 12px 0;
}
</style>
