<script setup>
import { ref, computed, watch, watchEffect } from 'vue'

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

// 검색어 및 알림창 제어용 데이터 (v-model 대용 한글 처리 및 이벤트 실습용)
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')

// 5. 나만의 반응형 상태: 즐겨찾기한 도시 id 목록
const favoriteCities = ref([])
const toggleFavorite = (id) => {
  favoriteCities.value = favoriteCities.value.includes(id)
    ? favoriteCities.value.filter((favId) => favId !== id)
    : [...favoriteCities.value, id]
}

// 2일차 추가: computed를 활용한 실시간 검색 필터링 (엔터 없이도 타이핑하는 즉시 목록이 좁혀짐)
// + 즐겨찾기(favoriteCities)한 도시를 목록 맨 위로 정렬
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

// 2일차 추가: watch로 상태 바 문구(selectedCityInfo) 변화만 콕 집어 감시
watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

// 2일차 추가: watchEffect로 searchQuery 변화를 의존성 선언 없이 자동 추적 (타이핑마다 API 호출을 시뮬레이션)
watchEffect(() => {
  console.log(`🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 데이터를 필터링합니다.`)
})

// 5. 나만의 watcher: 즐겨찾기 목록이 바뀔 때마다 콘솔로 알림
watch(favoriteCities, (newList) => {
  console.log(`⭐ [watch 감지] 즐겨찾기 목록이 변경되었습니다 -> 총 ${newList.length}곳`)
})

// 알림 대행 함수 (window 객체 격리 우회)
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// v-bind(:src) 실습용: 날씨 상태 → 아이콘 이미지 매핑
const weatherIconMap = {
  맑음: 'https://i1.sndcdn.com/artworks-BxBGsHqqajgl8PZe-fg4f6w-t500x500.jpg',
  비: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT3kZmypVN8KYhwfJHDKdjpbRs9r7OjYNAtXXE-8o-kw&s=10',
  구름: 'https://png.pngtree.com/png-vector/20190417/ourmid/pngtree-cloud-icon-png-image_919029.jpg',
}
const getWeatherIcon = (status) => weatherIconMap[status]

// .enter 수식어 실습용: 엔터 입력 시에만 검색 실행
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
    <section class="search-box">
      <h3>🔍 도시 검색</h3>
      <!-- input type="text" v-model="searchQuery" placeholder="검색할 도시 이름 입력" / -->
      <input
        type="text"
        :value="searchQuery"
        @input="(e) => (searchQuery = e.target.value.trim())"
        @keyup.enter="handleSearch"
        placeholder="검색할 도시 이름 입력 후 Enter"
      />
      <p>
        검색 중인 도시: <strong>{{ searchQuery }}</strong>
      </p>
    </section>

    <section class="list-box">
      <h3>🏙️ 지역별 날씨 현황 (즐겨찾기 {{ favoriteWeatherList.length }}곳)</h3>

      <div class="card-scroll">
        <div
          v-for="item in filteredWeatherList"
          :key="item.id"
          class="weather-card"
          @click="selectedCityInfo = `${item.name}이 선택되었습니다.`"
        >
          <h4>
            <img :src="getWeatherIcon(item.status)" :alt="item.status" class="weather-icon" />
            {{ item.name }} ({{ item.status }})
            <button
              class="btn-favorite"
              :class="{ active: favoriteCities.includes(item.id) }"
              @click.stop="toggleFavorite(item.id)"
            >
              {{ favoriteCities.includes(item.id) ? '⭐' : '☆' }}
            </button>
          </h4>
          <p>현재 기온: {{ item.temp }}°C</p>

          <span v-if="item.temp >= 25" class="badge hot">🔥 더움 (25도 이상)</span>
          <span v-else class="badge cool">❄️ 선선함 (25도 미만)</span>

          <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
            상세보기
          </button>
        </div>

        <p v-if="filteredWeatherList.length === 0" class="empty-message">
          😭 검색 결과와 일치하는 도시가 없습니다.
        </p>
      </div>
    </section>

    <div class="status-bar">
      {{ selectedCityInfo }}
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  max-width: 500px;
  margin: 20px auto;
  font-family: sans-serif;
}

.search-box,
.list-box {
  background: #f5f7fa;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
}

.list-box .card-scroll {
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
}

.search-box input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.weather-card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 10px;
  cursor: pointer;
}

.weather-card h4 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0 0 4px;
}

.weather-icon {
  width: 24px;
  height: 24px;
  object-fit: cover;
  border-radius: 4px;
}

.btn-favorite {
  margin-left: auto;
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
}

.btn-favorite.active {
  filter: drop-shadow(0 0 2px #f1c40f);
}

.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 14px;
  color: #fff;
  margin-top: 6px;
}

.badge.hot {
  background: #ff6b6b;
}

.badge.cool {
  background: #4d96ff;
}

.empty-message {
  text-align: center;
  color: #e74c3c;
  padding: 10px 0;
}

.btn-detail {
  float: right;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

.status-bar {
  background: #e6f6e6;
  color: #2e7d32;
  text-align: center;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
}
</style>
