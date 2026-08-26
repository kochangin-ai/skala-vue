<script setup>
import ProvideInjectGrandChild from './ProvideInjectGrandChild.vue'
// props/provide 없이 손자 컴포넌트만 렌더링 - 중간 단계 전달용 컴포넌트
</script>
<template>
  <div class="parent-container">
    <h3>중간 컴포넌트 (Parent)</h3>
    <p>이 컴포넌트는 globalTheme을 모르지만, 손자에게 그대로 전달됩니다.</p>
    <br />
    <ProvideInjectGrandChild />
  </div>
</template>
