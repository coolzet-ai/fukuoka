'use strict';
// 가족 여행 데이터. 로컬 저장만 사용하며 서버에 사진이나 개인정보를 전송하지 않습니다.
const STORE = 'kyushu-2026-family-v1';
const RATE_DATE = '2026-11-24';
const DEFAULT_RATE = 8.43704; // 2026-11-24 조회, 1 JPY = 8.43704 KRW. 결제 적용환율 아님.
const dayLabels = {day1:'11/28 · 벳푸',day2:'11/29 · 유후인·무나카타',day3:'11/30 · 후쿠오카',day4:'12/1 · 귀국'};
const hotels = [
 {id:'grand',day:'11/28(토)',night:'첫째 날',name:'그랜드 머큐어 벳푸완 리조트 앤 스파',jp:'グランドメルキュール別府湾リゾート＆スパ',city:'벳푸완 / 히지',beds:'싱글베드 2 + 엑스트라베드 1',yen:98562.50,meal:'올인클루시브 · 저녁·조식·라운지·대욕장',cancel:'숙박 1일 전까지 취소 가능 (정확한 마감 시각 확인)',source:'https://grand-mercure-beppubay-resortandspa.jp/ko/',map:'Grand Mercure Beppu Bay Resort & Spa'},
 {id:'munakata',day:'11/29(일)',night:'둘째 날',name:'머큐어 후쿠오카 무나카타 리조트 앤 스파',jp:'メルキュール福岡宗像リゾート＆スパ',city:'무나카타 / 현해탄',beds:'싱글베드 2 + 소파베드 1',yen:75173.50,meal:'올인클루시브 · 저녁·조식·라운지·대욕장',cancel:'숙박 1일 전까지 취소 가능 (정확한 마감 시각 확인)',source:'https://mercure-fukuokamunakata-resortandspa.jp/ko/',map:'Mercure Fukuoka Munakata Resort & Spa'},
 {id:'hilton',day:'11/30(월)',night:'셋째 날',name:'힐튼 후쿠오카 씨호크',jp:'ヒルトン福岡シーホーク',city:'후쿠오카 / 모모치',beds:'트리플 객실 · 3명',yen:72076,meal:'조식 1인 추가요금 미확인 · 7층 이와부로 대욕장 성인 3명 ¥5,280 별도',cancel:'숙박 1일 전까지 취소 가능 (정확한 마감 시각 확인)',source:'https://www.hilton.com/en/hotels/fukhihi-hilton-fukuoka-sea-hawk/',map:'Hilton Fukuoka Sea Hawk'}
];
const days=[
 {id:'day1',num:'01',date:'11월 28일(토)',where:'후쿠오카공항 → 벳푸만',subtitle:'도착 당일은 관광 1곳과 올인클루시브 휴식 중심',route:['후쿠오카공항','야마다 SA','벳푸만 SA','우미지옥','마루쇼쿠 세키노에','그랜드 머큐어 벳푸완'],routeStart:'Fukuoka Airport International Terminal',routeEnd:'Grand Mercure Beppu Bay Resort & Spa',routeWay:['Yamada Service Area Downbound','Beppuwan Service Area','Umi Jigoku','Marushoku Sekinoe Beppu'],tip:'오후 소나기가 예상됩니다. 우미지옥 관람 중 비가 오면 바로 호텔로 이동하세요.',alt:'비가 오거나 부모님이 피곤하시면 우미지옥을 생략하고 벳푸만 SA에서 식사 후 호텔 라운지를 이용하세요.',stops:[
  ['07:45','인천공항 출발 · KE787','제2터미널 / 후쿠오카 09:15 도착','항공','',true],
  ['09:15~11:00','입국 심사·수하물·렌터카 인수','토요타 렌터카 인수 예약 10:30. 입국 지연 시 영업소에 연락하세요.','이동','Fukuoka Airport International Terminal',true],
  ['11:00~12:05','야마다 SA 하행','약 55~65분 운전 후 화장실과 스트레칭 15분','휴식','Yamada Service Area Downbound'],
  ['13:05~13:55','벳푸만 SA 점심·전망','무라타 후쇼안 또는 푸드코트에서 점심, 부모님은 의자 휴식','점심','Beppuwan Service Area'],
  ['14:15~14:45','우미지옥 관광·기념품','푸른 온천 연못만 30분 관람, SHOP REN 기념품(오이타 과자)','관광','Umi Jigoku Beppu'],
  ['15:10~15:30','마루쇼쿠 세키노에점 장보기','객실용 생수·귤·바나나·음료 구매. 식품 09:00~22:00','마트','Marushoku Sekinoe Beppu'],
  ['15:50~16:20','그랜드 머큐어 벳푸완 체크인','싱글 2 + 엑스트라 1. 라운지에 먼저 들러 충분히 휴식','숙소','Grand Mercure Beppu Bay Resort & Spa',true],
  ['17:30~18:40','저녁 뷔페 · Le Sensoriel','예약한 올인클루시브 포함 여부와 좌석시간 확인','식사','Grand Mercure Beppu Bay Resort & Spa'],
  ['19:00 이후','대욕장·노천탕 이용','미끄럼 주의, 한 번에 오래 입욕하지 말고 수분 섭취','온천','Grand Mercure Beppu Bay Resort & Spa'] ]},
 {id:'day2',num:'02',date:'11월 29일(일)',where:'벳푸완 → 유후인 → 무나카타',subtitle:'유후인 솥밥과 지역 특산품 쇼핑 후 숙소에서 여유로운 오후',route:['그랜드 머큐어 벳푸완','긴린코','유후마부시 신','이온 유후인','미치노에키 무나카타','머큐어 무나카타'],routeStart:'Grand Mercure Beppu Bay Resort & Spa',routeEnd:'Mercure Fukuoka Munakata Resort & Spa',routeWay:['Kinrin Lake Yufuin','Yufumabushi Shin Kinrinko Honten','AEON Yufuin Store','Michi-no-Eki Munakata'],tip:'11/29 유후인은 아침 최저 약 -1℃ 전망입니다. 목도리·겉옷을 준비하고 호수 산책은 20~30분만 하세요.',alt:'강풍·추위가 심하면 긴린코를 차에서 잠깐 보고 점심과 쇼핑만 진행하세요. 무나카타에 도착한 뒤에는 온천·라운지 위주로 쉬세요.',stops:[
  ['07:00~08:10','그랜드 머큐어 조식·체크아웃','숙박 1일 전 취소 가능 조건 재확인, 짐과 여권 점검','숙소','Grand Mercure Beppu Bay Resort & Spa'],
  ['08:15~09:30','유후인으로 이동','차량 약 60~75분 예상, 산길 날씨·주차 상황 주의','이동','Kinrin Lake Yufuin'],
  ['09:30~10:10','긴린코 호수·기념품 산책','호수 전망 중심 짧은 산책, 유노츠보 거리 기념품은 선택','관광','Kinrin Lake Yufuin'],
  ['10:30~11:40','유후마부시 신(心) 점심','분고규·장어·닭고기 솥밥. 일요일 대기 시 다른 식당으로 대체','점심','Yufumabushi Shin Kinrinko Honten',true],
  ['11:45~12:05','이온 유후인점','생수·간식·지역 과자 소량 구매. 쇼핑보다 이동 시간을 우선','마트','AEON Yufuin Store'],
  ['12:05~15:00','무나카타 방향 장거리 이동','예상 2시간 30분~3시간, 휴게소 15분 휴식 반드시 확보','이동','Michi-no-Eki Munakata',true],
  ['15:00~15:25','미치노에키 무나카타 기념품','지역 특산품·과자·해산물 가공품. 냉장식품 보냉 확인','기념품','Michi-no-Eki Munakata'],
  ['15:40~16:10','머큐어 후쿠오카 무나카타 체크인','싱글 2 + 소파베드 1, 라운지 15:00~18:00','숙소','Mercure Fukuoka Munakata Resort & Spa',true],
  ['17:30~18:40','Locavore 올인클루시브 저녁','뷔페 17:30~21:00, 마지막 입장 20:30(안내 기준)','식사','Mercure Fukuoka Munakata Resort & Spa'],
  ['19:00 이후','겐카이 사츠키 온천·휴식','대욕장 15:00~23:00, 마지막 입장 22:30(공식 기준)','온천','Mercure Fukuoka Munakata Resort & Spa'] ]},
 {id:'day3',num:'03',date:'11월 30일(월)',where:'무나카타 → 규슈대 → 후쿠오카',subtitle:'캠퍼스·대형몰·선물 쇼핑과 힐튼 온천까지',route:['머큐어 무나카타','규슈대 이토캠퍼스','라라포트 후쿠오카','하카타역 마잉(선택)','MARK IS 할로데이','힐튼 씨호크'],routeStart:'Mercure Fukuoka Munakata Resort & Spa',routeEnd:'Hilton Fukuoka Sea Hawk',routeWay:['Kyushu University Ito Campus','LaLaport Fukuoka','Hakata Station','HalloDay MARK IS Fukuoka Momochi'],tip:'규슈대는 일반 방문이 가능하지만 강의실·연구동 출입은 제한됩니다. 임시 차량 입장료 ¥300, 라라포트는 월요일 주차 무료입니다.',alt:'체력이 떨어지면 하카타역 마잉을 생략하고 라라포트에서 기념품까지 구매하세요. 쇼핑보다 호텔 온천과 휴식을 우선합니다.',stops:[
  ['07:00~08:10','무나카타 호텔 조식·체크아웃','소파베드와 객실 짐, 충전기 확인','숙소','Mercure Fukuoka Munakata Resort & Spa'],
  ['08:15~09:45','규슈대 이토캠퍼스로 이동','차량 약 80~100분 예상. 도착 전 화장실 휴식','이동','Kyushu University Ito Campus'],
  ['09:45~10:25','규슈대학교 이토캠퍼스','대학 중앙광장·외관만 30~40분, 차량 입장 ¥300','관광','Kyushu University Ito Campus'],
  ['10:25~11:30','라라포트 후쿠오카 이동','차량 약 50~65분, 정체 시 여유 추가','이동','LaLaport Fukuoka'],
  ['11:30~13:30','라라포트 점심·쇼핑·건담','음식점 한 곳에서 점심, 건담 SIDE-F·규슈 한정 굿즈. 월요일 주차 무료','점심/쇼핑','LaLaport Fukuoka'],
  ['14:00~14:40','하카타역 마잉 기념품(선택)','하카타 토리몬·멘베이·명란 선물. 피곤하면 생략','기념품','Hakata Maing',false,true],
  ['15:00~15:25','MARK IS 할로데이 마트','과일·생수·조식용 간식 구매 후 힐튼으로 이동','마트','HalloDay MARK IS Fukuoka Momochi'],
  ['15:35~16:15','힐튼 후쿠오카 씨호크 체크인','트리플 객실. 힐튼 골드 조식 대상 및 제3자 요금 재확인','숙소','Hilton Fukuoka Sea Hawk',true],
  ['16:30~17:15','힐튼 7층 이와부로 대욕장','성인 3명 ¥5,280, 일부 6·7층 지정 객실 무료. 영업 15:00~23:30','온천','Hilton Fukuoka Sea Hawk'],
  ['17:45~18:50','저녁: 호텔 또는 MARK IS','부모님 동선 짧게. 호텔식 또는 마크이즈 일식 정식','저녁','MARK IS Fukuoka Momochi'],
  ['19:00 이후','모모치하마 해변·기념 사진(선택)','바람이 차거나 피곤하면 바로 호텔 객실 휴식','선택','Momochi Seaside Park',false,true] ]},
 {id:'day4',num:'04',date:'12월 1일(화)',where:'후쿠오카 → 인천 귀국',subtitle:'관광 없이 렌터카 반납·면세 세관 확인·귀국에 집중',route:['힐튼 씨호크','토요타 렌터카 반납점','후쿠오카공항 국제선','인천공항 T2'],routeStart:'Hilton Fukuoka Sea Hawk',routeEnd:'Fukuoka Airport International Terminal',routeWay:[],tip:'렌터카 예약 반납은 10:30이지만 가능하면 09:30~09:50 반납을 목표로 하세요. 실제 지점·셔틀 소요시간은 예약서로 확인해야 합니다.',alt:'교통 정체·수하물 증가 시 호텔 조식을 줄이고 조기 출발하세요. 면세품을 수하물에 위탁하기 전에 세관 확인을 진행해야 합니다.',stops:[
  ['07:00~08:00','힐튼 조식·짐 정리','조식 1인 추가 결제금액 확인, 여권·항공권·면세품 분리','조식','Hilton Fukuoka Sea Hawk'],
  ['08:30~08:45','힐튼 체크아웃','주차비, 대욕장 비용 및 영수증 확인','숙소','Hilton Fukuoka Sea Hawk'],
  ['08:45~09:45','토요타 렌터카 반납 이동','주유 후 차량 상태 사진, ETC 카드·개인물품 확인','이동','Toyota Rent a Car Fukuoka Airport',true],
  ['09:45~10:15','차량 반납·공항 셔틀','예약 반납시한 10:30. 영업소 주소·셔틀 운행시간 미확인','렌터카','Fukuoka Airport International Terminal',true],
  ['10:15~11:10','후쿠오카공항 국제선·면세 확인','면세 구입 물품을 위탁하기 전 세관 확인. 환급 방식은 구매처 안내 확인','공항','Fukuoka Airport International Terminal',true],
  ['11:10~12:30','수하물 위탁·출국 심사·간식','면세 환급 절차와 보안 검색 시간 확보','공항','Fukuoka Airport International Terminal'],
  ['13:45','대한항공 KE792 출발','후쿠오카(FUK) → 인천(ICN), 기내 휴식','항공','Fukuoka Airport International Terminal',true],
  ['15:10','인천공항 도착','제2터미널 도착 예정 · 한국시간과 일본시간 동일','귀국','Incheon International Airport Terminal 2',true] ]}
];
const promos=[
 {name:'KB국민카드 · 일본 편의점',duration:'2026. 11. 17. ~ 11. 30.',lead:'세븐일레븐·로손·패밀리마트',detail:'먼저 응모하고 대상 KB국민 해외겸용 카드로 1회 ¥1,000 이상 결제하면 건당 ¥500 상당 KB Pay 외화머니(최대 ¥5,000). 12/1에는 행사 종료.',url:'https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001?eventNum=1002702&mainCC=a',tag:'응모 필수 · 11/30 종료'},
 {name:'하나 Mastercard · 일본 오프라인',duration:'2026. 10. 1. ~ 12. 31.',lead:'선착순 최대 ¥2,000 캐시백',detail:'카드별 별도 등록 후 일본 오프라인 엔화 결제 합산 ¥50,000 이상 시 선착순 ¥2,000 캐시백. 일부 등급의 하나 Mastercard만 해당하며 카드별 합산 불가.',url:'https://m.hanacard.co.kr/MKEVT1010M.web?EVN_SEQ=60615',tag:'사전 카드 등록 · 선착순'},
 {name:'일본 면세 환급 제도',duration:'2026. 11. 1.부터 적용',lead:'구매 → 출국 세관 확인 → 환급',detail:'면세 대상 물품을 구매할 때 세금 포함 결제 후 90일 안에 일본 출국 시 세관 반출 확인을 받아야 환급을 받을 수 있습니다. 면세품은 짐을 맡기기 전 검사 가능하게 정리하세요.',url:'https://www.nta.go.jp/publication/pamph/shohi/menzei/201805/pdf/caution_kr.pdf',tag:'할인 행사가 아닌 법령 변경'},
 {name:'할인 확인 전 주의',duration:'각 카드사 앱 최신 공지 확인',lead:'겹치는 할인·제외 매장 확인',detail:'한국 카드사 행사라도 일본 현지 매장·카드 등급·매입일·등록 방법에 따라 달라집니다. 확인되지 않은 할인율은 이 페이지에 확정 금액으로 표시하지 않습니다.',url:'https://www.jnto.go.jp/',tag:'현장 적용 여부 확인'}
];
const souvenirs=[
 ['벳푸·오이타','지옥찜 푸딩(현지에서 섭취) · 온천 관련 소품 · 오이타 과자'],
 ['유후인','유후인 과자·잼·목공 소품 · 긴린코 근처 기념품'],
 ['무나카타','지역 특산품 · 건어물·해산물 가공품 · 무나카타 지역 과자'],
 ['라라포트','GUNDAM SIDE-F 굿즈 · 캐릭터 상품'],
 ['하카타 마잉','하카타 토리몬 · 멘베이 · 명란 관련 선물'],
 ['후쿠오카공항','기내 반입 가능한 상온 보관 과자 · 남은 선물']
];
const checks={
 '여권·예약 서류':['여권 원본 3명, 유효기간 확인','대한항공 예약내역·편명·수하물 규정','호텔 3개 예약서와 무료 취소 마감시각','토요타 렌터카 예약서·인수/반납 영업소 확인','Visit Japan Web 입국·세관 준비','보험 증권·긴급 연락처'],
 '렌터카·운전':['한국 운전면허증 원본','1949년 제네바 협약 국제운전면허증 원본','여권·해외결제 가능한 카드','ETC 카드 장착/대여 여부','차량 운전석·주유구·보험 사진','좌측 통행·주차장 높이·반납 주유'],
 '부모님 건강·안전':['평소 복용약과 처방전·복약 시간표','미끄럼 방지 신발·가벼운 외투','여분의 물·간단한 간식','필요 시 보행 보조기·휴대 쿠션','온천 전 수분 섭취·짧은 입욕','11/29 유후인 추위 대비 목도리·장갑'],
 '휴대전화·결제':['로밍/eSIM·모바일 데이터','휴대폰 충전기·보조배터리(기내 휴대)','구글 지도·번역 앱','일본 콘센트 변환 플러그(A형)','현금 엔화 소액·해외결제카드','카드 이벤트 사전 등록 및 응모'],
 '귀국일 전용':['면세품·구입 영수증 분리','공항 세관 확인 전에 위탁수하물 맡기지 않기','렌터카 주유·반납 영수증·ETC 카드','대한항공 체크인·탑승구 확인','부모님 좌석·화장실·식수 확인','여권·휴대전화·지갑 최종 확인']
};
const fixedDefaults=[
 {id:'flight',name:'대한항공 왕복 3명',amount:1356400,currency:'KRW',note:'확정 예약금액'},
 {id:'rent',name:'토요타 렌터카 11/28~12/1',amount:45100,currency:'JPY',note:'주유·통행료 별도'},
 {id:'grand',name:'그랜드 머큐어 벳푸완 1박',amount:98562.50,currency:'JPY',note:'싱글 2 + 엑스트라 1, 올인클루시브'},
 {id:'munakata',name:'머큐어 무나카타 1박',amount:75173.50,currency:'JPY',note:'싱글 2 + 소파베드 1, 올인클루시브'},
 {id:'hilton',name:'힐튼 후쿠오카 1박',amount:72076,currency:'JPY',note:'트리플 · 조식 추가 인원 별도'},
 {id:'bath',name:'힐튼 이와부로 대욕장 3명',amount:5280,currency:'JPY',note:'¥1,760 × 3 (지정 객실 무료 가능)'},
 {id:'insurance',name:'여행자보험',amount:100700,currency:'KRW',note:'확정 예약금액'}
];
const variableDefaults=[
 {id:'hilton_breakfast',name:'힐튼 추가 1인 조식',note:'정확한 가격 미확인 · 예약 조건 확인'},
 {id:'lunch1',name:'11/28 벳푸 점심 · 3명',note:'벳푸만 SA'},
 {id:'lunch2',name:'11/29 유후인 점심 · 3명',note:'유후마부시 신'},
 {id:'lunch3',name:'11/30 후쿠오카 점심 · 3명',note:'라라포트'},
 {id:'dinner3',name:'11/30 저녁 · 3명',note:'힐튼 또는 MARK IS'},
 {id:'cafe',name:'카페·간식',note:'전 일정'},
 {id:'supermarket',name:'마트 장보기',note:'호텔 체크인 전'},
 {id:'admission',name:'관광지 입장료',note:'우미지옥 등'},
 {id:'souvenirs',name:'기념품·쇼핑',note:'지역별 선물'},
 {id:'fuel',name:'주유비',note:'렌터카 별도'},
 {id:'tolls',name:'고속도로·주차료',note:'ETC·통행료·주차'},
 {id:'other',name:'기타 비용',note:'개인 지출·예상외 비용'}
];
const sourceLinks=[
 ['일본정부관광국 JNTO','https://www.jnto.go.jp/'],
 ['Visit Japan Web','https://www.vjw.digital.go.jp/'],
 ['일본 국세청 면세 안내(한국어)','https://www.nta.go.jp/publication/pamph/shohi/menzei/201805/pdf/caution_kr.pdf'],
 ['그랜드 머큐어 벳푸완','https://grand-mercure-beppubay-resortandspa.jp/ko/'],
 ['머큐어 무나카타 올인클루시브','https://mercure-fukuokamunakata-resortandspa.jp/ko/'],
 ['힐튼 이와부로 대욕장 공식','https://www.hilton.com/en/hotels/fukhihi-hilton-fukuoka-sea-hawk/spa/'],
 ['규슈대학교 자유견학','https://www.kyushu-u.ac.jp/en/university/facility/campus-visit/freewalk/'],
 ['라라포트 운영시간','https://mitsui-shopping-park.com/ko/lalaport/fukuoka/hour/'],
 ['라라포트 주차장','https://mitsui-shopping-park.com/ko/lalaport/fukuoka/access/parking.html'],
 ['마루쇼쿠 세키노에점','https://www.sunlive.co.jp/shop/%E3%83%9E%E3%83%AB%E3%82%B7%E3%83%A7%E3%82%AF%E9%96%A2%E3%81%AE%E6%B1%9F%E5%BA%97/'],
 ['이온 유후인점','https://www.aeon.com/store/list/%E7%B7%8F%E5%90%88%E3%82%B9%E3%83%BC%E3%83%91%E3%83%BC/%E3%82%A4%E3%82%AA%E3%83%B3%E3%83%BB%E3%82%A4%E3%82%AA%E3%83%B3%E3%82%B9%E3%82%BF%E3%82%A4%E3%83%AB/%E4%B9%9D%E5%B7%9E%E5%9C%B0%E6%96%B9/%E5%A4%A7%E5%88%86%E7%9C%8C/%E3%82%A4%E3%82%AA%E3%83%B3%E6%B9%AF%E5%B8%83%E9%99%A2%E5%BA%97/'],
 ['KB 국민카드 공식 행사','https://card.kbcard.com/BON/DVIEW/HBBMCXCRVNEC0001?eventNum=1002702&mainCC=a'],
 ['하나 Mastercard 공식 행사','https://m.hanacard.co.kr/MKEVT1010M.web?EVN_SEQ=60615'],
 ['일본 기상청','https://www.jma.go.jp/jma/index.html'],
 ['Open-Meteo 날씨 API','https://open-meteo.com/']
];
const $=id=>document.getElementById(id);
const won=n=>`${Math.round(Number(n)||0).toLocaleString('ko-KR')}원`;
const yen=n=>`¥${Number(n||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2})}`;
function html(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function maps(q){return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(q);}
function routeUrl(d){return 'https://www.google.com/maps/dir/?api=1&travelmode=driving&origin='+encodeURIComponent(d.routeStart)+'&destination='+encodeURIComponent(d.routeEnd)+'&waypoints='+encodeURIComponent(d.routeWay.join('|'));}
let state;
try{state=JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch{state={};}
state.checks=state.checks||{};state.stops=state.stops||{};state.dayCompleted=state.dayCompleted||{};state.dayCollapsed=state.dayCollapsed||{};state.fixed=state.fixed||{};state.variable=state.variable||{};state.expenses=state.expenses||[];
function save(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch{notify('저장공간 부족: 백업을 권장합니다.');}}
function notify(msg){const n=$('toast');n.textContent=msg;n.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>n.classList.remove('show'),2600);}

const HOTEL_MEDIA = {
  grand: {
    main: 'https://media.grand-mercure-beppubay-resortandspa.jp/2024/10/Open-air-bath2_Grand-Mercure-Beppu-Bay-Resort-Spa_2024414_C1N6.webp',
    mainAlt: '그랜드 머큐어 벳푸완 리조트의 바다가 보이는 노천 대욕장',
    mainLabel: '벳푸만 전망 노천탕 · 호텔 공식 사진',
    detail: 'https://media.grand-mercure-beppubay-resortandspa.jp/2024/10/Superior-twin-Ocean-view_Grand-Mercure-Beppu-Bay-Resort-Spa_2024414_C1N6.webp',
    detailAlt: '그랜드 머큐어 벳푸완의 트윈룸 예시 이미지',
    detailLabel: '객실 유형별 구조가 다를 수 있습니다',
    official: 'https://grand-mercure-beppubay-resortandspa.jp/ko/',
    booking: 'https://all.accor.com/hotel/C1N6/index.en.shtml',
    gallery: 'https://grand-mercure-beppubay-resortandspa.jp/ko/rooms/',
    sourceLabel: '그랜드 머큐어 공식 제공',
    features: ['벳푸만 해안 리조트', '뷔페·라운지 포함', '대욕장·노천탕'],
    arrival: '11월 28일 토요일', bath: '대욕장·노천탕 · 숙박객 이용',
    breakfast: '올인클루시브 식사 포함'
  },
  munakata: {
    main: 'https://www.crossroadfukuoka.jp/storage/tourism_attractions/10143/responsive_images/kPfIrUMwsqDvSwxhyJJkosfWXxrVAoz5xlILbvZg__1673_1116.jpg',
    mainAlt: '후쿠오카현 관광 공식 사이트에 실린 머큐어 무나카타 호텔 외관',
    mainLabel: '해안 숲 속 리조트 · 후쿠오카현 관광 공식 사진',
    detail: 'https://media.mercure-fukuokamunakata-resortandspa.jp/2026/04/fukuoka_top_spring1.webp',
    detailAlt: '머큐어 후쿠오카 무나카타의 정원 노천온천',
    detailLabel: '노천온천 · 호텔 공식 사진',
    official: 'https://mercure-fukuokamunakata-resortandspa.jp/ko/',
    booking: 'https://all.accor.com/hotel/C1N7/index.en.shtml',
    gallery: 'https://mercure-fukuokamunakata-resortandspa.jp/ko/rooms/',
    sourceLabel: '후쿠오카현 관광 공식·호텔 공식 제공',
    features: ['사츠키 마쓰바라 인근', '저녁·조식·라운지 포함', '노천온천'],
    arrival: '11월 29일 일요일', bath: '겐카이 사츠키 온천 · 노천탕',
    breakfast: '올인클루시브 식사 포함'
  },
  hilton: {
    main: 'https://www.hilton.com/im/en/FUKHIHI/21420845/fukhihi-exterior-01.jpg?ch=3333&cw=5000&gravity=NorthWest&impolicy=crop&rh=427&rw=640&xposition=0&yposition=-1',
    mainAlt: '해안에서 바라본 힐튼 후쿠오카 씨호크 호텔 건물과 인접 돔',
    mainLabel: '하카타만 시티뷰 · 힐튼 공식 사진',
    detail: 'https://www.hilton.com/im/en/FUKHIHI/21420731/fukhihi-stonebath04.jpg?ch=3333&cw=5000&gravity=NorthWest&impolicy=crop&rh=427&rw=640&xposition=0&yposition=-1',
    detailAlt: '힐튼 후쿠오카 씨호크의 7층 이와부로 대욕장 내부',
    detailLabel: '7층 이와부로 대욕장 · 힐튼 공식 사진',
    official: 'https://www.hilton.com/en/hotels/fukhihi-hilton-fukuoka-sea-hawk/',
    booking: 'https://www.hilton.com/en/hotels/fukhihi-hilton-fukuoka-sea-hawk/',
    gallery: 'https://www.hilton.com/en/hotels/fukhihi-hilton-fukuoka-sea-hawk/gallery/',
    sourceLabel: '힐튼 공식 사진 제공',
    features: ['하카타만 시티뷰', '트리플 예약', '이와부로 별도 요금'],
    arrival: '11월 30일 월요일', bath: '7층 이와부로 · 3인 ¥5,280 추가',
    breakfast: '조식 1인 추가 금액 확인 필요'
  }
};
function hotelPhoto(url,alt,caption,photoClass) {
  return '<figure class="hotel-photo '+photoClass+'"><img src="'+url+'" alt="'+html(alt)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"><figcaption>'+html(caption)+'</figcaption><span class="photo-fallback">사진을 불러올 수 없습니다. 아래 공식 사진 링크를 이용해 주세요.</span></figure>';
}

/* Today-first overview: Japan local date; does not change any booking or itinerary. */
function japanLocalDate(){
 const parts=new Intl.DateTimeFormat('en-US',{
  timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'
 }).formatToParts(new Date());
 const p=Object.fromEntries(parts.filter(v=>v.type!=='literal').map(v=>[v.type,v.value]));
 return p.year+'-'+p.month+'-'+p.day;
}
function updateJourneyDashboard(){
 const title=$('todayTitle');
 if(!title)return;
 const date=japanLocalDate();
 const dates=['2026-11-28','2026-11-29','2026-11-30','2026-12-01'];
 let ix=dates.indexOf(date);
 if(ix<0)ix=date<dates[0]?0:3;
 const d=days[ix];
 const before=date<dates[0],after=date>dates[3];
 const labels=[
  '그랜드 머큐어 벳푸완',
  '머큐어 후쿠오카 무나카타',
  '힐튼 후쿠오카 씨호크',
  '후쿠오카공항 · KE792 귀국'
 ];
 const stayHints=[
  '올인클루시브 · 저녁·조식·온천 포함',
  '올인클루시브 · 저녁·조식·라운지 포함',
  '트리플 객실 · 이와부로 대욕장 추가 이용',
  '13:45 후쿠오카 출발 · 15:10 인천 도착'
 ];
 const stayBtn=$('todayStayLink');
 $('todayDay').textContent=(before?'출발 전 · 첫째 날 미리보기':after?'여행 기록 확인':'일본 현지 오늘 일정')+' · DAY '+d.num;
 title.textContent=d.where;
 $('todayDescription').textContent=d.subtitle;
 $('todayStay').textContent=labels[ix];
 $('todayStayHint').textContent=stayHints[ix];
 $('todayOpen').href='#'+d.id;
 $('todayOpen').textContent='DAY '+d.num+' 상세 일정 바로 보기 →';
 stayBtn.href=ix===3?'#flights':'#hotels';
 stayBtn.textContent=ix===3?'귀국 항공편 확인 ↗':'숙소 상세 정보 확인 ↗';
 const count=days.filter(x=>state.dayCompleted?.[x.id]).length;
 const phase=before?'여행 준비 중':after?'여행 종료':'여행 중';
 $('todayProgress').textContent=phase+' · '+count+'/4일 완료';
 document.querySelectorAll('.days-jump a').forEach(a=>{
   if(a.getAttribute('href')==='#'+d.id){
     a.setAttribute('aria-current','date');
   }else a.removeAttribute('aria-current');
 });
}

function renderHotels(){
 $('hotelGrid').innerHTML=hotels.map((h,i)=>{
   const m=HOTEL_MEDIA[h.id];
   return '<article class="card hotel-card">'
    +'<div class="hotel-media">'+hotelPhoto(m.main,m.mainAlt,m.mainLabel,'hotel-photo-main')+hotelPhoto(m.detail,m.detailAlt,m.detailLabel,'hotel-photo-side')+'</div>'
    +'<div class="hotel-card-inner"><div class="hotel-identity"><span class="hotel-number">STAY 0'+(i+1)+' · '+html(h.day)+'</span><span class="hotel-location">📍 '+html(h.city)+'</span></div>'
    +'<h3 class="hotel-name" title="'+html(h.name)+'" aria-label="'+html(h.name)+'" tabindex="0">'+html(({grand:'그랜드 머큐어 벳푸완',munakata:'머큐어 후쿠오카 무나카타',hilton:'힐튼 후쿠오카 씨호크'})[h.id]||h.name)+'</h3>'
    +'<p class="hotel-arrival">체크인 15:00 · 체크아웃 11:00 · '+html(m.arrival)+'</p>'
    +'<div class="hotel-feature-list">'+m.features.map(v=>'<span>'+html(v)+'</span>').join('')+'</div>'
    +'<dl class="hotel-facts"><div><dt>침대 구성</dt><dd>'+html(h.beds)+'</dd></div>'
    +'<div><dt>식사</dt><dd>'+html(m.breakfast)+'</dd></div>'
    +'<div><dt>목욕시설</dt><dd>'+html(m.bath)+'</dd></div>'
    +'<div><dt>예약금액</dt><dd><strong>'+yen(h.yen)+'</strong> <small>원화 환산은 경비 탭</small></dd></div>'
    +'<div><dt>취소조건</dt><dd>'+html(h.cancel)+'</dd></div></dl>'
    +'<p class="hotel-photo-note">호텔 홍보용 사진으로, 실제 예약 객실의 전망·침구와 다를 수 있습니다. <small>사진: '+html(m.sourceLabel)+'</small></p>'
    +'<div class="hotel-links"><a class="hotel-link-primary" target="_blank" rel="noopener noreferrer" href="'+m.official+'">공식 홈페이지 ↗</a>'
    +'<a class="small-link" target="_blank" rel="noopener noreferrer" href="'+m.gallery+'">객실 사진 ↗</a>'
    +'<a class="small-link" target="_blank" rel="noopener noreferrer" href="'+m.booking+'">예약 안내 ↗</a>'
    +'<a class="small-link" target="_blank" rel="noopener noreferrer" href="'+maps(h.map)+'">📍 길찾기 ↗</a></div>'
    +'</div></article>';
 }).join('');
 document.querySelectorAll('.hotel-photo img').forEach(img=>{
  img.addEventListener('error',()=>{const fig=img.closest('figure');if(fig)fig.classList.add('photo-unavailable');});
 });
}


/* Day-by-day tourism brochure media; remote images belong to credited source sites. */
const DAY_SPOT_MEDIA={
 day1:[
  {src:'https://cdn-ak.f.st-hatena.com/images/fotolife/t/tboffice/20250507/20250507092337.jpg',title:'우미지옥',detail:'푸른 온천 연못·기념품점, 짧게 관광',credit:'사진: 飛行機搭乗奇行',link:'https://tboffice.hateblo.jp/entry/beppu-umijigoku'},
  {src:HOTEL_MEDIA.grand.main,title:'그랜드 머큐어 벳푸완',detail:'체크인 후 라운지·저녁·온천 휴식',credit:'사진: 그랜드 머큐어 공식',link:HOTEL_MEDIA.grand.official}
 ],
 day2:[
  {src:'https://oita-tourism.com/lsc/upfile/spot/0000/1066/1066_9_l.jpg',title:'유후인 긴린코',detail:'호수 주변 20~30분 산책과 지역 선물',credit:'사진: 오이타현 공식 관광사이트',link:'https://oita-tourism.com/en/attractions/detail_1066.html'},
  {src:HOTEL_MEDIA.munakata.main,title:'머큐어 무나카타',detail:'지역 특산품 쇼핑 후 올인클루시브 숙박',credit:'사진: 후쿠오카현 공식 관광사이트',link:HOTEL_MEDIA.munakata.official}
 ],
 day3:[
  {src:'https://showcase.city.fukuoka.lg.jp/admn/mrgt/images/2014/10/img0986-1280x852.jpg',title:'규슈대학교 이토캠퍼스',detail:'중앙광장과 건물 외관만 짧게 방문',credit:'사진: 후쿠오카시 공식 사진자료',link:'https://showcase.city.fukuoka.lg.jp/photo/img0986.html'},
  {src:'https://gofukuoka.jp/files/Spots/40a6137d-2517-425e-ba6b-36dd5a2c2a08/image/ab32fedeecc49a94b5bacb9199e9396b.jpg',title:'라라포트 후쿠오카',detail:'점심·대형 쇼핑몰·건담 굿즈 쇼핑',credit:'사진: 후쿠오카시 공식 관광사이트',link:'https://gofukuoka.jp/ko/spots/detail/259810'}
 ],
 day4:[
  {src:HOTEL_MEDIA.hilton.main,title:'힐튼 후쿠오카 씨호크',detail:'조식·체크아웃 후 공항으로 이동',credit:'사진: 힐튼 공식',link:HOTEL_MEDIA.hilton.official},
  {src:'https://resources.matcha-jp.com/resize/720x2000/2023/03/16-136047.webp',title:'후쿠오카공항 국제선',detail:'렌터카 반납·세관 확인·KE792 귀국',credit:'사진: 일본 관광 매체 MATCHA',link:'https://matcha-jp.com/ko/11776'}
 ]
};
const DAY_FORECAST_DATES={
 day1:['2026-11-28'],day2:['2026-11-29'],
 day3:['2026-11-30'],day4:['2026-12-01']
};
let dayWeatherSnapshot=null;
state.dayCompleted=state.dayCompleted||{};
state.dayCollapsed=state.dayCollapsed||{};
function isMealStop(stop){return /점심|저녁|조식|식사/.test(stop[3]);}
function isSightStop(stop){return /관광|기념품|마트|쇼핑|선택|온천/.test(stop[3]);}
function dayWeatherData(id){
 const entries=dayWeatherSnapshot||weatherPlaces;
 return entries.filter(p=>(DAY_FORECAST_DATES[id]||[]).includes(p.date));
}
function oneLineWeather(place){
 const d=place.data||place.backup;
 const icon=place.data?weatherCondition(place.code)[0]:(d[2]>40?'🌦️':'🌤️');
 return '<span class="weather-one-line"><strong class="weather-place">'+html(place.label)+' · '+html(place.name)+'</strong>'
   +'<span class="weather-reading"><span aria-hidden="true">'+icon+'</span> '+Math.round(d[0])+'°/'+Math.round(d[1])+'°</span>'
   +'<span class="weather-rain">비 '+Math.round(d[2]??0)+'%</span></span>';
}
function dayWeatherMarkup(id){
 const rows=dayWeatherData(id);
 return rows.length?rows.map(p=>'<div class="day-weather-row">'+oneLineWeather(p)+'</div>').join(''):
 '<p class="day-weather-empty">날씨를 불러오지 못했습니다. 상단 날씨에서 새로고침해 주세요.</p>';
}
function dayHighlights(d){
 const sights=d.stops.filter(isSightStop);
 const meals=d.stops.filter(isMealStop);
 const list=(arr,max,empty)=>arr.length?
  '<ul>'+arr.slice(0,max).map(s=>'<li><span class="brief-time">'+html(s[0])+'</span><span>'+html(s[1])+'</span></li>').join('')+'</ul>':
  '<p class="brief-empty">'+empty+'</p>';
 return '<div class="day-highlight-grid">'
  +'<section class="day-highlight sight" aria-label="관광과 쇼핑"><h5>📍 관광·쇼핑</h5>'+list(sights,5,'귀국일에는 별도의 관광을 넣지 않았습니다.')+'</section>'
  +'<section class="day-highlight meal" aria-label="식사와 카페"><h5>🍽️ 식사·카페</h5>'+list(meals,4,'별도 식사 일정 없이 이동과 수속에 집중합니다.')+'</section>'
  +'</div>';
}
function spotPhotos(id){
 return (DAY_SPOT_MEDIA[id]||[]).map(m=>'<figure class="day-spot-photo">'
  +'<a href="'+m.link+'" target="_blank" rel="noopener noreferrer" aria-label="'+html(m.title)+' 사진 출처 열기">'
  +'<img src="'+m.src+'" alt="'+html(m.title)+' 풍경 사진" loading="lazy" decoding="async" referrerpolicy="no-referrer">'
  +'<span class="day-spot-fallback">사진을 불러오지 못했습니다. 사진 출처 보기 ↗</span></a>'
  +'<figcaption><strong>'+html(m.title)+'</strong><span>'+html(m.detail)+'</span>'
  +'<small>'+html(m.credit)+'</small></figcaption></figure>').join('');
}
function dayStopRow(d,s,i){
 const done=!!state.stops[d.id+'-'+i];
 const type=isMealStop(s)?'meal-stop':isSightStop(s)?'sight-stop':'transit-stop';
 return '<li class="stop '+type+(done?' done':'')+'" data-stop="'+d.id+'-'+i+'">'
  +'<div class="stop-time">'+html(s[0])+'</div><div class="stop-detail"><div class="stop-title">'+html(s[1])+'</div>'
  +'<p class="stop-desc">'+html(s[2])+'</p><div class="stop-tags"><span class="stop-tag">'+html(s[3])+'</span>'
  +(s[5]?'<span class="stop-tag important">중요</span>':'')+(s[6]?'<span class="stop-tag">선택 일정</span>':'')+'</div>'
  +'<div class="stop-actions">'
  +(s[4]?'<a target="_blank" rel="noopener noreferrer" href="'+maps(s[4])+'" aria-label="'+html(s[1])+' 지도에서 보기">📍 길찾기 ↗</a>':'')
  +'<button type="button" class="stop-toggle" data-key="'+d.id+'-'+i+'" aria-pressed="'+done+'">'+(done?'✓ 완료됨':'□ 완료 표시')+'</button>'
  +'</div></div></li>';
}

/* Compact geo overview. Coordinates approximate map anchors, not road routing.
 * OpenStreetMap via Leaflet (no API key); offline gracefully falls back to a schematic.
 */
const DAY_ROUTE_MAPS={
 day1:[
  ['후쿠오카공항',33.585,130.451],['야마다 SA',33.430,130.730],
  ['벳푸만 SA',33.339,131.478],['우미지옥',33.317,131.468],
  ['마트',33.339,131.493],['벳푸완 호텔',33.35603,131.49832]
 ],
 day2:[
  ['벳푸완 호텔',33.35603,131.49832],['긴린코',33.265,131.369],
  ['유후인 점심·마트',33.265,131.359],['무나카타 특산품점',33.852,130.539],
  ['무나카타 호텔',33.860,130.520]
 ],
 day3:[
  ['무나카타 호텔',33.860,130.520],['규슈대 이토캠퍼스',33.595,130.224],
  ['라라포트',33.570,130.445],['하카타 마잉',33.590,130.420],
  ['MARK IS 마트',33.592,130.358],['힐튼 씨호크',33.595,130.355]
 ],
 day4:[
  ['힐튼 씨호크',33.595,130.355],['후쿠오카공항 국제선',33.585,130.452]
 ]
};
let leafletPromise=null;
let instantiatedRouteMaps=[];
function loadLeaflet(){
 if(window.L)return Promise.resolve(window.L);
 if(leafletPromise)return leafletPromise;
 leafletPromise=new Promise((resolve,reject)=>{
  if(!document.querySelector('link[data-leaflet]')){
   const css=document.createElement('link');css.rel='stylesheet';css.dataset.leaflet='1';
   css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
   css.crossOrigin='anonymous';document.head.appendChild(css);
  }
  const script=document.createElement('script');
  script.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
  script.crossOrigin='anonymous';script.async=true;
  script.onload=()=>window.L?resolve(window.L):reject(new Error('Leaflet unavailable'));
  script.onerror=()=>reject(new Error('Map tiles unavailable'));
  document.head.appendChild(script);
 }).catch(()=>null);
 return leafletPromise;
}
function routeMapFallback(dayId){
 const points=DAY_ROUTE_MAPS[dayId]||[];
 const n=points.length;
 const spots=points.map((p,i)=>{
  const x=25+(i%3)*144+(Math.floor(i/3)%2)*6, y=48+Math.floor(i/3)*97;
  return {name:p[0],i,x:Math.min(x,339),y:Math.min(y,170)};
 });
 const path=spots.map((p,i)=>(i?'L':'M')+p.x+' '+p.y).join(' ');
 return '<svg class="route-map-fallback" viewBox="0 0 360 204" role="img" aria-label="'+html(points.map(p=>p[0]).join(' → '))+'">'
 +'<defs><linearGradient id="mapBg-'+dayId+'" x2="0" y2="1"><stop stop-color="#e6f0e9"/><stop offset="1" stop-color="#f5f6ed"/></linearGradient></defs>'
 +'<rect width="360" height="204" rx="14" fill="url(#mapBg-'+dayId+')"/>'
 +'<path d="M10 140 Q 95 65 164 130 T355 78" fill="none" stroke="#c7dccc" stroke-width="23" opacity=".9"/>'
 +'<path d="M-5 23 Q90 95 165 26 T365 160" fill="none" stroke="#fff" stroke-width="6" opacity=".8"/>'
 +'<path d="'+path+'" fill="none" stroke="#176e70" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="7 5"/>'
 +spots.map(p=>'<circle cx="'+p.x+'" cy="'+p.y+'" r="14" fill="#155a65" stroke="#fff" stroke-width="3"/><text x="'+p.x+'" y="'+(p.y+5)+'" fill="#fff" font-size="14" text-anchor="middle" font-weight="bold">'+(p.i+1)+'</text>').join('')
 +'<text x="12" y="195" font-size="10" fill="#496c65">개략 동선 · 도로 지도는 아래 길찾기 이용</text></svg>';
}
function routeMapPanel(d){
 const places=DAY_ROUTE_MAPS[d.id]||[];
 return '<section class="day-route-panel" aria-label="'+html(d.date)+' 이동 동선지도">'
  +'<h4>🗺️ 오늘의 동선지도</h4>'
  +'<div class="route-map-stage" id="route-map-'+d.id+'" data-route-map="'+d.id+'">'+routeMapFallback(d.id)+'</div>'
  +'<ol class="route-map-place-list" aria-label="주요 방문 순서">'
  +places.map((p,i)=>'<li><span class="route-map-index">'+(i+1)+'</span>'+html(p[0])+'</li>').join('')
  +'</ol>'
  +'<a class="route-map-link" href="'+routeUrl(d)+'" target="_blank" rel="noopener noreferrer">🚗 실제 차량 길찾기 열기 ↗</a>'
  +'<p class="route-map-caveat">지도 핀·직선 연결은 개략 위치입니다. 실제 도로·교통·렌터카 반납점은 길찾기에서 확인하세요.</p>'
  +'</section>';
}
function clearRouteMaps(){
 instantiatedRouteMaps.forEach(m=>{try{m.remove()}catch{}});
 instantiatedRouteMaps=[];
}
async function initializeRouteMaps(){
 // A useful offline schematic is already visible. Leaflet upgrades it only when available.
 if(!document.querySelectorAll)return;
 const shells=[...document.querySelectorAll('.route-map-stage')].filter(el=>el.offsetParent!==null);
 if(!shells.length)return;
 const Leaflet=await loadLeaflet();
 if(!Leaflet)return;
 for(const shell of shells){
  if(!shell.isConnected||shell.offsetParent===null||shell.dataset.initialized)continue;
  const places=DAY_ROUTE_MAPS[shell.dataset.routeMap]||[];
  if(!places.length)continue;
  try{
   shell.innerHTML='';
   const m=Leaflet.map(shell,{zoomControl:false,attributionControl:true,
     dragging:false,scrollWheelZoom:false,doubleClickZoom:false,touchZoom:false,
     boxZoom:false,keyboard:false,trackResize:true});
   instantiatedRouteMaps.push(m);
   Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
     attribution:'© OpenStreetMap contributors',maxZoom:18,
     detectRetina:false
   }).addTo(m);
   const pts=places.map(p=>[p[1],p[2]]);
   Leaflet.polyline(pts,{color:'#166a70',weight:4,opacity:.84,dashArray:'7 6'}).addTo(m);
   places.forEach((p,i)=>{
     const marker=Leaflet.divIcon({
       className:'route-pin-wrapper',
       html:'<span class="route-pin">'+(i+1)+'</span>',
       iconSize:[30,30],iconAnchor:[15,15]
     });
     Leaflet.marker([p[1],p[2]],{icon:marker,keyboard:false})
       .bindTooltip((i+1)+'. '+p[0],{direction:'top'}).addTo(m);
   });
   const bounds=Leaflet.latLngBounds(pts);
   m.fitBounds(bounds.pad(.24),{padding:[20,20],maxZoom:12,animate:false});
   if(places.length===2)m.setZoom(Math.min(m.getZoom(),11));
   shell.dataset.initialized='1';
   requestAnimationFrame(()=>{if(shell.isConnected&&shell.offsetParent!==null)m.invalidateSize(false);});
  }catch{
   shell.innerHTML=routeMapFallback(shell.dataset.routeMap);
  }
 }
}

