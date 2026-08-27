# skala-vue

skala vue 연습 공간입니다.

---

## Handson: Weather Mockup

`src/components/practices/basic/handson/WeatherMockup.vue`를 실습하면서 아래 내용을 하나씩 추가했습니다.

- **카드 스타일**: 텍스트만 나열되니 뭘 만들고 있는지 감이 잘 안 왔습니다. Claude의 도움을 받아 예시 화면과 비슷한 느낌으로 초기 화면을 꾸며봤습니다.
- **카드 목록 스크롤 처리**: 도시 데이터를 하나둘 늘렸더니 카드가 길어지면서 맨 아래 상태바가 화면 밖으로 밀려나 안 보이는 문제가 생겼습니다. 전체를 다 보여주기보다 카드 영역만 스크롤되게 바꿔서 해결했습니다.
- **Enter 키 검색 실행**: 처음엔 입력할 때마다 바로 반응하게 했습니다. 그런데 검색처럼 무거워질 수 있는 동작은 매번 실행할 필요가 없겠다 싶었습니다. 그래서 입력값은 실시간으로 갱신하되, 실제 검색은 Enter를 눌렀을 때만 실행되도록 나눠봤습니다. 이 과정에서 `.enter` 수식어로 특정 키에만 반응하는 리스너를 연습해봤습니다.
- **날씨 아이콘 이미지**: 날씨 상태가 계속 텍스트로만 보여서 좀 밋밋하다고 느꼈습니다. 상태값에 따라 아이콘 이미지가 자동으로 바뀌면 더 와닿을 것 같아서, 상태 → 이미지 URL을 매핑하는 함수를 만들고 `:src`에 바인딩해봤습니다. 단순 값이 아니라 함수 결과를 동적으로 연결하는 `v-bind` 활용을 연습해봤습니다.

---

## Handson: Weather Composition

`src/components/practices/basic/handson/WeatherComposition.vue`는 WeatherMockup을 기반으로 이어서 만든 컴포넌트입니다. 아래 내용을 하나씩 추가했습니다.

- **즐겨찾기 기능**: 카드마다 별 아이콘을 눌러 즐겨찾기를 토글하는 기능을 추가했습니다.
  - 반응형 상태: 즐겨찾기한 도시 id를 담는 `favoriteCities` ref를 새로 선언했습니다.
  - computed: `favoriteWeatherList`로 즐겨찾기된 도시 정보만 따로 뽑아서 목록 헤더에 즐겨찾기 개수를 보여줍니다.
  - watcher: `favoriteCities`를 `watch`로 감시해서 즐겨찾기 목록이 바뀔 때마다 콘솔 로그를 남기도록 했습니다.

```js
// 반응형 상태: 즐겨찾기한 도시 id 목록
const favoriteCities = ref([])
const toggleFavorite = (id) => {
  favoriteCities.value = favoriteCities.value.includes(id)
    ? favoriteCities.value.filter((favId) => favId !== id)
    : [...favoriteCities.value, id]
}

// computed: 검색 필터링 + 즐겨찾기된 도시를 맨 위로 정렬
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  const list = query
    ? weatherList.value.filter((item) => item.name.includes(query))
    : weatherList.value

  return [...list].sort((a, b) => {
    const aFav = favoriteCities.value.includes(a.id) ? 1 : 0
    const bFav = favoriteCities.value.includes(b.id) ? 1 : 0
    return bFav - aFav
  })
})

// computed: 즐겨찾기된 도시 정보만 모아서 개수/목록으로 가공
const favoriteWeatherList = computed(() =>
  weatherList.value.filter((item) => favoriteCities.value.includes(item.id)),
)

// watcher: 즐겨찾기 목록이 바뀔 때마다 콘솔로 알림
watch(favoriteCities, (newList) => {
  console.log(`⭐ [watch 감지] 즐겨찾기 목록이 변경되었습니다 -> 총 ${newList.length}곳`)
})
```

