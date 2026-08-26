<script setup>
defineProps({
  title: {
    type: String,
    default: '날씨 Vue Router 앱',
  },
})
</script>

<template>
  <header class="weather-app-header">
    <h1>🌤️ {{ title }}</h1>
    <nav class="weather-app-nav">
      <RouterLink to="/weather-app">📊 날씨 대시보드</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/weather-app/favorites">⭐ 즐겨찾기</RouterLink>
      <span class="divider">|</span>
      <RouterLink to="/weather-app/about">ℹ️ 서비스 소개</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.weather-app-header {
  text-align: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.weather-app-header h1 {
  font-size: 20px;
  margin: 0 0 12px;
}

.weather-app-nav {
  display: flex;
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