function renderDays(){
 clearRouteMaps();
 $('daySections').innerHTML=days.map(d=>{
  const completed=!!state.dayCompleted[d.id],collapsed=!!state.dayCollapsed[d.id];
  const panelId='day-panel-'+d.id;
  return '<article class="card day-card'+(completed?' is-complete':'')+'" id="'+d.id+'">'
   +'<header class="day-header"><div class="day-heading"><div class="day-kicker">DAY '+d.num+' · '+html(d.date)+'</div>'
   +'<h3>'+html(d.where)+'</h3><p>'+html(d.subtitle)+'</p></div>'
   +'<div class="day-header-actions"><span class="day-status'+(completed?' complete':'')+'">'+(completed?'✓ 여행 완료':'진행 예정')+'</span>'
   +'<button type="button" class="day-complete-toggle" data-day-id="'+d.id+'" aria-pressed="'+completed+'" aria-label="'+html(d.date)+' 여행 완료 표시'+(completed?' 취소':'')+'">'+(completed?'완료 취소':'✓ 이날 여행 완료')+'</button>'
   +'<button type="button" class="day-collapse-toggle" data-day-id="'+d.id+'" aria-expanded="'+(!collapsed)+'" aria-controls="'+panelId+'">'+(collapsed?'＋ 일정 다시 펼치기':'− 일정 접기')+'</button>'
   +'</div></header>'
   +'<div id="'+panelId+'" class="day-body"'+(collapsed?' hidden':'')+'>'
   +'<div class="day-content-grid"><div class="day-primary">'
   +'<div class="day-top"><p class="day-summary">🚙 이동시간은 교통·주차·부모님 휴식에 따라 달라지는 <strong>예상 시간</strong>입니다.</p>'
   +'<a class="day-map" target="_blank" rel="noopener noreferrer" href="'+routeUrl(d)+'">🧭 오늘 차량 길찾기 ↗</a></div>'
   +'<div class="route-rail" aria-label="이동 순서">'+d.route.map(x=>'<span class="route-chip">'+html(x)+'</span>').join('')+'</div>'
   +'<div class="timeline-title"><h4>시간순 전체 일정</h4><p><span class="type-key sight-key">관광·쇼핑</span><span class="type-key meal-key">식사·카페</span>로 구분했습니다.</p></div>'
   +'<ol class="timeline">'+d.stops.map((s,i)=>dayStopRow(d,s,i)).join('')+'</ol>'
   +'<div class="day-tips"><div class="tip-box"><strong>💡 꼭 기억할 팁</strong>'+html(d.tip)+'</div>'
   +'<div class="tip-box warning"><strong>☔ 비·피로 시 B안</strong>'+html(d.alt)+'</div></div>'
   +'</div><aside class="day-aside" aria-label="'+html(d.date)+'의 날씨와 주요 장소">'
   +'<section class="day-weather-panel"><h4>🌤️ 해당 날짜 예상 날씨</h4><div data-day-weather="'+d.id+'">'+dayWeatherMarkup(d.id)+'</div>'
   +'<p>현지 예보 · 출발 전 날씨 새로고침</p></section>'
   +routeMapPanel(d)
   +'<section class="day-spot-panel"><h4>📷 주요 스팟 사진</h4>'+spotPhotos(d.id)+'</section>'
   +'<section class="day-brief-panel"><h4>한눈에 보는 오늘</h4>'+dayHighlights(d)+'</section>'
   +'</aside></div></div></article>';
 }).join('');
 document.querySelectorAll('.day-spot-photo img').forEach(img=>{
  img.addEventListener('error',()=>{const parent=img.closest('.day-spot-photo');if(parent)parent.classList.add('photo-error');});
 });
 initializeRouteMaps();
}

