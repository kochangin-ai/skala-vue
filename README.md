# skala-vue

skala vue 연습 공간입니다.

---

## Handson: WeatherMockup

`src/components/practices/basic/handson/WeatherMockup.vue`를 실습하면서 아래 내용을 하나씩 추가했습니다.

- **카드 스타일**: 텍스트만 나열되니 뭘 만들고 있는지 감이 잘 안 왔습니다. Claude의 도움을 받아 예시 화면과 비슷한 느낌으로 초기 화면을 꾸며봤습니다.
- **카드 목록 스크롤 처리**: 도시 데이터를 하나둘 늘렸더니 카드가 길어지면서 맨 아래 상태바가 화면 밖으로 밀려나 안 보이는 문제가 생겼습니다. 전체를 다 보여주기보다 카드 영역만 스크롤되게 바꿔서 해결했습니다.
- **Enter 키 검색 실행**: 처음엔 입력할 때마다 바로 반응하게 했습니다. 그런데 검색처럼 무거워질 수 있는 동작은 매번 실행할 필요가 없겠다 싶었습니다. 그래서 입력값은 실시간으로 갱신하되, 실제 검색은 Enter를 눌렀을 때만 실행되도록 나눠봤습니다. 이 과정에서 `.enter` 수식어로 특정 키에만 반응하는 리스너를 연습해봤습니다.
- **날씨 아이콘 이미지**: 날씨 상태가 계속 텍스트로만 보여서 좀 밋밋하다고 느꼈습니다. 상태값에 따라 아이콘 이미지가 자동으로 바뀌면 더 와닿을 것 같아서, 상태 → 이미지 URL을 매핑하는 함수를 만들고 `:src`에 바인딩해봤습니다. 단순 값이 아니라 함수 결과를 동적으로 연결하는 `v-bind` 활용을 연습해봤습니다.

---

## Handson: WeatherComposition

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

## Handson: WeatherComponent (컴포넌트 분리)

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
