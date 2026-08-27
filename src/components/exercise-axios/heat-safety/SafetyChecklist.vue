<script setup>
import { computed } from 'vue'
import { getBasicRules } from '@/heat/heatIndex'
import { useWorksiteStore } from '@/stores/worksiteStore'
import { useFeelsLikeAxiosStore } from '@/stores/feelsLikeAxiosStore'

// 계절별 기본수칙(여름: 물·그늘·휴식 / 겨울: 온수·온열 휴게장소·2인 1조) 오늘자 점검 체크리스트.
// 체크 상태는 worksiteStore를 통해 localStorage에 날짜별로 저장된다.
const props = defineProps({
  siteId: {
    type: String,
    required: true,
  },
})

const store = useWorksiteStore()
const seasonStore = useFeelsLikeAxiosStore()
const rules = computed(() => getBasicRules(seasonStore.season))
const checks = computed(() => store.getTodayChecks(props.siteId))
const doneCount = computed(() => rules.value.filter((r) => checks.value[r.key]).length)
</script>

<template>
  <div class="checklist">
    <p class="head">오늘 점검 {{ doneCount }}/{{ rules.length }}</p>
    <label v-for="rule in rules" :key="rule.key" class="item" :class="{ done: checks[rule.key] }">
      <input type="checkbox" :checked="!!checks[rule.key]" @change="store.toggleCheck(siteId, rule.key)" />
      <span class="icon">{{ rule.icon }}</span>
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

.head {
  margin: 0;
  font-size: 13px;
  font-weight: bold;
  color: #555;
}

.item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
}

.item.done {
  background: #eefaf0;
  border-color: #bfe6c8;
}

.item input {
  margin-top: 2px;
}

.icon {
  font-size: 16px;
}

.text {
  display: flex;
  flex-direction: column;
  font-size: 13px;
}

.text .desc {
  color: #777;
  font-size: 12px;
}
</style>
