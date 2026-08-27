<script setup>
import { ref, readonly, computed, watch, watchEffect, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise-store/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise-store/SearchBar.vue'
import WeatherCard from '@/components/exercise-store/WeatherCard.vue'
import StatusBar from '@/components/exercise-store/StatusBar.vue'
import WeatherAppHeader from '@/components/exercise-store/WeatherAppHeader.vue'
import { weatherMockData } from '@/mock/weatherMockData'
import { getWeatherIcon } from '@/mock/weatherIconMap'
import { useFavoriteCities } from '@/composables/useFavoriteCities'

const route = useRoute()
const router = useRouter()

// Weather Router의 WeatherHomeView와 동일한 구조 (컴포넌트만 exercise-store/로 분리 복제)
const weatherList = ref(weatherMockData)

const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const updateSearchQuery = (value) => {
  searchQuery.value = value
  router.replace({ query: { ...route.query, q: value || undefined } })
}

const { favoriteCities, toggleFavorite } = useFavoriteCities()
provide('favoriteCities', readonly(favoriteCities))
provide('toggleFavorite', toggleFavorite)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  const list = query ? weatherList.value.filter((item) => item.name.includes(query)) : weatherList.value

  return [...list].sort((a, b) => {
    const aFav = favoriteCities.value.includes(a.id) ? 1 : 0
    const bFav = favoriteCities.value.includes(b.id) ? 1 : 0
    return bFav - aFav
  })
})

const favoriteWeatherList = computed(() =>
  weatherList.value.filter((item) => favoriteCities.value.includes(item.id)),
)

watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

watchEffect(() => {
  console.log(`🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 필터링합니다.`)
})

watch(favoriteCities, (newList) => {
  console.log(`⭐ [watch 감지] 즐겨찾기 목록이 변경되었습니다 -> 총 ${newList.length}곳`)
})

// 상세보기: Pinia 실습용 상세 페이지(/weather-store/weather/:cityId)로 이동
const showDetail = (item) => {
  router.push(`/weather-store/weather/${item.id}`)
}

const handleSearch = () => {
  if (!searchQuery.value) {
    selectedCityInfo.value = '카드를 클릭하거나 검색해 보세요.'
    return
  }
  const matched = weatherList.value.filter((item) => item.name.includes(searchQuery.value))
  selectedCityInfo.value = matched.length
    ? `'${searchQuery.value}' 검색 결과: ${matched.map((item) => item.name).join(', ')}`
    : `'${searchQuery.value}'와(과) 일치하는 도시가 없습니다.`
}
</script>

<template>
  <div class="weather-app-page">
    <WeatherAppHeader />

    <div class="dashboard-wrapper">
      <BaseDashboardCard title="🔍 도시 검색">
        <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" @search="handleSearch" />
      </BaseDashboardCard>

      <BaseDashboardCard :title="`🏙️ 지역별 날씨 현황 (즐겨찾기 ${favoriteWeatherList.length}곳)`">
        <div class="card-scroll">
          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :item="item"
            :get-weather-icon="getWeatherIcon"
            @select-card="selectedCityInfo = `${item.name}이 선택되었습니다.`"
            @click-detail="showDetail"
          />

          <p v-if="filteredWeatherList.length === 0" class="empty-message">
            😭 검색 결과와 일치하는 도시가 없습니다.
          </p>
        </div>
      </BaseDashboardCard>

      <StatusBar :message="selectedCityInfo" />
    </div>
  </div>
</template>

<style scoped>
.weather-app-page {
  max-width: 500px;
  margin: 20px auto;
  font-family: sans-serif;
}

.dashboard-wrapper {
  font-family: sans-serif;
}

.card-scroll {
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.empty-message {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}
</style>
