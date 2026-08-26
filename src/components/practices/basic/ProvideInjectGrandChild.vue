<script setup>
import { inject } from 'vue'
// 1. 최상위 조상이 provide한 읽기 전용 테마 값 주입
const theme = inject('globalTheme')
// 2. 값 변경용으로 조상이 내려준 함수 주입
const setTheme = inject('setGlobalTheme')
// 3. 버튼 클릭 시 주입받은 함수를 호출해 조상의 상태를 변경
const toggleTheme = () => {
  setTheme(theme.value === 'dark-mode' ? 'light-mode' : 'dark-mode')
}
</script>
<template>
  <div class="grandchild-container">
    <h3>최하위 컴포넌트 (GrandChild)</h3>
    <p>
      주입받은 테마: <strong>{{ theme }}</strong>
    </p>
    <br />
    <!-- 클릭 시 조상이 내려준 setGlobalTheme 함수를 통해 테마 변경 -->
    <button @click="toggleTheme">테마 변경 요청</button>
  </div>
</template>
