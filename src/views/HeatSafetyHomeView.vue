<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import HeatAppHeader from '@/components/exercise-axios/heat-safety/HeatAppHeader.vue'
import SiteRiskCard from '@/components/exercise-axios/heat-safety/SiteRiskCard.vue'
import AddWorksiteForm from '@/components/exercise-axios/heat-safety/AddWorksiteForm.vue'
import BaseDashboardCard from '@/components/exercise-axios/BaseDashboardCard.vue'
import { fetchWorksiteWeatherList } from '@/api/openWeatherApi'
import { computeFeelsLike, getThermalStage } from '@/heat/heatIndex'
import { useWorksiteStore } from '@/stores/worksiteStore'
import { useFeelsLikeAxiosStore } from '@/stores/feelsLikeAxiosStore'

// 요구사항 3: Weather Axios 데이터를 그대로 써서 "현장별 온열/한랭질환 위험 현황판"을 만든다.
//  - 기본 현장(주요 도시) + 사용자가 추가한 작업장을 OpenWeatherMap 좌표 조회로 불러옴
//  - 계절(SeasonToggler)에 따라 여름=온열질환 / 겨울=한랭질환 단계표로 위험도 판정 → 위험한 현장 상단 정렬
const router = useRouter()
const store = useWorksiteStore()
const seasonStore = useFeelsLikeAxiosStore()

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
    console.error('[HeatSafety] 현장 조회 실패:', error)
    errorMessage.value = '통신 중 오류가 발생했습니다.'
  } finally {
    isLoading.value = false
  }
}

// 작업장 목록이 바뀌면(추가/삭제) 다시 조회
watch(() => store.allWorksites, (list) => loadAll(list), { immediate: true, deep: true })

// 각 현장에 체감온도/단계를 붙이고 위험도 높은 순으로 정렬
const rankedEntries = computed(() => {
  const withStage = entries.value.map((entry) => {
    const feelsLike = entry.weather ? computeFeelsLike(seasonStore.season, entry.weather) : null
    return { entry, feelsLike, stage: getThermalStage(seasonStore.season, feelsLike) }
  })
  // 1순위: 단계 level 내림차순. 2순위: 여름은 더 더운 곳, 겨울은 더 추운 곳을 위로.
  return withStage.sort((a, b) => {
    if (b.stage.level !== a.stage.level) return b.stage.level - a.stage.level
    const af = a.feelsLike ?? 0
    const bf = b.feelsLike ?? 0
    return isWinter.value ? af - bf : bf - af
  })
})

// 상단 경보 배너: 가장 위험한 현장이 '관심' 이상이면 노출
const topAlert = computed(() => {
  const worst = rankedEntries.value[0]
  return worst && worst.stage.level >= 1 ? worst : null
})

const handleAdd = (payload) => {
  store.addWorksite(payload)
}
const openDetail = (id) => {
  router.push(`/weather-axios/heat-safety/site/${id}`)
}
const handleRemove = (id) => {
  store.removeWorksite(id)
}
</script>

<template>
  <div class="heat-page">
    <HeatAppHeader />

    <div
      v-if="topAlert"
      class="top-alert"
      :style="{ backgroundColor: topAlert.stage.color }"
    >
      ⚠️ 최고 위험 현장: <strong>{{ topAlert.entry.worksite.name }}</strong>
      <template v-if="topAlert.feelsLike !== null">체감 {{ topAlert.feelsLike }}°C </template>
      ({{ topAlert.stage.label }}) — {{ topAlert.stage.guide }}
    </div>

    <BaseDashboardCard :title="`🏗️ 현장별 ${illnessLabel} 위험 현황`">
      <p v-if="isLoading" class="info">⏳ 실시간 날씨로 위험도를 계산하는 중...</p>
      <p v-else-if="errorMessage" class="error">⚠️ {{ errorMessage }}</p>

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

    <BaseDashboardCard title="➕ 작업장 추가">
      <AddWorksiteForm @add="handleAdd" />
      <p class="hint">
        기본 현장(주요 도시)은 삭제할 수 없고, 추가한 작업장과 오늘 점검 기록은 이 브라우저에 저장됩니다.
      </p>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.heat-page {
  max-width: 520px;
  margin: 20px auto;
  font-family: sans-serif;
}

.top-alert {
  color: #fff;
  padding: 12px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
  line-height: 1.5;
}

.info {
  text-align: center;
  color: #2f6fed;
  padding: 10px 0;
}

.error {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}

.hint {
  margin: 10px 0 0;
  font-size: 12px;
  color: #888;
  line-height: 1.5;
}
</style>
