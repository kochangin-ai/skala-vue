<script setup>
import { computed } from 'vue'
import HeatAppHeader from '@/components/exercise-axios/heat-safety/HeatAppHeader.vue'
import { HEAT_STAGES, COLD_STAGES, getBasicRules } from '@/heat/heatIndex'
import { useFeelsLikeAxiosStore } from '@/stores/feelsLikeAxiosStore'

// 계절(SeasonToggler)에 따라 온열/한랭 단계표와 기본수칙을 바꿔서 보여준다.
const seasonStore = useFeelsLikeAxiosStore()
const isWinter = computed(() => seasonStore.season === 'winter')
const illnessLabel = computed(() => (isWinter.value ? '한랭질환' : '온열질환'))
const formulaLabel = computed(() =>
  isWinter.value ? '기상청 겨울철 체감온도 공식' : '기상청 여름철 체감온도 공식',
)

// '평상'(level 0)을 뺀 위험 단계만, 낮은 단계부터 보여준다
const stages = computed(() => {
  const src = isWinter.value ? COLD_STAGES : HEAT_STAGES
  return [...src].filter((s) => s.level > 0).reverse()
})
const rules = computed(() => getBasicRules(seasonStore.season))

// 온도 기준 표시: 여름은 'N℃ 이상', 겨울은 'N℃ 이하'
const tempText = (stage) =>
  isWinter.value ? `${stage.max}℃ 이하` : `${stage.min}℃ 이상`
</script>

<template>
  <div class="heat-page">
    <HeatAppHeader />

    <h2>ℹ️ {{ illnessLabel }} 체감온도 단계별 기준</h2>
    <p class="lead">
      Weather Axios의 실시간 날씨를 <strong>{{ formulaLabel }}</strong>으로 환산한 뒤,
      고용노동부 {{ illnessLabel }} 예방 가이드의 구간별 조치를 적용합니다.
      상단 <strong>계절변경</strong> 버튼으로 온열/한랭 기준을 전환할 수 있습니다.
    </p>

    <table class="stage-table">
      <thead>
        <tr>
          <th>체감온도</th>
          <th>단계</th>
          <th>조치</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in stages" :key="s.level">
          <td class="th-temp">{{ tempText(s) }}</td>
          <td>
            <span class="dot" :style="{ backgroundColor: s.color }"></span>
            {{ s.label }}
          </td>
          <td>{{ s.guide }}</td>
        </tr>
      </tbody>
    </table>

    <h3>{{ illnessLabel }} 예방 기본수칙</h3>
    <ul class="rules">
      <li v-for="r in rules" :key="r.key">
        <strong>{{ r.icon }} {{ r.label }}</strong> — {{ r.desc }}
      </li>
    </ul>

    <p class="note">
      ※ 체감온도는 관측 기반 추정값으로 기상청 예보값과 차이가 있을 수 있습니다. 실제 작업 중지·휴식
      판단은 현장 온·습도계(WBGT계) 측정값과 사업장 안전보건 규정을 기준으로 하세요.
      겨울철 체감온도는 기온 10℃ 이하, 풍속 1.3m/s 이상일 때만 산출됩니다.
    </p>

    <RouterLink to="/weather-axios/heat-safety" class="back">← 현장 현황으로</RouterLink>
  </div>
</template>

<style scoped>
.heat-page {
  max-width: 500px;
  margin: 20px auto;
  font-family: sans-serif;
  line-height: 1.6;
}

.lead {
  font-size: 14px;
}

.stage-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin: 12px 0;
}

.stage-table th,
.stage-table td {
  border: 1px solid #e0e0e0;
  padding: 8px 10px;
  text-align: left;
  vertical-align: top;
}

.stage-table thead th {
  background: #f5f7fa;
}

.th-temp {
  white-space: nowrap;
  font-weight: bold;
}

.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
}

.rules {
  padding-left: 18px;
  font-size: 13px;
}

.note {
  margin-top: 16px;
  padding: 10px 12px;
  background: #fdf6ec;
  border-radius: 6px;
  font-size: 12px;
  color: #8a6d3b;
}

.back {
  display: block;
  margin-top: 20px;
  padding: 10px;
  border-radius: 8px;
  background: #2f6fed;
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-weight: bold;
}
</style>