### 트러블슈팅: 즐겨찾기해도 목록 맨 위로 안 올라가던 문제

즐겨찾기 버튼을 눌러도 카드 순서가 그대로였습니다. 원인을 보니 `filteredWeatherList` computed가 `searchQuery`와 `weatherList`만 읽고 있었습니다. 그래서 Vue 입장에서는 이 computed가 `favoriteCities`와는 아무 연관이 없는 값이었습니다. computed는 함수 내부에서 실제로 `.value`를 읽은 반응형 변수만 의존성으로 추적하기 때문에, 즐겨찾기 상태가 바뀌어도 재계산이 트리거되지 않았던 것입니다.

해결은 `filteredWeatherList` 내부에서 정렬 로직을 추가하면서, 정렬 기준으로 `favoriteCities.value.includes(...)`를 직접 읽게 만든 것이었습니다. 이 한 줄이 추가되자 computed가 `favoriteCities`도 자동으로 의존성에 포함시켰습니다. 그 결과 즐겨찾기를 토글할 때마다 `filteredWeatherList`가 다시 계산되면서 즐겨찾기된 카드가 자연스럽게 맨 위로 정렬됐습니다.

### CSS 분리: 공통/외부 CSS 적용 방법

프로젝트 전체 공통 스타일은 `main.js`에 등록하고, 특정 컴포넌트 전용 스타일은 `<style>` 안에서 `@import`로 가져온다는 방식을 적용해봤습니다. WeatherComposition은 WeatherMockup을 기반으로 이어서 만든 컴포넌트라, 애초에 같은 기반 위에서 출발한 만큼 `<style>` 블록도 공통된 부분이 많았습니다. 그래서 두 컴포넌트가 공유하는 기반 스타일은 `weather-card.css`로 뽑아서 같이 import했습니다. 즐겨찾기처럼 새로 추가한 스타일만 `weather-composition.css`로 따로 뒀습니다. `@import`는 `scoped` 안에서는 효과가 없다는 걸 알게 되어 `scoped`는 지우고 사용했습니다.

---

## Handson: Weather Component

`src/components/practices/basic/handson/WeatherParent.vue`는 WeatherComposition 하나에 몰려있던 코드를 기능 변경 없이 여러 컴포넌트로 쪼갠 버전입니다.

### 요구사항대로 나눈 4개 컴포넌트

- **WeatherParent.vue**: 도시 목록, 검색어, 즐겨찾기 등 모든 반응형 상태와 로직을 그대로 들고 있습니다. 자식 컴포넌트들은 표시와 이벤트 전달만 담당하고, 실제 상태 변경은 전부 여기서 처리합니다.
- **BaseDashboardCard.vue**: 검색박스/리스트박스가 배경, 둥근 모서리, 여백까지 똑같은 디자인을 쓰고 있길래 공통 카드 레이아웃으로 뽑았습니다. `title` prop과 기본 슬롯만 있고, 실제 내용은 slot으로 부모가 채워 넣습니다.
- **SearchBar.vue**: 검색어를 표시만 하고, 입력/엔터가 발생하면 `update-query` / `search` 이벤트로 부모에게 알립니다.
- **WeatherCard.vue**: 도시 하나의 정보를 표시하고, 카드 선택/상세보기 동작을 각각 `select-card` / `click-detail` 이벤트로 부모에게 올려보냅니다. 즐겨찾기는 아래 Provide/Inject 항목처럼 WeatherCard를 거치지 않고 별도로 처리됩니다.

### 요구사항 외에 추가로 나눈 컴포넌트

- **StatusBar.vue**: 하단 상태 문구는 `message` prop 하나만 받아서 보여주는 게 전부라, 가장 단순하게 분리할 수 있는 부분이었습니다.
- **FavoriteButton.vue**: WeatherCard 안에 즐겨찾기 별 버튼 로직이 섞여 있어서, WeatherCard를 더 얇게 만들기 위해 따로 뺐습니다. 아래 Provide/Inject 항목에서 다루듯, 이 컴포넌트는 즐겨찾기 상태를 WeatherCard가 아니라 WeatherParent와 직접 주고받습니다.

