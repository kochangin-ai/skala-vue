<script setup>
// 작업장 관리 화면들이 공유하는 헤더.
// 같은 Weather UI handson이라 최상단은 공통 WeatherAppHeader를 그대로 쓰고,
// 그 아래 작업장 관리 전용 서브 내비만 한 줄 덧붙인다. (계절 토글은 상단 헤더에 이미 있음)
import { computed } from 'vue'
import Tag from 'primevue/tag'
import WeatherAppHeader from '@/components/exercise-ui/WeatherAppHeader.vue'
import { useFeelsLikeUiStore } from '@/stores/feelsLikeUiStore'

const store = useFeelsLikeUiStore()
const isWinter = computed(() => store.season === 'winter')

const links = [
  { to: '/weather-ui/heat-safety', icon: 'pi pi-building', label: '현장 현황' },
  { to: '/weather-ui/heat-safety/about', icon: 'pi pi-info-circle', label: '단계별 기준' },
]
</script>

<template>
  <div>
    <WeatherAppHeader />
    <nav class="heat-subnav">
      <Tag
        :value="isWinter ? '한랭질환 예방' : '온열질환 예방'"
        :severity="isWinter ? 'info' : 'warn'"
        :icon="isWinter ? 'pi pi-cloud' : 'pi pi-sun'"
      />
      <span class="spacer" />
      <RouterLink v-for="link in links" :key="link.to" :to="link.to" class="heat-nav-link">
        <i :class="link.icon" />
        <span>{{ link.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
.heat-subnav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: -8px 0 16px;
}

.spacer {
  flex: 1;
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
