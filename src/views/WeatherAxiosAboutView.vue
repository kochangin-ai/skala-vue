<script setup>
import WeatherAppHeader from '@/components/exercise-axios/WeatherAppHeader.vue'
</script>

<template>
  <div class="weather-app-page">
    <WeatherAppHeader />

    <h2>ℹ️ 서비스 소개</h2>
    <p>
      Weather Store 단계의 대시보드를 기반으로, 가짜(mock) 날씨 데이터를 걷어내고
      <strong>OpenWeatherMap API</strong>의 실시간 데이터로 바꾼 버전입니다.
    </p>
    <ul>
      <li>메인 대시보드는 Current Weather API로 전국 주요 도시의 실시간 기온·습도·풍속을 가져와요</li>
      <li>상세 페이지는 여기에 더해 3시간 간격 예보(5 day / 3 hour Forecast API)를 함께 보여줘요</li>
      <li>상세 페이지에서 대기질 지수(Air Pollution API)와 미세먼지 농도까지 확인할 수 있어요</li>
      <li>계절(여름철/겨울철) 체감온도 공식은 이전 단계 그대로 두되, 이제 실측 기온·습도·풍속으로 계산돼요</li>
      <li>API가 자체적으로 계산해준 체감온도(feels_like)도 나란히 비교해서 보여줘요</li>
    </ul>

    <RouterLink to="/weather-axios" class="back-button">대시보드 홈으로 이동</RouterLink>
  </div>
</template>

<style scoped>
.weather-app-page {
  max-width: 500px;
  margin: 20px auto;
  font-family: sans-serif;
  line-height: 1.6;
}

.back-button {
  display: block;
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  background: #2f6fed;
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
}
</style>