function renderPromo(){$('promoGrid').innerHTML=promos.map(p=>`<article class="card promo-card"><div class="promo-title">${html(p.name)}</div><div class="promo-dates">${html(p.duration)}</div><p><strong>${html(p.lead)}</strong></p><p>${html(p.detail)}</p><span class="pill muted">${html(p.tag)}</span><p style="margin-top:15px"><a class="small-link" target="_blank" rel="noopener noreferrer" href="${html(p.url)}">공식 상세 안내 ↗</a></p></article>`).join('');$('souvenirGrid').innerHTML=souvenirs.map(a=>`<div class="souvenir"><strong>📦 ${html(a[0])}</strong>${html(a[1])}</div>`).join('');}
function renderChecks(){let count=0,total=0;$('checklistGrid').innerHTML=Object.entries(checks).map(([group,arr])=>{const n=arr.filter((_,i)=>state.checks[group+'-'+i]).length;count+=n;total+=arr.length;return `<section class="card check-group"><h3>${html(group)}</h3><p class="check-progress">${n} / ${arr.length}개 완료</p>${arr.map((item,i)=>{let key=group+'-'+i;let done=!!state.checks[key];return `<label class="check-row${done?' done':''}"><input type="checkbox" data-check="${html(key)}" ${done?'checked':''}><span>${html(item)}</span></label>`;}).join('')}</section>`}).join('');$('checklist').querySelector('.section-head p:last-child').textContent=`${total}개 중 ${count}개 준비했습니다. 체크 내용은 기기에 자동 저장됩니다.`;}
function getRate(){const r=Number($('fxRate').value);return Number.isFinite(r)&&r>0?r:DEFAULT_RATE;}
function getFixed(id){const v=Number(state.fixed[id]);return state.fixed[id]!==undefined&&Number.isFinite(v)&&v>=0?v:fixedDefaults.find(x=>x.id===id).amount;}
function renderCosts(){let savedRate=Number(state.fx);$('fxRate').value=Number.isFinite(savedRate)&&savedRate>0?savedRate:DEFAULT_RATE;$('feePercent').value=state.fee??0;$('reservePercent').value=state.reserve??10;$('fixedRows').innerHTML=fixedDefaults.map(x=>`<div class="cost-row"><label for="fixed-${x.id}">${html(x.name)}<small>${html(x.note)}</small></label><input id="fixed-${x.id}" type="number" inputmode="decimal" min="0" step="0.01" data-fixed="${x.id}" value="${getFixed(x.id)}" aria-label="${html(x.name)} 금액(${x.currency==='JPY'?'엔':'원'})"><div class="cost-display" data-fixed-convert="${x.id}"></div></div>`).join('');$('variableRows').innerHTML=variableDefaults.map(x=>`<div class="cost-row"><label for="var-${x.id}">${html(x.name)}<small>${html(x.note)}</small></label><input id="var-${x.id}" type="number" inputmode="decimal" min="0" step="0.01" data-variable="${x.id}" placeholder="엔 단위로 입력" value="${state.variable[x.id]??''}" aria-label="${html(x.name)} 예상금액 엔"><div class="cost-display" data-variable-convert="${x.id}">미입력</div></div>`).join('');calculate();}
function calculate(){const rate=getRate();let fixedKrw=0,jpyBase=0;fixedDefaults.forEach(x=>{const n=getFixed(x.id);const krw=x.currency==='JPY'?n*rate:n;if(x.currency==='JPY')jpyBase+=n;fixedKrw+=krw;const e=document.querySelector(`[data-fixed-convert="${x.id}"]`);if(e)e.textContent=(x.currency==='JPY'?yen(n)+' ≈ ':'')+won(krw);});let extraKrw=0,filled=0;variableDefaults.forEach(x=>{const n=Number(state.variable[x.id]);const has=state.variable[x.id]!==undefined&&state.variable[x.id]!==''&&Number.isFinite(n)&&n>=0;let k=has?n*rate:0;extraKrw+=k;if(has)filled++;jpyBase+=has?n:0;const e=document.querySelector(`[data-variable-convert="${x.id}"]`);if(e)e.textContent=has?`≈ ${won(k)}`:'미입력';});let fee=Math.max(0,Number($('feePercent').value)||0)/100*jpyBase*rate;let total=fixedKrw+extraKrw+fee;let reserve=Math.max(0,Number($('reservePercent').value)||0)/100*total;$('grandTotal').textContent=won(total);$('perPerson').textContent=won(total/3);$('perDay').textContent=won(total/4);$('withReserve').textContent=won(total+reserve);let t=$('budget').querySelector('.section-head p:last-child');t.textContent=`예약금액 + 입력한 추가 항목 ${filled}/${variableDefaults.length}개 · 환율 ${rate.toFixed(5)}원/엔 · 수수료 ${won(fee)}. 추가 미입력 비용은 합계에 포함되지 않습니다.`;}
function renderExpenses(){let rate=getRate(),sum=0;$('expenseList').innerHTML=state.expenses.length?state.expenses.slice().reverse().map(x=>{let krw=x.currency==='JPY'?x.amount*rate:x.amount;sum+=krw;return `<div class="expense-item"><div><strong>${html(x.day)} · ${html(x.title)}</strong><p>${x.currency==='JPY'?yen(x.amount):won(x.amount)} · 환산 ${won(krw)}</p></div><button type="button" data-expense-delete="${html(x.id)}" aria-label="${html(x.title)} 지출 삭제">삭제</button></div>`}).join(''):'<p>아직 입력한 지출이 없습니다.</p>';$('expenseSum').textContent='실제 기록된 지출 합계 '+won(sum);}
function renderSources(){$('sourceLinks').innerHTML=sourceLinks.map(([name,url])=>`<a target="_blank" rel="noopener noreferrer" href="${html(url)}">${html(name)} ↗</a>`).join('');}
function setupCountdown(){const now=new Date(),departure=new Date('2026-11-28T07:45:00+09:00');const diff=Math.ceil((departure-now)/86400000);$('tripCountdown').textContent=diff>0?`출국 D-${diff}`:diff===0?'오늘 출국':now<new Date('2026-12-02T00:00:00+09:00')?'여행 중':'여행 종료';}
const weatherPlaces=[
 {name:'벳푸',date:'2026-11-28',label:'11/28 토',lat:33.2847,lon:131.491,backup:[18,7,62,'소나기 가능']},
 {name:'유후인',date:'2026-11-29',label:'11/29 일',lat:33.2636,lon:131.356,backup:[10,-1,0,'맑음·아침 추움']},
 {name:'무나카타',date:'2026-11-29',label:'11/29 일',lat:33.808,lon:130.541,backup:[14,7,0,'대체로 맑음']},
 {name:'후쿠오카',date:'2026-11-30',label:'11/30 월',lat:33.590,lon:130.401,backup:[17,9,3,'대체로 맑음']},
 {name:'후쿠오카',date:'2026-12-01',label:'12/1 화',lat:33.590,lon:130.401,backup:[21,12,1,'약간 흐림']}
];
function weatherCondition(code){if(code===0)return ['☀️','맑음'];if(code<=3)return ['🌤️','구름 조금'];if(code<=48)return ['🌫️','안개'];if(code<=67)return ['🌦️','비 가능'];if(code<=77)return ['🌨️','눈'];if(code<=82)return ['🌧️','비'];if(code<=86)return ['🌨️','눈'];return ['⛈️','소나기/천둥'];}

