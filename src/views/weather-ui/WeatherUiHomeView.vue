<script setup>
// Handson: Weather UI Library — WeatherAxiosHomeView 를 PrimeVue 로 재스킨한 버전.
// 로직/화면 구성은 그대로, 표현만 PrimeVue 컴포넌트 + 계절 배경 테마로 교체하고 이모지를 제거.
import { ref, readonly, computed, watch, watchEffect, provide, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import BaseDashboardCard from '@/components/exercise-ui/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise-ui/SearchBar.vue'
import WeatherCard from '@/components/exercise-ui/WeatherCard.vue'
import StatusBar from '@/components/exercise-ui/StatusBar.vue'
import WeatherAppHeader from '@/components/exercise-ui/WeatherAppHeader.vue'
import { axiosCityList } from '@/mock/axiosCityList'
import { fetchCurrentWeatherList } from '@/api/openWeatherApi'
import { useFavoriteCitiesUi } from '@/composables/useFavoriteCitiesUi'
import { useSeasonTheme } from '@/composables/useSeasonTheme'

useSeasonTheme()

const route = useRoute()
const router = useRouter()

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
    console.error('[WeatherUi] 목록 조회 실패:', error)
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

const { favoriteCities, toggleFavorite } = useFavoriteCitiesUi()
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
  console.log(`[watch] 상태 바 문구 갱신 -> "${newInfo}"`)
})

watchEffect(() => {
  console.log(`[watchEffect] 현재 검색어 '${searchQuery.value}' 기준으로 목록을 필터링합니다.`)
})

watch(favoriteCities, (newList) => {
  console.log(`[watch] 즐겨찾기 목록 변경 -> 총 ${newList.length}곳`)
})

const showDetail = (item) => {
  router.push(`/weather-ui/weather/${item.id}`)
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
  <div class="weather-ui-page weather-ui-surface">
    <WeatherAppHeader />

    <BaseDashboardCard title="도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="updateSearchQuery" @search="handleSearch" />
    </BaseDashboardCard>

    <BaseDashboardCard :title="`실시간 날씨 현황 (즐겨찾기 ${favoriteWeatherList.length}곳)`">
      <div v-if="isLoading" class="loading">
        <ProgressSpinner style="width: 40px; height: 40px" stroke-width="4" />
        <span>OpenWeatherMap에서 실시간 날씨를 불러오는 중...</span>
      </div>

      <Message v-else-if="errorMessage" severity="error" :closable="false">
        {{ errorMessage }}
      </Message>

      <div v-else class="card-scroll">
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :item="item"
          @select-card="selectedCityInfo = `${item.name} 카드를 선택했습니다.`"
          @click-detail="showDetail"
        />

        <Message v-if="filteredWeatherList.length === 0" severity="warn" :closable="false">
          검색 결과와 일치하는 도시가 없습니다.
        </Message>
      </div>
    </BaseDashboardCard>

    <StatusBar :message="selectedCityInfo" />
  </div>
</template>

<style scoped>
.card-scroll {
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;
}

.loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--p-text-muted-color);
  padding: 12px 0;
}
</style>
