<script setup>
// Weather Store 단계 WeatherAppHeader를 복제, 링크 경로만 /weather-axios/* 로 교체
import SeasonToggler from './SeasonToggler.vue'
</script>

<template>
  <header class="weather-app-header">
    <div class="weather-app-header-row">
      <nav class="weather-app-nav">
        <RouterLink to="/weather-axios">📊 날씨 대시보드</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/weather-axios/favorites">⭐ 즐겨찾기</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/weather-axios/about">ℹ️ 서비스 소개</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/weather-axios/heat-safety">🏗️ 작업장 관리</RouterLink>
        <SeasonToggler />
      </nav>
    </div>
  </header>
</template>

<style scoped>
.weather-app-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.weather-app-header-row {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.weather-app-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.weather-app-nav a {
  color: #666;
  text-decoration: none;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.weather-app-nav a.router-link-exact-active {
  color: #2f6fed;
  border-bottom-color: #2f6fed;
  font-weight: bold;
}

.divider {
  color: #ccc;
}
</style>
