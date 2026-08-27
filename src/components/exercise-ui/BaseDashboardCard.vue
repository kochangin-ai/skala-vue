<script setup>
// exercise-axios/BaseDashboardCard 를 PrimeVue Panel 로 교체한 버전.
import Panel from 'primevue/panel'

defineProps({
  title: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <Panel :header="title" class="dashboard-panel">
    <slot />
  </Panel>
</template>

<style scoped>
.dashboard-panel {
  margin-bottom: 16px;
}
</style>
