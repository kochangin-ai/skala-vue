<script setup>
// exercise-axios/heat-safety/HeatAppHeader 를 PrimeVue 스타일로. 이모지 대신 아이콘 + Tag.
import { computed } from 'vue'
import Tag from 'primevue/tag'
import SeasonToggler from '../SeasonToggler.vue'
import { useFeelsLikeUiStore } from '@/stores/feelsLikeUiStore'

const store = useFeelsLikeUiStore()
const isWinter = computed(() => store.season === 'winter')

const links = [
  { to: '/weather-ui/heat-safety', icon: 'pi pi-building', label: '현장 현황' },
  { to: '/weather-ui/heat-safety/about', icon: 'pi pi-info-circle', label: '단계별 기준' },
  { to: '/weather-ui', icon: 'pi pi-arrow-left', label: '날씨 대시보드' },
]
</script>

<template>
  <header class="heat-header">
    <div class="heat-header-top">
      <Tag
        :value="isWinter ? '한랭질환 예방' : '온열질환 예방'"
        :severity="isWinter ? 'info' : 'warn'"
        :icon="isWinter ? 'pi pi-cloud' : 'pi pi-sun'"
      />
      <SeasonToggler />
    </div>
    <nav class="heat-nav">
      <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="heat-nav-link">
        <i :class="link.icon" />
        <span>{{ link.label }}</span>
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.heat-header {
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--p-content-border-color);
}

.heat-header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.heat-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.heat-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--p-text-muted-color);
  text-decoration: none;
}

.heat-nav-link:hover {
  background: var(--p-content-hover-background);
}

.heat-nav-link.router-link-exact-active {
  color: var(--p-primary-color);
  background: var(--p-highlight-background);
  font-weight: 700;
}
</style>