### Provide/Inject: 즐겨찾기 상태

처음엔 `getWeatherIcon` 함수를 WeatherParent가 provide하고 WeatherCard가 inject하는 식으로 짜봤는데, 생각해보니 WeatherCard는 slot 내용이라 BaseDashboardCard를 거치지 않고 WeatherParent 스코프에서 바로 컴파일되는 직계 자식이었습니다. 즉 몇 단계를 건너뛰는 상황이 아니라 그냥 props를 대체한 것뿐이라 provide/inject를 억지로 쓴 셈이었습니다.

그래서 진짜로 조상 손자 관계인 지점을 찾아서 옮겼습니다. `FavoriteButton.vue`는 WeatherCard의 진짜 자식(WeatherParent 기준으로는 손자)이라, 여기서 WeatherCard를 건너뛰고 최상위 WeatherParent의 즐겨찾기 상태(`favoriteCities`)와 변경 함수(`toggleFavorite`)를 직접 주입받도록 바꿨습니다. FavoriteButton은 이제 도시 `id`만 prop으로 받고, 즐겨찾기 여부 판단과 토글 요청을 전부 inject한 값으로 직접 처리합니다. 대신 `getWeatherIcon`은 원래대로 WeatherParent → WeatherCard에 평범한 prop으로 내렸습니다.

```js
// WeatherParent.vue
provide('favoriteCities', readonly(favoriteCities))
provide('toggleFavorite', toggleFavorite)
```

```js
// FavoriteButton.vue (WeatherCard를 건너뛰고 WeatherParent에서 바로 주입)
const favoriteCities = inject('favoriteCities')
const toggleFavorite = inject('toggleFavorite')
const isFavorite = computed(() => favoriteCities.value.includes(props.id))
```

### 컴포넌트 간 Props / Emit 흐름

https://mermaid.ai/app/dashboard 를 이용해서 각 컴포넌트 간 흐름도를 작성했습니다.
![WeatherComponent props/emit/provide 흐름도](readmesrc/WeatherComponent.png)

---

## Handson: Weather Router

`/weather-app` 경로 아래에 WeatherComponent를 Vue Router 기반 다중 페이지 구조로 확장한 버전입니다.

라우터 지연 로딩은 원래 `src/router/index.js`에 있던 모든 라우트가 이미 `component: () => import(...)` 형태였어서, 새로 추가한 `/weather-app` 계열 라우트도 그 관례를 그대로 따라 지연 로딩으로 등록했습니다. Catch-all Route는 `/:pathMatch(.*)*` 패턴으로 `NotFoundView.vue`를 연결했고, Vue Router는 routes 배열에 등록된 순서대로 매칭을 시도하기 때문에 이 라우트를 배열 맨 마지막에 둬서 다른 라우트에 안 걸리는 경로만 여기로 떨어지게 했습니다. App.vue의 Navigation Bar와 `<RouterView />`는 이미 처음부터 있던 구조라 손댈 게 없었고, 이번엔 Handson 목록에 "날씨 Vue Router 앱" 링크 하나만 추가해서 진입점을 열어뒀습니다.

WeatherHomeView.vue는 WeatherParent.vue의 반응형 상태와 로직을 거의 그대로 옮겨왔고, 상세보기 버튼을 눌렀을 때 기존의 `window.alert()` 호출을 지우고 `router.push()`로 상세 페이지(`/weather-app/weather/:cityId`)로 이동하도록 바꿨습니다. WeatherDetailView.vue는 `onMounted` 시점에 라우트 파라미터 `route.params.cityId`를 읽어서 `weatherMockData` 배열에서 해당 도시 객체를 찾아 화면에 뿌려주는 식으로 만들었습니다. WeatherAboutView.vue는 이 프로젝트가 어떤 흐름으로 만들어졌는지 소개하는 문구와 "대시보드 홈으로 이동" 버튼을 넣었고, 추가 view로는 즐겨찾기한 도시만 모아 보여주는 WeatherFavoritesView.vue를 만들어서 `/weather-app/favorites`로 라우팅했습니다.

