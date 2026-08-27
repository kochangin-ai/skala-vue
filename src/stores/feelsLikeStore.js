import { ref } from 'vue'
import { defineStore } from 'pinia'

// 본인 추가 Store: 기상청 체감온도 산출식을 계절별로 계산하는 store
// 실제 날짜 대신 SeasonToggler.vue에서 직접 고른 계절(state)을 기준으로 공식을 바꿔 적용한다.
export const useFeelsLikeStore = defineStore('feelsLike', () => {
  // state: 현재 적용 중인 계절 공식 ('summer' | 'winter')
  const season = ref('summer')

  // action: 계절 전환
  const setSeason = (value) => {
    season.value = value
  }

  // Stull(2011) 근사식: 기온(Ta)과 상대습도(RH%)로 습구온도(Tw) 추정
  const calcWetBulb = (ta, rh) => {
    return (
      ta * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) +
      Math.atan(ta + rh) -
      Math.atan(rh - 1.676331) +
      0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
      4.686035
    )
  }

  // getter(함수형): 도시 하나({temp, humidity, windSpeed})의 체감온도를 현재 season 기준으로 계산
  // 겨울철은 산출 조건(기온 10℃ 이하, 풍속 1.3m/s 이상)을 만족하지 못하면 null 반환
  const calculateFeelsLike = ({ temp, humidity, windSpeed }) => {
    if (season.value === 'summer') {
      const tw = calcWetBulb(temp, humidity)
      const feelsLike =
        -0.2442 + 0.55399 * tw + 0.45535 * temp - 0.0022 * tw ** 2 + 0.00278 * tw * temp + 3.0
      return Math.round(feelsLike * 10) / 10
    }

    if (temp > 10 || windSpeed < 1.3) {
      return null
    }
    const windKmh = windSpeed * 3.6
    const v016 = Math.pow(windKmh, 0.16)
    const feelsLike = 13.12 + 0.6215 * temp - 11.37 * v016 + 0.3965 * v016 * temp
    return Math.round(feelsLike * 10) / 10
  }

  return { season, setSeason, calculateFeelsLike }
})