function renderWeather(items,live){
 dayWeatherSnapshot=items;
 $('weatherGrid').innerHTML=items.map(x=>'<article class="weather-day" aria-label="'+html(x.label)+' '+html(x.name)+' 날씨">'+oneLineWeather(x)+'</article>').join('');
 document.querySelectorAll('[data-day-weather]').forEach(el=>{el.innerHTML=dayWeatherMarkup(el.dataset.dayWeather);});
 $('weatherMeta').textContent=live?
  'Open-Meteo 예보 갱신 · 일본 현지시간 '+new Date().toLocaleString('ko-KR',{timeZone:'Asia/Tokyo'})+' · 변동 가능':
  '2026년 11월 24일 확인한 예보를 임시 표시합니다. 온라인에서 새로고침해 주세요.';
}
async function loadWeather(){const b=$('refreshWeather');b.disabled=true;b.textContent='날씨 확인 중…';let received=0;const outcomes=await Promise.all(weatherPlaces.map(async p=>{try{const url=`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Asia%2FTokyo&start_date=${p.date}&end_date=${p.date}`;let c=new AbortController();const t=setTimeout(()=>c.abort(),10000);let response=await fetch(url,{signal:c.signal});clearTimeout(t);if(!response.ok)throw Error('weather');const j=await response.json();const a=j.daily;if(!a?.temperature_2m_max?.length)throw Error('data');received++;return {...p,code:a.weather_code[0],data:[a.temperature_2m_max[0],a.temperature_2m_min[0],a.precipitation_probability_max?.[0]??0,'']};}catch{return p;}}));renderWeather(outcomes,received===weatherPlaces.length);b.disabled=false;b.textContent='↻ 날씨 새로고침';}
function setupEvents(){
 $('fontSizeBtn').addEventListener('click',()=>{const b=document.body.classList.toggle('large-text');$('fontSizeBtn').setAttribute('aria-pressed',String(b));state.large=b;save()});
 $('contrastBtn').addEventListener('click',()=>{const b=document.body.classList.toggle('high-contrast');$('contrastBtn').setAttribute('aria-pressed',String(b));state.contrast=b;save()});
 $('refreshWeather').addEventListener('click',loadWeather);
 $('daySections').addEventListener('click',e=>{
  const dayDone=e.target.closest('button.day-complete-toggle');
  if(dayDone){
    const id=dayDone.dataset.dayId;
    state.dayCompleted[id]=!state.dayCompleted[id];
    state.dayCollapsed[id]=!!state.dayCompleted[id];
    save();renderDays();
    const control=document.querySelector('#'+id+' .day-collapse-toggle');
    control?.focus({preventScroll:true});
    updateJourneyDashboard();
    notify(state.dayCompleted[id]?'이날 여행을 완료하고 접었습니다.':'여행 완료 표시를 취소했습니다.');
    return;
  }
  const dayExpand=e.target.closest('button.day-collapse-toggle');
  if(dayExpand){
    const id=dayExpand.dataset.dayId;
    state.dayCollapsed[id]=!state.dayCollapsed[id];
    save();renderDays();
    document.querySelector('#'+id+' .day-collapse-toggle')?.focus({preventScroll:true});
    return;
  }
  const b=e.target.closest('button.stop-toggle');
  if(!b)return;
  const k=b.dataset.key;
  state.stops[k]=!state.stops[k];
  save();renderDays();
  document.querySelector('button.stop-toggle[data-key="'+k+'"]')?.focus({preventScroll:true});
  notify('일정 완료 표시를 저장했습니다.');
 });
 $('checklistGrid').addEventListener('change',e=>{if(!e.target.matches('[data-check]'))return;state.checks[e.target.dataset.check]=e.target.checked;save();renderChecks();});
 $('resetChecks').addEventListener('click',()=>{if(!confirm('준비물 체크 표시를 모두 지울까요?'))return;state.checks={};save();renderChecks();});
 $('fxRate').addEventListener('input',()=>{state.fx=$('fxRate').value;save();calculate();renderExpenses();});
 $('fixedRows').addEventListener('input',e=>{if(!e.target.matches('[data-fixed]'))return;state.fixed[e.target.dataset.fixed]=Math.max(0,Number(e.target.value)||0);save();calculate();});
 $('variableRows').addEventListener('input',e=>{if(!e.target.matches('[data-variable]'))return;state.variable[e.target.dataset.variable]=e.target.value;save();calculate();});
 for(const [id,key] of [['feePercent','fee'],['reservePercent','reserve']])$(id).addEventListener('input',e=>{state[key]=e.target.value;save();calculate();});
 $('expenseForm').addEventListener('submit',e=>{e.preventDefault();const title=$('expenseTitle').value.trim(),amount=Number($('expenseAmount').value);if(!title||!Number.isFinite(amount)||amount<=0)return;state.expenses.push({id:uniqueId(),day:$('expenseDay').value,title,amount,currency:$('expenseCurrency').value});save();$('expenseForm').reset();renderExpenses();notify('지출 기록을 저장했습니다.');});
 $('expenseList').addEventListener('click',e=>{const b=e.target.closest('[data-expense-delete]');if(!b)return;if(!confirm('이 지출을 삭제할까요?'))return;state.expenses=state.expenses.filter(x=>x.id!==b.dataset.expenseDelete);save();renderExpenses();});
 $('exportBudget').addEventListener('click',()=>{const s=['날짜,내용,금액,통화',...state.expenses.map(x=>[x.day,x.title,x.amount,x.currency].map(v=>'"'+String(v).replaceAll('"','""')+'"').join(','))].join('\n');downloadFile('kyushu-expenses.csv',new Blob(['\ufeff'+s],{type:'text/csv;charset=utf-8'}));});
 $('photoForm').addEventListener('submit',addPhoto);
 $('photoGallery').addEventListener('click',async e=>{const b=e.target.closest('[data-photo-delete]');if(!b)return;if(!confirm('이 사진·메모 기록을 삭제할까요?'))return;try{await dbDelete(b.dataset.photoDelete);await loadGallery();notify('사진 기록을 삭제했습니다.')}catch{notify('삭제하지 못했습니다.')}});
 $('backupBtn').addEventListener('click',backupAll);$('importBackup').addEventListener('change',importAll);
}
function uniqueId(){return typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():String(Date.now())+'-'+String(Math.random()).slice(2);}
function downloadFile(name,blob){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),3000);}
const DB_NAME='kyushu-family-photos-2026';
function openDb(){return new Promise((resolve,reject)=>{if(!window.indexedDB)return reject(Error('indexedDB unavailable'));const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>r.result.createObjectStore('photos',{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function dbAll(){const d=await openDb();return new Promise((res,rej)=>{const t=d.transaction('photos','readonly');const r=t.objectStore('photos').getAll();r.onsuccess=()=>{d.close();res(r.result||[])};r.onerror=()=>{d.close();rej(r.error)}});}
async function dbPut(record){const d=await openDb();return new Promise((res,rej)=>{const t=d.transaction('photos','readwrite');t.objectStore('photos').put(record);t.oncomplete=()=>{d.close();res()};t.onerror=()=>{d.close();rej(t.error)}});}
async function dbDelete(id){const d=await openDb();return new Promise((res,rej)=>{const t=d.transaction('photos','readwrite');t.objectStore('photos').delete(id);t.oncomplete=()=>{d.close();res()};t.onerror=()=>{d.close();rej(t.error)}});}
async function compressPhoto(file){if(file.size>30e6)throw Error('사진 1장 최대 30MB');const img=await createImageBitmap(file);const scale=Math.min(1,1400/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);img.close?.();return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('이미지 변환 실패')),'image/jpeg',.78));}
async function addPhoto(e){e.preventDefault();const file=$('photoFile').files?.[0],title=$('photoTitle').value.trim();if(!file||!title)return;$('photoStatus').textContent='사진을 기기에 저장하고 있습니다…';try{const blob=await compressPhoto(file);await dbPut({id:uniqueId(),title,day:$('photoDay').value,memo:$('photoMemo').value.trim(),blob,created:Date.now()});$('photoForm').reset();$('photoStatus').textContent='사진이 이 기기에 저장되었습니다.';await loadGallery();notify('사진 저장 완료');}catch(err){$('photoStatus').textContent='사진 저장 실패: '+err.message+' (일부 HEIC는 JPEG로 변환 후 업로드해 주세요.)';}}
let galleryUrls=[];
async function loadGallery(){galleryUrls.forEach(x=>URL.revokeObjectURL(x));galleryUrls=[];const g=$('photoGallery');try{const arr=(await dbAll()).sort((a,b)=>b.created-a.created);if(!arr.length){g.innerHTML='<p>아직 저장한 사진이 없습니다. 첫날의 사진을 기록해 보세요.</p>';return;}g.innerHTML=arr.map(x=>{const u=URL.createObjectURL(x.blob);galleryUrls.push(u);return `<article class="photo-entry"><img src="${u}" alt="${html(x.title)}" loading="lazy"><div><h4>${html(x.title)}</h4><p>${html(dayLabels[x.day]||x.day)} · ${html(x.memo||'메모 없음')}</p><button type="button" data-photo-delete="${html(x.id)}">사진 삭제</button></div></article>`}).join('');}catch{g.innerHTML='<p>이 브라우저에서는 사진을 저장할 수 없습니다. HTTPS GitHub Pages에서 다시 시도해 주세요.</p>';}}
function blobToDataURL(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(r.error);r.readAsDataURL(blob);});}
function dataURLToBlob(dataURL){const [h,data]=dataURL.split(',');const mime=(h.match(/data:(.*?);base64/)||[])[1]||'image/jpeg';const bytes=atob(data),a=new Uint8Array(bytes.length);for(let i=0;i<bytes.length;i++)a[i]=bytes.charCodeAt(i);return new Blob([a],{type:mime});}
async function backupAll(){try{$('photoStatus').textContent='백업 파일을 준비 중입니다…';const photos=await dbAll();const out=[];for(const x of photos)out.push({...x,blob:await blobToDataURL(x.blob)});const payload={version:1,exported:new Date().toISOString(),state,photos:out};downloadFile('kyushu-family-backup-'+new Date().toISOString().slice(0,10)+'.json',new Blob([JSON.stringify(payload)],{type:'application/json'}));$('photoStatus').textContent='백업 파일 저장이 시작되었습니다. 이 파일을 안전한 곳에 보관하세요.';}catch(err){$('photoStatus').textContent='백업을 만들지 못했습니다: '+err.message;}}
async function importAll(e){const f=e.target.files?.[0];if(!f)return;try{const data=JSON.parse(await f.text());if(data.version!==1||!data.state||!Array.isArray(data.photos))throw Error('지원하지 않는 백업 파일');if(!confirm('백업 파일의 내용으로 준비물·지출 기록을 바꾸고 사진을 추가할까요?'))return;for(const p of data.photos){if(typeof p.blob!=='string'||!p.blob.startsWith('data:image/'))continue;await dbPut({...p,blob:dataURLToBlob(p.blob)});}state={...data.state,checks:data.state.checks||{},stops:data.state.stops||{},fixed:data.state.fixed||{},variable:data.state.variable||{},expenses:data.state.expenses||[]};save();location.reload();}catch(err){notify('백업 복원 실패: '+err.message)}finally{e.target.value='';}}
function init(){if(state.large){document.body.classList.add('large-text');$('fontSizeBtn').setAttribute('aria-pressed','true');}if(state.contrast){document.body.classList.add('high-contrast');$('contrastBtn').setAttribute('aria-pressed','true');}setupCountdown();renderHotels();renderDays();updateJourneyDashboard();renderPromo();renderChecks();renderCosts();renderExpenses();renderSources();setupEvents();renderWeather(weatherPlaces,false);loadWeather();loadGallery();if('serviceWorker'in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
