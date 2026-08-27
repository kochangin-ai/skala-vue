<script setup>
// exercise-axios/WeatherAppHeader 를 PrimeVue 스타일로. 이모지 대신 PrimeIcons.
import SeasonToggler from './SeasonToggler.vue'

const links = [
  { to: '/weather-ui', icon: 'pi pi-th-large', label: '날씨 대시보드' },
  { to: '/weather-ui/favorites', icon: 'pi pi-star', label: '즐겨찾기' },
  { to: '/weather-ui/about', icon: 'pi pi-info-circle', label: '서비스 소개' },
  { to: '/weather-ui/heat-safety', icon: 'pi pi-building', label: '작업장 관리' },
]
</script>

<template>
  <header class="wui-header">
    <nav class="wui-nav">
      <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="wui-nav-link">
        <i :class="link.icon" />
        <span>{{ link.label }}</span>
      </RouterLink>
    </nav>
    <SeasonToggler />
  </header>
</template>

<style scoped>
.wui-header {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 14px;
  border-bottom: 1px solid var(--p-content-border-color);
}

.wui-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.wui-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--p-text-muted-color);
  text-decoration: none;
}

.wui-nav-link:hover {
  background: var(--p-content-hover-background);
}

.wui-nav-link.router-link-exact-active {
  color: var(--p-primary-color);
  background: var(--p-highlight-background);
  font-weight: 700;
}
</style>
