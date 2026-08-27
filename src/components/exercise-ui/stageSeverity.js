// getHeatStage / getColdStage 가 돌려주는 stage.level(0~4) → PrimeVue Tag severity 매핑.
// 이모지 뱃지 대신 색상 severity로 위험도를 직관적으로 보여주기 위한 공용 헬퍼.
export const stageSeverity = (level) => {
  if (level >= 4) return 'danger'
  if (level === 3) return 'danger'
  if (level === 2) return 'warn'
  if (level === 1) return 'info'
  return 'success'
}
