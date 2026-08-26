<script setup>
import { computed, inject } from 'vue'

// 1. WeatherCard(부모)로부터 도시 id만 props로 전달받음
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

// 2. Provide/Inject: WeatherCard를 건너뛰고 조상(WeatherParent)의 즐겨찾기 상태를 직접 주입받아 사용
const favoriteCities = inject('favoriteCities')
const toggleFavorite = inject('toggleFavorite')
const isFavorite = computed(() => favoriteCities.value.includes(props.id))
</script>

<template>
  <button class="btn-favorite" :class="{ active: isFavorite }" @click.stop="toggleFavorite(id)">
    {{ isFavorite ? '⭐' : '☆' }}
  </button>
</template>

<style scoped>
.btn-favorite {
  margin-left: auto;
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}

.btn-favorite.active {
  filter: drop-shadow(0 0 2px #f1c40f);
}
</style>
