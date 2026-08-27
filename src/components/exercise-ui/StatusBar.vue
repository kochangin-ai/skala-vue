<script setup>
// exercise-axios/StatusBar 를 PrimeVue Message 로 교체.
import Message from 'primevue/message'

defineProps({
  message: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <Message severity="info" :closable="false" icon="pi pi-info-circle">
    {{ message }}
  </Message>
</template>
