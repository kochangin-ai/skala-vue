<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import HeatAppHeader from '@/components/exercise-axios/heat-safety/HeatAppHeader.vue'
import HeatStageBadge from '@/components/exercise-axios/heat-safety/HeatStageBadge.vue'
import HeatTimeline from '@/components/exercise-axios/heat-safety/HeatTimeline.vue'
import SafetyChecklist from '@/components/exercise-axios/heat-safety/SafetyChecklist.vue'
import { fetchWorksiteWeather, fetchForecastByCoord } from '@/api/openWeatherApi'
import { computeFeelsLike, getThermalStage } from '@/heat/heatIndex'
import { useWorksiteStore } from '@/stores/worksiteStore'
import { useFeelsLikeAxiosStore } from '@/stores/feelsLikeAxiosStore'

// 요구사항 3: 현장 1곳의 지금 위험도 + 시간대별 위험 예보 + 기본수칙 점검
const route = useRoute()
const store = useWorksiteStore()
const seasonStore = useFeelsLikeAxiosStore()

const isWinter = computed(() => seasonStore.season === 'winter')
const worksite = computed(() => store.getWorksite(route.params.siteId))
const weather = ref(null)
const forecast = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const feelsLike = computed(() =>
  weather.value ? computeFeelsLike(seasonStore.season, weather.value) : null,
)
const stage = computed(() => getThermalStage(seasonStore.season, feelsLike.value))

onMounted(async () => {
  if (!worksite.value) {
    errorMessage.value = `등록되지 않은 작업장입니다. (id: ${route.params.siteId})`
    return
  }
  isLoading.value = true
  try {
    weather.value = await fetchWorksiteWeather(worksite.value)
    // 예보는 부가 정보라 실패해도 상세 화면은 뜨도록 별도 처리
    try {
      forecast.value = await fetchForecastByCoord(worksite.value.lat, worksite.value.lon)
    } catch (forecastError) {
      console.warn('[HeatSafety] 예보 조회 실패:', forecastError)
    }
  } catch (error) {
    console.error('[HeatSafety] 상세 조회 실패:', error)
    errorMessage.value = '날씨 데이터를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="heat-page">
    <HeatAppHeader />

    <p v-if="errorMessage" class="empty">😭 {{ errorMessage }}</p>
    <p v-else-if="isLoading" class="info">⏳ 불러오는 중...</p>

    <template v-else-if="worksite">
      <h2>{{ worksite.name }}</h2>

      <section class="now-card" :style="{ borderColor: stage.color }">
        <div class="now-head">
          <span class="now-feels">
            체감 {{ feelsLike === null ? '산출 불가' : `${feelsLike}°C` }}
          </span>
          <HeatStageBadge :stage="stage" />
        </div>
        <p class="now-sub" v-if="weather">
          기온 {{ weather.temp }}°C · 습도 {{ weather.humidity }}% · 풍속 {{ weather.windSpeed }}m/s
        </p>
        <p class="now-guide">{{ stage.guide }}</p>
      </section>

      <h3>⏱️ 시간대별 위험 예보</h3>
      <HeatTimeline :forecast="forecast" />

      <h3>✅ 오늘 기본수칙 점검</h3>
      <SafetyChecklist :site-id="worksite.id" />

      <template v-if="isWinter">
        <h3>🚑 한랭질환 발생 시</h3>
        <ol class="first-aid">
          <li>따뜻한 곳으로 옮기고 젖은 옷을 벗긴 뒤 담요·마른 옷으로 보온합니다.</li>
          <li>의식이 있으면 따뜻한 음료(술·카페인 X)를 천천히 마시게 합니다.</li>
          <li>의식이 없거나 심한 저체온이면 곧바로 <strong>119</strong>에 신고하고, 몸을 거칠게 문지르지 않습니다.</li>
        </ol>
      </template>
      <template v-else>
        <h3>🚑 온열질환 발생 시</h3>
        <ol class="first-aid">
          <li>즉시 시원한 곳으로 옮기고 옷을 느슨하게 합니다.</li>
          <li>물수건·얼음으로 몸을 식히고, 의식이 있으면 물을 마시게 합니다.</li>
          <li>의식이 없거나 증상이 심하면 곧바로 <strong>119</strong>에 신고합니다. (의식 없을 땐 물 억지로 X)</li>
        </ol>
      </template>

      <RouterLink to="/weather-axios/heat-safety" class="back">← 현장 현황으로</RouterLink>
    </template>
  </div>
</template>

<style scoped>
.heat-page {
  max-width: 520px;
  margin: 20px auto;
  font-family: sans-serif;
}

.now-card {
  border: 2px solid #ccc;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 8px;
}

.now-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.now-feels {
  font-size: 22px;
  font-weight: bold;
}

.now-sub {
  margin: 6px 0 4px;
  color: #888;
  font-size: 13px;
}

.now-guide {
  margin: 0;
  font-size: 14px;
  color: #444;
}

h3 {
  margin: 20px 0 8px;
}

.first-aid {
  padding-left: 20px;
  font-size: 13px;
  line-height: 1.7;
  color: #444;
}

.info {
  text-align: center;
  color: #2f6fed;
  padding: 10px 0;
}

.empty {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}

.back {
  display: block;
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  background: #1c2333;
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
}
</style>
