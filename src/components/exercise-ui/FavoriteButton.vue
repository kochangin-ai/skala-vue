<script setup>
// exercise-axios/FavoriteButton 를 PrimeVue Button(아이콘) 으로 교체.
// ⭐/☆ 이모지 대신 pi-star-fill / pi-star 아이콘 + 활성 시 warn 색상.
import { computed, inject } from 'vue'
import Button from 'primevue/button'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

const favoriteCities = inject('favoriteCities')
const toggleFavorite = inject('toggleFavorite')
const isFavorite = computed(() => favoriteCities.value.includes(props.id))
</script>

<template>
  <Button
    :icon="isFavorite ? 'pi pi-star-fill' : 'pi pi-star'"
    :severity="isFavorite ? 'warn' : 'secondary'"
    :aria-label="isFavorite ? '즐겨찾기 해제' : '즐겨찾기'"
    text
    rounded
    size="small"
    @click.stop="toggleFavorite(id)"
  />
</template>
