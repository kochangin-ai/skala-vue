<script setup>
//js 영역
const welcomeMessage = "Welcome to skala-vue"
</script>

<template>
  <div class="practice-section">
    <h2>{{ welcomeMessage }}</h2>
    <p>{{ welcomeMessage.toUpperCase() }}</p>
    <p>{{ 'Random number: '+Math.ceil(Math.random()*100) }}</p>
  </div>
</template>

