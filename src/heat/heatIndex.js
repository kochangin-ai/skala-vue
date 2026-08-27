// Weather Axios 단계(요구사항 3)에서 쓰는 체감온도 계산 + 온열질환 위험 단계 판정.
//
// 체감온도 계산식 자체는 feelsLikeAxiosStore가 쓰던 기상청(KMA) 공식과 동일한데,
// store에 묶여 있으면 Pinia 없이 못 쓰므로 순수 함수로 분리했다.
// feelsLikeAxiosStore도 이 파일을 import 해서 쓴다 (Weather Axios와 한 몸으로 움직임).

// Stull(2011) 근사식: 기온(Ta)과 상대습도(RH%)로 습구온도(Tw) 추정
export const calcWetBulb = (ta, rh) =>
  ta * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) +
  Math.atan(ta + rh) -
  Math.atan(rh - 1.676331) +
  0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
  4.686035

const round1 = (n) => Math.round(n * 10) / 10

// 기상청 여름철 체감온도(2022.6.2. 개정식): 기온 + 습구온도
export const summerFeelsLike = (ta, rh) => {
  const tw = calcWetBulb(ta, rh)
  const feelsLike =
    -0.2442 + 0.55399 * tw + 0.45535 * ta - 0.0022 * tw ** 2 + 0.00278 * tw * ta + 3.0
  return round1(feelsLike)
}

// 기상청 겨울철 체감온도: 기온 10℃ 이하 & 풍속 1.3m/s 이상일 때만 산출, 아니면 null
export const winterFeelsLike = (ta, windSpeed) => {
  if (ta > 10 || windSpeed < 1.3) return null
  const windKmh = windSpeed * 3.6
  const v016 = Math.pow(windKmh, 0.16)
  const feelsLike = 13.12 + 0.6215 * ta - 11.37 * v016 + 0.3965 * v016 * ta
  return round1(feelsLike)
}

// ────────────────────────────────────────────────────────────
// 온열질환 예방: 체감온도(℃) → 위험 단계
// 고용노동부 온열질환 예방 가이드의 체감온도 구간별 조치를 그대로 코드화.
// 표 문구를 고치고 싶으면 여기 HEAT_STAGES 한 곳만 수정하면 된다.
// ────────────────────────────────────────────────────────────
export const HEAT_STAGES = [
  {
    level: 4,
    label: '위험',
    sub: '폭염경보',
    min: 38,
    color: '#8e44ad',
    guide:
      '매시간 15분씩 휴식하며, 무더위 시간대(14~17시)에는 긴급 작업을 제외한 옥외 작업을 중지합니다.',
  },
  {
    level: 3,
    label: '경고',
    sub: '',
    min: 35,
    color: '#e74c3c',
    guide: '체감온도가 높은 시간대에는 휴식 시간을 늘립니다.',
  },
  {
    level: 2,
    label: '주의',
    sub: '폭염주의보',
    min: 33,
    color: '#e67e22',
    guide: '2시간마다 20분씩 휴식을 제공합니다.',
  },
  {
    level: 1,
    label: '관심',
    sub: '',
    min: 31,
    color: '#f1c40f',
    guide: '작업 시간을 조정하고, 온·습도계를 통해 실시간 체감온도를 관리합니다.',
  },
  {
    level: 0,
    label: '평상',
    sub: '',
    min: -Infinity,
    color: '#2ecc71',
    guide: '특이사항 없음. 평소 기본수칙(물·그늘·휴식)을 유지합니다.',
  },
]

// 체감온도(숫자)를 받아 해당 구간 객체를 반환. null/undefined면 '평상' 취급.
export const getHeatStage = (feelsLike) => {
  if (feelsLike == null || Number.isNaN(feelsLike)) return HEAT_STAGES[HEAT_STAGES.length - 1]
  return HEAT_STAGES.find((stage) => feelsLike >= stage.min)
}

