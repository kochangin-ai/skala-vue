<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import WeatherAppHeader from '@/components/exercise-axios/WeatherAppHeader.vue'
import ForecastList from '@/components/exercise-axios/ForecastList.vue'
import AirQualityCard from '@/components/exercise-axios/AirQualityCard.vue'
import { findAxiosCity } from '@/mock/axiosCityList'
import { fetchCurrentWeather, fetchForecast, fetchAirPollution } from '@/api/openWeatherApi'
import { useFeelsLikeAxiosStore } from '@/stores/feelsLikeAxiosStore'

const route = useRoute()
const feelsLikeStore = useFeelsLikeAxiosStore()

// Weather Store 단계 WeatherStoreDetailView와 동일하게 Mount 시점에 cityId로 조회.
// 단, mock 배열 검색 대신 OpenWeatherMap을 호출한다.
//  - 요구사항 1: 실시간 현재 날씨
//  - 요구사항 2: 5일/3시간 예보 + 대기질(Air Pollution)
const city = ref(null)
const forecast = ref([])
const air = ref(null)
const isLoading = ref(false)
const errorMessage = ref('')

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

    // 예보/대기질은 부가 정보라, 하나가 실패해도 상세 화면은 떠야 하므로 개별 try
    const [forecastResult, airResult] = await Promise.allSettled([
      fetchForecast(target),
      fetchAirPollution(current.lat, current.lon),
    ])
    if (forecastResult.status === 'fulfilled') forecast.value = forecastResult.value
    if (airResult.status === 'fulfilled') air.value = airResult.value
  } catch (error) {
    console.error('[WeatherAxios] 상세 조회 실패:', error)
    errorMessage.value = '날씨 데이터를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="weather-app-page">
    <WeatherAppHeader />

    <h2>📊 지역별 상세 기상관측 정보</h2>

    <p v-if="isLoading" class="info-message">⏳ 불러오는 중...</p>
    <p v-else-if="errorMessage" class="empty-message">😭 {{ errorMessage }}</p>

    <template v-else-if="city">
      <div class="detail-card">
        <p>📍 지정 지역: {{ city.region }}</p>
        <p>실시간 기온: {{ city.temp }}°C</p>
        <p>기상 현황: {{ city.status }}</p>
        <p>대기 습도: {{ city.humidity }}%</p>
        <p>현재 풍속: {{ city.windSpeed }}m/s</p>
        <p>OpenWeatherMap 체감 온도: {{ city.feelsLikeApi }}°C</p>
        <p>
          체감 온도({{ feelsLikeStore.season === 'summer' ? '여름철' : '겨울철' }} 공식):
          <strong v-if="feelsLikeStore.calculateFeelsLike(city) !== null">
            {{ feelsLikeStore.calculateFeelsLike(city) }}°C
          </strong>
          <strong v-else>산출 불가 (겨울철 조건 미충족)</strong>
        </p>
      </div>

      <h3>⏱️ 시간대별 예보 (3시간 간격)</h3>
      <ForecastList :forecast="forecast" />

      <h3>🌫️ 대기질 정보</h3>
      <div class="detail-card">
        <AirQualityCard :air="air" />
      </div>
    </template>

    <RouterLink to="/weather-axios" class="back-button">← 메인 대시보드로 돌아가기</RouterLink>
  </div>
</template>

<style scoped>
.weather-app-page {
  max-width: 500px;
  margin: 20px auto;
  font-family: sans-serif;
}

.detail-card {
  background: #f5f7fa;
  border-radius: 10px;
  padding: 16px;
  line-height: 1.8;
  margin-bottom: 12px;
}

h3 {
  margin: 18px 0 8px;
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

.back-button {
  display: block;
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  background: #1c2333;
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
}
</style>
