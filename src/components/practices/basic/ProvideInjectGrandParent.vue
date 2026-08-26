<script setup>
import { ref, readonly, provide } from 'vue'
import ProvideInjectParent from './ProvideInjectParent.vue'
// 1. 최상위 조상의 반응형 상태 정의
const themeColor = ref('dark-mode')
// 2. 자손이 직접 값을 바꾸지 못하도록 읽기 전용으로 제공할 값 등록
provide('globalTheme', readonly(themeColor))
// 3. 값 변경은 조상이 내려준 전용 함수로만 가능하도록 별도 제공
const setThemeColor = (value) => {
  themeColor.value = value
}
provide('setGlobalTheme', setThemeColor)
</script>
<template>
  <div class="practice-section">
    <h2>Provide & Inject (2단계 조상)</h2>
    <div class="grandparent-container">
      <h3>최상위 컴포넌트 (GrandParent)</h3>
      <p>
        현재 테마: <strong>{{ themeColor }}</strong>
      </p>
      <br />
      <!-- 중간 Parent는 props 없이 그대로 자식만 렌더링 (prop drilling 없이 손자까지 전달) -->
      <ProvideInjectParent />
    </div>
  </div>
</template>
