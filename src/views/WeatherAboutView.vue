<script setup>
import WeatherAppHeader from '@/components/exercise/WeatherAppHeader.vue'
</script>

<template>
  <div class="weather-app-page">
    <WeatherAppHeader />

    <h2>ℹ️ 서비스 소개</h2>
    <p>
      WeatherComposition에서 시작해 컴포넌트 분리, 그리고 Vue Router 기반 다중 페이지 구조까지
      이어서 실습한 결과물입니다.
    </p>
    <ul>
      <li><code>components/exercise/</code> 폴더의 독립 부품(BaseDashboardCard, SearchBar, WeatherCard, FavoriteButton)을 그대로 재사용</li>
      <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
      <li>URL 쿼리 스트링(<code>?q=</code>)을 활용한 실시간 검색 상태 동기화</li>
    </ul>

    <RouterLink to="/weather-app" class="back-button">대시보드 홈으로 이동</RouterLink>
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
