<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import WeatherAppHeader from '@/components/exercise/WeatherAppHeader.vue'
import { weatherMockData } from '@/mock/weatherMockData'

const route = useRoute()

// 동적 경로(:cityId)로 넘어온 도시 id를 Mount 시점에 Mock Data에서 조회
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
    </div>
    <p v-else class="empty-message">😭 존재하지 않는 도시입니다. (cityId: {{ route.params.cityId }})</p>

    <RouterLink to="/weather-app" class="back-button">← 메인 대시보드로 돌아가기</RouterLink>
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
