<script setup>
// 위험 단계 뱃지 → PrimeVue Tag (색상 severity 로 직관 표시).
import Tag from 'primevue/tag'
import { stageSeverity } from '../stageSeverity'

defineProps({
  stage: {
    type: Object,
    required: true, // { label, sub, level, ... }
  },
})
</script>

<template>
  <Tag
    :value="stage.sub ? `${stage.label} · ${stage.sub}` : stage.label"
    :severity="stageSeverity(stage.level)"
  />
</template>
