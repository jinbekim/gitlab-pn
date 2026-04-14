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
    id: 'pin-mr-filter',
    name: 'MR Filter Pinner',
    description: 'MR 필터 히스토리 항목 핀 고정 기능',
    enabledKey: 'pin-mr-filter-enabled',
  },
  {
    id: 'mr-desc-viewer',
    name: 'MR Description Viewer',
    description: 'Changes 탭에서 MR 설명 사이드 패널 보기',
    enabledKey: 'mr-desc-viewer-enabled',
  },
  {
    id: 'urgent-mr',
    name: 'Urgent MR Toggle',
    description: 'MR 제목에 ❗️ 긴급 표시 체크박스 추가',
    enabledKey: 'urgent-mr-enabled',
  },
];
