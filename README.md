# 부모님과 함께하는 규슈 3박 4일 — GitHub Pages

2026.11.28~12.01 / 성인 3명 / 대한항공 KE787·KE792 / 토요타 렌터카 / 벳푸완·무나카타·힐튼 3박.

## 파일 구성
- `index.html` : 메인 페이지
- `styles.css` : 반응형·큰 글씨·고대비 디자인
- `app.js` : 날짜별 일정, 지도 링크, 경비 자동계산, 체크리스트, 사진 기록
- `assets/kyushu-hero.webp` : AI 제작 이미지(실제 관광지 사진 아님)
- `manifest.webmanifest`, `sw.js` : 홈 화면 설치·한 번 방문 후 일부 오프라인 열람 지원

## GitHub Pages 배포 방법
1. GitHub에서 **Public** 또는 **Private** 저장소를 만들고 파일을 동일한 폴더 구조로 업로드합니다.
2. 저장소 **Settings → Pages → Build and deployment → Deploy from a branch**를 선택합니다.
3. **Branch: main / Folder: /(root)**를 선택하고 저장합니다.
4. Pages의 안내 주소(예: `https://USER.github.io/REPOSITORY/`)를 휴대전화에서 엽니다.
5. 스마트폰 브라우저의 **홈 화면에 추가**를 누르면 앱처럼 실행할 수 있습니다.

파일을 바꿨는데 이전 화면이 보이면 브라우저 새로고침/사이트 데이터 초기화를 하세요. `sw.js`의 `CACHE` 버전을 올려 변경 배포를 빠르게 반영할 수 있습니다.

### 수동 Git 명령어
```bash
git init
git add .
git commit -m "Create senior-friendly Kyushu travel guide"
git branch -M main
git remote add origin https://github.com/USER/REPOSITORY.git
git push -u origin main
```

## 부모님 친화 기능
- 기본 18px, `글씨 크게` 모드 22px 이상
- 명확한 대비, 48px 이상 터치 버튼, 하단 5개 탭, 스크린리더용 라벨과 키보드 초점 표시
- 일자별 계획·단축 동선·길찾기 링크, 출발 준비 완료 체크
- 호텔 침구·식사·취소 조건, 카드 혜택, 일본 상식, 공식 출처
- 날짜별 Open-Meteo 예보 조회 (접속 실패 시 2026.11.24 기준 예보를 임시 표시)
- 환율 수정에 따른 원화 자동 환산, 추가 예산 입력, 실제 지출 CSV
- 사진·메모를 기기 IndexedDB에만 저장, JSON 백업·복원

## 중요: 개인정보·사진
이 정적 웹사이트는 GitHub에 개인 사진·메모를 자동 업로드하지 않습니다. 사진·메모·지출·체크리스트는 브라우저의 로컬 저장소에 남습니다. **기기 교체, 사파리의 저장공간 정리, 비공개 모드 또는 브라우저 데이터 삭제 시 자료가 사라질 수 있습니다.** `사진·메모 → 전체 백업` 기능을 이용해 별도의 안전한 위치에 복사하세요. 다른 기기와 자동 동기화되지는 않습니다. GitHub 저장소에 실제 여권·항공 예약번호·신용카드 정보가 담긴 파일은 절대로 올리지 마세요.

## 데이터 확인 사항 (2026.11.24)
- 호텔 비용: ¥98,562.50 / ¥75,173.50 / ¥72,076. 무나카타 입력값 `75,173,50`을 **¥75,173.50**으로 해석함.
- 별도 비용: 항공 ₩1,356,400 / 렌터카 ¥45,100 / 보험 ₩100,700 / 힐튼 7층 대욕장 ¥5,280.
- 1엔=₩8.43704는 **2026.11.24 참고환율**, 카드 청구금액과 다릅니다.
- 힐튼의 추가 1인 조식 가격은 미확인. 경비 페이지에서 직접 입력하세요.
- 기상·기념품 재고·영업시간·카드 행사·입국 규정은 변경될 수 있습니다. 개별 공식 사이트를 확인하세요.
- 11/28~12/1 소요 시간은 실제 도로 정보가 아닌 가족 여행 계획을 위한 예상값입니다.

## 주요 공식 출처
- 일본 입국: https://www.vjw.digital.go.jp/
- 일본 면세: https://www.nta.go.jp/publication/pamph/shohi/menzei/201805/pdf/caution_kr.pdf
- 힐튼 대욕장: https://www.hilton.com/en/hotels/fukhihi-hilton-fukuoka-sea-hawk/spa/
- 무나카타: https://mercure-fukuokamunakata-resortandspa.jp/ko/all_inclusive/
- 규슈대학교: https://www.kyushu-u.ac.jp/en/university/facility/campus-visit/freewalk/
- 라라포트: https://mitsui-shopping-park.com/ko/lalaport/fukuoka/access/parking.html
- KB 카드: https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001?eventNum=1002702&mainCC=a
- 하나 Mastercard: https://m.hanacard.co.kr/MKEVT1010M.web?EVN_SEQ=60615
- 날씨: https://open-meteo.com/
