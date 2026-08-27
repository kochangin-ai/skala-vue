import { ref } from 'vue'

// Weather UI Library 단계 전용 즐겨찾기 상태 (useFavoriteCitiesAxios 복제).
// 모듈 스코프 ref라 이 단계의 화면들끼리만 공유되고, 이전 단계와는 분리된다.
const favoriteCities = ref([])

export function useFavoriteCitiesUi() {
  const toggleFavorite = (id) => {
    favoriteCities.value = favoriteCities.value.includes(id)
      ? favoriteCities.value.filter((favId) => favId !== id)
      : [...favoriteCities.value, id]
  }

  return { favoriteCities, toggleFavorite }
}
