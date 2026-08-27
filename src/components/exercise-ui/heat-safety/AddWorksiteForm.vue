<script setup>
// exercise-axios/heat-safety/AddWorksiteForm 를 PrimeVue 입력요소로. 이모지 대신 아이콘.
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Message from 'primevue/message'

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
    geoState.value = 'error'
    geoMessage.value = '작업장명을 입력하세요.'
    return
  }
  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum) || latNum === 0 || lonNum === 0) {
    geoState.value = 'error'
    geoMessage.value = '위치(위도/경도)를 지정하세요.'
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
    <InputText v-model="name" placeholder="작업장명 (예: A현장 3공구)" fluid />

    <div class="coord-row">
      <Button
        type="button"
        label="현재 위치 사용"
        icon="pi pi-map-marker"
        size="small"
        outlined
        :loading="geoState === 'loading'"
        @click="useCurrentLocation"
      />
      <InputText v-model="lat" placeholder="위도" class="coord" />
      <InputText v-model="lon" placeholder="경도" class="coord" />
    </div>

    <Message
      v-if="geoMessage"
      :severity="geoState === 'error' ? 'error' : 'success'"
      :closable="false"
    >
      {{ geoMessage }}
    </Message>

    <Button type="submit" label="작업장 추가" icon="pi pi-plus" />
  </form>
</template>

<style scoped>
.add-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.coord-row {
  display: flex;
  gap: 6px;
}

.coord {
  flex: 1;
  min-width: 0;
}
</style>
