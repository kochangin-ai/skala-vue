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
          실시간 날씨(OpenWeatherMap)에서 얻은 기온·습도·풍속을 <strong>기상청 체감온도 공식</strong>으로
          환산하고, 그 값을 고용노동부 예방 가이드 기준에 맞춰 <strong>현장별 온열·한랭질환 위험도</strong>로
          보여주는 작업장 관리 앱입니다.
        </p>

        <h3 class="sub">체감온도 기반 작업장 관리</h3>
        <ul class="feature-list">
          <li>
            계절 토글로 <strong>여름철=온열질환 / 겨울철=한랭질환</strong> 기준을 전환합니다. 여름은
            기온+습도, 겨울은 기온+풍속으로 체감온도를 계산합니다.
          </li>
          <li>
            체감온도 구간별 단계(온열: 관심·주의·경고·위험 / 한랭: 일상적 관리·한파 관심·주의보·경보)와
            그 단계에서 사업장이 취해야 하는 조치(휴식 주기, 옥외작업 중지 시간대 등)를 카드에 표시합니다.
          </li>
          <li>
            기본 현장(주요 도시)에 더해, 브라우저 위치 API로 <strong>내 작업장</strong>을 추가할 수
            있습니다. 카드 정렬은 즐겨찾기 작업장 → 즐겨찾기 도시 → 작업장 → 도시 순이며, 가장 위험한
            현장은 상단 배너로 알립니다.
          </li>
          <li>상세 페이지에서 3시간 간격 예보를 시각별 체감온도로 환산한 위험 타임라인, 예방 기본수칙 점검, 응급조치 안내를 제공합니다.</li>
        </ul>

        <h3 class="sub">날씨 대시보드 &amp; 이 단계의 작업</h3>
        <ul class="feature-list">
          <li>도시별 실시간 날씨(Current Weather), 상세 예보(5 day / 3 hour Forecast), 대기질 지수(Air Pollution) API를 사용합니다.</li>
          <li>Weather Axios 단계를 <strong>PrimeVue</strong>로 재스킨했습니다 — 화면 구성은 유지하고 이모지를 아이콘·색상 Tag로 대체.</li>
          <li>계절 토글에 따라 페이지 배경 테마가 바뀝니다(여름=따뜻한 톤 / 겨울=차가운 톤).</li>
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

.sub {
  font-size: 1rem;
  margin: 18px 0 6px;
}

.feature-list {
  padding-left: 18px;
  line-height: 1.7;
  margin: 0;
}

.back-btn {
  margin-top: 16px;
}
</style>
