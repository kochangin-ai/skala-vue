# skala-vue

skala vue 연습공간입니다.

## Handson: WeatherMockup

`src/components/practices/basic/handson/WeatherMockup.vue`에 실습 중 다음 내용을 추가했습니다.

- **카드 스타일 추가**: `<style scoped>`로 검색창/카드/배지/상태바 디자인을 입혀서 목업처럼 보이게 함
- **카드 목록 스크롤 처리**: `.card-scroll`에 `max-height` + `overflow-y: auto`를 적용해 카드가 한 번에 3개 정도만 보이고 나머지는 스크롤로 확인하도록 함
- **Enter 키 검색 실행**: 검색 input에 `@keyup.enter="handleSearch"`를 추가해, 입력 중엔 값만 갱신하고 Enter를 눌렀을 때만 도시 이름을 필터링해 상태바에 결과를 표시하도록 함 (`.enter` 사용)
- **날씨 아이콘 이미지 적용**: 상태(맑음/비/구름)별 아이콘 URL을 매핑하는 `getWeatherIcon()`을 만들고 `:src`로 바인딩해서, 텍스트 상태 옆에 아이콘 이미지가 함께 보이도록 함 (`v-bind` 사용 )
