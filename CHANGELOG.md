# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
