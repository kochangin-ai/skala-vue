<template>
  <!-- 부모가 넣어준 콘텐츠가 없으면 슬롯 기본값(fallback)이 표시됨 -->
  <div class="base-card">
    <slot>
      <p>기본 콘텐츠 영역입니다.</p>
    </slot>
  </div>
</template>

<style scoped>
.base-card {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
</style>
