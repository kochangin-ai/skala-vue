import { ref } from 'vue'

// 모듈 스코프 ref: import하는 모든 컴포넌트/뷰가 같은 즐겨찾기 상태를 공유
// (WeatherHomeView -> WeatherDetailView처럼 라우터로 페이지가 바뀌어도 즐겨찾기가 유지됨)
const favoriteCities = ref([])

export function useFavoriteCities() {
  const toggleFavorite = (id) => {
    favoriteCities.value = favoriteCities.value.includes(id)
      ? favoriteCities.value.filter((favId) => favId !== id)
      : [...favoriteCities.value, id]
  }

  return { favoriteCities, toggleFavorite }
}
