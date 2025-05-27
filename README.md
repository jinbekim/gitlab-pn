# gitlab-pn

## 적용 방법

### 1. `git clone`

```sh
$> git clone https://github.com/jinbekim/gitlab-pn.git
```

### 2. `chrome://extensions/` 접속

### 3. 우측 상단의 `개발자 모드` 활성화

  ![개발자 모드 토글](/img//dev-mode.png)

### 4. `압축해제된 확장 프로그램을 로드합니다.` 클릭

  ![프로그램 로드 버튼](/img/load.png)

### 5. 클론한 위치에서 `gitlab-pn` 폴더 선택

  ![폴더 선택 창](/img/select.png)

## pn_rule

### 6. 원하는 텍스트 및 이모지로 변경

  ![익스텐션 UI](https://github.com/user-attachments/assets/fb211f48-4b82-448e-ae37-63e64bc5b307)

## rm_mr_filter

### 삭제 버튼

  추가된 삭제 버튼을 누르면, 해당 element와 local storage에 저장된 filter정보가 제거됨

  ![rm_mr_filter](/img/rm_mr_filter.png)

### TODO

gitlab 버전별로 하드코딩 되는 부분 변수로 분리
