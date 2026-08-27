<script setup>
// exercise-axios/SeasonToggler 를 PrimeVue SelectButton 으로 교체 (feelsLikeUiStore 사용).
import { computed } from 'vue'
import SelectButton from 'primevue/selectbutton'
import { useFeelsLikeUiStore } from '@/stores/feelsLikeUiStore'

const store = useFeelsLikeUiStore()

const options = [
  { label: '여름철', value: 'summer', icon: 'pi pi-sun' },
  { label: '겨울철', value: 'winter', icon: 'pi pi-cloud' },
]

const season = computed({
  get: () => store.season,
  set: (v) => store.setSeason(v),
})
</script>

<template>
  <SelectButton
    v-model="season"
    :options="options"
    option-label="label"
    option-value="value"
    :allow-empty="false"
    size="small"
    aria-label="계절 선택"
  >
    <template #option="{ option }">
      <i :class="option.icon" style="margin-right: 6px" />
      <span>{{ option.label }}</span>
    </template>
  </SelectButton>
</template>
