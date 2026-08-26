<script setup>
// 기본 슬롯: 콘텐츠 전달 여부에 따라 부모 마크업 또는 자식의 fallback이 렌더링됨
import SlotDefaultChild from './SlotDefaultChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Default Slot 레이아웃 주입 실습</h2>
    <SlotDefaultChild>
      <p>단순한 텍스트 문장을 주입합니다.</p>
    </SlotDefaultChild>
    <SlotDefaultChild>
      <h2 style="color: #e74c3c">🔥 경고 상태</h2>
      <button>확인</button>
    </SlotDefaultChild>
    <SlotDefaultChild> </SlotDefaultChild>
  </div>
</template>
