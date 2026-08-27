<script setup>
// WeatherAxiosDetailView 를 PrimeVue 로 재스킨. 로직 동일, 이모지 제거, 계절 배경 테마 적용.
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import Divider from 'primevue/divider'
import WeatherAppHeader from '@/components/exercise-ui/WeatherAppHeader.vue'
import ForecastList from '@/components/exercise-ui/ForecastList.vue'
import AirQualityCard from '@/components/exercise-ui/AirQualityCard.vue'
import { findAxiosCity } from '@/mock/axiosCityList'
import { fetchCurrentWeather, fetchForecast, fetchAirPollution } from '@/api/openWeatherApi'
import { useFeelsLikeUiStore } from '@/stores/feelsLikeUiStore'
import { useSeasonTheme } from '@/composables/useSeasonTheme'

useSeasonTheme()

const route = useRoute()
const feelsLikeStore = useFeelsLikeUiStore()

const city = ref(null)
const forecast = ref([])
const air = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

const feelsLike = computed(() => (city.value ? feelsLikeStore.calculateFeelsLike(city.value) : null))

onMounted(async () => {
  const target = findAxiosCity(route.params.cityId)
  if (!target) {
    errorMessage.value = `존재하지 않는 도시입니다. (cityId: ${route.params.cityId})`
    return
  }

  isLoading.value = true
  try {
    const current = await fetchCurrentWeather(target)
    city.value = current

    const [forecastResult, airResult] = await Promise.allSettled([
      fetchForecast(target),
      fetchAirPollution(current.lat, current.lon),
    ])
    if (forecastResult.status === 'fulfilled') forecast.value = forecastResult.value
    if (airResult.status === 'fulfilled') air.value = airResult.value
  } catch (error) {
    console.error('[WeatherUi] 상세 조회 실패:', error)
    errorMessage.value = '날씨 데이터를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="weather-ui-page weather-ui-surface">
    <WeatherAppHeader />

    <h2 class="page-title">지역별 상세 기상관측 정보</h2>

    <div v-if="isLoading" class="loading">
      <ProgressSpinner style="width: 40px; height: 40px" stroke-width="4" />
      <span>불러오는 중...</span>
    </div>
    <Message v-else-if="errorMessage" severity="error" :closable="false">{{ errorMessage }}</Message>

    <template v-else-if="city">
      <Card class="detail-card">
        <template #content>
          <dl class="detail-grid">
            <div><dt>지정 지역</dt><dd>{{ city.region }}</dd></div>
            <div><dt>실시간 기온</dt><dd>{{ city.temp }}°C</dd></div>
            <div><dt>기상 현황</dt><dd>{{ city.status }}</dd></div>
            <div><dt>대기 습도</dt><dd>{{ city.humidity }}%</dd></div>
            <div><dt>현재 풍속</dt><dd>{{ city.windSpeed }} m/s</dd></div>
            <div><dt>OpenWeatherMap 체감</dt><dd>{{ city.feelsLikeApi }}°C</dd></div>
            <div>
              <dt>{{ feelsLikeStore.seasonLabel }} 공식 체감</dt>
              <dd>
                <strong v-if="feelsLike !== null">{{ feelsLike }}°C</strong>
                <span v-else>산출 불가 (겨울철 조건 미충족)</span>
              </dd>
            </div>
          </dl>
        </template>
      </Card>

      <Divider />
      <h3 class="section-title">시간대별 예보 (3시간 간격)</h3>
      <ForecastList :forecast="forecast" />

      <Divider />
      <h3 class="section-title">대기질 정보</h3>
      <Card class="detail-card">
        <template #content>
          <AirQualityCard :air="air" />
        </template>
      </Card>
    </template>

    <RouterLink to="/weather-ui" custom v-slot="{ navigate }">
      <Button label="메인 대시보드로 돌아가기" icon="pi pi-arrow-left" text @click="navigate" />
    </RouterLink>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 1.2rem;
  margin: 0 0 12px;
}

.section-title {
  font-size: 1rem;
  margin: 0 0 8px;
}

.detail-card {
  margin-bottom: 8px;
}

.detail-grid {
  margin: 0;
  display: grid;
  gap: 8px;
}

.detail-grid > div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.detail-grid dt {
  color: var(--p-text-muted-color);
}

.detail-grid dd {
  margin: 0;
  font-weight: 600;
  text-align: right;
}

.loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--p-text-muted-color);
  padding: 12px 0;
}
</style>