### 트러블 슈팅: 왜 `/`가 아니라 `/weather-app`인지

과제 요구사항 에서는 WeatherHomeView를 `/` 경로에 두라고 되어 있는데, 저는 `/weather-app`에 뒀습니다. 솔직히 말하면 이 프로젝트의 `/` 경로가 지금까지 실습한 모든 Code Challenge/Handson 링크를 모아둔 야매(?) 홈 화면 역할을 하고 있어서, 여기를 WeatherHomeView로 갈아치우면 지금까지 쌓아온 다른 실습 페이지로 가는 진입로가 전부 없어지는 상황이었습니다. 그래서 기존 라우터 구조를 건드리지 않는 선에서 `/weather-app`을 이번 과제만의 새 루트로 잡고, 그 밑에 `/weather-app/about`, `/weather-app/favorites`, `/weather-app/weather/:cityId`를 매달았습니다. Catch-all Route만 앱 전체에 공통으로 걸리는 전역 라우트라 그대로 뒀습니다.

---

## Handson: Weather Store

`/weather-store` 경로 아래에 Pinia로 상태를 관리하는 버전을 새로 만들었습니다. 과제 예시는 단위(°C/°F) 설정을 `configStore.js`로 관리하는 것이었는데, 저는 그 대신 기상청이 실제로 쓰는 체감온도 산출식을 계절별로 계산해주는 Store를 만들어봤습니다. 여름철은 기온+습도, 겨울철은 기온+풍속을 쓰는 완전히 다른 공식이라 계절이 바뀔 때마다 어떤 공식을 쓸지 상태로 들고 있어야 했고, 이게 마침 Pinia store가 하기 딱 좋은 일이라 생각했습니다.

### feelsLikeStore.js: 계절별 체감온도 계산

`season`이라는 state 하나에 `'summer' | 'winter'`를 담아두고, `calculateFeelsLike(city)`가 이 상태를 보고 두 공식 중 하나를 골라 계산합니다. 여름철 공식은 습구온도(Tw)가 먼저 필요한데, 기상자료개방포털 공식에는 상대습도만 주어져 있어서 Stull(2011)의 근사식으로 습구온도부터 구한 다음 체감온도 공식에 넣었습니다. 겨울철 공식은 기온이 10℃를 넘거나 풍속이 1.3m/s보다 느리면 애초에 산출 대상이 아니라서, 조건을 만족 못 하면 `null`을 반환하도록 했습니다. 처음엔 `setSeason(value)`로 두 버튼 중 하나를 고르는 식으로 만들었는데, 과제 예시(configStore의 `toggleUnit`)가 버튼 하나로 두 상태를 스위칭하는 방식이라 그에 맞춰 `toggleSeason()` 하나로 여름철/겨울철을 오가도록 바꿨습니다. 라벨 표시용으로 `unitSymbol`에 대응하는 `seasonLabel` getter도 추가했습니다.

```js
// stores/feelsLikeStore.js
export const useFeelsLikeStore = defineStore('feelsLike', () => {
  const season = ref('summer')
  const seasonLabel = computed(() =>
    season.value === 'summer' ? '☀️ 여름철 공식' : '❄️ 겨울철 공식',
  )
  const toggleSeason = () => {
    season.value = season.value === 'summer' ? 'winter' : 'summer'
  }

  const calculateFeelsLike = ({ temp, humidity, windSpeed }) => {
    if (season.value === 'summer') {
      const tw = calcWetBulb(temp, humidity) // Stull 근사식
      return -0.2442 + 0.55399 * tw + 0.45535 * temp - 0.0022 * tw ** 2 + 0.00278 * tw * temp + 3.0
    }
    if (temp > 10 || windSpeed < 1.3) return null // 겨울철 산출 조건 미충족
    const windKmh = windSpeed * 3.6
    const v016 = Math.pow(windKmh, 0.16)
    return 13.12 + 0.6215 * temp - 11.37 * v016 + 0.3965 * v016 * temp
  }

  return { season, seasonLabel, toggleSeason, calculateFeelsLike }
})
```

