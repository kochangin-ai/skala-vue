<script setup>
import WeatherAppHeader from '@/components/exercise-store/WeatherAppHeader.vue'
</script>

<template>
  <div class="weather-app-page">
    <WeatherAppHeader />

    <h2>ℹ️ 서비스 소개</h2>
    <p>
      전국 주요 도시의 실시간 날씨를 한눈에 확인하고, 마음에 드는 도시는 즐겨찾기로 모아볼 수 있는
      날씨 정보 앱입니다.
    </p>
    <ul>
      <li>도시 이름으로 검색해서 원하는 지역의 날씨를 바로 찾을 수 있어요</li>
      <li>카드를 눌러 기온, 습도, 풍속 같은 상세 기상 정보를 확인할 수 있어요</li>
      <li>계절(여름철/겨울철) 공식에 따라 실제 체감온도가 몇 도인지 계산해서 보여줘요</li>
      <li>즐겨찾기한 도시는 언제든 즐겨찾기 탭에서 다시 모아볼 수 있어요</li>
    </ul>

    <RouterLink to="/weather-store" class="back-button">대시보드 홈으로 이동</RouterLink>
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
