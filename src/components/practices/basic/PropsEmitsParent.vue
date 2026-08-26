<script setup>
import { ref } from 'vue'
import PropsEmitsChild from './PropsEmitsChild.vue'
// 1. 상위 컴포넌트의 로컬 반응형 상태 정의
const message = ref('Parent 초기 메시지')
// 2. 하위 컴포넌트의 커스텀 이벤트를 수신했을 때 실행될 핸들러 함수
// 인자(newValue)로 하위 컴포넌트가 보낸 페이로드가 자동 주입됩니다.
const handleUpdateRequest = (newValue) => {
  message.value = newValue
}
// 3. Parent에서 직접 상태를 변경 -> props로 Child에 그대로 전달되는 흐름을 확인하기 위한 핸들러
let count = 0
const updateFromParent = () => {
  count += 1
  message.value = `Parent에서 변경한 메시지 #${count}`
}
</script>
<template>
  <div class="practice-section">
    <h2>Props & Emits</h2>
    <div class="parent-container">
      <h2>상위 컴포넌트 (Parent)</h2>
      <p>
        현재 로컬 데이터(State): <strong>{{ message }}</strong>
      </p>
      <br />
      <!-- 클릭 시 Parent의 상태를 직접 변경 -> Child로 props가 갱신되어 내려가는 흐름 확인 -->
      <button @click="updateFromParent">Parent에서 직접 변경 (Props)</button>
      <br /><br />
      <!-- props로 message 전달, update-request 이벤트로 핸들러 연결 -->
      <PropsEmitsChild :parent-data="message" @update-request="handleUpdateRequest" />
    </div>
  </div>
</template>