### SeasonToggler.vue: Navigation Bar 옆에 배치

`체감 공식: 여름철` 같은 현재 상태 표시 영역과 `계절변경` 버튼을 한 세트로 묶어서, `WeatherAppHeader.vue`의 `<nav>` 안 "ℹ️ 서비스 소개" 바로 뒤에 나란히 넣었습니다. `WeatherAppHeader.vue`는 홈/즐겨찾기/소개/상세 페이지가 전부 공유하는 컴포넌트라, 이 토글도 페이지를 옮겨 다녀도 항상 같은 위치(Navigation Bar 옆)에 떠 있습니다.

```vue
<!-- SeasonToggler.vue -->
<div style="display: inline-flex; align-items: center; gap: 8px">
  <span>체감 공식: <strong>{{ feelsLikeStore.season === 'summer' ? '☀️ 여름철' : '❄️ 겨울철' }}</strong></span>
  <button @click="feelsLikeStore.toggleSeason" class="toggle-btn">계절변경</button>
</div>
```

버튼을 처음엔 "여름철 공식"/"겨울철 공식" 버튼 두 개를 나란히 두고 클릭한 쪽을 활성화하는 식으로 테스트 했었었는데, 과제 예시(UnitToggler.vue: `configStore.toggleUnit`)가 라벨 하나 + 토글 버튼 하나로 상태를 스위칭하는 방식이라 그 구조를 그대로 가져와서 지금 형태로 바꿨습니다.

### 메인/상세에 똑같이 적용

WeatherCard.vue(메인 목록)와 WeatherStoreDetailView.vue(상세 페이지) 둘 다 `useFeelsLikeStore()`로 store를 직접 구독해서 같은 `calculateFeelsLike()`를 그대로 호출합니다. "메인/상세에 적용하면 코드가 중복되니 Composable로 해결 가능하다(범위 제외)"는 참고가 있었는데, 계산 로직 자체를 store 하나에 몰아넣고 나니 두 화면은 그냥 store를 불러다 쓰기만 하면 돼서 자연스럽게 중복이 생기지 않았습니다.

### 트러블슈팅: 습구온도(Tw)를 구할 방법이 없던 문제

여름철 공식은 기온(Ta)과 습구온도(Tw)가 필요한데, mock 데이터에는 기온과 상대습도(RH%)만 있고 습구온도는 없었습니다. 습구온도를 직접 측정하지 않고 기온과 상대습도만으로 근사할 수 있는 계산식이 필요해서, https://calculator.goldsupplier.com/wet-bulb-temperature-calculator/ 에서 Stull(2011) 근사식을 가져와 `calcWetBulb(ta, rh)` 함수로 구현하고, 그 결과를 여름철 체감온도 공식에 그대로 넣었습니다.

### 트러블슈팅: 겨울철을 선택하면 전부 "산출 불가"로 뜨는 문제

처음엔 버그인 줄 알았는데, mock 데이터를 보니 도시 8곳 온도가 전부 19~33℃라 겨울철 공식의 산출 조건(기온 10℃ 이하)을 하나도 만족하지 못하는 게 정상이었습니다. 그래서 조건을 만족하는 겨울 도시(태백, 철원, 봉화)를 mock 데이터에 3곳 더 추가해서, 겨울철 공식으로 전환해도 실제 계산 결과를 확인할 수 있게 했습니다.

---

## Handson: Weather Axios

