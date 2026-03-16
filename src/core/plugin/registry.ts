/**
 * Plugin registry for UI and management purposes
 */

export interface PluginInfo {
  id: string;
  name: string;
  description: string;
  enabledKey: string;
}

export const PLUGIN_REGISTRY: PluginInfo[] = [
  {
    id: 'pn-rule',
    name: 'Priority Label Replacer',
    description: 'P1, P2, P3 라벨을 커스텀 마커로 대체',
    enabledKey: 'pn-rule-enabled',
  },
  {
    id: 'rm-mr-filter',
    name: 'MR Filter Remover',
    description: 'MR 필터 히스토리 항목 삭제 버튼 추가',
    enabledKey: 'rm-mr-filter-enabled',
  },
  {
    id: 'mr-desc-viewer',
    name: 'MR Description Viewer',
    description: 'Changes 탭에서 MR 설명 사이드 패널 보기',
    enabledKey: 'mr-desc-viewer-enabled',
  },
];
