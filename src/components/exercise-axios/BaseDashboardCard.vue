<script setup>
// 검색박스/리스트박스 공통 레이아웃, 실제 콘텐츠는 부모가 slot으로 주입
defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <section class="dashboard-card">
    <h3>{{ title }}</h3>
    <slot></slot>
  </section>
</template>

<style scoped>
.dashboard-card {
  background: #f5f7fa;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
}
</style>
