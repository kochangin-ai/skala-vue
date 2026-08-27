<script setup>
import { ref, readonly, computed, watch, watchEffect, provide, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseDashboardCard from '@/components/exercise-axios/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise-axios/SearchBar.vue'
import WeatherCard from '@/components/exercise-axios/WeatherCard.vue'
import StatusBar from '@/components/exercise-axios/StatusBar.vue'
import WeatherAppHeader from '@/components/exercise-axios/WeatherAppHeader.vue'
import { axiosCityList } from '@/mock/axiosCityList'
import { fetchCurrentWeatherList } from '@/api/openWeatherApi'
import { useFavoriteCitiesAxios } from '@/composables/useFavoriteCitiesAxios'

const route = useRoute()
const router = useRouter()

// Weather Store 단계 WeatherStoreHomeView와 동일 구조.
// 단, weatherList를 weatherMockData 상수 대신 OpenWeatherMap 실시간 응답으로 채운다. (요구사항 1)
const weatherList = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const loadWeather = async () => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    weatherList.value = await fetchCurrentWeatherList(axiosCityList)
    if (weatherList.value.length === 0) {
      errorMessage.value = '날씨 데이터를 가져오지 못했습니다. API 키(.env)를 확인하세요.'
    }
  } catch (error) {
    console.error('[WeatherAxios] 목록 조회 실패:', error)
    errorMessage.value = '통신 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadWeather)

const searchQuery = ref(typeof route.query.q === 'string' ? route.query.q : '')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

const updateSearchQuery = (value) => {
  searchQuery.value = value
  router.replace({ query: { ...route.query, q: value || undefined } })
}

const { favoriteCities, toggleFavorite } = useFavoriteCitiesAxios()
provide('favoriteCities', readonly(favoriteCities))
provide('toggleFavorite', toggleFavorite)

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  const list = query
    ? weatherList.value.filter((item) => item.name.includes(query))
    : weatherList.value

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

const showDetail = (item) => {
  router.push(`/weather-axios/weather/${item.id}`)
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

      <BaseDashboardCard :title="`🏙️ 실시간 날씨 현황 (즐겨찾기 ${favoriteWeatherList.length}곳)`">
        <p v-if="isLoading" class="info-message">⏳ OpenWeatherMap에서 실시간 날씨를 불러오는 중...</p>
        <p v-else-if="errorMessage" class="error-message">⚠️ {{ errorMessage }}</p>

        <div v-else class="card-scroll">
          <WeatherCard
            v-for="item in filteredWeatherList"
            :key="item.id"
            :item="item"
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
  max-height: 360px;
  overflow-y: auto;
  padding-right: 4px;
}

.info-message {
  text-align: center;
  color: #2f6fed;
  padding: 10px 0;
}

.error-message {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}

.empty-message {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}
</style>
