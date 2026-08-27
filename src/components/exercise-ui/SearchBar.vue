<script setup>
// exercise-axios/SearchBar 를 PrimeVue IconField + InputText 로 교체.
import IconField from 'primevue/iconfield'
import InputIcon from 'primevue/inputicon'
import InputText from 'primevue/inputtext'

defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})
const emit = defineEmits(['update-query', 'search'])
</script>

<template>
  <div class="search-bar">
    <IconField>
      <InputIcon class="pi pi-search" />
      <InputText
        :model-value="searchQuery"
        placeholder="도시 이름 입력 후 Enter"
        fluid
        @update:model-value="emit('update-query', ($event ?? '').trim())"
        @keyup.enter="emit('search')"
      />
    </IconField>
    <small v-if="searchQuery" class="hint">검색 중: <strong>{{ searchQuery }}</strong></small>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.hint {
  color: var(--p-text-muted-color);
}
</style>
