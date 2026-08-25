<script setup>
import { RouterLink, RouterView } from 'vue-router'

const practiceLinks = [
  { to: '/practice/sample-one', label: 'SampleOne' },
  { to: '/practice/sample-two', label: 'SampleTwo' },
  { to: '/practice/von-event-handler', label: 'v-on 기초' },
  { to: '/practice/event-object', label: '이벤트 객체' },
  { to: '/practice/event-modifier', label: '이벤트 수식어' },
  { to: '/practice/form-elements', label: 'Form 요소' },
  { to: '/practice/v-model-modifiers', label: 'v-model 수식어' },
  { to: '/practice/vue-style', label: 'Vue 스타일' },
  { to: '/practice/weather-mockup', label: '날씨 Mockup' },
  { to: '/practice/v-bind', label: 'v-bind 기본' },
  { to: '/practice/v-bind-shorthand', label: 'v-bind 단축 문법' },
  { to: '/practice/v-bind-class', label: 'v-bind 클래스' },
  { to: '/practice/v-bind-style', label: 'v-bind 스타일' },
  { to: '/practice/v-for', label: 'v-for' },
  { to: '/practice/v-if', label: 'v-if' },
]
</script>

<template>
  <div style="padding: 20px">
    <nav style="margin-bottom: 20px; display: flex; flex-wrap: wrap; gap: 8px">
      <RouterLink v-for="link in practiceLinks" :key="link.to" :to="link.to">
        {{ link.label }}
      </RouterLink>
    </nav>

    <RouterView />
  </div>
</template>
