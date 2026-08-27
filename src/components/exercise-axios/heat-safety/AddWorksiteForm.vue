<script setup>
import { ref } from 'vue'

// 작업장 추가 폼: 작업장명 + 좌표.
// 좌표는 브라우저 Geolocation API(navigator.geolocation)로 현재 위치를 넣거나 직접 입력한다.
const emit = defineEmits(['add'])

const name = ref('')
const lat = ref('')
const lon = ref('')
const geoState = ref('idle') // idle | loading | done | error
const geoMessage = ref('')

const useCurrentLocation = () => {
  if (!('geolocation' in navigator)) {
    geoState.value = 'error'
    geoMessage.value = '이 브라우저는 위치 기능을 지원하지 않습니다.'
    return
  }
  geoState.value = 'loading'
  geoMessage.value = ''
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      lat.value = pos.coords.latitude.toFixed(4)
      lon.value = pos.coords.longitude.toFixed(4)
      geoState.value = 'done'
      geoMessage.value = `현재 위치를 불러왔습니다 (${lat.value}, ${lon.value})`
    },
    (err) => {
      geoState.value = 'error'
      geoMessage.value =
        err.code === err.PERMISSION_DENIED
          ? '위치 권한이 거부되었습니다. 좌표를 직접 입력하세요.'
          : '위치를 가져오지 못했습니다. 좌표를 직접 입력하세요.'
    },
    { timeout: 10000, enableHighAccuracy: true },
  )
}

const submit = () => {
  const latNum = Number(lat.value)
  const lonNum = Number(lon.value)
  if (!name.value.trim()) {
    geoMessage.value = '작업장명을 입력하세요.'
    geoState.value = 'error'
    return
  }
  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum) || latNum === 0 || lonNum === 0) {
    geoMessage.value = '위치(위도/경도)를 지정하세요.'
    geoState.value = 'error'
    return
  }
  emit('add', {
    name: name.value,
    lat: latNum,
    lon: lonNum,
    source: geoState.value === 'done' ? 'geo' : 'user',
  })
  name.value = ''
  lat.value = ''
  lon.value = ''
  geoState.value = 'idle'
  geoMessage.value = ''
}
</script>

<template>
  <form class="add-form" @submit.prevent="submit">
    <input v-model="name" type="text" placeholder="작업장명 (예: A현장 3공구)" class="name-input" />

    <div class="coord-row">
      <button type="button" class="btn-geo" :disabled="geoState === 'loading'" @click="useCurrentLocation">
        {{ geoState === 'loading' ? '📍 불러오는 중...' : '📍 현재 위치 사용' }}
      </button>
      <input v-model="lat" type="number" step="any" placeholder="위도" class="coord-input" />
      <input v-model="lon" type="number" step="any" placeholder="경도" class="coord-input" />
    </div>

    <p v-if="geoMessage" class="geo-message" :class="{ error: geoState === 'error' }">{{ geoMessage }}</p>

    <button type="submit" class="btn-add">작업장 추가</button>
  </form>
</template>

<style scoped>
.add-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.name-input,
.coord-input {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

.name-input {
  width: 100%;
}

.coord-row {
  display: flex;
  gap: 6px;
}

.coord-input {
  width: 90px;
  flex: 1;
}

.btn-geo {
  padding: 8px 10px;
  border: 1px solid #4b6584;
  border-radius: 6px;
  background: #fff;
  color: #4b6584;
  font-weight: bold;
  cursor: pointer;
  white-space: nowrap;
}

.btn-geo:disabled {
  opacity: 0.6;
  cursor: default;
}

.btn-add {
  padding: 9px;
  border: none;
  border-radius: 6px;
  background: #c0392b;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}

.geo-message {
  margin: 0;
  font-size: 12px;
  color: #2e7d32;
}

.geo-message.error {
  color: #c0392b;
}
</style>
