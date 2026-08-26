<script setup>
// 이름 있는 슬롯: v-slot:header로 header 위치, 기본 슬롯으로 나머지 콘텐츠를 주입
import SlotNamedChild from './SlotNamedChild.vue'
</script>

<template>
  <div class="practice-section">
    <h2>Named Slot 주입 실습</h2>
    <SlotNamedChild>
      <template v-slot:header>
        <h3>Child 주입 제목</h3>
      </template>
      <p>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt..."</p>
    </SlotNamedChild>
  </div>
</template>
