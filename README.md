# gitlab-pn

GitLab Merge Request 페이지를 커스터마이징하는 Chrome 확장 프로그램 (Manifest V3)

## 기능

### 1. pn-rule (우선순위 라벨 변환)
- MR 노트에서 P1, P2, P3 우선순위 라벨을 커스텀 스타일 마커로 변환
- 텍스트와 색상 커스터마이징 가능
- 실시간 DOM 감지로 동적 콘텐츠에도 적용

### 2. rm-mr-filter (MR 필터 삭제)
- MR 필터 히스토리 드롭다운에 삭제 버튼 추가
- DOM과 localStorage에서 동시 제거

## 설치 방법

### 수동 설치

#### 1. 저장소 클론

```sh
git clone https://github.com/jinbekim/gitlab-pn.git
cd gitlab-pn
npm install
npm run build
```

#### 2. `chrome://extensions/` 접속

#### 3. 우측 상단의 `개발자 모드` 활성화

![개발자 모드 토글](/img/dev-mode.png)

#### 4. `압축해제된 확장 프로그램을 로드합니다.` 클릭

![프로그램 로드 버튼](/img/load.png)

#### 5. 클론한 위치에서 `gitlab-pn` 폴더 선택

![폴더 선택 창](/img/select.png)

## 사용 방법

### 팝업 UI

확장 프로그램 팝업은 탭 기반 UI로 구성되어 있습니다:

- **기능설정 탭**: 플러그인별 활성화/비활성화 토글
- **설정 탭**: P1/P2/P3 텍스트 및 컬러 팔레트 설정

![익스텐션 UI](https://github.com/user-attachments/assets/fb211f48-4b82-448e-ae37-63e64bc5b307)

### rm-mr-filter

MR 필터 히스토리 드롭다운에서 삭제 버튼을 클릭하면, 해당 element와 localStorage에 저장된 필터 정보가 제거됩니다.

![rm_mr_filter](/img/rm_mr_filter.png)

## 개발 가이드

### 요구사항
- Node.js 18+
- npm

### 설치

```sh
npm install
```

### 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | Watch 모드 (popup + inject 동시) |
| `npm run dev:popup` | Popup Watch 모드 |
| `npm run dev:inject` | Content script Watch 모드 |
| `npm run build` | 프로덕션 빌드 (전체) |
| `npm run build:popup` | Popup 프로덕션 빌드 |
| `npm run build:inject` | Content script 프로덕션 빌드 |
| `npm run type-check` | TypeScript 타입 체크 |
| `npm run test` | 테스트 실행 (watch) |
| `npm run test:run` | 테스트 1회 실행 |
| `npm run test:coverage` | 커버리지 리포트 |

### 빌드 결과

- `dist/inject/` - 콘텐츠 스크립트
- `dist/popup/` - 확장 프로그램 팝업 UI

## 플러그인 아키텍처

### 구조

gitlab-pn은 플러그인 기반 아키텍처를 사용합니다:

- **PluginManager**: 플러그인 라이프사이클 관리 (등록, 초기화, 시작/중지)
- **BasePlugin**: 모든 플러그인의 추상 베이스 클래스
- **PluginContext**: 공유 서비스 제공 (storage, gitlab DOM accessors)

### 새 플러그인 만들기

1. `src/plugins/` 에 새 디렉토리 생성
2. `BasePlugin`을 확장하는 플러그인 클래스 작성
3. `src/plugins/inject/index.ts`에 등록

### 디렉토리 구조

```
src/
├── core/           # 플러그인 시스템 코어
├── plugins/        # 플러그인 구현체
├── domain/         # 도메인 모델
├── services/       # GitLab DOM 서비스
└── utils/          # 유틸리티
```

## 호환성

- Chrome (Manifest V3)
- GitLab (버전별 셀렉터 조정 필요시 `src/services/gitlab/selectors.ts` 수정)

