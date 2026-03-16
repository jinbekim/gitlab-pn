# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 1.3.0 (2026-03-16)


### Features

* **mr-desc-viewer:** Changes 탭에서 MR description 사이드 패널 보기 플러그인 추가 71c03e4


### Bug Fixes

* **mr-desc-viewer:** SPA 네비게이션 감지, 다크 테마, API 호환성 개선 b5f4436
* **mr-desc-viewer:** MAIN world nav-interceptor로 CSP 호환 pushState 인터셉트
* **mr-desc-viewer:** GitLab lazy load 이미지(data-src) 처리
* **mr-desc-viewer:** showModal backdrop 지원 및 외부 클릭 닫기


### Build

* nav-interceptor MAIN world content script 빌드 타겟 추가

## 1.2.0 (2026-02-16)


### Features

* **popup:** 탭 기반 플러그인 관리 UI 추가 ad082be


### Bug Fixes

* **popup:** 저장 버튼 동작 및 가시성 문제 수정 ca6ac28
* **pn-rule:** Chrome storage 초기 상태에서 기능 미동작 문제 수정 0f2c374


### Build

* tsup에서 Vite로 빌드 시스템 마이그레이션 9b428db


### Style

* **popup:** UI 스타일 간소화 및 컬러 팔레트 방식으로 변경 ae6055f


### Code Refactoring

* plugin 기반 아키텍처로 리팩토링 11b2a62
* **rm-mr-filter:** 불필요한 주석 및 타입 정의 제거 ec8b1e5
* remove unused code and dead exports 0fd5ed4


### Documentation

* README.md 구조 개선 및 개발 가이드 추가 f761040


### Chores

* add dist to gitignore and remove from tracking ad0b205
* add _metadata to gitignore b6365b0

## 1.1.0 (2026-01-25)


### Features

* ✨ 원하는 텍스트 인풋 및 기능 구현 c4d4b1b
* 🎉 add logo f720bc6
* 📦️ add: ts d64e491
* 📦️ tsup bundle 10e9f43
* 🦺 add escape html util c62db04
* add path mappings for domain and services modules in tsconfig 66ebd75
* edit bg color and text color 95d07ad
* implement debounce utility and refactor pn handling in popup and inject modules a52a7a7
* **popup:** pn-rule과 rm-mr-filter 기능 토글 추가 ([#23](https://github.com/jinbekim/gitlab-pn/issues/23)) ab8b8c5
* **popup:** redesign popup UI with modern styling 4699f1e
* **rm_mr_filter:** ✨ mr filter 삭제 버튼 추가 1e2a5d3
* **rm_mr_filter:** 드롭다운 삭제 버튼 배경색을 투명에서 어두운 색으로 변경 a265e2d
* **rm_mr_filter:** removeFilterByIndex 함수에서 siblings 배열 처리 개선 및 로그 추가 51af217


### Bug Fixes

* 🐛 discussion-body가 아닌 커멘트로 올라온 스레드 인식안됨 6a460a5
* content script ES module import error 1446d61
* marker가 색상 hexcode로 변경되는 버그 a5aafcc
* **rm_mr_filter:**  local gitlab 버전에 맞춰서 querySelector 및 css 수정 fa8806c


### Documentation

* 📝 적용 방법 작성 03abaa0
* README.md에 pn_rule 및 rm_mr_filter 섹션 추가, 삭제 버튼 기능 설명 및 이미지 포함 e24a0bb


### Code Refactoring

* 각 모듈로 분리 84a0190
* restructure project to src/ directory with feature-based architecture ([#20](https://github.com/jinbekim/gitlab-pn/issues/20)) 17ca00c
* **rm_mr_filter:** RemoveButton 컴포넌트를 ui 폴더로 이동 0faf410
