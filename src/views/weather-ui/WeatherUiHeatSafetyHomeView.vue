<script setup>
// HeatSafetyHomeView 를 PrimeVue 로 재스킨. 로직 동일, 이모지 제거, 경보는 Message 로.
import { ref, readonly, computed, watch, provide } from 'vue'
import { useRouter } from 'vue-router'
import Message from 'primevue/message'
import ProgressSpinner from 'primevue/progressspinner'
import HeatAppHeader from '@/components/exercise-ui/heat-safety/HeatAppHeader.vue'
import SiteRiskCard from '@/components/exercise-ui/heat-safety/SiteRiskCard.vue'
import AddWorksiteForm from '@/components/exercise-ui/heat-safety/AddWorksiteForm.vue'
import BaseDashboardCard from '@/components/exercise-ui/BaseDashboardCard.vue'
import { stageSeverity } from '@/components/exercise-ui/stageSeverity'
import { fetchWorksiteWeatherList } from '@/api/openWeatherApi'
import { computeFeelsLike, getThermalStage } from '@/heat/heatIndex'
import { useWorksiteUiStore } from '@/stores/worksiteUiStore'
import { useFeelsLikeUiStore } from '@/stores/feelsLikeUiStore'
import { useFavoriteCitiesUi } from '@/composables/useFavoriteCitiesUi'
import { useSeasonTheme } from '@/composables/useSeasonTheme'

useSeasonTheme()

const router = useRouter()
const store = useWorksiteUiStore()
const seasonStore = useFeelsLikeUiStore()

// 작업장 관리 탭에서도 즐겨찾기 가능하도록 (SiteRiskCard 안의 FavoriteButton이 inject로 사용)
// 즐겨찾기는 worksite.id 기준으로 저장된다 (도시=default-*, 작업장=user-*)
const { favoriteCities, toggleFavorite } = useFavoriteCitiesUi()
provide('favoriteCities', readonly(favoriteCities))
provide('toggleFavorite', toggleFavorite)

const isWinter = computed(() => seasonStore.season === 'winter')
const illnessLabel = computed(() => (isWinter.value ? '한랭질환' : '온열질환'))

const entries = ref([]) // [{ worksite, weather|null }]
const isLoading = ref(false)
const errorMessage = ref('')

const loadAll = async (worksites) => {
  isLoading.value = true
  errorMessage.value = ''
  try {
    entries.value = await fetchWorksiteWeatherList(worksites)
    if (entries.value.every((e) => e.weather === null)) {
      errorMessage.value = '날씨 데이터를 가져오지 못했습니다. API 키(.env)를 확인하세요.'
    }
  } catch (error) {
    console.error('[WeatherUi/HeatSafety] 현장 조회 실패:', error)
    errorMessage.value = '통신 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

watch(() => store.allWorksites, (list) => loadAll(list), { immediate: true, deep: true })

// 카드 상위노출 순서: 즐겨찾기 된 작업장 → 즐겨찾기 된 도시 → 작업장 → 도시
// (같은 그룹 안에서는 위험 단계 높은 순, 그다음 체감온도 순)
const groupRank = (worksite) => {
  const fav = favoriteCities.value.includes(worksite.id)
  const isWorksite = worksite.source !== 'default' // default-* = 도시, user/geo = 작업장
  if (fav && isWorksite) return 0
  if (fav && !isWorksite) return 1
  if (isWorksite) return 2
  return 3
}

const rankedEntries = computed(() => {
  const withStage = entries.value.map((entry) => {
    const feelsLike = entry.weather ? computeFeelsLike(seasonStore.season, entry.weather) : null
    return { entry, feelsLike, stage: getThermalStage(seasonStore.season, feelsLike) }
  })
  return withStage.sort((a, b) => {
    const ga = groupRank(a.entry.worksite)
    const gb = groupRank(b.entry.worksite)
    if (ga !== gb) return ga - gb
    if (b.stage.level !== a.stage.level) return b.stage.level - a.stage.level
    const af = a.feelsLike ?? 0
    const bf = b.feelsLike ?? 0
    return isWinter.value ? af - bf : bf - af
  })
})

// 최고 위험 배너는 정렬 순서와 무관하게 가장 위험한 현장을 찾는다
const topAlert = computed(() => {
  const worst = rankedEntries.value.reduce(
    (acc, cur) => (acc && acc.stage.level >= cur.stage.level ? acc : cur),
    null,
  )
  return worst && worst.stage.level >= 1 ? worst : null
})

const handleAdd = (payload) => store.addWorksite(payload)
const openDetail = (id) => router.push(`/weather-ui/heat-safety/site/${id}`)
const handleRemove = (id) => store.removeWorksite(id)
</script>

<template>
  <div class="weather-ui-page weather-ui-surface">
    <HeatAppHeader />

    <Message
      v-if="topAlert"
      :severity="stageSeverity(topAlert.stage.level)"
      :closable="false"
      icon="pi pi-exclamation-triangle"
      class="top-alert"
    >
      최고 위험 현장: <strong>{{ topAlert.entry.worksite.name }}</strong>
      <template v-if="topAlert.feelsLike !== null"> · 체감 {{ topAlert.feelsLike }}°C</template>
      ({{ topAlert.stage.label }}) — {{ topAlert.stage.guide }}
    </Message>

    <BaseDashboardCard :title="`현장별 ${illnessLabel} 위험 현황`">
      <div v-if="isLoading" class="loading">
        <ProgressSpinner style="width: 40px; height: 40px" stroke-width="4" />
        <span>실시간 날씨로 위험도를 계산하는 중...</span>
      </div>
      <Message v-else-if="errorMessage" severity="error" :closable="false">{{ errorMessage }}</Message>

      <div v-else>
        <SiteRiskCard
          v-for="{ entry } in rankedEntries"
          :key="entry.worksite.id"
          :entry="entry"
          @open-detail="openDetail"
          @remove="handleRemove"
        />
      </div>
    </BaseDashboardCard>

    <BaseDashboardCard title="작업장 추가">
      <AddWorksiteForm @add="handleAdd" />
      <p class="hint">
        기본 현장(주요 도시)은 삭제할 수 없고, 추가한 작업장과 오늘 점검 기록은 이 브라우저에 저장됩니다.
      </p>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.top-alert {
  margin-bottom: 16px;
}

.loading {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--p-text-muted-color);
  padding: 12px 0;
}

.hint {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--p-text-muted-color);
  line-height: 1.5;
}
</style>