// ────────────────────────────────────────────────────────────
// 한랭질환 예방: 체감온도(℃) → 위험 단계 (겨울철)
// 고용노동부 한파 단계별 조치사항(일상적 관리 / 한파 관심·주의보·경보) 기준.
// ────────────────────────────────────────────────────────────
export const COLD_STAGES = [
  {
    level: 4,
    label: '한파경보',
    sub: '',
    max: -15,
    color: '#8e44ad',
    guide:
      '휴게시간을 추가 배정하고, 민감군·중작업자 작업관리와 핫팩 제공, 2인 1조 관찰, 자율 작업중지 보장을 시행합니다.',
  },
  {
    level: 3,
    label: '한파주의보',
    sub: '',
    max: -12,
    color: '#e74c3c',
    guide:
      '휴게시간을 배정하고 따뜻한 물·환복 장소·온열 휴게장소를 제공하며, 2인 1조로 증상을 관찰하고 자율 작업중지를 보장합니다.',
  },
  {
    level: 2,
    label: '한파관심',
    sub: '',
    max: -6,
    color: '#e67e22',
    guide: '기상정보를 공유하고 추운 시간대에 휴게시간을 배치하며 따뜻한 물을 제공합니다.',
  },
  {
    level: 1,
    label: '일상적 관리',
    sub: '',
    max: 0,
    color: '#f1c40f',
    guide:
      '작업·휴식 배분 계획을 세우고 민감군(고혈압·당뇨 등)을 확인하며, 예방교육·비상연락망·휴게공간을 갖춥니다.',
  },
  {
    level: 0,
    label: '평상',
    sub: '',
    max: Infinity,
    color: '#2ecc71',
    guide: '특이사항 없음. 평소 기본수칙(온수·온열 휴게장소·2인 1조)을 유지합니다.',
  },
]

// 겨울철 체감온도를 받아 한랭 단계 반환. null(산출 조건 미충족)이면 '평상' 취급.
export const getColdStage = (feelsLike) => {
  if (feelsLike == null || Number.isNaN(feelsLike)) return COLD_STAGES[COLD_STAGES.length - 1]
  return COLD_STAGES.find((stage) => feelsLike <= stage.max)
}

// ── 계절 스위치: feelsLikeAxiosStore.season('summer'|'winter')에 따라 온열/한랭 로직 선택 ──
export const computeFeelsLike = (season, { temp, humidity, windSpeed }) =>
  season === 'winter' ? winterFeelsLike(temp, windSpeed) : summerFeelsLike(temp, humidity)

export const getThermalStage = (season, feelsLike) =>
  season === 'winter' ? getColdStage(feelsLike) : getHeatStage(feelsLike)

// 계절별 기본수칙 (체크리스트) - 여름: 물·그늘·휴식 / 겨울: 온수·온열 휴게장소·2인 1조
export const SUMMER_RULES = [
  { key: 'water', icon: '💧', label: '물', desc: '시원하고 깨끗한 물을 규칙적으로 마시기' },
  { key: 'shade', icon: '⛱️', label: '그늘', desc: '그늘지고 바람 잘 통하는 휴식 장소 확보' },
  { key: 'rest', icon: '😮‍💨', label: '휴식', desc: '가장 더운 시간대에는 작업을 줄이고 규칙적으로 쉬기' },
]

export const WINTER_RULES = [
  { key: 'warmwater', icon: '☕', label: '온수', desc: '따뜻하고 깨끗한 물을 규칙적으로 제공' },
  { key: 'shelter', icon: '🔥', label: '온열 휴게장소', desc: '바람을 막은 따뜻한 휴게공간과 환복 장소 확보' },
  { key: 'buddy', icon: '👥', label: '2인 1조', desc: '서로 한랭질환 경고증상을 관찰하고 조치' },
]

// 하위 호환: 기존 import { BASIC_RULES } 를 위해 여름 기본수칙을 그대로 노출
export const BASIC_RULES = SUMMER_RULES

export const getBasicRules = (season) => (season === 'winter' ? WINTER_RULES : SUMMER_RULES)
