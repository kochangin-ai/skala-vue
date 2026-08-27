<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import WeatherAppHeader from '@/components/exercise-store/WeatherAppHeader.vue'
import { weatherMockData } from '@/mock/weatherMockData'
import { useFeelsLikeStore } from '@/stores/feelsLikeStore'

const route = useRoute()
const feelsLikeStore = useFeelsLikeStore()

// Weather Router의 WeatherDetailView와 동일하게, Mount 시점에 cityId로 Mock Data 조회
const city = ref(null)
onMounted(() => {
  city.value = weatherMockData.find((item) => item.id === route.params.cityId) ?? null
})
</script>

<template>
  <div class="weather-app-page">
    <WeatherAppHeader />

    <h2>📊 지역별 상세 기상관측 정보</h2>

    <div v-if="city" class="detail-card">
      <p>📍 지정 지역: {{ city.region }}</p>
      <p>실시간 기온: {{ city.temp }}°C</p>
      <p>기상 현황: {{ city.status }}</p>
      <p>대기 습도: {{ city.humidity }}%</p>
      <p>현재 풍속: {{ city.windSpeed }}m/s</p>
      <p>
        체감 온도({{ feelsLikeStore.season === 'summer' ? '여름철' : '겨울철' }} 공식):
        <strong v-if="feelsLikeStore.calculateFeelsLike(city) !== null">
          {{ feelsLikeStore.calculateFeelsLike(city) }}°C
        </strong>
        <strong v-else>산출 불가 (겨울철 조건 미충족)</strong>
      </p>
    </div>
    <p v-else class="empty-message">😭 존재하지 않는 도시입니다. (cityId: {{ route.params.cityId }})</p>

    <RouterLink to="/weather-store" class="back-button">← 메인 대시보드로 돌아가기</RouterLink>
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
