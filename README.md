# skala-vue

skala vue 연습공간입니다.

## Handson: WeatherMockup

`src/components/practices/basic/handson/WeatherMockup.vue`에 실습 중 다음 내용을 추가했습니다.

- **카드 스타일 추가**: Claude의 도움을 받아 예시 화면과 비슷하게 초기 화면을 구성함
- **카드 목록 스크롤 처리**: 데이터를 추가하면서 상태바가 안 보이는 문제가 발생해서 스크롤 형식으로 바꿈
- **Enter 키 검색 실행**: 입력은 실시간 반영하되 검색 실행은 Enter를 눌렀을 때만 하도록 분리해, `.enter` 수식어로 특정 키에만 반응하는 리스너를 적용해보는 연습
- **날씨 아이콘 이미지 적용**: 상태 텍스트를 `:src` 동적 바인딩과 연결해, 함수 리턴값으로 이미지가 자동 전환되는 `v-bind` 활용 연습
