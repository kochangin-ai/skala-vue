<script setup>
// HeatSafetyHomeView 를 PrimeVue 로 재스킨. 로직 동일, 이모지 제거, 경보는 Message 로.
import { ref, computed, watch } from 'vue'
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
import { useSeasonTheme } from '@/composables/useSeasonTheme'

useSeasonTheme()

const router = useRouter()
const store = useWorksiteUiStore()
const seasonStore = useFeelsLikeUiStore()

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

const rankedEntries = computed(() => {
  const withStage = entries.value.map((entry) => {
    const feelsLike = entry.weather ? computeFeelsLike(seasonStore.season, entry.weather) : null
    return { entry, feelsLike, stage: getThermalStage(seasonStore.season, feelsLike) }
  })
  return withStage.sort((a, b) => {
    if (b.stage.level !== a.stage.level) return b.stage.level - a.stage.level
    const af = a.feelsLike ?? 0
    const bf = b.feelsLike ?? 0
    return isWinter.value ? af - bf : bf - af
  })
})

const topAlert = computed(() => {
  const worst = rankedEntries.value[0]
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
