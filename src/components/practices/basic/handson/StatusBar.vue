<script setup>
// 부모(WeatherParent)로부터 상태 문구를 props로 전달받아 표시
defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="status-bar">
    {{ message }}
  </div>
</template>

<style scoped>
.status-bar {
  background: #e6f6e6;
  color: #2e7d32;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
}
</style>
