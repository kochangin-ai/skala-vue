import { ref } from 'vue'

// Weather Store 단계의 useFavoriteCities.js를 복제한 Weather Axios 단계 전용 즐겨찾기 상태.
// (단계별 즐겨찾기가 서로 섞이지 않도록 모듈 스코프 ref를 따로 둔다)
const favoriteCities = ref([])

export function useFavoriteCitiesAxios() {
  const toggleFavorite = (id) => {
    favoriteCities.value = favoriteCities.value.includes(id)
      ? favoriteCities.value.filter((favId) => favId !== id)
      : [...favoriteCities.value, id]
  }

  return { favoriteCities, toggleFavorite }
}
