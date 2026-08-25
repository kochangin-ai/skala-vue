# skala-vue

skala vue 연습공간입니다.

## Handson: WeatherMockup

`src/components/practices/basic/handson/WeatherMockup.vue`를 실습하면서 아래 내용을 하나씩 추가했습니다.

- **카드 스타일**: 텍스트만 나열되니 뭘 만들고 있는지 감이 잘 안 와서, Claude의 도움을 받아 예시 화면과 비슷한 느낌으로 초기 화면을 꾸며봤습니다.
- **카드 목록 스크롤 처리**: 도시 데이터를 하나둘 늘렸더니 카드가 길어지면서 맨 아래 상태바가 화면 밖으로 밀려나 안 보이는 문제가 생겼습니다. 전체를 다 보여주기보다 카드 영역만 스크롤되게 바꿔서 해결했습니다.
- **Enter 키 검색 실행**: 처음엔 입력할 때마다 바로 반응하게 했는데, 검색처럼 무거워질 수 있는 동작은 매번 실행할 필요가 없겠다 싶었습니다. 그래서 입력값은 실시간으로 갱신하되, 실제 검색은 Enter를 눌렀을 때만 실행되도록 나눠봤고, 이 과정에서 `.enter` 수식어로 특정 키에만 반응하는 리스너를 연습해봤습니다.
- **날씨 아이콘 이미지**: 날씨 상태가 계속 텍스트로만 보여서 좀 밋밋하다고 느꼈습니다. 상태값에 따라 아이콘 이미지가 자동으로 바뀌면 더 와닿을 것 같아서, 상태 → 이미지 URL을 매핑하는 함수를 만들고 `:src`에 바인딩해봤습니다. 단순 값이 아니라 함수 결과를 동적으로 연결하는 `v-bind` 활용을 연습해본 부분입니다.

## Handson: WeatherComposition

- **즐겨찾기 기능**: 카드마다 별 아이콘을 눌러 즐겨찾기를 토글하는 기능을 추가했습니다.
  - 반응형 상태: 즐겨찾기한 도시 id를 담는 `favoriteCities` ref를 새로 선언
  - computed: `favoriteWeatherList`로 즐겨찾기된 도시 정보만 따로 뽑아 목록 헤더에 즐겨찾기 개수를 보여줌
  - watcher: `favoriteCities`를 `watch`로 감시해서 즐겨찾기 목록이 바뀔 때마다 콘솔 로그를 남기도록 함

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

즐겨찾기 버튼을 눌러도 카드 순서가 그대로였습니다. 원인을 보니 `filteredWeatherList` computed가 `searchQuery`와 `weatherList`만 읽고 있어서, Vue 입장에서는 이 computed가 `favoriteCities`와는 아무 연관이 없는 값이었습니다. computed는 함수 내부에서 실제로 `.value`를 읽은 반응형 변수만 의존성으로 추적하기 때문에, 즐겨찾기 상태가 바뀌어도 재계산이 트리거되지 않았던 것입니다.

해결은 `filteredWeatherList` 내부에서 정렬 로직을 추가하면서, 정렬 기준으로 `favoriteCities.value.includes(...)`를 직접 읽게 만든 것이었습니다. 이 한 줄이 추가되자 computed가 `favoriteCities`도 자동으로 의존성에 포함시켰고, 즐겨찾기를 토글할 때마다 `filteredWeatherList`가 다시 계산되면서 즐겨찾기된 카드가 자연스럽게 맨 위로 정렬됐습니다.