1. **실제 날씨 데이터 적용** — Weather Store까지 쓰던 가짜 도시 데이터를 걷어내고 OpenWeatherMap 실시간 데이터로 전면 교체했습니다.
2. **OpenWeatherMap API 추가로 기능 확대** — 현재 날씨에 더해 예보 / 대기질 API를 붙였습니다.
3. **체감온도 활용 + 외부 위치 API** — 앱이 계산만 하던 체감온도를 온열질환·한랭질환 정부 예방 가이드에 연결하고, 브라우저 위치 API로 사용자가 자기 현재 위치를 작업장으로 등록해 예방 조치를 확인할 수 있게 했습니다.

### 실제 날씨 데이터 적용 (목업데이터 → API)

지금까지 `weatherMockData` 상수를 그대로 화면에 뿌렸는데, 이번엔 그 자리를 전부 OpenWeatherMap 응답으로 대체했습니다.

- **API 계층 분리**: 코드 챌린지(`AxiosWeather.vue`)에서 연습한 axios 호출을 `api/openWeatherApi.js`로 옮기고, `axios.create()`로 `baseURL` + 공용 파라미터(`appid` / `units=metric` / `lang=kr`)를 물린 인스턴스를 만들어 호출부 중복을 없앴습니다.
- **응답 normalize**: OpenWeatherMap 응답을 이전 단계 화면이 그대로 쓰던 도시 객체(`{ temp, status, humidity, windSpeed, ... }`) 형태로 변환합니다. `temp/humidity/windSpeed` 키를 유지한 덕분에 `feelsLikeAxiosStore.calculateFeelsLike()`(계절별 체감온도)를 한 줄도 안 고치고 재사용했습니다.
- **병렬 조회**: 대시보드는 도시 9곳을 `Promise.allSettled`로 병렬 호출해서, 일부 도시가 실패해도 나머지는 그대로 렌더링합니다. 로딩/에러 상태도 화면에 표시합니다.

### OpenWeatherMap API 추가로 기능 확대

상세 페이지(`/weather-axios/weather/:cityId`)에 현재 날씨 외에 두 개를 더 붙였습니다.

- **5 day / 3 hour Forecast API** (`/data/2.5/forecast`): 3시간 간격 예보를 `ForecastList.vue`에서 가로 스크롤 카드로 표시.
- **Air Pollution API** (`/data/2.5/air_pollution`): 현재 날씨 응답의 위·경도로 대기질 지수(AQI 1~5)와 미세먼지(PM2.5/PM10)·오존·이산화질소 농도를 `AirQualityCard.vue`에 표시.

예보/대기질은 부가 정보라 `Promise.allSettled`로 감싸서 하나가 실패해도 상세 화면은 뜨게 했고, API가 제공하는 체감온도(`main.feels_like`)를 공식으로 계산한 결과와 나란히 비교할 수 있게 뒀습니다.

### 체감온도 활용 — 작업장 관리 (온열/한랭질환 예방)

`/weather-axios/heat-safety`. 이 앱은 계절별 체감온도를 계산만 하고 숫자로 보여주기만 했는데, "이 숫자를 실제로 뭔가에 쓸 수 없나" 해서 고용노동부의 **온열질환·한랭질환 예방 가이드**를 가져왔습니다. 체감온도 구간별로 사업장이 취해야 하는 조치(휴식 주기, 옥외작업 중지 시간대 등)가 표로 정해져 있어서, 그 표를 그대로 코드로 옮기면 "지금 이 현장은 몇 분 쉬어야 한다"까지 자동으로 나옵니다.

