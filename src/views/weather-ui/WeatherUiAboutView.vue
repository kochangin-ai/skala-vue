<script setup>
// WeatherAxiosAboutView 를 PrimeVue 로 재스킨. 이모지 제거, 계절 배경 테마 적용.
import Card from 'primevue/card'
import Button from 'primevue/button'
import WeatherAppHeader from '@/components/exercise-ui/WeatherAppHeader.vue'
import { useSeasonTheme } from '@/composables/useSeasonTheme'

useSeasonTheme()
</script>

<template>
  <div class="weather-ui-page weather-ui-surface">
    <WeatherAppHeader />

    <h2 class="page-title">서비스 소개</h2>

    <Card>
      <template #content>
        <p class="lead">
          Weather Axios 단계의 대시보드를 <strong>PrimeVue</strong>로 재스킨한 버전입니다. 화면 구성은
          그대로 두고 표현만 UI 라이브러리 컴포넌트로 바꾸고, 이모지는 아이콘·색상 Tag로 대체했습니다.
        </p>
        <ul class="feature-list">
          <li>메인 대시보드는 Current Weather API로 주요 도시의 실시간 기온·습도·풍속을 가져옵니다</li>
          <li>상세 페이지는 3시간 간격 예보(5 day / 3 hour Forecast API)를 함께 보여줍니다</li>
          <li>상세 페이지에서 대기질 지수(Air Pollution API)와 미세먼지 농도를 확인할 수 있습니다</li>
          <li>계절(여름철/겨울철) 체감온도 공식은 그대로, 실측 기온·습도·풍속으로 계산됩니다</li>
          <li>계절 토글에 따라 페이지 배경 테마(여름=따뜻한 톤 / 겨울=차가운 톤)가 바뀝니다</li>
        </ul>
      </template>
    </Card>

    <RouterLink to="/weather-ui" custom v-slot="{ navigate }">
      <Button label="대시보드 홈으로 이동" icon="pi pi-home" class="back-btn" @click="navigate" />
    </RouterLink>
  </div>
</template>

<style scoped>
.page-title {
  font-size: 1.2rem;
  margin: 0 0 12px;
}

.lead {
  margin-top: 0;
  line-height: 1.6;
}

.feature-list {
  padding-left: 18px;
  line-height: 1.7;
}

.back-btn {
  margin-top: 16px;
}
</style>
