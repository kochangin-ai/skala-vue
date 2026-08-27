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
  { to: '/practice/v-bind', label: 'v-bind 기본' },
  { to: '/practice/v-bind-shorthand', label: 'v-bind 단축 문법' },
  { to: '/practice/v-bind-class', label: 'v-bind 클래스' },
  { to: '/practice/v-bind-style', label: 'v-bind 스타일' },
  { to: '/practice/v-for', label: 'v-for' },
  { to: '/practice/v-if', label: 'v-if' },
  { to: '/practice/ref-example', label: 'ref() 기초' },
  { to: '/practice/reactive-example', label: 'reactive()' },
  { to: '/practice/reactive-ref', label: 'ref() 심화' },
  { to: '/practice/reactive-reactive', label: 'reactive() 심화' },
  { to: '/practice/computed-basic', label: 'computed() 캐싱' },
  { to: '/practice/watchers-basic', label: 'watch() 기초' },
  { to: '/practice/watchers-deep', label: 'ref 객체/배열 감시' },
  { to: '/practice/watchers-multi', label: '다중 변수 감시' },
  { to: '/practice/watchers-reactive', label: 'reactive watch 규칙' },
  { to: '/practice/watchers-reactive-array', label: 'reactive 배열 감시' },
  { to: '/practice/watchers-ref-array', label: 'ref 배열 감시' },
  { to: '/practice/watchers-watch-effect', label: 'watchEffect()' },
  { to: '/practice/component-lifecycle-hook', label: '컴포넌트 라이프사이클 훅' },
  // Props & Emits 예제 (Parent 페이지에서 Child를 함께 렌더링)
  { to: '/practice/props-emits-parent', label: 'Props & Emits' },
  // Provide/Inject 2단계 조상 예제
  { to: '/practice/provide-inject-grandparent', label: 'Provide & Inject (GrandParent)' },
  { to: '/practice/slot-default', label: 'Default Slot' },
  { to: '/practice/slot-named', label: 'Named Slot' },
  { to: '/practice/slot-scoped', label: 'Scoped Slot' },
  // Code Challenge: Axios 라이브러리
  { to: '/practice/axios-json', label: 'Axios CRUD (JSONPlaceholder)' },
  { to: '/practice/axios-weather', label: 'Axios 실시간 날씨' },
]

const handsonLinks = [
  { to: '/practice/weather-mockup', label: '날씨 Mockup' },
  { to: '/practice/weather-composition', label: '날씨 Composition (computed/watch)' },
  { to: '/practice/weather-component', label: '날씨 Component 분리' },
  { to: '/weather-app', label: '날씨 Vue Router 앱' },
  { to: '/weather-store', label: '날씨 Pinia Store (체감온도)' },
]
</script>

<template>
  <div class="app-wrapper">
    <nav class="nav-group">
      <p class="nav-title">Code Challenge</p>
      <div class="nav-links">
        <RouterLink v-for="link in practiceLinks" :key="link.to" :to="link.to">
          {{ link.label }}
        </RouterLink>
      </div>
    </nav>

    <nav class="nav-group">
      <p class="nav-title">Handson</p>
      <div class="nav-links">
        <RouterLink v-for="link in handsonLinks" :key="link.to" :to="link.to">
          {{ link.label }}
        </RouterLink>
      </div>
    </nav>

    <RouterView />
  </div>
</template>

<style scoped>
.app-wrapper {
  padding: 20px;
}

.nav-group {
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px 16px;
  margin-bottom: 16px;
}

.nav-title {
  margin: 0 0 8px;
  font-size: 13px;
  font-weight: 700;
  color: #888;
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.nav-links a {
  padding: 4px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  text-decoration: none;
  color: #333;
  font-size: 14px;
}

.nav-links a.router-link-active {
  background: #333;
  color: #fff;
  border-color: #333;
}
</style>
