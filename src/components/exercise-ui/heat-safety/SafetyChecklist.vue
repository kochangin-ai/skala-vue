<script setup>
// exercise-axios/heat-safety/SafetyChecklist 를 PrimeVue Checkbox + ProgressBar 로. 이모지 제거.
import { computed } from 'vue'
import Checkbox from 'primevue/checkbox'
import ProgressBar from 'primevue/progressbar'
import { getBasicRules } from '@/heat/heatIndex'
import { useWorksiteUiStore } from '@/stores/worksiteUiStore'
import { useFeelsLikeUiStore } from '@/stores/feelsLikeUiStore'

const props = defineProps({
  siteId: {
    type: String,
    required: true,
  },
})

const store = useWorksiteUiStore()
const seasonStore = useFeelsLikeUiStore()
const rules = computed(() => getBasicRules(seasonStore.season))
const checks = computed(() => store.getTodayChecks(props.siteId))
const doneCount = computed(() => rules.value.filter((r) => checks.value[r.key]).length)
const percent = computed(() => Math.round((doneCount.value / rules.value.length) * 100))
</script>

<template>
  <div class="checklist">
    <div class="progress-row">
      <span>오늘 점검 {{ doneCount }}/{{ rules.length }}</span>
      <ProgressBar :value="percent" :show-value="false" style="height: 8px; flex: 1" />
    </div>

    <label
      v-for="rule in rules"
      :key="rule.key"
      class="item"
      :class="{ done: checks[rule.key] }"
    >
      <Checkbox
        :model-value="!!checks[rule.key]"
        binary
        @update:model-value="store.toggleCheck(siteId, rule.key)"
      />
      <span class="text">
        <strong>{{ rule.label }}</strong>
        <span class="desc">{{ rule.desc }}</span>
      </span>
    </label>
  </div>
</template>

<style scoped>
.checklist {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 700;
  color: var(--p-text-muted-color);
}

.item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: var(--p-content-background);
  border: 1px solid var(--p-content-border-color);
  border-radius: 8px;
  cursor: pointer;
}

.item.done {
  border-color: var(--p-primary-color);
}

.text {
  display: flex;
  flex-direction: column;
  font-size: 13px;
}

.text .desc {
  color: var(--p-text-muted-color);
  font-size: 12px;
}
</style>
