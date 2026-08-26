<script setup></script>

<template>
  <div class="not-found-page">
    <div class="not-found-card">
      <p class="not-found-emoji">☀️❓</p>
      <h2>페이지를 찾을 수 없습니다.</h2>
      <p>요청하신 주소가 존재하지 않거나, 아직 개발되지 않았습니다.</p>
      <RouterLink to="/weather-app" class="back-button">날씨 메인으로 이동</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  max-width: 500px;
  margin: 60px auto;
  font-family: sans-serif;
}

.not-found-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 40px 24px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.not-found-emoji {
  font-size: 40px;
  margin: 0 0 8px;
}

.back-button {
  display: inline-block;
  margin-top: 16px;
  padding: 10px 20px;
  border-radius: 8px;
  background: #2f6fed;
  color: #fff;
  text-decoration: none;
  font-weight: bold;
}
</style>
