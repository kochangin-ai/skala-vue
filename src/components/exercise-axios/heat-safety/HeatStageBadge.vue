<script setup>
// 체감온도 위험 단계(getHeatStage 결과)를 색상 뱃지로 표시
defineProps({
  stage: {
    type: Object,
    required: true, // { label, sub, color, ... }
  },
})
</script>

<template>
  <span class="stage-badge" :style="{ backgroundColor: stage.color }">
    {{ stage.label }}<template v-if="stage.sub"> · {{ stage.sub }}</template>
  </span>
</template>

<style scoped>
.stage-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  white-space: nowrap;
}
</style>
