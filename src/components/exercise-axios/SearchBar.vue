<script setup>
// 1. 부모(WeatherParent)로부터 검색어를 props로 전달받아 표시
defineProps({
  searchQuery: {
    type: String,
    required: true,
  },
})
// 2. 입력값 변경(update-query), 엔터 검색(search) 시 부모에게 emit으로 알림
const emit = defineEmits(['update-query', 'search'])
</script>

<template>
  <div>
    <input
      type="text"
      :value="searchQuery"
      @input="emit('update-query', $event.target.value.trim())"
      @keyup.enter="emit('search')"
      placeholder="검색할 도시 이름 입력 후 Enter"
    />
    <p>
      검색 중인 도시: <strong>{{ searchQuery }}</strong>
    </p>
  </div>
</template>

<style scoped>
input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