- **외부 위치 API로 작업장 등록**: 브라우저 `navigator.geolocation`으로 사용자의 현재 위경도를 받아 "내 작업장"으로 추가합니다. 권한 거부/미지원이면 좌표 직접 입력으로 폴백. 기본 현장(주요 도시 9곳)은 코드에 박아두고, 사용자가 추가한 작업장과 "오늘 기본수칙 점검" 체크 상태는 `stores/worksiteStore.js`(Pinia) + `localStorage`에 영속 저장합니다.
- **좌표 기반 조회 추가**: 사용자 작업장은 도시명(`q`)이 없으므로 `openWeatherApi.js`에 `fetchWorksiteWeather` / `fetchForecastByCoord`(lat/lon 기반)를 추가했습니다.
- **체감온도 계산식 공유**: `feelsLikeAxiosStore`에 묶여 있던 기상청 여름/겨울 공식(습구온도 Stull 근사식 포함)을 `heat/heatIndex.js` 순수 함수로 빼내고 store도 이걸 import 하도록 리팩터링했습니다. 작업장 화면은 Pinia 없이 `computeFeelsLike(season, weather)` / `getThermalStage(season, feelsLike)`만 씁니다.
- **단계 판정 표 (계절별)**: `HEAT_STAGES`(여름: 31 관심 / 33 주의·폭염주의보 / 35 경고 / 38 위험·폭염경보), `COLD_STAGES`(겨울: 0℃ 이하 일상적 관리 / -6 한파관심 / -12 한파주의보 / -15 한파경보). 색상·조치문구를 상수 한 곳에서 관리하고, Weather Axios 대시보드 카드 뱃지(원래 "25도 이상 더움" 고정값)도 이 단계 기준으로 바꿨습니다.
- **현황판 / 상세**: 대시보드는 전 현장을 병렬 조회해 위험 단계 높은 순으로 정렬하고 최고 위험 현장을 상단 배너로 띄웁니다. 상세 페이지는 예보를 시각별 체감온도로 환산한 색상 타임라인 + "N일 14~17시 위험" 자동 문구, 기본수칙 체크리스트, 응급조치 안내(온열/한랭 분기)를 보여줍니다.
- 체감온도는 관측 기반 추정값이라, 실제 작업 중지 판단은 현장 WBGT계·사업장 규정을 따르라는 고지를 소개 페이지에 넣었습니다.

### 트러블슈팅: 겨울철로 바꾸면 전부 "산출 불가"

처음엔 여름철 = 온열질환만 생각하고 만들었습니다. 그런데 헤더의 계절변경 버튼으로 겨울철로 돌려보니 모든 현장이 "산출 불가"로 떴습니다. 겨울철 체감온도 공식은 기온 10℃ 이하 & 풍속 1.3m/s 이상일 때만 산출되는데, 지금(8월) 실제 기온이 그 조건을 하나도 못 넘으니 당연한 결과였습니다. Weather Store 단계에서 mock에 겨울 도시(태백·철원·봉화)를 억지로 넣어 해결했던 것과 같은 상황인데, 이번엔 실시간 데이터라 그럴 수도 없었습니다.

계절만 바뀌고 아무것도 안 보이는 화면은 의미가 없어서, 겨울철에는 아예 **한랭질환 예방 가이드**(`COLD_STAGES` — 일상적 관리 / 한파 관심·주의보·경보)로 판정 로직을 바꾸도록 확장했습니다. `computeFeelsLike` / `getThermalStage` / `getBasicRules`가 계절값 하나로 온열↔한랭의 계산식·기준표·기본수칙·응급조치를 전부 스위칭합니다. 덕분에 여름엔 폭염 단계, 겨울엔 한파 단계로 같은 화면이 그대로 동작합니다.

---

## Handson: Weather UI Libraries

외부 UI Library PrimeVue(테마 프리셋 Aura + PrimeIcons)를 골라, 바로 앞 Weather Axios 단계를 재스킨했습니다.

### 적용한 곳

화면 구성은 유지하면서 표현만 PrimeVue로 바꾸고, 텍스트 옆 이모지를 걷어내 그 의미를 컴포넌트로 옮겼습니다.

