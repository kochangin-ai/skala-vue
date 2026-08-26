<script setup>
import { ref, readonly, computed, watch, watchEffect, provide } from 'vue'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import WeatherCard from './WeatherCard.vue'
import StatusBar from './StatusBar.vue'

// 4일차 API 연동을 대비한 가상의 백엔드 데이터 배열 (v-for 및 :key 실습용)
const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '인천', temp: 33, status: '맑음' },
  { id: 'city_05', name: '성남', temp: 21, status: '비' },
  { id: 'city_06', name: '안양', temp: 19, status: '비' },
  { id: 'city_07', name: '평택', temp: 27, status: '구름' },
  { id: 'city_08', name: '이천', temp: 33, status: '구름' },
])

// 검색어 및 알림창 제어용 데이터
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 5. 나만의 반응형 상태: 즐겨찾기한 도시 id 목록
const favoriteCities = ref([])
const toggleFavorite = (id) => {
  favoriteCities.value = favoriteCities.value.includes(id)
    ? favoriteCities.value.filter((favId) => favId !== id)
    : [...favoriteCities.value, id]
}
// Provide/Inject: WeatherCard를 건너뛰고 손자인 FavoriteButton이 즐겨찾기 상태를 직접 조회/변경하도록 제공
provide('favoriteCities', readonly(favoriteCities))
provide('toggleFavorite', toggleFavorite)

// computed를 활용한 실시간 검색 필터링 + 즐겨찾기한 도시를 목록 맨 위로 정렬
const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  const list = query ? weatherList.value.filter((item) => item.name.includes(query)) : weatherList.value

  return [...list].sort((a, b) => {
    const aFav = favoriteCities.value.includes(a.id) ? 1 : 0
    const bFav = favoriteCities.value.includes(b.id) ? 1 : 0
    return bFav - aFav
  })
})

// 5. 나만의 computed: 즐겨찾기한 도시 정보만 모아서 개수/목록으로 가공
const favoriteWeatherList = computed(() =>
  weatherList.value.filter((item) => favoriteCities.value.includes(item.id)),
)

watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

watchEffect(() => {
  console.log(`🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 필터링합니다.`)
})

// 5. 나만의 watcher: 즐겨찾기 목록이 바뀔 때마다 콘솔로 알림
watch(favoriteCities, (newList) => {
  console.log(`⭐ [watch 감지] 즐겨찾기 목록이 변경되었습니다 -> 총 ${newList.length}곳`)
})

// 알림 대행 함수 (WeatherCard의 click-detail 이벤트 핸들러)
const showDetail = (item) => {
  window.alert(`${item.name}의 현재 날씨는 [${item.status}] 상태입니다.`)
}

// v-bind(:src) 실습용: 날씨 상태 → 아이콘 이미지 매핑
const weatherIconMap = {
  맑음: 'https://i1.sndcdn.com/artworks-BxBGsHqqajgl8PZe-fg4f6w-t500x500.jpg',
  비: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT3kZmypVN8KYhwfJHDKdjpbRs9r7OjYNAtXXE-8o-kw&s=10',
  구름: 'https://png.pngtree.com/png-vector/20190417/ourmid/pngtree-cloud-icon-png-image_919029.jpg',
}
const getWeatherIcon = (status) => weatherIconMap[status]

// SearchBar의 search 이벤트(엔터) 발생 시에만 상태 바 문구를 갱신
const handleSearch = () => {
  if (!searchQuery.value) {
    selectedCityInfo.value = '카드를 클릭하거나 검색해 보세요.'
    return
  }
  const matched = weatherList.value.filter((item) => item.name.includes(searchQuery.value))
  selectedCityInfo.value = matched.length
    ? `'${searchQuery.value}' 검색 결과: ${matched.map((item) => item.name).join(', ')}`
    : `'${searchQuery.value}'와(과) 일치하는 도시가 없습니다.`
}
</script>

<template>
  <div class="dashboard-wrapper">
    <BaseDashboardCard title="🔍 도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="searchQuery = $event" @search="handleSearch" />
    </BaseDashboardCard>

    <BaseDashboardCard :title="`🏙️ 지역별 날씨 현황 (즐겨찾기 ${favoriteWeatherList.length}곳)`">
      <div class="card-scroll">
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :item="item"
          :get-weather-icon="getWeatherIcon"
          @select-card="selectedCityInfo = `${item.name}이 선택되었습니다.`"
          @click-detail="showDetail"
        />

        <p v-if="filteredWeatherList.length === 0" class="empty-message">
          😭 검색 결과와 일치하는 도시가 없습니다.
        </p>
      </div>
    </BaseDashboardCard>

    <StatusBar :message="selectedCityInfo" />
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  max-width: 500px;
  margin: 20px auto;
  font-family: sans-serif;
}

.card-scroll {
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.empty-message {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}
</style>
