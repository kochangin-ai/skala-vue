<script setup>
// HeatSafetyAboutView 를 PrimeVue DataTable + Tag 로 재스킨. 이모지 제거.
import { computed } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Message from 'primevue/message'
import HeatAppHeader from '@/components/exercise-ui/heat-safety/HeatAppHeader.vue'
import { stageSeverity } from '@/components/exercise-ui/stageSeverity'
import { HEAT_STAGES, COLD_STAGES, getBasicRules } from '@/heat/heatIndex'
import { useFeelsLikeUiStore } from '@/stores/feelsLikeUiStore'
import { useSeasonTheme } from '@/composables/useSeasonTheme'

useSeasonTheme()

const seasonStore = useFeelsLikeUiStore()
const isWinter = computed(() => seasonStore.season === 'winter')
const illnessLabel = computed(() => (isWinter.value ? '한랭질환' : '온열질환'))
const formulaLabel = computed(() =>
  isWinter.value ? '기상청 겨울철 체감온도 공식' : '기상청 여름철 체감온도 공식',
)

const stages = computed(() => {
  const src = isWinter.value ? COLD_STAGES : HEAT_STAGES
  return [...src]
    .filter((s) => s.level > 0)
    .reverse()
    .map((s) => ({
      ...s,
      tempText: isWinter.value ? `${s.max}℃ 이하` : `${s.min}℃ 이상`,
    }))
})
const rules = computed(() => getBasicRules(seasonStore.season))
</script>

<template>
  <div class="weather-ui-page weather-ui-surface">
    <HeatAppHeader />

    <h2 class="page-title">{{ illnessLabel }} 체감온도 단계별 기준</h2>
    <p class="lead">
      Weather UI의 실시간 날씨를 <strong>{{ formulaLabel }}</strong>으로 환산한 뒤, 고용노동부
      {{ illnessLabel }} 예방 가이드의 구간별 조치를 적용합니다. 상단 <strong>계절</strong> 토글로
      온열/한랭 기준을 전환할 수 있습니다.
    </p>

    <DataTable :value="stages" size="small" class="stage-table">
      <Column field="tempText" header="체감온도" style="width: 6rem" />
      <Column header="단계" style="width: 8rem">
        <template #body="{ data }">
          <Tag :value="data.label" :severity="stageSeverity(data.level)" />
        </template>
      </Column>
      <Column field="guide" header="조치" />
    </DataTable>

    <h3 class="section-title">{{ illnessLabel }} 예방 기본수칙</h3>
    <ul class="rules">
      <li v-for="r in rules" :key="r.key"><strong>{{ r.label }}</strong> — {{ r.desc }}</li>
    </ul>

    <Message severity="secondary" :closable="false" class="note">
      체감온도는 관측 기반 추정값으로 기상청 예보값과 차이가 있을 수 있습니다. 실제 작업 중지·휴식
      판단은 현장 온·습도계(WBGT계) 측정값과 사업장 안전보건 규정을 기준으로 하세요. 겨울철 체감온도는
      기온 10℃ 이하, 풍속 1.3m/s 이상일 때만 산출됩니다.
    </Message>

    <RouterLink to="/weather-ui/heat-safety" custom v-slot="{ navigate }">
      <Button label="현장 현황으로" icon="pi pi-arrow-left" text @click="navigate" />
    </RouterLink>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 1.2rem;
  margin: 0 0 12px;
}

.section-title {
  font-size: 1rem;
  margin: 20px 0 8px;
}

.lead {
  line-height: 1.6;
  font-size: 0.9rem;
}

.stage-table {
  font-size: 0.85rem;
}

.rules {
  padding-left: 18px;
  font-size: 0.85rem;
  line-height: 1.7;
}

.note {
  margin-top: 16px;
}
</style>