| 원래                          | 대체 (PrimeVue)                              |
| ----------------------------- | -------------------------------------------- |
| 카드 / 패널 박스              | `Card`, `Panel`                              |
| 위험 단계 뱃지 (`🔥 더움` 등) | `Tag` — 색상 severity                        |
| 즐겨찾기 `⭐/☆`               | `Button` 아이콘 (`pi-star-fill` / `pi-star`) |
| 로딩 `⏳` / 경보·안내 `⚠️`    | `ProgressSpinner` / `Message`                |
| 계절 토글                     | `SelectButton` (여름철·겨울철)               |
| 도시 검색창                   | `IconField` + `InputText`                    |
| 단계별 기준 표                | `DataTable` + `Column`                       |
| 3대 수칙 체크리스트           | `Checkbox` + `ProgressBar`                   |
| 대기질 지수(AQI)              | `Knob` + `Tag`                               |
| 작업장 좌표 입력 폼           | `InputText` + `Button`                       |
| 네비게이션 이모지             | PrimeIcons (`pi-th-large`, `pi-building` 등) |

### 코드 전후 비교 예시(StatusBar)

`div` + scoped CSS를 PrimeVue `Message` 한 줄로 대체하고 스타일 블록을 통째로 지웠습니다.

```vue
<!-- Before -->
<template>
  <div class="status-bar">{{ message }}</div>
</template>
<style scoped>
.status-bar {
  background: #e6f6e6;
  color: #2e7d32;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
}
</style>
```

```vue
<!-- After -->
<script setup>
import Message from 'primevue/message'
</script>
<template>
  <Message severity="info" :closable="false">{{ message }}</Message>
</template>
```

### 계절별 배경 테마

현재 계절에 따라, `assets/weather-ui.css`가 배경색만 바꿉니다 — 여름 `#fdf4e8`(크림), 겨울 `#eaf1f9`(페일 블루). weather-ui 화면을 벗어나면 `onUnmounted`에서 속성을 지워 다른 화면에는 영향이 없습니다.

### 반응형 레이아웃 정리

화면이 왼쪽으로 쏠려 보이는 문제가 있었습니다. Vite Vue 스타터 기본 CSS(`assets/main.css`)가 `1024px` 이상에서 `#app`을 `grid-template-columns: 1fr 1fr` 2열로 만들고 `body { display: flex }`로 가운데 정렬까지 깨고 있었기 때문입니다(원래 스타터의 2단 환영 화면용). 이 블록을 지우고 `#app`을 `max-width: 1100px` + `margin: 0 auto` + `padding: clamp(16px, 3vw, 32px)`로 바꿔, 모든 페이지가 화면 폭에 맞춰 가운데 정렬되고 여백이 반응형으로 조절되도록 했습니다.

---

## Weather Deployment

### Source Code 품질 관리

1. **ESLint 점검**: `npm run lint`(oxlint + eslint)로 전체를 점검해 Error 0을 유지했습니다.
2. **API 키 환경 변수 분리**: OpenWeatherMap 키는 `.env`의 `VITE_OPENWEATHER_API_KEY`로 두고 `import.meta.env`로 주입합니다. `.gitignore`에 `.env`, `.env.*`(단, `!.env.example` 예외)를 등록해 Git에 올라가지 않도록 했고, `.env.example`만 커밋했습니다.

### Build & Deployment

1. **Build**: `npm run build` → `dist/`에 정적 파일 생성. 로컬에서 `npm run preview`로 프로덕션 빌드의 라우팅·API 동작을 확인했습니다.
2. **Hosting**: **Vercel**에 배포했습니다. GitHub 리포를 연결해 `main` push마다 자동 빌드(`npm run build`) / 배포되며, `dist/`가 정적 파일로 서빙됩니다. SPA(`createWebHistory`)라 모든 경로를 `index.html`로 되돌리는 fallback은 Vercel이 Vite 프로젝트에 자동 적용하고, `VITE_OPENWEATHER_API_KEY`는 Vercel 프로젝트 환경 변수(Production·Preview)로 등록했습니다.

- 배포 URL: <https://skala-vue-two-liart.vercel.app/>
