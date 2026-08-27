import { watch, onMounted, onUnmounted } from 'vue'
import { useFeelsLikeUiStore } from '@/stores/feelsLikeUiStore'

// Weather UI Library 단계: 현재 계절(feelsLikeUiStore.season)을 <body>의 data 속성으로 노출한다.
// assets/weather-ui.css 가 이 속성을 보고 여름/겨울 배경색을 바꾼다.
// 컴포넌트가 언마운트되면 속성을 지워서 weather-ui 밖 화면에는 배경 테마가 남지 않게 한다.
export function useSeasonTheme() {
  const store = useFeelsLikeUiStore()
  const apply = () => {
    document.body.dataset.weatherUiSeason = store.season
  }

  onMounted(apply)
  watch(() => store.season, apply)
  onUnmounted(() => {
    delete document.body.dataset.weatherUiSeason
  })
}
