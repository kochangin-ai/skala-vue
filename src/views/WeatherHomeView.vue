<script setup>
import { ref, readonly, computed, watch, watchEffect, provide } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import StatusBar from '@/components/exercise/StatusBar.vue'
import WeatherAppHeader from '@/components/exercise/WeatherAppHeader.vue'
import { weatherMockData } from '@/mock/weatherMockData'
import { getWeatherIcon } from '@/mock/weatherIconMap'
import { useFavoriteCities } from '@/composables/useFavoriteCities'

const route = useRoute()
const router = useRouter()

// WeatherParent와 동일한 가상의 백엔드 데이터 (여러 뷰가 공유하도록 mock 모듈로 분리)
const weatherList = ref(weatherMockData)

// URL 쿼리 스트링(?q=)에 검색어를 실시간 동기화 -> 새로고침/링크 공유해도 검색 상태 유지
const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const updateSearchQuery = (value) => {
  searchQuery.value = value
  router.replace({ query: { ...route.query, q: value || undefined } })
}

// 즐겨찾기 상태는 composable에서 가져와 라우팅으로 페이지가 바뀌어도 유지되게 함
const { favoriteCities, toggleFavorite } = useFavoriteCities()
// Provide/Inject: WeatherCard를 건너뛰고 손자인 FavoriteButton이 즐겨찾기 상태를 직접 조회/변경하도록 제공
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

// 상세보기: window.alert() 대신 Programmatic Navigation으로 상세 페이지 이동
const showDetail = (item) => {
  router.push(`/weather-app/weather/${item.id}`)
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
