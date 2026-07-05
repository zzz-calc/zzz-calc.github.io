(function () {
  "use strict";

  const DATA_VERSION = "2026-07-06-v1.4-autocomplete-selects-3.0";
  const DATA_PROFILE = {
    label: "3.0 live",
    agents: 56,
    wEngines: 93,
    driveDiscs: 28,
    naming: "에이전트 이름과 W-Engine 이름은 API 한국어명을 우선 표시하고, 영어명은 검색과 DB 식별용으로 유지합니다.",
  };
  const STATE_STORAGE_KEY = "zzz-calc-state";
  const THEME_STORAGE_KEY = "zzz-calc-theme";
  const EFFECT_DB_URL = "data/effects.mock.json";
  const AGENT_API_VERSION = "3.0";
  const AGENT_API_BASE = `https://static.nanoka.cc/zzz/${AGENT_API_VERSION}`;
  const NANOKA_ASSET_BASE = "https://static.nanoka.cc/assets/zzz";
  const TRANSIENT_FIELD_IDS = new Set(["agent-name-filter", "agent-role-filter", "agent-attribute-filter", "agent-rank-filter", "database-search"]);
  const SEARCHABLE_SELECTS = {
    "agent-select": "에이전트 검색",
    "growth-agent-select": "에이전트 검색",
    "party-slot-1": "파티원 검색",
    "party-slot-2": "파티원 검색",
    "engine-select": "W-Engine / 전무 검색",
    "disc-four": "4세트 디스크 검색",
    "disc-two": "2세트 디스크 검색",
    "party-disc-1": "파티원 1 디스크 검색",
    "party-disc-2": "파티원 2 디스크 검색",
  };

  const roleLabels = {
    all: "전체",
    attack: "강공",
    stun: "격파",
    anomaly: "이상",
    support: "지원",
    defense: "방어",
    rupture: "명파",
  };

  const attributeLabels = {
    all: "전체",
    physical: "물리",
    fire: "불",
    ice: "얼음",
    frost: "서리",
    electric: "전기",
    ether: "에테르",
    wind: "바람",
    auricInk: "현묵",
  };

  const rankLabels = {
    all: "전체",
    S: "S",
    A: "A",
    B: "B",
    I: "I",
  };

  function fandomAvatar(fileName) {
    return `https://zenless-zone-zero.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(fileName)}`;
  }

  const agents = [
    {
      id: "anby",
      kr: "안비 데마라",
      en: "Anby Demara",
      rank: "A",
      attribute: "electric",
      role: "stun",
      faction: "교활한 토끼굴",
      image: fandomAvatar("Avatar Anby Demara.png"),
      stats: { hp: 7500, def: 612, atk: 658, critRate: 5, critDmg: 50, penRatio: 0, impact: 136, anomalyMastery: 94, energy: 1.2 },
      engines: ["데마라 배터리 II형", "헬파이어 기어", "구속된 자"],
      discs: ["쇼크스타 디스코 4 + 스윙 재즈 2"],
      teams: [
        { name: "초반 전기", members: ["anby", "anton", "nicole"], note: "격파 후 강공 딜러를 넣는 기본형" },
      ],
    },
    {
      id: "anton",
      kr: "앤톤 이바노프",
      en: "Anton Ivanov",
      rank: "A",
      attribute: "electric",
      role: "attack",
      faction: "벨로보그 중공업",
      image: fandomAvatar("Avatar Anton Ivanov.png"),
      stats: { hp: 7219, def: 622, atk: 791, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 95, anomalyMastery: 86, energy: 1.2 },
      engines: ["드릴 리그 - 레드 액시스", "브림스톤"],
      discs: ["썬더 메탈 4 + 딱따구리 일렉트로 2"],
      teams: [{ name: "전기 강공", members: ["anton", "anby", "rina"], note: "감전 유지 후 버스트" }],
    },
    {
      id: "billy",
      kr: "빌리 키드",
      en: "Billy Kid",
      rank: "A",
      attribute: "physical",
      role: "attack",
      faction: "교활한 토끼굴",
      image: fandomAvatar("Avatar Billy Kid.png"),
      stats: { hp: 6907, def: 606, atk: 787, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 91, anomalyMastery: 92, energy: 1.2 },
      engines: ["별빛 엔진 복제품", "스틸 쿠션"],
      discs: ["송곳니 메탈 4 + 딱따구리 일렉트로 2"],
      teams: [{ name: "교활한 토끼굴", members: ["billy", "anby", "nicole"], note: "무료 캐릭터 중심" }],
    },
    {
      id: "nicole",
      kr: "니콜 데마라",
      en: "Nicole Demara",
      rank: "A",
      attribute: "ether",
      role: "support",
      faction: "교활한 토끼굴",
      image: fandomAvatar("Avatar Nicole Demara.png"),
      stats: { hp: 8145, def: 622, atk: 649, critRate: 5, critDmg: 50, penRatio: 0, impact: 88, anomalyMastery: 90, energy: 1.56 },
      engines: ["보물함", "흐느끼는 요람"],
      discs: ["스윙 재즈 4 + 카오스 메탈 2"],
      teams: [
        { name: "에테르 버스트", members: ["zhu-yuan", "qingyi", "nicole"], note: "방깎/몹몰이 후 주연 딜 타이밍" },
      ],
    },
    {
      id: "zhu-yuan",
      kr: "주연",
      en: "Zhu Yuan",
      rank: "S",
      attribute: "ether",
      role: "attack",
      faction: "치안국 특수대응팀",
      image: fandomAvatar("Avatar Zhu Yuan.png"),
      stats: { hp: 7482, def: 600, atk: 919, critRate: 5, critDmg: 78.8, penRatio: 0, impact: 90, anomalyMastery: 93, energy: 1.2 },
      engines: ["진압자 VI형", "브림스톤"],
      discs: ["카오스 메탈 4 + 딱따구리 일렉트로 2"],
      teams: [
        { name: "주연 표준", members: ["zhu-yuan", "qingyi", "nicole"], note: "그로기 창에 탄창을 몰아넣는 구성" },
        { name: "주연 지원 강화", members: ["zhu-yuan", "anby", "astra"], note: "지원 버프를 크게 받는 버스트형" },
      ],
    },
    {
      id: "qingyi",
      kr: "청의",
      en: "Qingyi",
      rank: "S",
      attribute: "electric",
      role: "stun",
      faction: "치안국 특수대응팀",
      image: fandomAvatar("Avatar Qingyi.png"),
      stats: { hp: 8250, def: 612, atk: 758, critRate: 5, critDmg: 50, penRatio: 0, impact: 136, anomalyMastery: 94, energy: 1.2 },
      engines: ["옥주전자", "헬파이어 기어"],
      discs: ["쇼크스타 디스코 4 + 스윙 재즈 2"],
      teams: [{ name: "그로기 코어", members: ["zhu-yuan", "qingyi", "nicole"], note: "고효율 격파 슬롯" }],
    },
    {
      id: "ellen",
      kr: "엘렌 조",
      en: "Ellen Joe",
      rank: "S",
      attribute: "ice",
      role: "attack",
      faction: "빅토리아 하우스키핑",
      image: fandomAvatar("Avatar Ellen Joe.png"),
      stats: { hp: 7673, def: 606, atk: 938, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 93, anomalyMastery: 94, energy: 1.2 },
      engines: ["심해 방문객", "브림스톤"],
      discs: ["극지 메탈 4 + 딱따구리 일렉트로 2"],
      teams: [
        { name: "엘렌 빙결", members: ["ellen", "lycaon", "soukaku"], note: "격파와 얼음 버프로 안정적인 표준형" },
        { name: "엘렌 버프형", members: ["ellen", "lighter", "soukaku"], note: "라이터 보유 시 화력 창을 더 크게 잡는 구성" },
      ],
    },
    {
      id: "lycaon",
      kr: "본 리카온",
      en: "Von Lycaon",
      rank: "S",
      attribute: "ice",
      role: "stun",
      faction: "빅토리아 하우스키핑",
      image: fandomAvatar("Avatar Von Lycaon.png"),
      stats: { hp: 8416, def: 606, atk: 728, critRate: 5, critDmg: 50, penRatio: 0, impact: 137, anomalyMastery: 91, energy: 1.2 },
      engines: ["구속된 자", "헬파이어 기어"],
      discs: ["쇼크스타 디스코 4 + 스윙 재즈 2"],
      teams: [{ name: "빙결 격파", members: ["ellen", "lycaon", "soukaku"], note: "엘렌과 궁합 좋은 얼음 격파" }],
    },
    {
      id: "rina",
      kr: "알렉산드리나 세바스티안",
      en: "Alexandrina Sebastiane",
      rank: "S",
      attribute: "electric",
      role: "support",
      faction: "빅토리아 하우스키핑",
      image: fandomAvatar("Avatar Alexandrina Sebastiane.png"),
      stats: { hp: 8609, def: 600, atk: 717, critRate: 5, critDmg: 50, penRatio: 14, impact: 83, anomalyMastery: 93, energy: 1.2 },
      engines: ["흐느끼는 요람", "호화로운 악기"],
      discs: ["스윙 재즈 4 + 복어 일렉트로 2"],
      teams: [{ name: "감전 지원", members: ["grace", "rina", "anton"], note: "관통/감전 보조" }],
    },
    {
      id: "soukaku",
      kr: "소우카쿠",
      en: "Soukaku",
      rank: "A",
      attribute: "ice",
      role: "support",
      faction: "대공동 6과",
      image: fandomAvatar("Avatar Soukaku.png"),
      stats: { hp: 8025, def: 597, atk: 665, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 93, energy: 1.56 },
      engines: ["게임볼", "흐느끼는 요람"],
      discs: ["스윙 재즈 4 + 극지 메탈 2"],
      teams: [{ name: "얼음 지원", members: ["ellen", "lycaon", "soukaku"], note: "얼음 딜러 공격력 보조" }],
    },
    {
      id: "miyabi",
      kr: "호시미 미야비",
      en: "Hoshimi Miyabi",
      rank: "S",
      attribute: "frost",
      role: "anomaly",
      faction: "대공동 6과",
      image: fandomAvatar("Avatar Hoshimi Miyabi.png"),
      stats: { hp: 7673, def: 606, atk: 880, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 116, energy: 1.2 },
      engines: ["폭풍우 신사", "융합 컴파일러"],
      discs: ["나뭇가지 검의 노래 4 + 딱따구리 일렉트로 2"],
      teams: [
        { name: "미야비 혼돈", members: ["miyabi", "yanagi", "astra"], note: "이상 교대와 지원 버프를 같이 보는 구성" },
        { name: "미야비 얼음", members: ["miyabi", "lycaon", "soukaku"], note: "얼음/서리 중심 안정형" },
      ],
    },
    {
      id: "harumasa",
      kr: "아사바 하루마사",
      en: "Asaba Harumasa",
      rank: "S",
      attribute: "electric",
      role: "attack",
      faction: "대공동 6과",
      image: fandomAvatar("Avatar Asaba Harumasa.png"),
      stats: { hp: 7405, def: 600, atk: 915, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 90, anomalyMastery: 80, energy: 1.2 },
      engines: ["잔심의 청낭", "브림스톤"],
      discs: ["썬더 메탈 4 + 딱따구리 일렉트로 2"],
      teams: [{ name: "전기 강공", members: ["harumasa", "qingyi", "rina"], note: "격파 후 전기 딜 압축" }],
    },
    {
      id: "jane",
      kr: "제인 도",
      en: "Jane Doe",
      rank: "S",
      attribute: "physical",
      role: "anomaly",
      faction: "치안국 특수대응팀",
      image: fandomAvatar("Avatar Jane Doe.png"),
      stats: { hp: 7788, def: 606, atk: 880, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 148, energy: 1.2 },
      engines: ["예리한 앞발", "융합 컴파일러"],
      discs: ["송곳니 메탈 4 + 자유의 블루스 2"],
      teams: [
        { name: "제인 강타", members: ["jane", "seth", "rina"], note: "실드/관통 지원을 받아 강타를 반복" },
        { name: "제인 혼돈", members: ["jane", "burnice", "seth"], note: "물리와 불 이상을 교차" },
      ],
    },
    {
      id: "seth",
      kr: "세스 로웰",
      en: "Seth Lowell",
      rank: "A",
      attribute: "electric",
      role: "defense",
      faction: "치안국 특수대응팀",
      image: fandomAvatar("Avatar Seth Lowell.png"),
      stats: { hp: 8701, def: 746, atk: 643, critRate: 5, critDmg: 50, penRatio: 0, impact: 94, anomalyMastery: 86, energy: 1.56 },
      engines: ["평화 수호자 - 특화형", "오리지널 변신 아이템"],
      discs: ["원시 펑크 4 + 자유의 블루스 2"],
      teams: [{ name: "이상 방어", members: ["jane", "seth", "burnice"], note: "이상 캐릭터 보조" }],
    },
    {
      id: "burnice",
      kr: "버니스 화이트",
      en: "Burnice White",
      rank: "S",
      attribute: "fire",
      role: "anomaly",
      faction: "칼리돈의 자손",
      image: fandomAvatar("Avatar Burnice White.png"),
      stats: { hp: 7368, def: 600, atk: 863, critRate: 5, critDmg: 50, penRatio: 0, impact: 83, anomalyMastery: 118, energy: 1.56 },
      engines: ["플레임메이커 셰이커", "융합 컴파일러"],
      discs: ["카오스 재즈 4 + 자유의 블루스 2"],
      teams: [{ name: "불 혼돈", members: ["jane", "burnice", "seth"], note: "오프필드 불 이상으로 혼돈 유도" }],
    },
    {
      id: "lighter",
      kr: "라이터",
      en: "Lighter",
      rank: "S",
      attribute: "fire",
      role: "stun",
      faction: "칼리돈의 자손",
      image: fandomAvatar("Avatar Lighter.png"),
      stats: { hp: 8253, def: 612, atk: 797, critRate: 5, critDmg: 50, penRatio: 0, impact: 137, anomalyMastery: 91, energy: 1.2 },
      engines: ["불타는 월계관", "헬파이어 기어"],
      discs: ["쇼크스타 디스코 4 + 스윙 재즈 2"],
      teams: [{ name: "불/얼음 격파", members: ["ellen", "lighter", "soukaku"], note: "그로기 창 확장형" }],
    },
    {
      id: "astra",
      kr: "아스트라 야오",
      en: "Astra Yao",
      rank: "S",
      attribute: "ether",
      role: "support",
      faction: "리라의 별",
      image: fandomAvatar("Avatar Astra Yao.png"),
      stats: { hp: 8609, def: 600, atk: 715, critRate: 5, critDmg: 50, penRatio: 0, impact: 83, anomalyMastery: 93, energy: 1.56 },
      engines: ["화려한 허영", "흐느끼는 요람"],
      discs: ["고요 속의 별 4 + 스윙 재즈 2"],
      teams: [{ name: "범용 지원", members: ["miyabi", "yanagi", "astra"], note: "버프 의존 딜러와 조합" }],
    },
    {
      id: "yanagi",
      kr: "츠키시로 야나기",
      en: "Tsukishiro Yanagi",
      rank: "S",
      attribute: "electric",
      role: "anomaly",
      faction: "대공동 6과",
      image: fandomAvatar("Avatar Tsukishiro Yanagi.png"),
      stats: { hp: 7788, def: 612, atk: 872, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 148, energy: 1.2 },
      engines: ["타임위버", "융합 컴파일러"],
      discs: ["카오스 재즈 4 + 자유의 블루스 2"],
      teams: [{ name: "미야비 혼돈", members: ["miyabi", "yanagi", "astra"], note: "전기 이상으로 혼돈 트리거" }],
    },
    {
      id: "yixuan",
      kr: "의현",
      en: "Yixuan",
      rank: "S",
      attribute: "auricInk",
      role: "rupture",
      faction: "운규산",
      image: fandomAvatar("Avatar Yixuan.png"),
      stats: { hp: 8373, def: 441, atk: 872, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 93, anomalyMastery: 92, energy: 1.2 },
      engines: ["구름을 헤친 빛", "크라켄의 요람"],
      discs: ["운규 이야기 4 + 딱따구리 일렉트로 2"],
      teams: [
        { name: "운규 명파", members: ["yixuan", "ju-fufu", "pan-yinhu"], note: "명파 딜러와 전용 지원을 같이 운용" },
      ],
    },
    {
      id: "ju-fufu",
      kr: "주복복",
      en: "Ju Fufu",
      rank: "S",
      attribute: "fire",
      role: "stun",
      faction: "운규산",
      image: fandomAvatar("Avatar Ju Fufu.png"),
      stats: { hp: 8250, def: 597, atk: 765, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 118, anomalyMastery: 93, energy: 1.2 },
      engines: ["수석 조수", "헬파이어 기어"],
      discs: ["산림의 왕 4 + 쇼크스타 디스코 2"],
      teams: [{ name: "운규 명파", members: ["yixuan", "ju-fufu", "pan-yinhu"], note: "그로기와 치명 보조" }],
    },
    {
      id: "pan-yinhu",
      kr: "반인호",
      en: "Pan Yinhu",
      rank: "A",
      attribute: "physical",
      role: "defense",
      faction: "운규산",
      image: fandomAvatar("Avatar Pan Yinhu.png"),
      stats: { hp: 8453, def: 712, atk: 661, critRate: 5, critDmg: 50, penRatio: 0, impact: 94, anomalyMastery: 91, energy: 1.56 },
      engines: ["둥둥 메아리", "오리지널 변신 아이템"],
      discs: ["원시 펑크 4 + 운규 이야기 2"],
      teams: [{ name: "운규 명파", members: ["yixuan", "ju-fufu", "pan-yinhu"], note: "생존과 보조 슬롯" }],
    },
    {
      id: "yuzuha",
      kr: "우키나미 유즈하",
      en: "Ukinami Yuzuha",
      rank: "S",
      attribute: "physical",
      role: "support",
      faction: "스푸크 샥",
      image: fandomAvatar("Avatar Ukinami Yuzuha.png"),
      stats: { hp: 8829, def: 612, atk: 758, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 124, energy: 1.2 },
      engines: ["너구리의 7단 변신", "화려한 허영"],
      discs: ["달빛 기사의 칭송 4 + 송곳니 메탈 2"],
      teams: [
        { name: "물리 이상", members: ["alice", "yuzuha", "jane"], note: "물리 이상 딜러를 지원하는 구성" },
      ],
    },
    {
      id: "alice",
      kr: "앨리스 타임필드",
      en: "Alice Thymefield",
      rank: "S",
      attribute: "physical",
      role: "anomaly",
      faction: "스푸크 샥",
      image: fandomAvatar("Avatar Alice Thymefield.png"),
      stats: { hp: 7673, def: 606, atk: 880, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 142, energy: 1.2 },
      engines: ["견고한 꽃받침", "융합 컴파일러"],
      discs: ["송곳니 메탈 4 + 자유의 블루스 2"],
      teams: [{ name: "물리 이상", members: ["alice", "yuzuha", "jane"], note: "지원과 강타를 같이 보는 구성" }],
    },
  ];

  agents.push(
    {
      id: "ben",
      kr: "Ben Bigger",
      en: "Ben Bigger",
      rank: "A",
      attribute: "fire",
      role: "defense",
      faction: "Belobog Heavy Industries",
      image: fandomAvatar("Avatar Ben Bigger.png"),
      stats: { hp: 8578, def: 724, atk: 650, critRate: 5, critDmg: 50, penRatio: 0, impact: 95, anomalyMastery: 90, energy: 1.2 },
      engines: ["Original Transmorpher", "Big Cylinder"],
      discs: ["Proto Punk 4 + Soul Rock 2"],
      teams: [{ name: "Belobog Core", members: ["koleda", "ben", "grace"], note: "Defense/Stun shell for Belobog teams." }],
    },
    {
      id: "corin",
      kr: "Corin Wickes",
      en: "Corin Wickes",
      rank: "A",
      attribute: "physical",
      role: "attack",
      faction: "Victoria Housekeeping Co.",
      image: fandomAvatar("Avatar Corin Wickes.png"),
      stats: { hp: 6976, def: 605, atk: 782, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 93, anomalyMastery: 93, energy: 1.2 },
      engines: ["Housekeeper", "Starlight Engine"],
      discs: ["Fanged Metal 4 + Woodpecker Electro 2"],
      teams: [{ name: "Victoria Physical", members: ["corin", "lycaon", "rina"], note: "Stun window focused Physical Attack setup." }],
    },
    {
      id: "grace",
      kr: "Grace Howard",
      en: "Grace Howard",
      rank: "S",
      attribute: "electric",
      role: "anomaly",
      faction: "Belobog Heavy Industries",
      image: fandomAvatar("Avatar Grace Howard.png"),
      stats: { hp: 7482, def: 600, atk: 826, critRate: 5, critDmg: 50, penRatio: 0, impact: 83, anomalyMastery: 148, energy: 1.2 },
      engines: ["Fusion Compiler", "Weeping Gemini"],
      discs: ["Thunder Metal 4 + Freedom Blues 2"],
      teams: [{ name: "Shock Core", members: ["grace", "rina", "anton"], note: "Shock uptime with Electric damage follow-up." }],
    },
    {
      id: "koleda",
      kr: "Koleda Belobog",
      en: "Koleda Belobog",
      rank: "S",
      attribute: "fire",
      role: "stun",
      faction: "Belobog Heavy Industries",
      image: fandomAvatar("Avatar Koleda Belobog.png"),
      stats: { hp: 8127, def: 594, atk: 737, critRate: 5, critDmg: 50, penRatio: 0, impact: 137, anomalyMastery: 91, energy: 1.2 },
      engines: ["Hellfire Gears", "The Restrained"],
      discs: ["Shockstar Disco 4 + Swing Jazz 2"],
      teams: [{ name: "Belobog Core", members: ["koleda", "ben", "grace"], note: "Stun and defensive utility for Belobog teams." }],
    },
    {
      id: "nekomata",
      kr: "Nekomiya Mana",
      en: "Nekomiya Mana",
      rank: "S",
      attribute: "physical",
      role: "attack",
      faction: "Cunning Hares",
      image: fandomAvatar("Avatar Nekomiya Mana.png"),
      stats: { hp: 7560, def: 588, atk: 911, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 92, anomalyMastery: 92, energy: 1.2 },
      engines: ["Steel Cushion", "The Brimstone"],
      discs: ["Fanged Metal 4 + Woodpecker Electro 2"],
      teams: [{ name: "Cunning Hares Burst", members: ["nekomata", "anby", "nicole"], note: "Defense shred and stun windows for Physical burst." }],
    },
    {
      id: "soldier-11",
      kr: "Soldier 11",
      en: "Soldier 11",
      rank: "S",
      attribute: "fire",
      role: "attack",
      faction: "Obol Squad",
      image: fandomAvatar("Avatar Soldier 11.png"),
      stats: { hp: 7673, def: 612, atk: 889, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 93, anomalyMastery: 92, energy: 1.2 },
      engines: ["The Brimstone", "Starlight Engine"],
      discs: ["Inferno Metal 4 + Woodpecker Electro 2"],
      teams: [{ name: "Fire Attack", members: ["soldier-11", "lighter", "lucy"], note: "Fire damage core with Stun and Support slots." }],
    },
    {
      id: "lucy",
      kr: "Luciana de Montefio",
      en: "Luciana de Montefio",
      rank: "A",
      attribute: "fire",
      role: "support",
      faction: "Sons of Calydon",
      image: fandomAvatar("Avatar Luciana de Montefio.png"),
      stats: { hp: 8025, def: 613, atk: 659, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 93, energy: 1.56 },
      engines: ["Kaboom the Cannon", "Slice of Time"],
      discs: ["Swing Jazz 4 + Hormone Punk 2"],
      teams: [{ name: "Calydon Fire", members: ["burnice", "lighter", "lucy"], note: "Fire support option for Calydon teams." }],
    },
    {
      id: "piper",
      kr: "Piper Wheel",
      en: "Piper Wheel",
      rank: "A",
      attribute: "physical",
      role: "anomaly",
      faction: "Sons of Calydon",
      image: fandomAvatar("Avatar Piper Wheel.png"),
      stats: { hp: 7788, def: 612, atk: 759, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 148, energy: 1.2 },
      engines: ["Roaring Ride", "Weeping Gemini"],
      discs: ["Fanged Metal 4 + Freedom Blues 2"],
      teams: [{ name: "Budget Assault", members: ["piper", "lucy", "seth"], note: "Accessible Physical Anomaly setup." }],
    },
    {
      id: "caesar",
      kr: "Caesar King",
      en: "Caesar King",
      rank: "S",
      attribute: "physical",
      role: "defense",
      faction: "Sons of Calydon",
      image: fandomAvatar("Avatar Caesar King.png"),
      stats: { hp: 9526, def: 754, atk: 712, critRate: 5, critDmg: 50, penRatio: 0, impact: 105, anomalyMastery: 90, energy: 1.2 },
      engines: ["Tusks of Fury", "Original Transmorpher"],
      discs: ["Proto Punk 4 + Shockstar Disco 2"],
      teams: [{ name: "Calydon Guard", members: ["burnice", "caesar", "lucy"], note: "Shield, damage amp, and Fire/Anomaly pressure." }],
    },
    {
      id: "evelyn",
      kr: "Evelyn Chevalier",
      en: "Evelyn Chevalier",
      rank: "S",
      attribute: "fire",
      role: "attack",
      faction: "Stars of Lyra",
      image: fandomAvatar("Avatar Evelyn Chevalier.png"),
      stats: { hp: 7405, def: 600, atk: 915, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 90, anomalyMastery: 92, energy: 1.2 },
      engines: ["Heartstring Nocturne", "The Brimstone"],
      discs: ["Inferno Metal 4 + Woodpecker Electro 2"],
      teams: [{ name: "Stars of Lyra", members: ["evelyn", "lighter", "astra"], note: "Fire Attack core with strong support window." }],
    },
    {
      id: "trigger",
      kr: "Trigger",
      en: "Trigger",
      rank: "S",
      attribute: "electric",
      role: "stun",
      faction: "Obol Squad",
      image: fandomAvatar("Avatar Trigger.png"),
      stats: { hp: 8250, def: 612, atk: 765, critRate: 5, critDmg: 50, penRatio: 0, impact: 137, anomalyMastery: 91, energy: 1.2 },
      engines: ["Spectral Gaze", "Hellfire Gears"],
      discs: ["Shockstar Disco 4 + Swing Jazz 2"],
      teams: [{ name: "Obol Electric", members: ["harumasa", "trigger", "rina"], note: "Electric Stun slot for Attack teams." }],
    },
    {
      id: "pulchra",
      kr: "Pulchra Fellini",
      en: "Pulchra Fellini",
      rank: "A",
      attribute: "physical",
      role: "stun",
      faction: "Sons of Calydon",
      image: fandomAvatar("Avatar Pulchra Fellini.png"),
      stats: { hp: 7764, def: 612, atk: 690, critRate: 5, critDmg: 50, penRatio: 0, impact: 132, anomalyMastery: 91, energy: 1.2 },
      engines: ["Box Cutter", "Steam Oven"],
      discs: ["Shockstar Disco 4 + Swing Jazz 2"],
      teams: [{ name: "Physical Stun", members: ["jane", "pulchra", "seth"], note: "Physical stun support for Assault teams." }],
    },
    {
      id: "hugo",
      kr: "Hugo Vlad",
      en: "Hugo Vlad",
      rank: "S",
      attribute: "ice",
      role: "attack",
      faction: "Mockingbird",
      image: fandomAvatar("Avatar Hugo Vlad.png"),
      stats: { hp: 7482, def: 600, atk: 919, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 90, anomalyMastery: 93, energy: 1.2 },
      engines: ["Myriad Eclipse", "Deep Sea Visitor"],
      discs: ["Polar Metal 4 + Woodpecker Electro 2"],
      teams: [{ name: "Mockingbird Ice", members: ["hugo", "lycaon", "rina"], note: "Ice Attack setup with stun and support." }],
    },
    {
      id: "vivian",
      kr: "Vivian Banshee",
      en: "Vivian Banshee",
      rank: "S",
      attribute: "ether",
      role: "anomaly",
      faction: "Mockingbird",
      image: fandomAvatar("Avatar Vivian Banshee.png"),
      stats: { hp: 7788, def: 606, atk: 872, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 148, energy: 1.2 },
      engines: ["Flight of Fancy", "Fusion Compiler"],
      discs: ["Chaotic Metal 4 + Freedom Blues 2"],
      teams: [{ name: "Ether Anomaly", members: ["vivian", "astra", "yanagi"], note: "Ether anomaly pressure with support and Disorder triggers." }],
    },
    {
      id: "pyrois",
      kr: "Pyrois",
      en: "Pyrois",
      rank: "S",
      attribute: "ether",
      role: "attack",
      faction: "Phaethon",
      image: fandomAvatar("Avatar Pyrois.png"),
      stats: { hp: 7673, def: 612, atk: 849, critRate: 5, critDmg: 50, penRatio: 0, impact: 90, anomalyMastery: 92, energy: 1.2 },
      engines: ["Sol Exuvia", "The Brimstone"],
      discs: ["The Sky Ablaze 4 + Woodpecker Electro 2"],
      teams: [{ name: "Pyrois 3.0 Core", members: ["pyrois", "velina", "norma"], note: "Version 3.0 Ether Attack core with Wind Anomaly and Fire Stun support slots." }],
    },
    {
      id: "velina",
      kr: "Velina Airgid",
      en: "Velina Airgid",
      rank: "S",
      attribute: "wind",
      role: "anomaly",
      faction: "External Strategy Department",
      image: fandomAvatar("Avatar Velina Airgid.png"),
      stats: { hp: 7788, def: 612, atk: 797, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 148, energy: 1.2 },
      engines: ["Joyau Dore", "Fusion Compiler"],
      discs: ["Wuthering Salon 4 + Freedom Blues 2"],
      teams: [{ name: "Wind Anomaly", members: ["velina", "pyrois", "astra"], note: "Wind Anomaly routing for Pyrois and general Disorder setups." }],
    },
    {
      id: "norma",
      kr: "Norma Hollowell",
      en: "Norma Hollowell",
      rank: "S",
      attribute: "fire",
      role: "stun",
      faction: "External Strategy Department",
      image: fandomAvatar("Avatar Norma Hollowell.png"),
      stats: { hp: 7799, def: 582, atk: 687, critRate: 5, critDmg: 50, penRatio: 0, impact: 137, anomalyMastery: 91, energy: 1.2 },
      engines: ["Chief Sidekick", "Hellfire Gears"],
      discs: ["King of the Summit 4 + Shockstar Disco 2"],
      teams: [{ name: "3.0 Stun Preview", members: ["norma", "pyrois", "velina"], note: "Preview Fire Stun slot; details may change before full release data is published." }],
    },
  );

  const apiTypeToRole = {
    1: "attack",
    2: "stun",
    3: "anomaly",
    4: "support",
    5: "defense",
    6: "rupture",
  };

  const apiElementToAttribute = {
    200: "physical",
    201: "fire",
    202: "ice",
    203: "electric",
    204: "wind",
    205: "ether",
    300: "physical",
  };

  const apiAgentIdOverrides = {
    "Astra Yao": "astra",
    "Ju Fufu": "ju-fufu",
    "Orphie & Magus": "orphie-magus",
    "Pan Yinhu": "pan-yinhu",
    "Soldier 0 - Anby": "soldier-0-anby",
    "Soldier 11": "soldier-11",
    "Starlight - Billy": "starlight-billy",
    "Zhu Yuan": "zhu-yuan",
  };

  const apiAvatarNameOverrides = {
    Anby: "Anby Demara",
    Anton: "Anton Ivanov",
    Billy: "Billy Kid",
    Corin: "Corin Wickes",
    Ellen: "Ellen Joe",
    Grace: "Grace Howard",
    Harumasa: "Asaba Harumasa",
    Lycaon: "Von Lycaon",
    Lucy: "Luciana de Montefio",
    Miyabi: "Hoshimi Miyabi",
    Nekomata: "Nekomiya Mana",
    Rina: "Alexandrina Sebastiane",
    Yanagi: "Tsukishiro Yanagi",
  };

  function apiAgentDisplayName(name) {
    return name;
  }

  function isPublicApiAgent(entry) {
    return Boolean(entry?.icon) && !String(entry?.en || "").startsWith("Avatar_");
  }

  function apiAgentId(name) {
    return (
      apiAgentIdOverrides[name] ||
      apiAgentDisplayName(name)
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
    );
  }

  function nanokaAssetImage(icon) {
    return icon ? `${NANOKA_ASSET_BASE}/${encodeURIComponent(icon)}.webp` : "";
  }

  function nanokaCharacterOg(sourceId) {
    return `https://zzz.nanoka.cc/character/${sourceId}/og.png?v=${encodeURIComponent(AGENT_API_VERSION)}&lang=en`;
  }

  function apiAgentImages(sourceId, indexEntry, detail) {
    const skinIcon = Object.values(detail.skin || {})[0]?.image || "";
    const image = nanokaAssetImage(indexEntry.icon || detail.icon || skinIcon);
    const fallback = nanokaCharacterOg(sourceId);
    return {
      image: image || fallback,
      imageFallback: image ? fallback : "",
    };
  }

  function apiLookupKey(value) {
    return String(value || "")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/gi, "")
      .toLowerCase();
  }

  function extraValues(detail) {
    return Object.values(detail.extra_level?.["6"]?.extra || {});
  }

  function extraValue(detail, names) {
    const nameSet = new Set(Array.isArray(names) ? names : [names]);
    return extraValues(detail)
      .filter((item) => nameSet.has(item.name))
      .reduce((total, item) => total + Number(item.value || 0), 0);
  }

  function level60Stat(base, growth, promotion, extra) {
    return Math.round(Number(base || 0) + (Number(growth || 0) / 10000) * 59 + Number(promotion || 0) + Number(extra || 0));
  }

  function roleDefaultDiscs(agent) {
    if (agent.role === "rupture") return ["Yunkui Tales 4 + Woodpecker Electro 2"];
    if (agent.role === "stun") return ["Shockstar Disco 4 + Swing Jazz 2"];
    if (agent.role === "support") return ["Swing Jazz 4 + Hormone Punk 2"];
    if (agent.role === "defense") return ["Proto Punk 4 + Soul Rock 2"];
    if (agent.role === "anomaly") {
      if (agent.attribute === "wind") return ["Wuthering Salon 4 + Freedom Blues 2"];
      if (agent.attribute === "ether") return ["Chaotic Metal 4 + Freedom Blues 2"];
      return ["Freedom Blues 4 + Chaos Jazz 2"];
    }
    if (agent.attribute === "fire") return ["Inferno Metal 4 + Woodpecker Electro 2"];
    if (agent.attribute === "ice") return ["Polar Metal 4 + Woodpecker Electro 2"];
    if (agent.attribute === "electric") return ["Thunder Metal 4 + Woodpecker Electro 2"];
    if (agent.attribute === "ether") return ["The Sky Ablaze 4 + Woodpecker Electro 2"];
    return ["Fanged Metal 4 + Woodpecker Electro 2"];
  }

  function roleDefaultEngines(agent) {
    const byRole = {
      attack: ["The Brimstone", "Starlight Engine"],
      stun: ["Hellfire Gears", "The Restrained"],
      anomaly: ["Fusion Compiler", "Weeping Gemini"],
      support: ["Elegant Vanity", "Weeping Cradle"],
      defense: ["Original Transmorpher", "Bunny Band"],
      rupture: ["Kraken's Cradle", "Radiowave Journey"],
    };
    return byRole[agent.role] || ["Manual"];
  }

  function apiAgentFromDetail(sourceId, indexEntry, detail) {
    const name = apiAgentDisplayName(indexEntry.en);
    const promotion = detail.level?.["6"] || {};
    const hp = level60Stat(detail.stats.hp_max, detail.stats.hp_growth, promotion.hp_max, extraValue(detail, "HP"));
    const atk = level60Stat(detail.stats.attack, detail.stats.attack_growth, promotion.attack, extraValue(detail, ["Base ATK", "ATK"]));
    const def = level60Stat(detail.stats.defence, detail.stats.defence_growth, promotion.defence, extraValue(detail, "DEF"));
    const role = apiTypeToRole[indexEntry.type] || "attack";
    const attribute = apiElementToAttribute[indexEntry.element] || "physical";
    const images = apiAgentImages(sourceId, indexEntry, detail);
    const agent = {
      sourceId,
      id: apiAgentId(indexEntry.en),
      kr: indexEntry.ko?.startsWith("Avatar_") ? name : indexEntry.ko || name,
      en: name,
      rank: indexEntry.rank === 4 ? "S" : indexEntry.rank === 3 ? "A" : "B",
      attribute,
      role,
      faction: Object.values(detail.camp || {})[0] || "Unknown",
      image: images.image,
      imageFallback: images.imageFallback,
      stats: {
        hp,
        def,
        atk,
        critRate: Number(((detail.stats.crit || 0) / 100 + extraValue(detail, "CRIT Rate") / 100).toFixed(1)),
        critDmg: Number(((detail.stats.crit_damage || 0) / 100 + extraValue(detail, "CRIT DMG") / 100).toFixed(1)),
        penRatio: Number(((detail.stats.pen_rate || 0) / 100 + extraValue(detail, "PEN Ratio") / 100).toFixed(1)),
        impact: (detail.stats.break_stun || 0) + extraValue(detail, "Impact"),
        anomalyMastery: (detail.stats.element_abnormal_power || 0) + extraValue(detail, "Anomaly Mastery"),
        energy: Number((((detail.stats.sp_recover || 0) + extraValue(detail, "Base Energy Regen")) / 100).toFixed(2)),
        rpMax: detail.stats.rp_max || 0,
        rpRecover: detail.stats.rp_recover || 0,
      },
      engines: [],
      discs: [],
      teams: [],
    };
    agent.engines = roleDefaultEngines(agent);
    agent.discs = roleDefaultDiscs(agent);
    agent.teams = [{ name: `${name} Core`, members: [agent.id], note: "API roster baseline. Party recommendations need manual verification." }];
    return agent;
  }

  async function fetchJson(url) {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    return response.json();
  }

  function updateProfileBadge() {
    const badge = document.querySelector(".version-badge");
    if (badge) badge.textContent = `${DATA_PROFILE.label} KR - ${DATA_PROFILE.agents}/${DATA_PROFILE.wEngines}/${DATA_PROFILE.driveDiscs} 데이터`;
  }

  async function loadApiAgentRoster() {
    try {
      const index = await fetchJson(`${AGENT_API_BASE}/character.json`);
      const loadedAgents = await Promise.all(
        Object.entries(index)
          .filter(([, entry]) => isPublicApiAgent(entry))
          .map(async ([sourceId, entry]) => {
            const detail = await fetchJson(`${AGENT_API_BASE}/en/character/${sourceId}.json`);
            return apiAgentFromDetail(sourceId, entry, detail);
          }),
      );
      if (loadedAgents.length < 50) throw new Error(`Unexpected agent count: ${loadedAgents.length}`);
      agents.length = 0;
      agents.push(...loadedAgents);
      DATA_PROFILE.agents = loadedAgents.length;
      DATA_PROFILE.label = `${AGENT_API_VERSION} live API`;
      updateProfileBadge();
    } catch (error) {
      console.warn("Could not load API agent roster; using embedded fallback.", error);
      updateProfileBadge();
    }
  }

  async function loadApiEngineNames() {
    try {
      const index = await fetchJson(`${AGENT_API_BASE}/weapon.json`);
      const lookup = new Map(
        Object.values(index).map((entry) => [apiLookupKey(entry.en), entry]),
      );
      engines.forEach((engine) => {
        if (engine.id === "manual") return;
        const entry = lookup.get(apiLookupKey(engine.en));
        if (entry?.ko) engine.kr = entry.ko;
      });
    } catch (error) {
      console.warn("Could not load API W-Engine Korean names; using embedded fallback.", error);
    }
  }

  const engines = [
    { id: "manual", kr: "수동 입력", en: "Manual", rank: "-", role: "any", baseAtk: 0, stats: {}, effect: "입력값만 반영" },
    { id: "angel-in-the-shell", kr: "Angel in the Shell", en: "Angel in the Shell", rank: "S", role: "anomaly", baseAtk: 713, stats: { anomalyMastery: 30 }, effect: "에테르 이상 피해 보정" },
    { id: "bellicose-blaze", kr: "Bellicose Blaze", en: "Bellicose Blaze", rank: "S", role: "attack", baseAtk: 713, stats: { energyRegen: 60 }, effect: "불 여진 방어 무시 보정" },
    { id: "blazing-laurel", kr: "Blazing Laurel", en: "Blazing Laurel", rank: "S", role: "stun", baseAtk: 713, stats: { impact: 18 }, effect: "불/얼음 파티 치명 피해 보정" },
    { id: "chief-sidekick", kr: "Chief Sidekick", en: "Chief Sidekick", rank: "S", role: "stun", baseAtk: 713, stats: { critRate: 24 }, effect: "불 속성 격파 지원 보정" },
    { id: "cloudcleave-radiance", kr: "Cloudcleave Radiance", en: "Cloudcleave Radiance", rank: "S", role: "attack", baseAtk: 743, stats: { critDmg: 48 }, effect: "물리 저항 무시 및 명파 보정" },
    { id: "cordis-germina", kr: "Cordis Germina", en: "Cordis Germina", rank: "S", role: "attack", baseAtk: 713, stats: { critRate: 24 }, effect: "전기 기본/궁극기 방어 무시 보정" },
    { id: "deep-sea-visitor", kr: "Deep Sea Visitor", en: "Deep Sea Visitor", rank: "S", role: "attack", baseAtk: 713, stats: { critRate: 24 }, effect: "얼음 피해 및 치명타 보정" },
    { id: "dreamlit-hearth", kr: "Dreamlit Hearth", en: "Dreamlit Hearth", rank: "S", role: "support", baseAtk: 713, stats: { hpPct: 30 }, effect: "에테르 베일 파티 피해/HP 보정" },
    { id: "elegant-vanity", kr: "Elegant Vanity", en: "Elegant Vanity", rank: "S", role: "support", baseAtk: 713, stats: { atkPct: 30 }, effect: "에너지 소모 후 파티 피해 보정" },
    { id: "flamemaker-shaker", kr: "Flamemaker Shaker", en: "Flamemaker Shaker", rank: "S", role: "anomaly", baseAtk: 713, stats: { atkPct: 30 }, effect: "오프필드 불 이상 보정" },
    { id: "flight-of-fancy", kr: "Flight of Fancy", en: "Flight of Fancy", rank: "S", role: "anomaly", baseAtk: 713, stats: { anomalyProficiency: 90 }, effect: "에테르 이상 축적/숙련 보정" },
    { id: "frostfall-sickle", kr: "Frostfall Sickle", en: "Frostfall Sickle", rank: "S", role: "anomaly", baseAtk: 713, stats: { anomalyMastery: 30 }, effect: "얼음 이상 피해 보정" },
    { id: "fusion-compiler", kr: "Fusion Compiler", en: "Fusion Compiler", rank: "S", role: "anomaly", baseAtk: 684, stats: { penRatio: 24 }, effect: "공격력 및 이상 숙련 보정" },
    { id: "hailstorm-shrine", kr: "Hailstorm Shrine", en: "Hailstorm Shrine", rank: "S", role: "anomaly", baseAtk: 743, stats: { critRate: 24 }, effect: "서리/얼음 이상 보정" },
    { id: "half-sugar-bunny", kr: "Half-Sugar Bunny", en: "Half-Sugar Bunny", rank: "S", role: "defense", baseAtk: 713, stats: { hpPct: 30 }, effect: "에테르 베일 파티 공격/HP/치피 보정" },
    { id: "heartstring-nocturne", kr: "Heartstring Nocturne", en: "Heartstring Nocturne", rank: "S", role: "attack", baseAtk: 713, stats: { critRate: 24 }, effect: "불 체인/궁극기 저항 무시 보정" },
    { id: "hellfire-gears", kr: "Hellfire Gears", en: "Hellfire Gears", rank: "S", role: "stun", baseAtk: 684, stats: { impact: 18 }, effect: "오프필드 에너지와 충격력 보정" },
    { id: "ice-jade-teapot", kr: "Ice-Jade Teapot", en: "Ice-Jade Teapot", rank: "S", role: "stun", baseAtk: 713, stats: { impact: 18 }, effect: "충격력 및 파티 피해 보정" },
    { id: "joyau-dore", kr: "Joyau Dore", en: "Joyau Dore", rank: "S", role: "anomaly", baseAtk: 713, stats: { energyRegen: 60 }, effect: "바람 이상 및 파티 이상 숙련 보정" },
    { id: "krakens-cradle", kr: "Kraken's Cradle", en: "Kraken's Cradle", rank: "S", role: "rupture", baseAtk: 713, stats: { hpPct: 30 }, effect: "얼음 명파/HP 조건 치확 보정" },
    { id: "metanukimorphosis", kr: "Metanukimorphosis", en: "Metanukimorphosis", rank: "S", role: "support", baseAtk: 713, stats: { energyRegen: 60 }, effect: "물리 여진 파티 이상 숙련 보정" },
    { id: "myriad-eclipse", kr: "Myriad Eclipse", en: "Myriad Eclipse", rank: "S", role: "attack", baseAtk: 713, stats: { critRate: 24 }, effect: "얼음 EX/체인/궁극기 방어 무시 보정" },
    { id: "neon-fantasies", kr: "Neon Fantasies", en: "Neon Fantasies", rank: "S", role: "stun", baseAtk: 713, stats: { anomalyMastery: 30 }, effect: "에테르 격파 파티 피해 보정" },
    { id: "practiced-perfection", kr: "Practiced Perfection", en: "Practiced Perfection", rank: "S", role: "anomaly", baseAtk: 713, stats: { atkPct: 30 }, effect: "물리 강타/이상 장악 보정" },
    { id: "qingming-birdcage", kr: "Qingming Birdcage", en: "Qingming Birdcage", rank: "S", role: "rupture", baseAtk: 743, stats: { hpPct: 30 }, effect: "에테르 명파 피해 보정" },
    { id: "riot-suppressor-mark-vi", kr: "Riot Suppressor Mark VI", en: "Riot Suppressor Mark VI", rank: "S", role: "attack", baseAtk: 713, stats: { critDmg: 48 }, effect: "에테르 강공 보정" },
    { id: "roaring-furnace", kr: "Roaring Fur-nace", en: "Roaring Fur-nace", rank: "S", role: "stun", baseAtk: 713, stats: { atkPct: 30 }, effect: "불 체인/궁극기 파티 피해 보정" },
    { id: "serpentine-seeker", kr: "Serpentine Seeker", en: "Serpentine Seeker", rank: "S", role: "attack", baseAtk: 713, stats: { energyRegen: 60 }, effect: "전기 에너지 소모 방어 무시 보정" },
    { id: "severed-innocence", kr: "Severed Innocence", en: "Severed Innocence", rank: "S", role: "attack", baseAtk: 713, stats: { critDmg: 48 }, effect: "전기 치명 피해 보정" },
    { id: "sharpened-stinger", kr: "Sharpened Stinger", en: "Sharpened Stinger", rank: "S", role: "anomaly", baseAtk: 713, stats: { anomalyProficiency: 90 }, effect: "물리 이상 피해 보정" },
    { id: "sol-exuvia", kr: "Sol Exuvia", en: "Sol Exuvia", rank: "S", role: "attack", baseAtk: 713, stats: { atkPct: 30 }, effect: "피로이스 전용 에테르 저항 무시 보정" },
    { id: "spectral-gaze", kr: "Spectral Gaze", en: "Spectral Gaze", rank: "S", role: "stun", baseAtk: 713, stats: { critRate: 24 }, effect: "전기 여진 방깎/충격력 보정" },
    { id: "starlight-rider-faceplate", kr: "Starlight Rider Faceplate", en: "Starlight Rider Faceplate", rank: "S", role: "rupture", baseAtk: 713, stats: { hpPct: 30 }, effect: "물리 명파 피해 보정" },
    { id: "steel-cushion", kr: "Steel Cushion", en: "Steel Cushion", rank: "S", role: "attack", baseAtk: 684, stats: { critRate: 24 }, effect: "물리 피해 및 배후 공격 보정" },
    { id: "the-brimstone", kr: "The Brimstone", en: "The Brimstone", rank: "S", role: "attack", baseAtk: 684, stats: { atkPct: 30 }, effect: "공격 명중 후 공격력 보정" },
    { id: "the-restrained", kr: "The Restrained", en: "The Restrained", rank: "S", role: "stun", baseAtk: 684, stats: { impact: 18 }, effect: "기본 공격 피해/그로기 보정" },
    { id: "thoughtbop", kr: "Thoughtbop", en: "Thoughtbop", rank: "S", role: "support", baseAtk: 713, stats: { energyRegen: 60 }, effect: "물리 지원 파티 피해/공격 보정" },
    { id: "timeweaver", kr: "Timeweaver", en: "Timeweaver", rank: "S", role: "anomaly", baseAtk: 713, stats: { atkPct: 30 }, effect: "전기 이상과 혼돈 보정" },
    { id: "tusks-of-fury", kr: "Tusks of Fury", en: "Tusks of Fury", rank: "S", role: "defense", baseAtk: 713, stats: { impact: 18 }, effect: "실드/파티 피해/그로기 보정" },
    { id: "weeping-cradle", kr: "Weeping Cradle", en: "Weeping Cradle", rank: "S", role: "support", baseAtk: 684, stats: { penRatio: 24 }, effect: "오프필드 에너지와 피해 보정" },
    { id: "wrathful-vajra", kr: "Wrathful Vajra", en: "Wrathful Vajra", rank: "S", role: "rupture", baseAtk: 713, stats: { hpPct: 30 }, effect: "불 명파 피해 보정" },
    { id: "yesterday-calls", kr: "Yesterday Calls", en: "Yesterday Calls", rank: "S", role: "stun", baseAtk: 713, stats: { critRate: 24 }, effect: "물리 격파/파티 치피 보정" },
    { id: "zanshin-herb-case", kr: "Zanshin Herb Case", en: "Zanshin Herb Case", rank: "S", role: "attack", baseAtk: 713, stats: { critDmg: 48 }, effect: "전기 대시 공격 보정" },
    { id: "bashful-demon", kr: "Bashful Demon", en: "Bashful Demon", rank: "A", role: "support", baseAtk: 624, stats: { atkPct: 25 }, effect: "얼음 피해 및 파티 공격력 보정" },
    { id: "big-cylinder", kr: "Big Cylinder", en: "Big Cylinder", rank: "A", role: "defense", baseAtk: 624, stats: { defense: 40 }, effect: "피해 감소 및 방어력 기반 추가 피해" },
    { id: "box-cutter", kr: "Box Cutter", en: "Box Cutter", rank: "A", role: "stun", baseAtk: 624, stats: { impact: 15 }, effect: "물리 여진 피해/그로기 보정" },
    { id: "bunny-band", kr: "Bunny Band", en: "Bunny Band", rank: "A", role: "defense", baseAtk: 594, stats: { defense: 40 }, effect: "HP 및 실드 중 공격력 보정" },
    { id: "cannon-rotor", kr: "Cannon Rotor", en: "Cannon Rotor", rank: "A", role: "attack", baseAtk: 594, stats: { critRate: 20 }, effect: "공격력 및 치명타 추가 피해" },
    { id: "cauldron-of-clarity", kr: "Cauldron of Clarity", en: "Cauldron of Clarity", rank: "A", role: "rupture", baseAtk: 594, stats: { hpPct: 25 }, effect: "EX 후 피해/치확 보정" },
    { id: "demara-battery-mark-ii", kr: "Demara Battery Mark II", en: "Demara Battery Mark II", rank: "A", role: "stun", baseAtk: 624, stats: { impact: 15 }, effect: "전기 피해와 에너지 획득 보정" },
    { id: "drill-rig-red-axis", kr: "Drill Rig - Red Axis", en: "Drill Rig - Red Axis", rank: "A", role: "attack", baseAtk: 624, stats: { energyRegen: 50 }, effect: "전기 기본/대시 공격 보정" },
    { id: "electro-lip-gloss", kr: "Electro-Lip Gloss", en: "Electro-Lip Gloss", rank: "A", role: "anomaly", baseAtk: 594, stats: { anomalyProficiency: 75 }, effect: "이상 대상 공격/피해 보정" },
    { id: "gilded-blossom", kr: "Gilded Blossom", en: "Gilded Blossom", rank: "A", role: "attack", baseAtk: 594, stats: { atkPct: 25 }, effect: "공격력 및 EX 피해 보정" },
    { id: "grill-owisp", kr: "Grill O'Wisp", en: "Grill O'Wisp", rank: "A", role: "rupture", baseAtk: 624, stats: { hpPct: 25 }, effect: "불 피해/HP 감소 치확 보정" },
    { id: "housekeeper", kr: "Housekeeper", en: "Housekeeper", rank: "A", role: "attack", baseAtk: 624, stats: { atkPct: 25 }, effect: "오프필드 에너지와 물리 피해 보정" },
    { id: "boisterous-echoes", kr: "Boisterous Echoes", en: "Boisterous Echoes", rank: "A", role: "anomaly", baseAtk: 594, stats: { anomalyProficiency: 75 }, effect: "Vortex 발동 시 에너지 회복 및 이상 대상 피해 증가" },
    { id: "kaboom-the-cannon", kr: "Kaboom the Cannon", en: "Kaboom the Cannon", rank: "A", role: "support", baseAtk: 624, stats: { energyRegen: 50 }, effect: "파티 공격력 보정" },
    { id: "marcato-desire", kr: "Marcato Desire", en: "Marcato Desire", rank: "A", role: "attack", baseAtk: 594, stats: { critRate: 20 }, effect: "EX/체인 후 공격력 보정" },
    { id: "original-transmorpher", kr: "Original Transmorpher", en: "Original Transmorpher", rank: "A", role: "defense", baseAtk: 594, stats: { hpPct: 25 }, effect: "HP 및 피격 후 충격력 보정" },
    { id: "peacekeeper-specialized", kr: "Peacekeeper - Specialized", en: "Peacekeeper - Specialized", rank: "A", role: "defense", baseAtk: 624, stats: { atkPct: 25 }, effect: "실드 중 에너지/이상 축적 보정" },
    { id: "precious-fossilized-core", kr: "Precious Fossilized Core", en: "Precious Fossilized Core", rank: "A", role: "stun", baseAtk: 594, stats: { impact: 15 }, effect: "적 HP 조건 그로기 보정" },
    { id: "puzzle-sphere", kr: "Puzzle Sphere", en: "Puzzle Sphere", rank: "A", role: "rupture", baseAtk: 594, stats: { atkPct: 25 }, effect: "EX 치명 피해/저HP 피해 보정" },
    { id: "radiowave-journey", kr: "Radiowave Journey", en: "Radiowave Journey", rank: "A", role: "rupture", baseAtk: 594, stats: { hpPct: 25 }, effect: "체인/궁극기 후 명파력 보정" },
    { id: "rainforest-gourmet", kr: "Rainforest Gourmet", en: "Rainforest Gourmet", rank: "A", role: "anomaly", baseAtk: 594, stats: { anomalyProficiency: 75 }, effect: "에너지 소모 공격력 보정" },
    { id: "reel-projector", kr: "Reel Projector", en: "Reel Projector", rank: "A", role: "defense", baseAtk: 594, stats: { impact: 15 }, effect: "HP 조건 피해 감소/미아즈마 감소" },
    { id: "roaring-ride", kr: "Roaring Ride", en: "Roaring Ride", rank: "A", role: "anomaly", baseAtk: 624, stats: { atkPct: 25 }, effect: "EX 명중 후 무작위 이상 보정" },
    { id: "six-shooter", kr: "Six Shooter", en: "Six Shooter", rank: "A", role: "stun", baseAtk: 594, stats: { impact: 15 }, effect: "충전 스택 기반 EX 그로기 보정" },
    { id: "slice-of-time", kr: "Slice of Time", en: "Slice of Time", rank: "A", role: "support", baseAtk: 594, stats: { penRatio: 20 }, effect: "데시벨/에너지 생성 보정" },
    { id: "spring-embrace", kr: "Spring Embrace", en: "Spring Embrace", rank: "A", role: "defense", baseAtk: 594, stats: { atkPct: 25 }, effect: "피해 감소와 에너지 획득 보정" },
    { id: "starlight-engine", kr: "Starlight Engine", en: "Starlight Engine", rank: "A", role: "attack", baseAtk: 594, stats: { atkPct: 25 }, effect: "회피 반격/퀵 지원 후 공격력 보정" },
    { id: "starlight-engine-replica", kr: "Starlight Engine Replica", en: "Starlight Engine Replica", rank: "A", role: "attack", baseAtk: 624, stats: { atkPct: 25 }, effect: "원거리 기본/대시 물리 피해 보정" },
    { id: "steam-oven", kr: "Steam Oven", en: "Steam Oven", rank: "A", role: "stun", baseAtk: 594, stats: { energyRegen: 50 }, effect: "에너지 누적 충격력 보정" },
    { id: "street-superstar", kr: "Street Superstar", en: "Street Superstar", rank: "A", role: "attack", baseAtk: 594, stats: { atkPct: 25 }, effect: "체인 후 궁극기 피해 보정" },
    { id: "the-simmering-pot", kr: "The Simmering Pot", en: "The Simmering Pot", rank: "A", role: "stun", baseAtk: 594, stats: { impact: 15 }, effect: "지원 추격 그로기/피해 보정" },
    { id: "the-vault", kr: "The Vault", en: "The Vault", rank: "A", role: "support", baseAtk: 624, stats: { energyRegen: 50 }, effect: "에테르 공격 후 파티 피해 보정" },
    { id: "tremor-trigram-vessel", kr: "Tremor Trigram Vessel", en: "Tremor Trigram Vessel", rank: "A", role: "defense", baseAtk: 624, stats: { atkPct: 25 }, effect: "EX/궁극기 피해와 에너지 보정" },
    { id: "unfettered-game-ball", kr: "Unfettered Game Ball", en: "Unfettered Game Ball", rank: "A", role: "support", baseAtk: 594, stats: { energyRegen: 50 }, effect: "속성 카운터 후 파티 치확 보정" },
    { id: "weeping-gemini", kr: "Weeping Gemini", en: "Weeping Gemini", rank: "A", role: "anomaly", baseAtk: 594, stats: { atkPct: 25 }, effect: "이상 발생 후 이상 숙련 보정" },
    { id: "cinder-cobalt", kr: "[Cinder] Cobalt", en: "[Cinder] Cobalt", rank: "B", role: "rupture", baseAtk: 475, stats: { hpPct: 20 }, effect: "진입/교대 공격력 보정" },
    { id: "identity-base", kr: "[Identity] Base", en: "[Identity] Base", rank: "B", role: "defense", baseAtk: 475, stats: { defense: 32 }, effect: "피격 후 방어력 보정" },
    { id: "identity-inflection", kr: "[Identity] Inflection", en: "[Identity] Inflection", rank: "B", role: "defense", baseAtk: 475, stats: { defense: 32 }, effect: "피격 후 공격자 피해 감소" },
    { id: "lunar-decrescent", kr: "[Lunar] Decrescent", en: "[Lunar] Decrescent", rank: "B", role: "attack", baseAtk: 475, stats: { atkPct: 20 }, effect: "체인/궁극기 후 피해 보정" },
    { id: "lunar-noviluna", kr: "[Lunar] Noviluna", en: "[Lunar] Noviluna", rank: "B", role: "attack", baseAtk: 475, stats: { critRate: 16 }, effect: "EX 후 에너지 생성" },
    { id: "lunar-pleniluna", kr: "[Lunar] Pleniluna", en: "[Lunar] Pleniluna", rank: "B", role: "attack", baseAtk: 475, stats: { atkPct: 20 }, effect: "기본/대시/회피 반격 피해 보정" },
    { id: "magnetic-storm-alpha", kr: "[Magnetic Storm] Alpha", en: "[Magnetic Storm] Alpha", rank: "B", role: "anomaly", baseAtk: 475, stats: { atkPct: 20 }, effect: "이상 축적 후 이상 장악 보정" },
    { id: "magnetic-storm-bravo", kr: "[Magnetic Storm] Bravo", en: "[Magnetic Storm] Bravo", rank: "B", role: "anomaly", baseAtk: 356, stats: {}, effect: "이상 축적 후 이상 숙련 보정" },
    { id: "magnetic-storm-charlie", kr: "[Magnetic Storm] Charlie", en: "[Magnetic Storm] Charlie", rank: "B", role: "anomaly", baseAtk: 475, stats: { penRatio: 16 }, effect: "이상 발생 후 에너지 생성" },
    { id: "reverb-mark-i", kr: "[Reverb] Mark I", en: "[Reverb] Mark I", rank: "B", role: "support", baseAtk: 475, stats: { atkPct: 20 }, effect: "EX 후 파티 충격력 보정" },
    { id: "reverb-mark-ii", kr: "[Reverb] Mark II", en: "[Reverb] Mark II", rank: "B", role: "support", baseAtk: 475, stats: { energyRegen: 40 }, effect: "EX/체인 후 파티 이상 보정" },
    { id: "reverb-mark-iii", kr: "[Reverb] Mark III", en: "[Reverb] Mark III", rank: "B", role: "support", baseAtk: 475, stats: { hpPct: 20 }, effect: "체인/궁극기 후 파티 공격력 보정" },
    { id: "vortex-arrow", kr: "[Vortex] Arrow", en: "[Vortex] Arrow", rank: "B", role: "stun", baseAtk: 475, stats: { impact: 12 }, effect: "주 대상 그로기 보정" },
    { id: "vortex-hatchet", kr: "[Vortex] Hatchet", en: "[Vortex] Hatchet", rank: "B", role: "stun", baseAtk: 475, stats: { energyRegen: 16 }, effect: "진입/교대 충격력 보정" },
    { id: "vortex-revolver", kr: "[Vortex] Revolver", en: "[Vortex] Revolver", rank: "B", role: "stun", baseAtk: 475, stats: { atkPct: 20 }, effect: "EX 그로기 보정" },
  ];

  const driveDiscs = [
    { id: "none", kr: "없음", en: "None", two: "없음", four: "없음", stats: {} },
    { id: "fanged-metal", kr: "송곳니 메탈", en: "Fanged Metal", two: "물리 피해 +10%", four: "강타 후 대상 피해 +35%", stats: { physicalDmg: 10 } },
    { id: "polar-metal", kr: "극지 메탈", en: "Polar Metal", two: "얼음 피해 +10%", four: "일반/대시 공격 피해 보정", stats: { iceDmg: 10, frostDmg: 10 } },
    { id: "thunder-metal", kr: "썬더 메탈", en: "Thunder Metal", two: "전기 피해 +10%", four: "감전 대상 공격력 보정", stats: { electricDmg: 10 } },
    { id: "chaotic-metal", kr: "카오스 메탈", en: "Chaotic Metal", two: "에테르 피해 +10%", four: "침식 추가 피해 후 치명타 피해 보정", stats: { etherDmg: 10 } },
    { id: "inferno-metal", kr: "불지옥 메탈", en: "Inferno Metal", two: "불 피해 +10%", four: "연소 대상 치명타 확률 보정", stats: { fireDmg: 10 } },
    { id: "swing-jazz", kr: "스윙 재즈", en: "Swing Jazz", two: "에너지 자동 회복 +20%", four: "콤보/궁극기 후 파티 피해 보정", stats: { energyRegenPct: 20 } },
    { id: "soul-rock", kr: "소울 록", en: "Soul Rock", two: "방어력 +16%", four: "피격 후 받는 피해 감소", stats: { defPct: 16 } },
    { id: "hormone-punk", kr: "호르몬 펑크", en: "Hormone Punk", two: "공격력 +10%", four: "전투 진입/교대 공격력 보정", stats: { atkPct: 10 } },
    { id: "freedom-blues", kr: "자유의 블루스", en: "Freedom Blues", two: "이상 숙련 +30", four: "EX 명중 시 이상 축적 저항 감소", stats: { anomalyProficiency: 30 } },
    { id: "shockstar-disco", kr: "쇼크스타 디스코", en: "Shockstar Disco", two: "충격력 +6%", four: "일반/대시/회피 반격 그로기 축적 보정", stats: { impactPct: 6 } },
    { id: "puffer-electro", kr: "복어 일렉트로", en: "Puffer Electro", two: "관통률 +8%", four: "궁극기 피해 및 공격력 보정", stats: { penRatio: 8 } },
    { id: "woodpecker-electro", kr: "딱따구리 일렉트로", en: "Woodpecker Electro", two: "치명타 확률 +8%", four: "치명타 후 공격력 보정", stats: { critRate: 8 } },
    { id: "proto-punk", kr: "원시 펑크", en: "Proto Punk", two: "실드량 +15%", four: "지원 방어 후 파티 피해 보정", stats: {} },
    { id: "chaos-jazz", kr: "카오스 재즈", en: "Chaos Jazz", two: "이상 숙련 +30", four: "불/전기 피해 및 오프필드 피해 보정", stats: { anomalyProficiency: 30 } },
    { id: "astral-voice", kr: "고요 속의 별", en: "Astral Voice", two: "공격력 +10%", four: "퀵 지원 진입 피해 보정", stats: { atkPct: 10 } },
    { id: "branch-blade", kr: "나뭇가지 검의 노래", en: "Branch & Blade Song", two: "치명타 피해 +16%", four: "빙결/쇄빙 후 치명타 보정", stats: { critDmg: 16 } },
    { id: "shadow-harmony", kr: "그림자처럼 함께", en: "Shadow Harmony", two: "여진/대시 피해 +15%", four: "여진/대시 후 공격력 및 치명타 보정", stats: { aftershockDmg: 15 } },
    { id: "phaethon-melody", kr: "파에톤의 노래", en: "Phaethon's Melody", two: "이상 장악 +8%", four: "EX 후 이상 숙련 및 에테르 피해 보정", stats: { anomalyMasteryPct: 8 } },
    { id: "yunkui-tales", kr: "운규 이야기", en: "Yunkui Tales", two: "HP +10%", four: "EX/콤보/궁극기 후 명파 피해 보정", stats: { hpPct: 10 } },
    { id: "king-summit", kr: "산림의 왕", en: "King of the Summit", two: "그로기 수치 +6%", four: "격파 캐릭터 파티 치명타 피해 보정", stats: { dazePct: 6 } },
    { id: "dawns-bloom", kr: "여명의 꽃", en: "Dawn's Bloom", two: "일반 공격 피해 +15%", four: "강공 캐릭터 일반 공격 피해 보정", stats: { basicDmg: 15 } },
    { id: "moonlight-lullaby", kr: "달빛 기사의 칭송", en: "Moonlight Lullaby", two: "에너지 자동 회복 +20%", four: "지원 캐릭터 파티 피해 보정", stats: { energyRegenPct: 20 } },
    { id: "white-water-ballad", kr: "물빛 노랫소리", en: "White Water Ballad", two: "물리 피해 +10%", four: "에테르 장막 중 치명타 확률 및 공격력 보정", stats: { physicalDmg: 10 } },
    { id: "shining-aria", kr: "빛의 아리아", en: "Shining Aria", two: "에테르 피해 +10%", four: "일반 공격 명중 후 이상 마스터리 및 그로기 적 피해 보정", stats: { etherDmg: 10 } },
    { id: "bunny-wonderland", kr: "이상한 나라의 눈토끼", en: "Bunny in Wonderland", two: "HP +10%", four: "방어 캐릭터 파티 피해 보정", stats: { hpPct: 10 } },
    { id: "notes-chained", kr: "수감자 수기", en: "Notes From the Chained", two: "얼음 피해 +10%", four: "난개/빙결 후 이상 및 혼돈 피해 보정", stats: { iceDmg: 10 } },
    { id: "wuthering-salon", kr: "울부짖는 살롱", en: "Wuthering Salon", two: "바람 피해 +10%", four: "EX 후 이상 마스터리 및 풍화 후 피해 보정", stats: { windDmg: 10 } },
    { id: "sky-ablaze", kr: "새벽녘 여행기", en: "The Sky Ablaze", two: "에테르 피해 +10%", four: "에테르 캐릭터 치명타 피해 및 EX/궁극기 공격력 보정", stats: { etherDmg: 10 } },
  ];

  const materialNames = {
    role: {
      attack: ["초급 강공 휘장", "고급 강공 휘장", "선구자 휘장"],
      stun: ["초급 격파 휘장", "고급 격파 휘장", "파괴자 휘장"],
      anomaly: ["초급 이상 휘장", "고급 이상 휘장", "지배자 휘장"],
      support: ["초급 지원 휘장", "고급 지원 휘장", "통솔자 휘장"],
      defense: ["초급 방어 휘장", "고급 방어 휘장", "수호자 휘장"],
      rupture: ["초급 명파 휘장", "고급 명파 휘장", "판결자 휘장"],
    },
    chips: {
      physical: ["기본 물리 칩", "심화 물리 칩", "특화 물리 칩"],
      fire: ["기본 화상 칩", "심화 화상 칩", "특화 화상 칩"],
      ice: ["기본 빙결 칩", "심화 빙결 칩", "특화 빙결 칩"],
      frost: ["기본 빙결 칩", "심화 빙결 칩", "특화 빙결 칩"],
      electric: ["기본 감전 칩", "심화 감전 칩", "특화 감전 칩"],
      ether: ["기본 에테르 칩", "심화 에테르 칩", "특화 에테르 칩"],
      wind: ["기본 바람 칩", "심화 바람 칩", "특화 바람 칩"],
      auricInk: ["기본 명파 칩", "심화 명파 칩", "특화 명파 칩"],
    },
  };

  const englishAgentRecommendations = {
    anby: {
      faction: "Cunning Hares",
      engines: ["Demara Battery Mark II", "Hellfire Gears", "The Restrained"],
      discs: ["Shockstar Disco 4 + Swing Jazz 2"],
      teams: [{ name: "Starter Electric", members: ["anby", "anton", "nicole"], note: "Stun first, then swap into the Electric Attack damage window." }],
    },
    anton: {
      faction: "Belobog Heavy Industries",
      engines: ["Drill Rig - Red Axis", "The Brimstone"],
      discs: ["Thunder Metal 4 + Woodpecker Electro 2"],
      teams: [{ name: "Electric Attack", members: ["anton", "anby", "rina"], note: "Keep Shock active and burst during the stun window." }],
    },
    billy: {
      faction: "Cunning Hares",
      engines: ["Starlight Engine Replica", "Steel Cushion"],
      discs: ["Fanged Metal 4 + Woodpecker Electro 2"],
      teams: [{ name: "Cunning Hares", members: ["billy", "anby", "nicole"], note: "Free-agent core for early Physical Attack routing." }],
    },
    nicole: {
      faction: "Cunning Hares",
      engines: ["The Vault", "Weeping Cradle"],
      discs: ["Swing Jazz 4 + Chaotic Metal 2"],
      teams: [{ name: "Ether Burst", members: ["zhu-yuan", "qingyi", "nicole"], note: "Group enemies and apply DEF reduction before Zhu Yuan's burst." }],
    },
    "zhu-yuan": {
      faction: "Criminal Investigation Special Response Team",
      engines: ["Riot Suppressor Mark VI", "The Brimstone"],
      discs: ["Chaotic Metal 4 + Woodpecker Electro 2"],
      teams: [
        { name: "Zhu Yuan Standard", members: ["zhu-yuan", "qingyi", "nicole"], note: "Load shotgun shells into the stun window." },
        { name: "Zhu Yuan Support Burst", members: ["zhu-yuan", "anby", "astra"], note: "Support-heavy burst shell for buffed damage windows." },
      ],
    },
    qingyi: {
      faction: "Criminal Investigation Special Response Team",
      engines: ["Ice-Jade Teapot", "Hellfire Gears"],
      discs: ["Shockstar Disco 4 + Swing Jazz 2"],
      teams: [{ name: "Stun Core", members: ["zhu-yuan", "qingyi", "nicole"], note: "High-output stun slot for burst-focused teams." }],
    },
    ellen: {
      faction: "Victoria Housekeeping Co.",
      engines: ["Deep Sea Visitor", "The Brimstone"],
      discs: ["Polar Metal 4 + Woodpecker Electro 2"],
      teams: [
        { name: "Ellen Freeze", members: ["ellen", "lycaon", "soukaku"], note: "Classic Ice Attack shell with reliable stun and ATK support." },
        { name: "Ellen Buff Window", members: ["ellen", "lighter", "soukaku"], note: "Lighter expands the damage window when available." },
      ],
    },
    lycaon: {
      faction: "Victoria Housekeeping Co.",
      engines: ["The Restrained", "Hellfire Gears"],
      discs: ["Shockstar Disco 4 + Swing Jazz 2"],
      teams: [{ name: "Ice Stun", members: ["ellen", "lycaon", "soukaku"], note: "Ice stun slot that pairs naturally with Ellen." }],
    },
    rina: {
      faction: "Victoria Housekeeping Co.",
      engines: ["Weeping Cradle", "Elegant Vanity"],
      discs: ["Swing Jazz 4 + Puffer Electro 2"],
      teams: [{ name: "Shock Support", members: ["grace", "rina", "anton"], note: "PEN and Shock support for Electric teams." }],
    },
    soukaku: {
      faction: "Hollow Special Operations Section 6",
      engines: ["Unfettered Game Ball", "Weeping Cradle"],
      discs: ["Swing Jazz 4 + Polar Metal 2"],
      teams: [{ name: "Ice Support", members: ["ellen", "lycaon", "soukaku"], note: "ATK support for Ice damage dealers." }],
    },
    miyabi: {
      faction: "Hollow Special Operations Section 6",
      engines: ["Hailstorm Shrine", "Fusion Compiler"],
      discs: ["Branch & Blade Song 4 + Woodpecker Electro 2"],
      teams: [
        { name: "Miyabi Disorder", members: ["miyabi", "yanagi", "astra"], note: "Anomaly swap routing with strong support buffs." },
        { name: "Miyabi Ice", members: ["miyabi", "lycaon", "soukaku"], note: "Stable Frost/Ice route with traditional stun support." },
      ],
    },
    harumasa: {
      faction: "Hollow Special Operations Section 6",
      engines: ["Zanshin Herb Case", "The Brimstone"],
      discs: ["Thunder Metal 4 + Woodpecker Electro 2"],
      teams: [{ name: "Electric Attack", members: ["harumasa", "qingyi", "rina"], note: "Compress Electric damage into stun windows." }],
    },
    jane: {
      faction: "Criminal Investigation Special Response Team",
      engines: ["Sharpened Stinger", "Fusion Compiler"],
      discs: ["Fanged Metal 4 + Freedom Blues 2"],
      teams: [
        { name: "Jane Assault", members: ["jane", "seth", "rina"], note: "Shield and PEN support for repeated Assault triggers." },
        { name: "Jane Disorder", members: ["jane", "burnice", "seth"], note: "Cross Physical and Fire Anomaly applications." },
      ],
    },
    seth: {
      faction: "Criminal Investigation Special Response Team",
      engines: ["Peacekeeper - Specialized", "Original Transmorpher"],
      discs: ["Proto Punk 4 + Freedom Blues 2"],
      teams: [{ name: "Anomaly Defense", members: ["jane", "seth", "burnice"], note: "Defensive utility and support for Anomaly teams." }],
    },
    burnice: {
      faction: "Sons of Calydon",
      engines: ["Flamemaker Shaker", "Fusion Compiler"],
      discs: ["Chaos Jazz 4 + Freedom Blues 2"],
      teams: [{ name: "Fire Disorder", members: ["jane", "burnice", "seth"], note: "Off-field Fire Anomaly pressure for Disorder triggers." }],
    },
    lighter: {
      faction: "Sons of Calydon",
      engines: ["Blazing Laurel", "Hellfire Gears"],
      discs: ["Shockstar Disco 4 + Swing Jazz 2"],
      teams: [{ name: "Fire/Ice Stun", members: ["ellen", "lighter", "soukaku"], note: "Extended stun-window routing for Fire and Ice teams." }],
    },
    astra: {
      faction: "Stars of Lyra",
      engines: ["Elegant Vanity", "Weeping Cradle"],
      discs: ["Astral Voice 4 + Swing Jazz 2"],
      teams: [{ name: "Universal Support", members: ["miyabi", "yanagi", "astra"], note: "Strong support slot for buff-dependent damage dealers." }],
    },
    yanagi: {
      faction: "Hollow Special Operations Section 6",
      engines: ["Timeweaver", "Fusion Compiler"],
      discs: ["Chaos Jazz 4 + Freedom Blues 2"],
      teams: [{ name: "Miyabi Disorder", members: ["miyabi", "yanagi", "astra"], note: "Electric Anomaly route for Disorder triggers." }],
    },
    yixuan: {
      faction: "Yunkui Summit",
      engines: ["Cloudcleave Radiance", "Kraken's Cradle"],
      discs: ["Yunkui Tales 4 + Woodpecker Electro 2"],
      teams: [{ name: "Yunkui Rupture", members: ["yixuan", "ju-fufu", "pan-yinhu"], note: "Rupture DPS with dedicated stun and sustain support." }],
    },
    "ju-fufu": {
      faction: "Yunkui Summit",
      engines: ["Chief Sidekick", "Hellfire Gears"],
      discs: ["King of the Summit 4 + Shockstar Disco 2"],
      teams: [{ name: "Yunkui Rupture", members: ["yixuan", "ju-fufu", "pan-yinhu"], note: "Stun support and CRIT DMG utility for Yunkui teams." }],
    },
    "pan-yinhu": {
      faction: "Yunkui Summit",
      engines: ["Radiowave Journey", "Original Transmorpher"],
      discs: ["Proto Punk 4 + Yunkui Tales 2"],
      teams: [{ name: "Yunkui Rupture", members: ["yixuan", "ju-fufu", "pan-yinhu"], note: "Defensive utility and survival support slot." }],
    },
    yuzuha: {
      faction: "Spook Shack",
      engines: ["Metanukimorphosis", "Elegant Vanity"],
      discs: ["Moonlight Lullaby 4 + Fanged Metal 2"],
      teams: [{ name: "Physical Anomaly", members: ["alice", "yuzuha", "jane"], note: "Support route for Physical Anomaly damage dealers." }],
    },
    alice: {
      faction: "Spook Shack",
      engines: ["Practiced Perfection", "Fusion Compiler"],
      discs: ["Fanged Metal 4 + Freedom Blues 2"],
      teams: [{ name: "Physical Anomaly", members: ["alice", "yuzuha", "jane"], note: "Support and Assault-focused Physical Anomaly route." }],
    },
  };

  const koreanAgentDisplay = {
    anby: { faction: "교활한 토끼굴", teams: [{ name: "초반 전기", members: ["anby", "anton", "nicole"], note: "격파 후 전기 강공 딜러를 넣는 기본형입니다." }] },
    anton: { faction: "벨로보그 중공업", teams: [{ name: "전기 강공", members: ["anton", "anby", "rina"], note: "감전 유지 후 그로기 창에 버스트를 몰아넣습니다." }] },
    billy: { faction: "교활한 토끼굴", teams: [{ name: "교활한 토끼굴", members: ["billy", "anby", "nicole"], note: "무료 에이전트 중심의 물리 강공 조합입니다." }] },
    nicole: { faction: "교활한 토끼굴", teams: [{ name: "에테르 버스트", members: ["zhu-yuan", "qingyi", "nicole"], note: "몹몰이와 방어 감소 후 Zhu Yuan의 화력을 집중합니다." }] },
    "zhu-yuan": {
      faction: "치안국 특수대응팀",
      teams: [
        { name: "Zhu Yuan 표준", members: ["zhu-yuan", "qingyi", "nicole"], note: "그로기 창에 탄창을 몰아넣는 표준 구성입니다." },
        { name: "Zhu Yuan 지원 강화", members: ["zhu-yuan", "anby", "astra"], note: "지원 버프를 크게 받는 버스트형 구성입니다." },
      ],
    },
    qingyi: { faction: "치안국 특수대응팀", teams: [{ name: "그로기 코어", members: ["zhu-yuan", "qingyi", "nicole"], note: "고효율 격파 슬롯으로 버스트 딜러를 보조합니다." }] },
    ellen: {
      faction: "빅토리아 하우스키핑",
      teams: [
        { name: "Ellen 빙결", members: ["ellen", "lycaon", "soukaku"], note: "격파와 얼음 버프로 안정적으로 딜 타이밍을 만듭니다." },
        { name: "Ellen 버프형", members: ["ellen", "lighter", "soukaku"], note: "Lighter 보유 시 화력 창을 더 크게 잡는 구성입니다." },
      ],
    },
    lycaon: { faction: "빅토리아 하우스키핑", teams: [{ name: "얼음 격파", members: ["ellen", "lycaon", "soukaku"], note: "Ellen과 궁합이 좋은 얼음 격파 슬롯입니다." }] },
    rina: { faction: "빅토리아 하우스키핑", teams: [{ name: "감전 지원", members: ["grace", "rina", "anton"], note: "관통과 감전 보조로 전기 파티를 지원합니다." }] },
    soukaku: { faction: "대공동 6과", teams: [{ name: "얼음 지원", members: ["ellen", "lycaon", "soukaku"], note: "얼음 딜러의 공격력과 운용 안정성을 보조합니다." }] },
    miyabi: {
      faction: "대공동 6과",
      teams: [
        { name: "Miyabi 혼돈", members: ["miyabi", "yanagi", "astra"], note: "이상 교대와 지원 버프를 함께 보는 구성입니다." },
        { name: "Miyabi 얼음", members: ["miyabi", "lycaon", "soukaku"], note: "얼음/서리 중심의 안정형 구성입니다." },
      ],
    },
    harumasa: { faction: "대공동 6과", teams: [{ name: "전기 강공", members: ["harumasa", "qingyi", "rina"], note: "격파 후 전기 딜을 압축하는 구성입니다." }] },
    jane: {
      faction: "치안국 특수대응팀",
      teams: [
        { name: "Jane 강타", members: ["jane", "seth", "rina"], note: "실드와 관통 지원을 받아 강타를 반복합니다." },
        { name: "Jane 혼돈", members: ["jane", "burnice", "seth"], note: "물리와 불 이상을 교차해 혼돈을 노립니다." },
      ],
    },
    seth: { faction: "치안국 특수대응팀", teams: [{ name: "이상 방어", members: ["jane", "seth", "burnice"], note: "이상 캐릭터를 보호하고 보조하는 방어 슬롯입니다." }] },
    burnice: { faction: "칼리돈의 자손", teams: [{ name: "불 혼돈", members: ["jane", "burnice", "seth"], note: "오프필드 불 이상으로 혼돈을 유도합니다." }] },
    lighter: { faction: "칼리돈의 자손", teams: [{ name: "불/얼음 격파", members: ["ellen", "lighter", "soukaku"], note: "그로기 창을 확장해 딜 타이밍을 크게 잡습니다." }] },
    astra: { faction: "리라의 별", teams: [{ name: "범용 지원", members: ["miyabi", "yanagi", "astra"], note: "버프 의존 딜러와 잘 맞는 범용 지원 구성입니다." }] },
    yanagi: { faction: "대공동 6과", teams: [{ name: "Miyabi 혼돈", members: ["miyabi", "yanagi", "astra"], note: "전기 이상으로 혼돈 트리거를 보조합니다." }] },
    yixuan: { faction: "운규산", teams: [{ name: "운규 명파", members: ["yixuan", "ju-fufu", "pan-yinhu"], note: "명파 딜러와 전용 지원을 함께 운용합니다." }] },
    "ju-fufu": { faction: "운규산", teams: [{ name: "운규 명파", members: ["yixuan", "ju-fufu", "pan-yinhu"], note: "그로기와 치명타 피해 보조를 담당합니다." }] },
    "pan-yinhu": { faction: "운규산", teams: [{ name: "운규 명파", members: ["yixuan", "ju-fufu", "pan-yinhu"], note: "생존과 보조를 담당하는 방어 슬롯입니다." }] },
    yuzuha: { faction: "스푸크 샥", teams: [{ name: "물리 이상", members: ["alice", "yuzuha", "jane"], note: "물리 이상 딜러를 지원하는 구성입니다." }] },
    alice: { faction: "스푸크 샥", teams: [{ name: "물리 이상", members: ["alice", "yuzuha", "jane"], note: "지원과 강타를 함께 보는 물리 이상 구성입니다." }] },
    ben: { faction: "벨로보그 중공업", teams: [{ name: "벨로보그 코어", members: ["koleda", "ben", "grace"], note: "방어와 격파를 함께 쓰는 벨로보그 구성입니다." }] },
    corin: { faction: "빅토리아 하우스키핑", teams: [{ name: "빅토리아 물리", members: ["corin", "lycaon", "rina"], note: "그로기 창에 물리 강공 피해를 집중합니다." }] },
    grace: { faction: "벨로보그 중공업", teams: [{ name: "감전 코어", members: ["grace", "rina", "anton"], note: "감전 유지와 전기 후속 피해를 보는 구성입니다." }] },
    koleda: { faction: "벨로보그 중공업", teams: [{ name: "벨로보그 코어", members: ["koleda", "ben", "grace"], note: "격파와 방어 유틸을 함께 제공합니다." }] },
    nekomata: { faction: "교활한 토끼굴", teams: [{ name: "교활한 토끼굴 버스트", members: ["nekomata", "anby", "nicole"], note: "방어 감소와 그로기 창을 활용하는 물리 버스트 구성입니다." }] },
    "soldier-11": { faction: "오볼로스 소대", teams: [{ name: "불 강공", members: ["soldier-11", "lighter", "lucy"], note: "불 피해 딜러에 격파와 지원 슬롯을 붙입니다." }] },
    lucy: { faction: "칼리돈의 자손", teams: [{ name: "칼리돈 불", members: ["burnice", "lighter", "lucy"], note: "불 속성 파티를 보조하는 지원 선택지입니다." }] },
    piper: { faction: "칼리돈의 자손", teams: [{ name: "저비용 강타", members: ["piper", "lucy", "seth"], note: "접근성 좋은 물리 이상 구성입니다." }] },
    caesar: { faction: "칼리돈의 자손", teams: [{ name: "칼리돈 가드", members: ["burnice", "caesar", "lucy"], note: "실드, 피해 증가, 불/이상 압박을 함께 봅니다." }] },
    evelyn: { faction: "리라의 별", teams: [{ name: "리라의 별", members: ["evelyn", "lighter", "astra"], note: "강력한 지원 창을 활용하는 불 강공 구성입니다." }] },
    trigger: { faction: "오볼로스 소대", teams: [{ name: "오볼로스 전기", members: ["harumasa", "trigger", "rina"], note: "전기 강공 파티를 위한 격파 슬롯입니다." }] },
    pulchra: { faction: "칼리돈의 자손", teams: [{ name: "물리 격파", members: ["jane", "pulchra", "seth"], note: "강타 파티를 위한 물리 격파 지원입니다." }] },
    hugo: { faction: "모킹버드", teams: [{ name: "모킹버드 얼음", members: ["hugo", "lycaon", "rina"], note: "얼음 강공 딜러에 격파와 지원을 붙입니다." }] },
    vivian: { faction: "모킹버드", teams: [{ name: "에테르 이상", members: ["vivian", "astra", "yanagi"], note: "에테르 이상 압박과 혼돈 트리거를 함께 봅니다." }] },
    pyrois: { faction: "파에톤", teams: [{ name: "Pyrois 3.0 코어", members: ["pyrois", "velina", "norma"], note: "에테르 강공에 바람 이상과 불 격파 슬롯을 붙이는 3.0 구성입니다." }] },
    velina: { faction: "대외전략부", teams: [{ name: "바람 이상", members: ["velina", "pyrois", "astra"], note: "바람 이상 운용과 범용 혼돈 루트를 지원합니다." }] },
    norma: { faction: "대외전략부", teams: [{ name: "3.0 격파 프리뷰", members: ["norma", "pyrois", "velina"], note: "불 격파 프리뷰 슬롯입니다. 정식 세부 정보에 따라 바뀔 수 있습니다." }] },
  };

  const discKoreanDisplay = {
    none: { kr: "없음", two: "없음", four: "없음" },
    "fanged-metal": { kr: "송곳니 메탈", two: "물리 피해 +10%", four: "강타 후 대상이 받는 피해 증가" },
    "polar-metal": { kr: "극지 메탈", two: "얼음 피해 +10%", four: "일반/대시 공격 피해 증가, 빙결/쇄빙 후 추가 보정" },
    "thunder-metal": { kr: "썬더 메탈", two: "전기 피해 +10%", four: "감전 대상이 있을 때 공격력 증가" },
    "chaotic-metal": { kr: "카오스 메탈", two: "에테르 피해 +10%", four: "치명타 피해 증가, 침식 피해 후 추가 중첩" },
    "inferno-metal": { kr: "불지옥 메탈", two: "불 피해 +10%", four: "연소 대상 공격 시 치명타 확률 증가" },
    "swing-jazz": { kr: "스윙 재즈", two: "에너지 자동 회복 +20%", four: "콤보 스킬/궁극기 후 파티 피해 증가" },
    "soul-rock": { kr: "소울 록", two: "방어력 +16%", four: "피격 후 받는 피해 감소" },
    "hormone-punk": { kr: "호르몬 펑크", two: "공격력 +10%", four: "전투 진입/교대 후 공격력 증가" },
    "freedom-blues": { kr: "자유의 블루스", two: "이상 숙련 +30", four: "EX 특수 스킬 명중 시 이상 축적 저항 감소" },
    "shockstar-disco": { kr: "쇼크스타 디스코", two: "충격력 +6%", four: "일반/대시/회피 반격의 그로기 축적 증가" },
    "puffer-electro": { kr: "복어 일렉트로", two: "관통률 +8%", four: "궁극기 피해 증가 및 궁극기 후 공격력 증가" },
    "woodpecker-electro": { kr: "딱따구리 일렉트로", two: "치명타 확률 +8%", four: "치명타 적중 시 공격력 중첩 증가" },
    "proto-punk": { kr: "원시 펑크", two: "실드량 +15%", four: "지원 방어/회피 지원 후 파티 피해 증가" },
    "chaos-jazz": { kr: "카오스 재즈", two: "이상 숙련 +30", four: "불/전기 피해 및 오프필드 EX/지원 피해 증가" },
    "astral-voice": { kr: "고요 속의 별", two: "공격력 +10%", four: "퀵 지원 진입 시 고요 중첩 획득" },
    "branch-blade": { kr: "나뭇가지 검의 노래", two: "치명타 피해 +16%", four: "높은 이상 장악과 빙결/쇄빙 조건에서 치명 보정" },
    "shadow-harmony": { kr: "그림자처럼 함께", two: "여진/대시 공격 피해 +15%", four: "여진/대시 공격 적중 시 공격력 및 치명타 확률 증가" },
    "phaethon-melody": { kr: "파에톤의 노래", two: "이상 장악 +8%", four: "EX 특수 스킬 후 이상 숙련 및 에테르 피해 증가" },
    "yunkui-tales": { kr: "운규 이야기", two: "HP +10%", four: "EX/콤보/궁극기 후 치명타 확률 증가, 최대 중첩 시 순수 피해 증가" },
    "king-summit": { kr: "산림의 왕", two: "그로기 수치 +6%", four: "격파 캐릭터 사용 시 파티 치명타 피해 증가" },
    "dawns-bloom": { kr: "여명의 꽃", two: "일반 공격 피해 +15%", four: "일반 공격 피해 증가, 강공 캐릭터는 EX/궁극기 후 추가 증가" },
    "moonlight-lullaby": { kr: "달빛 기사의 칭송", two: "에너지 자동 회복 +20%", four: "지원 캐릭터의 EX 특수 스킬/궁극기 후 파티 피해 증가" },
    "white-water-ballad": { kr: "물빛 노랫소리", two: "물리 피해 +10%", four: "에테르 장막 중 치명타 확률 증가, 강공 캐릭터는 장막 발동/연장 시 치명타 확률 및 공격력 증가" },
    "shining-aria": { kr: "빛의 아리아", two: "에테르 피해 +10%", four: "일반 공격 명중 시 이상 마스터리 증가, 적 그로기 시 피해 증가" },
    "bunny-wonderland": { kr: "이상한 나라의 눈토끼", two: "HP +10%", four: "방어 캐릭터 장착 시 EX/지원 행동 후 파티 피해 증가" },
    "notes-chained": { kr: "수감자 수기", two: "얼음 피해 +10%", four: "난개 후 이상 마스터리 증가, 빙결 후 이상 및 혼돈 피해 증가" },
    "wuthering-salon": { kr: "울부짖는 살롱", two: "바람 피해 +10%", four: "EX 특수 스킬 후 이상 마스터리 증가, 풍화 후 피해 증가" },
    "sky-ablaze": { kr: "새벽녘 여행기", two: "에테르 피해 +10%", four: "에테르 캐릭터 치명타 피해 증가, EX/궁극기 후 공격력 증가" },
  };

  const discBuffPresets = {
    "fanged-metal": { label: "송곳니 메탈 4세트", dmgBonus: 35, note: "강타 후" },
    "polar-metal": { label: "극지 메탈 4세트", dmgBonus: 20, note: "일반/대시 공격 중심" },
    "thunder-metal": { label: "썬더 메탈 4세트", atkPct: 28, note: "감전 대상" },
    "chaotic-metal": { label: "카오스 메탈 4세트", critDmg: 20, note: "침식 중첩" },
    "inferno-metal": { label: "불지옥 메탈 4세트", critRate: 28, note: "연소 대상" },
    "swing-jazz": { label: "스윙 재즈 4세트", dmgBonus: 15, note: "콤보/궁극기 후" },
    "hormone-punk": { label: "호르몬 펑크 4세트", atkPct: 25, note: "전투 진입/교대" },
    "puffer-electro": { label: "복어 일렉트로 4세트", dmgBonus: 20, atkPct: 15, note: "궁극기 창" },
    "woodpecker-electro": { label: "딱따구리 일렉트로 4세트", atkPct: 27, note: "치명타 3중첩" },
    "proto-punk": { label: "원시 펑크 4세트", dmgBonus: 15, note: "지원 후" },
    "chaos-jazz": { label: "카오스 재즈 4세트", dmgBonus: 15, note: "오프필드/EX 창" },
    "astral-voice": { label: "고요 속의 별 4세트", dmgBonus: 24, note: "고요 중첩" },
    "branch-blade": { label: "나뭇가지 검의 노래 4세트", critRate: 12, critDmg: 30, note: "빙결/쇄빙 창" },
    "shadow-harmony": { label: "그림자처럼 함께 4세트", atkPct: 20, critRate: 12, note: "여진/대시 적중" },
    "phaethon-melody": { label: "파에톤의 노래 4세트", dmgBonus: 18, anomalyProficiency: 60, note: "EX 연계" },
    "yunkui-tales": { label: "운규 이야기 4세트", critRate: 12, dmgBonus: 20, note: "순수 피해 루트" },
    "king-summit": { label: "산림의 왕 4세트", critDmg: 30, note: "격파 지원" },
    "dawns-bloom": { label: "여명의 꽃 4세트", dmgBonus: 40, note: "일반 공격 조건 최대치" },
    "moonlight-lullaby": { label: "달빛 기사의 칭송 4세트", dmgBonus: 18, note: "지원 EX/궁극기" },
    "white-water-ballad": { label: "물빛 노랫소리 4세트", critRate: 20, atkPct: 10, note: "에테르 장막 조건 최대치" },
    "shining-aria": { label: "빛의 아리아 4세트", anomalyProficiency: 36, dmgBonus: 25, note: "일반 공격/그로기 조건" },
    "bunny-wonderland": { label: "이상한 나라의 눈토끼 4세트", dmgBonus: 18, note: "방어 캐릭터 3중첩" },
    "notes-chained": { label: "수감자 수기 4세트", anomalyProficiency: 48, dmgBonus: 16, note: "난개/빙결 조건" },
    "wuthering-salon": { label: "울부짖는 살롱 4세트", anomalyProficiency: 50, dmgBonus: 18, note: "EX 2중첩 및 풍화 조건" },
    "sky-ablaze": { label: "새벽녘 여행기 4세트", critDmg: 30, atkPct: 10, note: "에테르/EX 또는 궁극기 조건" },
  };

  const partyDiscBuffPresets = {
    "fanged-metal": { label: "송곳니 메탈 4세트", dmgBonus: 35, note: "강타 후" },
    "swing-jazz": { label: "스윙 재즈 4세트", dmgBonus: 15, note: "콤보/궁극기 후" },
    "proto-punk": { label: "원시 펑크 4세트", dmgBonus: 15, note: "지원 방어/회피 지원 후" },
    "astral-voice": { label: "고요 속의 별 4세트", dmgBonus: 24, note: "퀵 지원 진입 후" },
    "king-summit": { label: "산림의 왕 4세트", critDmg: 30, note: "격파 캐릭터 발동 후" },
    "moonlight-lullaby": { label: "달빛 기사의 칭송 4세트", dmgBonus: 18, note: "지원 EX/궁극기 후" },
    "bunny-wonderland": { label: "이상한 나라의 눈토끼 4세트", dmgBonus: 18, note: "방어 캐릭터 3중첩" },
  };

  const teamBuffPresets = {
    astra: { label: "Astra Yao", atkPct: 15, dmgBonus: 30, note: "지원 버프 창" },
    nicole: { label: "Nicole Demara", defReduction: 40, dmgBonus: 10, note: "에테르 필드 / 방어 감소" },
    rina: { label: "Alexandrina Sebastiane", penRatio: 20, dmgBonus: 10, note: "관통 지원" },
    soukaku: { label: "Soukaku", atkPct: 20, dmgBonus: 10, note: "공격력 지원" },
    lucy: { label: "Lucy", atkPct: 15, note: "응원 버프" },
    caesar: { label: "Caesar King", atkPct: 15, dmgBonus: 25, note: "실드 지원" },
    seth: { label: "Seth Lowell", anomalyProficiency: 100, dmgBonus: 10, note: "이상 실드 지원" },
    yuzuha: { label: "Ukinami Yuzuha", anomalyProficiency: 120, dmgBonus: 15, note: "물리 이상 지원" },
    "pan-yinhu": { label: "Pan Yinhu", dmgBonus: 12, note: "방어 유틸 지원" },
    "ju-fufu": { label: "Ju Fufu", critDmg: 30, stunDmg: 10, note: "격파 지원" },
    lighter: { label: "Lighter", stunDmg: 15, dmgBonus: 15, note: "그로기 창 지원" },
    qingyi: { label: "Qingyi", stunDmg: 20, note: "고배율 그로기 창" },
    lycaon: { label: "Von Lycaon", stunDmg: 15, dmgBonus: 10, note: "격파 지원" },
    anby: { label: "Anby Demara", stunDmg: 10, note: "초반 격파 지원" },
    koleda: { label: "Koleda Belobog", stunDmg: 15, note: "불 격파 지원" },
    pulchra: { label: "Pulchra Fellini", stunDmg: 12, note: "물리 격파 지원" },
    norma: { label: "Norma Hollowell", stunDmg: 15, critRate: 8, note: "불 격파 프리뷰 지원" },
    velina: { label: "Velina Airgid", anomalyMastery: 84, dmgBonus: 15, note: "바람 이상 지원" },
  };

  const buffFields = [
    "atkPct",
    "hpPct",
    "sheerForce",
    "dmgBonus",
    "critRate",
    "critDmg",
    "penRatio",
    "flatPen",
    "resShred",
    "defReduction",
    "anomalyProficiency",
    "anomalyMastery",
    "stunDmg",
    "impactPct",
    "energyRegenPct",
  ];

  function needsEnglishText(value) {
    return typeof value === "string" && value.includes("�");
  }

  function localizeDiscCombo(value) {
    return driveDiscs.reduce((label, disc) => {
      const koreanName = discKoreanDisplay[disc.id]?.kr || disc.en;
      return label.replaceAll(disc.en, koreanName);
    }, value);
  }

  function localizeEngineCombo(value) {
    return engines.reduce((label, engine) => {
      if (engine.id === "manual") return label;
      return label.replaceAll(engine.en, engine.kr || engine.en);
    }, value);
  }

  function applyDisplayData() {
    engines.forEach((engine) => {
      if (engine.id === "manual") {
        engine.kr = "수동 입력";
        engine.effect = "수동 입력값만 반영합니다.";
        return;
      }
      if (needsEnglishText(engine.effect)) {
        engine.effect = "효과 설명은 검증 대기 중이며, 계산기는 구조화된 스탯 필드를 사용합니다.";
      }
    });

    agents.forEach((agent) => {
      const recommendation = englishAgentRecommendations[agent.id];
      if (recommendation) {
        agent.faction = recommendation.faction;
        agent.engines = recommendation.engines;
        agent.discs = recommendation.discs;
        agent.teams = recommendation.teams;
      }
      const koreanDisplay = koreanAgentDisplay[agent.id];
      if (koreanDisplay) {
        agent.faction = koreanDisplay.faction;
        agent.teams = koreanDisplay.teams;
      } else if (needsEnglishText(agent.faction)) {
        agent.faction = "미확인";
      }
      agent.teams = agent.teams.map((team) => ({
        ...team,
        name: needsEnglishText(team.name) ? `${agent.en} 코어` : team.name,
        note: needsEnglishText(team.note) ? "초안 추천 구성입니다. 최신 엔드게임 데이터 기준으로 검증이 필요합니다." : team.note,
      }));
      agent.engines = agent.engines.map(localizeEngineCombo);
      agent.discs = agent.discs.map(localizeDiscCombo);
    });

    driveDiscs.forEach((disc) => {
      const effects = discKoreanDisplay[disc.id] || {};
      disc.kr = effects.kr || disc.en;
      disc.two = effects.two || disc.two;
      disc.four = effects.four || disc.four;
    });

    materialNames.role = {
      attack: ["초급 강공 휘장", "고급 강공 휘장", "선구자 휘장"],
      stun: ["초급 격파 휘장", "고급 격파 휘장", "파괴자 휘장"],
      anomaly: ["초급 이상 휘장", "고급 이상 휘장", "지배자 휘장"],
      support: ["초급 지원 휘장", "고급 지원 휘장", "통솔자 휘장"],
      defense: ["초급 방어 휘장", "고급 방어 휘장", "수호자 휘장"],
      rupture: ["초급 명파 휘장", "고급 명파 휘장", "판결자 휘장"],
    };
    materialNames.chips = {
      physical: ["기본 물리 칩", "심화 물리 칩", "특화 물리 칩"],
      fire: ["기본 화상 칩", "심화 화상 칩", "특화 화상 칩"],
      ice: ["기본 빙결 칩", "심화 빙결 칩", "특화 빙결 칩"],
      frost: ["기본 빙결 칩", "심화 빙결 칩", "특화 빙결 칩"],
      electric: ["기본 감전 칩", "심화 감전 칩", "특화 감전 칩"],
      ether: ["기본 에테르 칩", "심화 에테르 칩", "특화 에테르 칩"],
      wind: ["기본 바람 칩", "심화 바람 칩", "특화 바람 칩"],
      auricInk: ["기본 현묵 칩", "심화 현묵 칩", "특화 현묵 칩"],
    };
  }

  applyDisplayData();

  const tables = {
    agentPromotion: [
      { level: 20, tier: 0, count: 4, denny: 24000 },
      { level: 30, tier: 1, count: 12, denny: 56000 },
      { level: 40, tier: 1, count: 20, denny: 120000 },
      { level: 50, tier: 2, count: 10, denny: 200000 },
      { level: 60, tier: 2, count: 20, denny: 400000 },
    ],
    agentExpByBand: [
      { from: 1, to: 10, exp: 24000 },
      { from: 10, to: 20, exp: 56000 },
      { from: 20, to: 30, exp: 100000 },
      { from: 30, to: 40, exp: 180000 },
      { from: 40, to: 50, exp: 300000 },
      { from: 50, to: 60, exp: 450000 },
    ],
    skill: [
      { to: 2, tier: 0, count: 2, denny: 2000 },
      { to: 3, tier: 0, count: 3, denny: 3000 },
      { to: 4, tier: 1, count: 2, denny: 6000 },
      { to: 5, tier: 1, count: 3, denny: 9000 },
      { to: 6, tier: 1, count: 4, denny: 12000 },
      { to: 7, tier: 1, count: 6, denny: 18000 },
      { to: 8, tier: 2, count: 5, denny: 45000 },
      { to: 9, tier: 2, count: 8, denny: 67500 },
      { to: 10, tier: 2, count: 10, denny: 90000 },
      { to: 11, tier: 2, count: 12, denny: 112500, hamster: 1 },
      { to: 12, tier: 2, count: 15, denny: 135000, hamster: 1 },
    ],
    core: [
      { to: 1, label: "A", denny: 5000 },
      { to: 2, label: "B", denny: 12000 },
      { to: 3, label: "C", denny: 28000, highDim: 2 },
      { to: 4, label: "D", denny: 60000, highDim: 4, weekly: 2 },
      { to: 5, label: "E", denny: 100000, highDim: 9, weekly: 3 },
      { to: 6, label: "F", denny: 200000, highDim: 15, weekly: 4 },
    ],
    enginePromotion: [
      { level: 20, part: 4, denny: 12000 },
      { level: 30, part: 12, denny: 28000 },
      { level: 40, part: 20, denny: 60000 },
      { level: 50, part: 10, advanced: true, denny: 100000 },
      { level: 60, part: 20, advanced: true, denny: 200000 },
    ],
    engineExpByBand: [
      { from: 1, to: 10, exp: 4000 },
      { from: 10, to: 20, exp: 16000 },
      { from: 20, to: 30, exp: 40000 },
      { from: 30, to: 40, exp: 90000 },
      { from: 40, to: 50, exp: 150000 },
      { from: 50, to: 60, exp: 300000 },
    ],
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const fmt = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });
  const fmt1 = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 1 });
  const normalizeSearchText = (value) => String(value ?? "").normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();

  function getPreferredTheme() {
    return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
  }

  function getCurrentTheme() {
    return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  }

  function updateThemeToggle() {
    const button = $("#theme-toggle");
    const icon = $("#theme-toggle-icon");
    if (!button || !icon) return;

    const theme = getCurrentTheme();
    const isDark = theme === "dark";
    icon.textContent = isDark ? "☀" : "☾";
    button.setAttribute("aria-label", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
    button.setAttribute("title", isDark ? "라이트 모드로 전환" : "다크 모드로 전환");
  }

  function setTheme(theme, persist = true) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch {
        // Storage can be unavailable in private or locked-down browser contexts.
      }
    }
    updateThemeToggle();
  }

  function initThemeToggle() {
    setTheme(document.documentElement.dataset.theme || getPreferredTheme(), false);
    $("#theme-toggle")?.addEventListener("click", () => {
      setTheme(getCurrentTheme() === "dark" ? "light" : "dark");
    });
  }

  let fieldHelpTip = null;
  let activeHelpLabel = null;

  function getFieldHelpTip() {
    if (!fieldHelpTip) {
      fieldHelpTip = document.createElement("div");
      fieldHelpTip.className = "field-help-tip";
      fieldHelpTip.id = "field-help-tip";
      fieldHelpTip.hidden = true;
      fieldHelpTip.setAttribute("role", "tooltip");
      document.body.append(fieldHelpTip);
    }
    return fieldHelpTip;
  }

  function positionFieldHelpTip(label) {
    const tip = getFieldHelpTip();
    tip.hidden = false;
    const margin = 12;
    const labelRect = label.getBoundingClientRect();
    const tipRect = tip.getBoundingClientRect();
    const maxLeft = Math.max(margin, window.innerWidth - tipRect.width - margin);
    let left = Math.min(Math.max(labelRect.left, margin), maxLeft);
    let top = labelRect.top - tipRect.height - 10;

    if (top < margin) {
      top = labelRect.bottom + 10;
    }
    if (top + tipRect.height > window.innerHeight - margin) {
      top = Math.max(margin, window.innerHeight - tipRect.height - margin);
    }

    tip.style.left = `${Math.round(left)}px`;
    tip.style.top = `${Math.round(top)}px`;
  }

  function showFieldHelp(event) {
    const label = event.currentTarget;
    const help = label.dataset.help;
    if (!help) return;

    activeHelpLabel = label;
    const tip = getFieldHelpTip();
    tip.textContent = help;
    positionFieldHelpTip(label);
  }

  function hideFieldHelp(event) {
    if (event.type === "focusout" && event.currentTarget.contains(document.activeElement)) return;
    if (activeHelpLabel === event.currentTarget) {
      activeHelpLabel = null;
    }
    if (!activeHelpLabel && fieldHelpTip) {
      fieldHelpTip.hidden = true;
    }
  }

  function initFieldHelp() {
    $$("#damage-form label[data-help]").forEach((label) => {
      label.addEventListener("mouseenter", showFieldHelp);
      label.addEventListener("mouseleave", hideFieldHelp);
      label.addEventListener("focusin", showFieldHelp);
      label.addEventListener("focusout", hideFieldHelp);
    });

    window.addEventListener("resize", () => {
      if (activeHelpLabel) positionFieldHelpTip(activeHelpLabel);
    });
    window.addEventListener(
      "scroll",
      () => {
        if (activeHelpLabel) positionFieldHelpTip(activeHelpLabel);
      },
      true,
    );
    document.addEventListener("pointerdown", (event) => {
      if (!activeHelpLabel || activeHelpLabel.contains(event.target)) return;
      activeHelpLabel = null;
      if (fieldHelpTip) {
        fieldHelpTip.hidden = true;
      }
    });
  }

  let selectedAgentId = agents[0].id;
  let effectDb = { mindscapes: {}, wEngines: {}, status: "unloaded" };
  let effectDbLoadStatus = "unloaded";

  function number(id) {
    const value = Number($(id).value);
    return Number.isFinite(value) ? value : 0;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  async function loadEffectDb() {
    effectDbLoadStatus = "loading";
    try {
      const response = await fetch(EFFECT_DB_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`Effect DB HTTP ${response.status}`);
      effectDb = await response.json();
      effectDbLoadStatus = effectDb.status || "loaded";
    } catch (error) {
      effectDb = { mindscapes: {}, wEngines: {}, status: "unavailable" };
      effectDbLoadStatus = "unavailable";
      console.warn("Effect DB could not be loaded.", error);
    }
  }

  function getAgent(id) {
    return agents.find((agent) => agent.id === id) || agents[0];
  }

  function getEngine(id) {
    return engines.find((engine) => engine.id === id) || engines[0];
  }

  function escapeAttr(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function agentImageTag(agent, alt = "", loading = "lazy") {
    const fallback = agent.imageFallback ? ` data-fallback-src="${escapeAttr(agent.imageFallback)}"` : "";
    const loadingAttr = loading ? ` loading="${escapeAttr(loading)}"` : "";
    return `<img src="${escapeAttr(agent.image)}" alt="${escapeAttr(alt)}"${loadingAttr}${fallback} />`;
  }

  function handleAgentImageError(event) {
    const image = event.currentTarget;
    const fallback = image.dataset.fallbackSrc;
    if (fallback) {
      image.dataset.fallbackSrc = "";
      image.classList.remove("broken");
      image.src = fallback;
      return;
    }
    image.classList.add("broken");
  }

  function getDisc(id) {
    return driveDiscs.find((disc) => disc.id === id) || driveDiscs[0];
  }

  function selectedPartyIds() {
    return ["#party-slot-1", "#party-slot-2"]
      .map((selector) => $(selector)?.value)
      .filter((id) => id && id !== "none" && id !== $("#agent-select")?.value);
  }

  function selectedPartyDiscSources() {
    const usedDiscIds = new Set();
    return [
      { agentSelector: "#party-slot-1", discSelector: "#party-disc-1" },
      { agentSelector: "#party-slot-2", discSelector: "#party-disc-2" },
    ].flatMap(({ agentSelector, discSelector }) => {
      const agentId = $(agentSelector)?.value;
      const discId = $(discSelector)?.value;
      if (!agentId || agentId === "none" || agentId === $("#agent-select")?.value) return [];
      if (!discId || discId === "none" || usedDiscIds.has(discId)) return [];
      const preset = partyDiscBuffPresets[discId];
      if (!preset) return [];
      usedDiscIds.add(discId);
      const agent = getAgent(agentId);
      return [{ type: "파티 디스크", ...preset, label: `${agent.kr} / ${preset.label}` }];
    });
  }

  function selectedMindscapeLevel() {
    return Number($("#mindscape-level")?.value || 0);
  }

  function selectedEngineRefinement() {
    return Number($("#engine-refinement")?.value || 1);
  }

  function normalizeDbStats(stats = {}) {
    return Object.fromEntries(buffFields.map((field) => [field, Number(stats[field] || 0)]));
  }

  function dbSourceNote(item, verification) {
    const sourceStatus = item.sourceStatus || (item.rawText ? "source-text" : item.mockValue ? "source-pending" : "structured");
    if (sourceStatus === "structured") return "자동 파싱 적용";
    if (sourceStatus === "source-text") return "원문 DB";
    return [
      verification === "mock" ? "mock DB" : "",
      item.mockValue ? "원문 수집 대기" : "",
      item.condition || "",
      item.notes || "",
    ]
      .filter(Boolean)
      .join(" / ");
  }

  function dbBuffSource(type, labelPrefix, buff, verification) {
    return {
      type,
      label: `${labelPrefix} / ${buff.label || buff.id}`,
      note: dbSourceNote(buff, verification),
      isDbEffect: true,
      isMock: Boolean(buff.mockValue),
      rawText: buff.rawText || "",
      sourceStatus: buff.sourceStatus || (buff.rawText ? "source-text" : buff.mockValue ? "source-pending" : "structured"),
      ...normalizeDbStats(buff.stats),
    };
  }

  function dbDamageHookSource(type, labelPrefix, hook, verification) {
    return {
      type,
      label: `${labelPrefix} / ${hook.id}`,
      note: dbSourceNote(hook, verification) || hook.formula || "계산식 연결 대기",
      isDbEffect: true,
      isDamageHook: true,
      isMock: Boolean(hook.mockValue),
      rawText: hook.rawText || "",
      sourceStatus: hook.sourceStatus || (hook.rawText ? "source-text" : hook.mockValue ? "source-pending" : "structured"),
      ...normalizeDbStats({}),
    };
  }

  function selectedMindscapeDbSources() {
    if (!$("#auto-mindscape-buffs")?.checked) return [];
    const entry = effectDb.mindscapes?.[$("#agent-select")?.value];
    if (!entry) return [];
    const selectedLevel = selectedMindscapeLevel();
    return (entry.levels || [])
      .filter((level) => level.level > 0 && level.level <= selectedLevel)
      .flatMap((level) => [
        ...(level.buffs || []).map((buff) => dbBuffSource("돌파 DB", `${level.label} 자동`, buff, entry.verification)),
        ...(level.damageHooks || []).map((hook) => dbDamageHookSource("돌파 DB", `${level.label} 자동`, hook, entry.verification)),
      ]);
  }

  function selectedWEngineDbSources() {
    if (!$("#auto-engine-buffs")?.checked) return [];
    const entry = effectDb.wEngines?.[$("#engine-select")?.value];
    if (!entry) return [];
    const refinement = selectedEngineRefinement();
    const row = (entry.refinements || []).find((item) => item.refinement === refinement);
    if (!row) return [];
    return [
      ...(row.buffs || []).map((buff) => dbBuffSource("W-Engine DB", `${row.label} 자동`, buff, entry.verification)),
      ...(row.damageHooks || []).map((hook) => dbDamageHookSource("W-Engine DB", `${row.label} 자동`, hook, entry.verification)),
    ];
  }

  function mindscapeBuffSource() {
    const level = selectedMindscapeLevel();
    const buff = {
      type: "돌파",
      label: `M${level} 돌파 보정`,
      atkPct: number("#mindscape-atk-buff"),
      dmgBonus: number("#mindscape-dmg-buff"),
      critRate: number("#mindscape-crit-rate-buff"),
      critDmg: number("#mindscape-crit-dmg-buff"),
    };
    return buffParts(buff).length > 0 ? buff : null;
  }

  function emptyBuffTotals() {
    return Object.fromEntries(buffFields.map((field) => [field, 0]));
  }

  function addBuffTotals(total, buff) {
    buffFields.forEach((field) => {
      total[field] += Number(buff[field] || 0);
    });
    return total;
  }

  function buffParts(buff) {
    const labels = {
      atkPct: "공격력",
      hpPct: "HP",
      sheerForce: "명파력",
      dmgBonus: "피해",
      critRate: "치명타 확률",
      critDmg: "치명타 피해",
      penRatio: "관통률",
      flatPen: "관통 수치",
      resShred: "저항 감소",
      defReduction: "방어 감소",
      anomalyProficiency: "이상 숙련",
      anomalyMastery: "이상 장악",
      stunDmg: "그로기 피해",
      impactPct: "충격력",
      energyRegenPct: "에너지 자동 회복",
    };
    return buffFields
      .filter((field) => Number(buff[field] || 0) !== 0)
      .map((field) => {
        const value = Number(buff[field] || 0);
        const suffix =
          field === "flatPen" || field === "anomalyProficiency" || field === "anomalyMastery" || field === "sheerForce" ? "" : "%";
        return `${labels[field]} +${fmt1.format(value)}${suffix}`;
      });
  }

  function effectText(source, options = {}) {
    const parts = buffParts(source);
    if (parts.length > 0) return options.includeRaw && source.rawText ? `${parts.join(" / ")}\n${source.rawText}` : parts.join(" / ");
    if (source.rawText) return source.rawText;
    if (source.isDamageHook) return source.note || "계수 테이블 연결 대기";
    if (source.isMock) return source.note || "원문 효과 수집 대기";
    return source.note || "구조화된 효과 없음";
  }

  function sourceStatusText(source) {
    if (!source.isDbEffect) return "";
    if (source.sourceStatus === "source-text") return "원문";
    if (source.sourceStatus === "structured" || buffParts(source).length > 0) return "계산 반영";
    return "대기";
  }

  function renderEffectList(selector, sources, emptyText) {
    const target = $(selector);
    if (!target) return;
    target.replaceChildren(
      ...(sources.length
        ? sources.map((source) => {
            const item = document.createElement("article");
            item.className = "buff-chip";
            const header = document.createElement("div");
            const label = document.createElement("strong");
            const meta = document.createElement("span");
            const body = document.createElement("p");
            const status = sourceStatusText(source);

            label.textContent = source.label;
            meta.textContent = status ? `${source.type} / ${status}` : source.type;
            body.textContent = effectText(source, { includeRaw: true });
            header.append(label, meta);
            item.append(header, body);
            return item;
          })
        : [Object.assign(document.createElement("div"), { className: "empty-state", textContent: emptyText })]),
    );
  }

  function calculationReadyDbSources(sources) {
    return sources.filter((source) => buffParts(source).length > 0);
  }

  function collectBuffSources(discFour) {
    const sources = [];
    if ($("#auto-disc-buffs")?.checked) {
      const discBuff = discBuffPresets[discFour.id];
      if (discBuff) sources.push({ type: "디스크", ...discBuff });
    }

    if ($("#auto-team-buffs")?.checked) {
      selectedPartyIds().forEach((id) => {
        const teamBuff = teamBuffPresets[id];
        if (teamBuff) sources.push({ type: "파티", ...teamBuff });
      });
    }

    if ($("#auto-party-disc-buffs")?.checked) {
      sources.push(...selectedPartyDiscSources());
    }

    sources.push(...calculationReadyDbSources(selectedWEngineDbSources()));
    sources.push(...calculationReadyDbSources(selectedMindscapeDbSources()));

    const mindscapeBuff = mindscapeBuffSource();
    if (mindscapeBuff) sources.push(mindscapeBuff);

    const manualBuff = {
      type: "수동",
      label: "수동 버프",
      atkPct: number("#manual-atk-buff"),
      dmgBonus: number("#team-bonus"),
      critRate: number("#manual-crit-rate-buff"),
      critDmg: number("#manual-crit-dmg-buff"),
      penRatio: number("#manual-pen-ratio-buff"),
    };
    if (buffParts(manualBuff).length > 0) sources.push(manualBuff);
    return sources;
  }

  function summarizeBuffs(sources) {
    if (sources.length === 0) return "프리셋 없음";
    return `${sources.length}개 적용`;
  }

  function syncDamagePartyFromAgent(agentId) {
    const firstTeam = getAgent(agentId).teams[0];
    const members = (firstTeam?.members || []).filter((id) => id !== agentId);
    const slot1 = $("#party-slot-1");
    const slot2 = $("#party-slot-2");
    setSelectValue(slot1, members[0] || "none");
    setSelectValue(slot2, members[1] || "none");
    const disc1 = $("#party-disc-1");
    const disc2 = $("#party-disc-2");
    setSelectValue(disc1, "none");
    setSelectValue(disc2, "none");
  }

  function option(label, value, searchText = "") {
    const item = document.createElement("option");
    item.value = value;
    item.textContent = label;
    if (searchText) item.dataset.search = searchText;
    return item;
  }

  function fillSelect(select, items, labeler) {
    select.replaceChildren(
      ...items.map((item) => {
        const label = labeler(item);
        const searchText = [label, item.kr, item.en, item.id, item.role, item.attribute, item.rank, item.faction].filter(Boolean).join(" ");
        return option(label, item.id, searchText);
      }),
    );
  }

  function fillCoreSelect(select) {
    const items = [
      { id: 0, label: "없음" },
      { id: 1, label: "A" },
      { id: 2, label: "B" },
      { id: 3, label: "C" },
      { id: 4, label: "D" },
      { id: 5, label: "E" },
      { id: 6, label: "F" },
    ];
    select.replaceChildren(...items.map((item) => option(item.label, item.id)));
  }

  function cacheSearchableSelect(select) {
    select._searchOptions = Array.from(select.options).map((item) => {
      const searchText = [item.dataset.search, item.textContent, item.value].filter(Boolean).join(" ");
      return {
        value: item.value,
        label: item.textContent,
        searchText,
        normalized: normalizeSearchText(searchText),
      };
    });
  }

  function selectedSearchOption(select) {
    return select?._searchOptions?.find((item) => item.value === select.value);
  }

  function searchableSelectParts(select) {
    const combo = select?.parentElement?.querySelector(`[data-select-combo-for="${select.id}"]`);
    return {
      combo,
      input: combo?.querySelector(".select-search"),
      list: combo?.querySelector(".select-suggestions"),
    };
  }

  function searchableMatches(select, query) {
    const normalizedQuery = normalizeSearchText(query);
    const options = select._searchOptions || [];
    return normalizedQuery ? options.filter((item) => item.normalized.includes(normalizedQuery)) : options;
  }

  function closeSearchableSelect(select) {
    const { combo, input, list } = searchableSelectParts(select);
    if (!combo || !list) return;
    combo.dataset.open = "false";
    list.hidden = true;
    input?.setAttribute("aria-expanded", "false");
  }

  function closeAllSearchableSelects(exceptSelect = null) {
    Object.keys(SEARCHABLE_SELECTS).forEach((id) => {
      const select = document.getElementById(id);
      if (select && select !== exceptSelect) closeSearchableSelect(select);
    });
  }

  function syncSearchableSelectInput(select) {
    const { input } = searchableSelectParts(select);
    if (!input) return;
    const selected = selectedSearchOption(select);
    input.value = selected?.label || "";
    input.title = selected?.label || "";
  }

  function renderSearchableSuggestions(select, query = "", shouldOpen = true) {
    if (!select?._searchOptions) return;
    const { combo, list } = searchableSelectParts(select);
    if (!combo || !list) return;

    const matches = searchableMatches(select, query).slice(0, 8);
    const selectedValue = select.value;
    const nodes =
      matches.length > 0
        ? matches.map((item) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `select-suggestion ${item.value === selectedValue ? "selected" : ""}`;
            button.dataset.value = item.value;
            button.setAttribute("role", "option");
            button.setAttribute("aria-selected", item.value === selectedValue ? "true" : "false");
            button.textContent = item.label;
            return button;
          })
        : [Object.assign(document.createElement("div"), { className: "select-suggestion-empty", textContent: "검색 결과 없음" })];

    list.replaceChildren(...nodes);
    list.hidden = !shouldOpen;
    combo.dataset.open = shouldOpen ? "true" : "false";
  }

  function chooseSearchableSelectOption(select, value, shouldDispatch = false) {
    if (!select?._searchOptions?.some((item) => item.value === value)) return;
    select.value = value;
    syncSearchableSelectInput(select);
    closeSearchableSelect(select);
    if (shouldDispatch) {
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  function setSelectValue(select, value) {
    if (!select) return;
    if (select._searchOptions) {
      chooseSearchableSelectOption(select, value, false);
      return;
    }
    select.value = value;
  }

  function initSearchableSelects() {
    Object.entries(SEARCHABLE_SELECTS).forEach(([id, placeholder]) => {
      const select = document.getElementById(id);
      if (!select || select.dataset.searchEnhanced === "true") return;

      cacheSearchableSelect(select);
      select.dataset.searchEnhanced = "true";
      select.classList.add("native-select-hidden");
      select.tabIndex = -1;

      const combo = document.createElement("div");
      combo.className = "select-combo";
      combo.dataset.selectComboFor = id;
      combo.dataset.open = "false";

      const search = document.createElement("input");
      search.type = "search";
      search.className = "select-search";
      search.placeholder = placeholder;
      search.autocomplete = "off";
      search.setAttribute("aria-label", placeholder);
      search.setAttribute("role", "combobox");
      search.setAttribute("aria-autocomplete", "list");
      search.setAttribute("aria-expanded", "false");
      search.dataset.selectSearchFor = id;

      const list = document.createElement("div");
      list.className = "select-suggestions";
      list.hidden = true;
      list.setAttribute("role", "listbox");

      combo.append(search, list);
      select.before(combo);
      syncSearchableSelectInput(select);

      search.addEventListener("focus", () => {
        closeAllSearchableSelects(select);
        search.select();
        renderSearchableSuggestions(select, search.value, true);
        search.setAttribute("aria-expanded", "true");
      });
      search.addEventListener("input", () => {
        closeAllSearchableSelects(select);
        renderSearchableSuggestions(select, search.value, true);
        search.setAttribute("aria-expanded", "true");
      });
      search.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          syncSearchableSelectInput(select);
          closeSearchableSelect(select);
          search.setAttribute("aria-expanded", "false");
          search.blur();
          return;
        }
        if (event.key === "Enter") {
          const firstMatch = searchableMatches(select, search.value)[0];
          if (firstMatch) {
            event.preventDefault();
            chooseSearchableSelectOption(select, firstMatch.value, true);
            search.setAttribute("aria-expanded", "false");
          }
        }
      });
      search.addEventListener("blur", () => {
        setTimeout(() => {
          if (!combo.contains(document.activeElement)) {
            syncSearchableSelectInput(select);
            closeSearchableSelect(select);
            search.setAttribute("aria-expanded", "false");
          }
        }, 120);
      });
      list.addEventListener("mousedown", (event) => {
        event.preventDefault();
      });
      list.addEventListener("click", (event) => {
        const button = event.target.closest("[data-value]");
        if (!button) return;
        chooseSearchableSelectOption(select, button.dataset.value, true);
        search.setAttribute("aria-expanded", "false");
      });
      select.addEventListener("change", () => {
        syncSearchableSelectInput(select);
        closeSearchableSelect(select);
        search.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("pointerdown", (event) => {
      if (event.target.closest(".select-combo")) return;
      closeAllSearchableSelects();
    });
  }

  function switchTab(tabName) {
    $$(".tab-button").forEach((button) => button.classList.toggle("active", button.dataset.tab === tabName));
    $$(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `${tabName}-panel`));
  }

  function selectAgent(id, shouldRender = true, shouldSyncParty = true) {
    selectedAgentId = getAgent(id).id;
    ["#agent-select", "#growth-agent-select"].forEach((selector) => {
      const field = $(selector);
      setSelectValue(field, selectedAgentId);
    });
    if (shouldSyncParty) syncDamagePartyFromAgent(selectedAgentId);
    if (shouldRender) renderAll();
  }

  function renderAgentGrid() {
    const query = normalizeSearchText($("#agent-name-filter").value);
    const role = $("#agent-role-filter").value;
    const attribute = $("#agent-attribute-filter").value;
    const rank = $("#agent-rank-filter").value;
    const filtered = agents.filter((agent) => {
      const nameOk = !query || normalizeSearchText([agent.kr, agent.en, agent.faction].filter(Boolean).join(" ")).includes(query);
      const roleOk = role === "all" || agent.role === role;
      const attrOk = attribute === "all" || agent.attribute === attribute;
      const rankOk = rank === "all" || agent.rank === rank;
      return nameOk && roleOk && attrOk && rankOk;
    });

    $("#agent-count").textContent = `${filtered.length}명`;
    $("#agent-grid").replaceChildren(
      ...filtered.map((agent) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = `agent-card ${agent.id === selectedAgentId ? "selected" : ""}`;
        card.dataset.agentId = agent.id;
        card.innerHTML = `
          <div class="portrait">
            ${agentImageTag(agent, agent.kr)}
            <span class="portrait-fallback" aria-hidden="true"></span>
          </div>
          <div class="agent-card-body">
            <strong>${agent.kr}</strong>
            <span>${attributeLabels[agent.attribute]} / ${roleLabels[agent.role]}</span>
          </div>
          <span class="rank-badge">${agent.rank}</span>
        `;
        card.querySelector("img").addEventListener("error", handleAgentImageError);
        card.addEventListener("click", () => selectAgent(agent.id));
        return card;
      }),
    );
  }

  function teamMemberChip(id) {
    const agent = getAgent(id);
    return `
      <span class="team-chip">
        <span class="mini-portrait">${agentImageTag(agent, "")}</span>
        ${agent.kr}
      </span>
    `;
  }

  function renderAgentDetail() {
    const agent = getAgent(selectedAgentId);
    $("#agent-detail").innerHTML = `
      <div class="detail-portrait">
        ${agentImageTag(agent, agent.kr, "")}
        <span class="portrait-fallback" aria-hidden="true"></span>
      </div>
      <div class="detail-copy">
        <div class="detail-title">
          <h2>${agent.kr}</h2>
          <span class="rank-badge">${agent.rank}</span>
        </div>
        <p>${agent.en}</p>
        <div class="tag-row">
          <span class="pill">${attributeLabels[agent.attribute]}</span>
          <span class="pill">${roleLabels[agent.role]}</span>
          <span class="pill muted">${agent.faction}</span>
        </div>
        <dl class="mini-stats">
          <div><dt>공격력</dt><dd>${fmt.format(agent.stats.atk)}</dd></div>
          <div><dt>치확</dt><dd>${fmt1.format(agent.stats.critRate)}%</dd></div>
          <div><dt>충격</dt><dd>${fmt.format(agent.stats.impact)}</dd></div>
          <div><dt>이상 장악</dt><dd>${fmt.format(agent.stats.anomalyMastery)}</dd></div>
        </dl>
        <div class="recommend-block">
          <span>W-Engine</span>
          <strong>${agent.engines.join(" / ")}</strong>
        </div>
        <div class="recommend-block">
          <span>디스크</span>
          <strong>${agent.discs.join(" / ")}</strong>
        </div>
      </div>
    `;
    $("#agent-detail img").addEventListener("error", handleAgentImageError);

    $("#team-list").replaceChildren(
      ...agent.teams.map((team) => {
        const card = document.createElement("article");
        card.className = "team-card";
        card.innerHTML = `
          <div class="section-heading compact">
            <h3>${team.name}</h3>
            <button class="ghost-button apply-team" type="button">적용</button>
          </div>
          <div class="team-chip-row">${team.members.map(teamMemberChip).join("")}</div>
          <p>${team.note}</p>
        `;
        card.querySelector(".apply-team").addEventListener("click", () => applyTeam(team));
        card.querySelectorAll("img").forEach((img) => {
          img.addEventListener("error", handleAgentImageError);
        });
        return card;
      }),
    );
  }

  function applyTeam(team) {
    const damageMembers = team.members.filter((id) => id !== selectedAgentId);
    setSelectValue($("#party-slot-1"), damageMembers[0] || "none");
    setSelectValue($("#party-slot-2"), damageMembers[1] || "none");
    switchTab("damage");
    renderAll();
  }

  function sumStatFromDiscs(discs, stat) {
    return discs.reduce((total, disc) => total + (disc.stats[stat] || 0), 0);
  }

  function matchingAttributeBonus(agent, discs) {
    const key = `${agent.attribute}Dmg`;
    return sumStatFromDiscs(discs, key);
  }

  function calculateDamage() {
    const agent = getAgent($("#agent-select").value);
    const engine = getEngine($("#engine-select").value);
    const discFour = getDisc($("#disc-four").value);
    const discTwo = getDisc($("#disc-two").value);
    const discs = [discFour, discTwo];
    const buffSources = collectBuffSources(discFour);
    const buffTotals = buffSources.reduce((total, buff) => addBuffTotals(total, buff), emptyBuffTotals());

    const attackerLevel = number("#attacker-level");
    const enemyLevel = number("#enemy-level");
    const baseAtk = agent.stats.atk + engine.baseAtk;
    const atkPct = number("#atk-percent") + (engine.stats.atkPct || 0) + sumStatFromDiscs(discs, "atkPct") + buffTotals.atkPct;
    const flatAtk = number("#flat-atk");
    const totalAtk = baseAtk * (1 + atkPct / 100) + flatAtk;
    const baseHp = agent.stats.hp + number("#base-hp");
    const hpPct = number("#hp-percent") + (engine.stats.hpPct || 0) + sumStatFromDiscs(discs, "hpPct") + buffTotals.hpPct;
    const flatHp = number("#flat-hp");
    const totalHp = baseHp * (1 + hpPct / 100) + flatHp;
    const usesHpScaling = agent.role === "rupture";
    const flatSheerForce = number("#flat-sheer-force") + buffTotals.sheerForce;
    const totalSheerForce = usesHpScaling ? totalAtk * 0.3 + totalHp * 0.1 + flatSheerForce : 0;
    const damageBase = usesHpScaling ? totalSheerForce : totalAtk;
    const damageBaseLabel = usesHpScaling ? "명파력 기반" : "공격력 기반";

    const critRate = clamp(
      agent.stats.critRate + (engine.stats.critRate || 0) + sumStatFromDiscs(discs, "critRate") + number("#crit-rate") + buffTotals.critRate,
      0,
      100,
    );
    const critDmg = agent.stats.critDmg + (engine.stats.critDmg || 0) + sumStatFromDiscs(discs, "critDmg") + number("#crit-dmg") + buffTotals.critDmg;

    const baseDmgBonus =
      number("#dmg-bonus") +
      matchingAttributeBonus(agent, discs) +
      sumStatFromDiscs(discs, "basicDmg") +
      sumStatFromDiscs(discs, "aftershockDmg") +
      number("#disc-conditional") +
      buffTotals.dmgBonus;
    const vulnerability = number("#vulnerability");
    const damageBonusMultiplier = (1 + baseDmgBonus / 100) * (1 + vulnerability / 100);

    const penRatio = clamp(
      number("#pen-ratio") + (engine.stats.penRatio || 0) + sumStatFromDiscs(discs, "penRatio") + agent.stats.penRatio + buffTotals.penRatio,
      0,
      100,
    );
    const flatPen = number("#flat-pen") + buffTotals.flatPen;
    const defReduction = clamp(buffTotals.defReduction, 0, 95);
    const levelCoef = attackerLevel + 100;
    const enemyDefPart = Math.max((enemyLevel + 100) * (1 - defReduction / 100) * (1 - penRatio / 100) - flatPen, 1);
    const defMultiplier = usesHpScaling ? 1 : levelCoef / (levelCoef + enemyDefPart);

    const effectiveRes = number("#enemy-res") - number("#res-shred") - buffTotals.resShred;
    const resMultiplier = clamp(1 - effectiveRes / 100, 0.05, 2);
    const stunMultiplier = $("#enemy-stunned").checked ? (number("#stun-multiplier") / 100) * (1 + buffTotals.stunDmg / 100) : 1;

    const skillMultiplier = number("#skill-multiplier") / 100;
    const nonCrit = damageBase * skillMultiplier * damageBonusMultiplier * defMultiplier * resMultiplier * stunMultiplier;
    const crit = nonCrit * (1 + critDmg / 100);
    const expected = nonCrit * (1 + (critRate / 100) * (critDmg / 100));

    const anomalyProficiency =
      number("#anomaly-proficiency") +
      (engine.stats.anomalyProficiency || 0) +
      sumStatFromDiscs(discs, "anomalyProficiency") +
      buffTotals.anomalyProficiency;
    const anomalyMastery =
      agent.stats.anomalyMastery + (engine.stats.anomalyMastery || 0) + sumStatFromDiscs(discs, "anomalyMastery") + buffTotals.anomalyMastery;
    const anomaly = totalAtk * 4.5 * (1 + anomalyProficiency / 100) * damageBonusMultiplier * defMultiplier * resMultiplier;

    return {
      agent,
      engine,
      discFour,
      discTwo,
      totalAtk,
      totalHp,
      hpPct,
      flatSheerForce,
      totalSheerForce,
      damageBase,
      damageBaseLabel,
      usesHpScaling,
      critRate,
      critDmg,
      baseDmgBonus,
      penRatio,
      flatPen,
      defReduction,
      defMultiplier,
      resMultiplier,
      stunMultiplier,
      anomalyMastery,
      anomalyProficiency,
      buffSources,
      buffTotals,
      nonCrit,
      crit,
      expected,
      anomaly,
    };
  }

  function renderDamage() {
    const result = calculateDamage();
    $("#agent-meta").textContent = `${attributeLabels[result.agent.attribute]} / ${roleLabels[result.agent.role]} / ${result.agent.faction}`;
    $("#mindscape-summary").textContent = `M${selectedMindscapeLevel()}`;
    $("#engine-effect-summary").textContent = `R${selectedEngineRefinement()} / ${effectDbLoadStatus}`;
    $("#disc-summary").textContent = `${result.discFour.kr} 4 / ${result.discTwo.kr} 2`;
    $("#party-buff-summary").textContent = summarizeBuffs(result.buffSources);
    $("#normal-damage").textContent = fmt.format(result.nonCrit);
    $("#crit-damage").textContent = fmt.format(result.crit);
    $("#expected-damage").textContent = fmt.format(result.expected);
    $("#anomaly-damage").textContent = fmt.format(result.anomaly);
    renderEffectList("#engine-effect-list", selectedWEngineDbSources(), "선택한 W-Engine의 DB 효과가 없습니다.");
    renderEffectList("#mindscape-effect-list", selectedMindscapeDbSources(), "선택한 돌파 단계의 DB 효과가 없습니다.");
    $("#buff-list").replaceChildren(
      ...(result.buffSources.length
        ? result.buffSources.map((buff) => {
            const item = document.createElement("article");
            item.className = "buff-chip";
            const header = document.createElement("div");
            const label = document.createElement("strong");
            const meta = document.createElement("span");
            const body = document.createElement("p");

            label.textContent = buff.label;
            meta.textContent = `${buff.type}${buff.note ? ` / ${buff.note}` : ""}`;
            body.textContent = effectText(buff);
            header.append(label, meta);
            item.append(header, body);
            return item;
          })
        : [Object.assign(document.createElement("div"), { className: "empty-state", textContent: "자동 버프가 없습니다." })]),
    );

    const lines = [
      ["피해 기준", result.damageBaseLabel],
      ...(result.usesHpScaling ? [["총 명파력", fmt.format(result.totalSheerForce)]] : []),
      ["총 공격력", fmt.format(result.totalAtk)],
      ["총 HP", fmt.format(result.totalHp)],
      ["치명타", `${fmt1.format(result.critRate)}% / ${fmt1.format(result.critDmg)}%`],
      ["HP 보너스", `${fmt1.format(result.hpPct)}%`],
      ...(result.usesHpScaling ? [["고정 명파력", fmt.format(result.flatSheerForce)]] : []),
      ["피해 보너스", `${fmt1.format(result.baseDmgBonus)}%`],
      ["관통 / 방어 감소", `${fmt1.format(result.penRatio)}% / ${fmt1.format(result.defReduction)}%`],
      ["저항 감소", `${fmt1.format(result.buffTotals.resShred)}%`],
      ["방어 배율", fmt1.format(result.defMultiplier)],
      ["저항 배율", fmt1.format(result.resMultiplier)],
      ["그로기 배율", fmt1.format(result.stunMultiplier)],
      ["이상 장악", fmt1.format(result.anomalyMastery)],
      ["이상 숙련", fmt1.format(result.anomalyProficiency)],
    ];

    $("#damage-breakdown").replaceChildren(
      ...lines.flatMap(([key, value]) => {
        const dt = document.createElement("dt");
        const dd = document.createElement("dd");
        dt.textContent = key;
        dd.textContent = value;
        return [dt, dd];
      }),
    );
  }

  function addResource(map, name, amount) {
    if (!amount || amount <= 0) return;
    map.set(name, (map.get(name) || 0) + amount);
  }

  function addExpResources(map, label, exp) {
    if (exp <= 0) return;
    addResource(map, `${label} EXP`, Math.round(exp));
    addResource(map, label === "에이전트" ? "선임 조사원 기록 환산" : "W-Engine 에너지 모듈 환산", Math.ceil(exp / 3000));
  }

  function expBetween(table, current, target) {
    const start = Math.min(current, target);
    const end = Math.max(current, target);
    return table.reduce((total, band) => {
      const overlapStart = Math.max(start, band.from);
      const overlapEnd = Math.min(end, band.to);
      if (overlapEnd <= overlapStart) return total;
      const ratio = (overlapEnd - overlapStart) / (band.to - band.from);
      return total + band.exp * ratio;
    }, 0);
  }

  function calculateGrowth() {
    const agent = getAgent($("#growth-agent-select").value);
    const resources = new Map();
    const currentLevel = number("#current-level");
    const targetLevel = number("#target-level");
    const roleMats = materialNames.role[agent.role] || materialNames.role.attack;
    const chipMats = materialNames.chips[agent.attribute] || materialNames.chips.physical;

    addExpResources(resources, "에이전트", expBetween(tables.agentExpByBand, currentLevel, targetLevel));

    for (const step of tables.agentPromotion) {
      if (currentLevel < step.level && targetLevel >= step.level) {
        addResource(resources, roleMats[step.tier], step.count);
        addResource(resources, "데니", step.denny);
      }
    }

    const currentSkill = number("#current-skill");
    const targetSkill = number("#target-skill");
    const skillCount = number("#skill-count");
    for (const step of tables.skill) {
      if (currentSkill < step.to && targetSkill >= step.to) {
        addResource(resources, chipMats[step.tier], step.count * skillCount);
        addResource(resources, "데니", step.denny * skillCount);
        addResource(resources, "햄스터 케이지 패스", (step.hamster || 0) * skillCount);
      }
    }

    const currentCore = Number($("#current-core").value);
    const targetCore = Number($("#target-core").value);
    for (const step of tables.core) {
      if (currentCore < step.to && targetCore >= step.to) {
        addResource(resources, "데니", step.denny);
        addResource(resources, "에이전트별 고차원 데이터", step.highDim || 0);
        addResource(resources, "에이전트별 주간 보스 재료", step.weekly || 0);
      }
    }

    const currentEngineLevel = number("#current-engine-level");
    const targetEngineLevel = number("#target-engine-level");
    addExpResources(resources, "W-Engine", expBetween(tables.engineExpByBand, currentEngineLevel, targetEngineLevel));
    for (const step of tables.enginePromotion) {
      if (currentEngineLevel < step.level && targetEngineLevel >= step.level) {
        addResource(resources, step.advanced ? "특화 W-Engine 부품" : "강화 W-Engine 부품", step.part);
        addResource(resources, "데니", step.denny);
      }
    }

    return { agent, resources };
  }

  function renderGrowth() {
    const { agent, resources } = calculateGrowth();
    $("#growth-agent-meta").textContent = `${attributeLabels[agent.attribute]} / ${roleLabels[agent.role]}`;
    const rows = Array.from(resources.entries())
      .sort(([a], [b]) => {
        if (a === "데니") return -1;
        if (b === "데니") return 1;
        return a.localeCompare(b, "ko");
      })
      .map(([name, amount]) => {
        const row = document.createElement("div");
        row.className = "resource-row";
        row.innerHTML = `<span>${name}</span><strong>${fmt.format(amount)}</strong>`;
        return row;
      });
    $("#resource-list").replaceChildren(...rows);
  }

  function renderDatabase() {
    const query = $("#database-search").value.trim().toLowerCase();
    const matches = (values) => values.join(" ").toLowerCase().includes(query);

    $("#agent-table").replaceChildren(
      ...agents
        .filter((agent) => matches([agent.kr, agent.en, roleLabels[agent.role], attributeLabels[agent.attribute], agent.faction]))
        .map((agent) => {
          const row = document.createElement("tr");
          row.innerHTML = `<td><strong>${agent.kr}</strong><br>${agent.en}</td><td><span class="pill">${agent.rank}</span></td><td>${attributeLabels[agent.attribute]}</td><td>${roleLabels[agent.role]}</td><td>${agent.teams.map((team) => team.members.map((id) => getAgent(id).kr).join(" / ")).join("<br>")}</td>`;
          return row;
        }),
    );

    $("#disc-table").replaceChildren(
      ...driveDiscs
        .filter((disc) => disc.id !== "none")
        .filter((disc) => matches([disc.kr, disc.en, disc.two, disc.four]))
        .map((disc) => {
          const row = document.createElement("tr");
          row.innerHTML = `<td><strong>${disc.kr}</strong><br>${disc.en}</td><td>${disc.two}</td><td>${disc.four}</td>`;
          return row;
        }),
    );

    $("#engine-table").replaceChildren(
      ...engines
        .filter((engine) => engine.id !== "manual")
        .filter((engine) => matches([engine.kr, engine.en, engine.role, engine.effect]))
        .map((engine) => {
          const row = document.createElement("tr");
          row.innerHTML = `<td><strong>${engine.kr}</strong><br>${engine.en}</td><td><span class="pill">${engine.rank}</span></td><td>${roleLabels[engine.role] || "전체"}</td><td>${fmt.format(engine.baseAtk)}</td>`;
          return row;
        }),
    );
  }

  function saveSnapshot() {
    const fields = $$("input, select, textarea").filter((field) => field.id && field.type !== "file" && !TRANSIENT_FIELD_IDS.has(field.id));
    const snapshot = Object.fromEntries(fields.map((field) => [field.id, field.type === "checkbox" ? field.checked : field.value]));
    snapshot.selectedAgentId = selectedAgentId;
    localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(snapshot));
  }

  function restoreSnapshot() {
    try {
      const snapshot = JSON.parse(localStorage.getItem(STATE_STORAGE_KEY) || "{}");
      for (const [id, value] of Object.entries(snapshot)) {
        if (TRANSIENT_FIELD_IDS.has(id)) continue;
        const field = document.getElementById(id);
        if (!field) continue;
        if (field.type === "checkbox") field.checked = Boolean(value);
        else if (field.tagName === "SELECT") setSelectValue(field, value);
        else field.value = value;
      }
      selectedAgentId = snapshot.selectedAgentId || $("#agent-select").value || agents[0].id;
    } catch (_error) {
      localStorage.removeItem(STATE_STORAGE_KEY);
    }
  }

  function normalizeSelectValue(selector, fallbackValue) {
    const field = $(selector);
    if (!field) return;
    const options = field._searchOptions || Array.from(field.options);
    const hasValue = options.some((item) => item.value === field.value);
    if (!hasValue) setSelectValue(field, fallbackValue);
    else setSelectValue(field, field.value);
  }

  function resetStats() {
    const agent = getAgent($("#agent-select").value);
    $("#crit-rate").value = Math.max(0, 50 - agent.stats.critRate);
    $("#crit-dmg").value = Math.max(0, 120 - agent.stats.critDmg);
    $("#atk-percent").value = 70;
    $("#flat-atk").value = 316;
    $("#base-hp").value = 0;
    $("#hp-percent").value = agent.role === "rupture" ? 30 : 0;
    $("#flat-hp").value = 0;
    $("#flat-sheer-force").value = 0;
    $("#dmg-bonus").value = 46.6;
    $("#pen-ratio").value = 0;
    $("#flat-pen").value = 0;
    $("#anomaly-proficiency").value = 0;
    renderAll();
  }

  function downloadData() {
    const payload = { version: DATA_VERSION, profile: DATA_PROFILE, agents, engines, driveDiscs, materialNames, tables };
    downloadJson(payload, `zzz-calc-data-${DATA_VERSION}.json`);
  }

  function downloadJson(payload, fileName) {
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function copyGrowth() {
    const { resources } = calculateGrowth();
    const text = Array.from(resources.entries()).map(([name, amount]) => `${name}: ${fmt.format(amount)}`).join("\n");
    await navigator.clipboard.writeText(text);
    $("#copy-growth").textContent = "완료";
    window.setTimeout(() => {
      $("#copy-growth").textContent = "복사";
    }, 1200);
  }

  function renderAll() {
    renderAgentGrid();
    renderAgentDetail();
    renderDamage();
    renderGrowth();
    renderDatabase();
    saveSnapshot();
  }

  function initSelects() {
    const agentLabel = (agent) => `${agent.kr} (${attributeLabels[agent.attribute]} / ${roleLabels[agent.role]})`;
    fillSelect($("#agent-select"), agents, agentLabel);
    fillSelect($("#growth-agent-select"), agents, agentLabel);
    const partyOptions = [{ id: "none", kr: "없음" }, ...agents];
    fillSelect($("#party-slot-1"), partyOptions, (agent) => agent.kr);
    fillSelect($("#party-slot-2"), partyOptions, (agent) => agent.kr);
    const partyDiscOptions = [{ id: "none", kr: "없음" }, ...driveDiscs.filter((disc) => disc.id !== "none")];
    fillSelect($("#party-disc-1"), partyDiscOptions, (disc) => disc.kr);
    fillSelect($("#party-disc-2"), partyDiscOptions, (disc) => disc.kr);
    const mindscapeOptions = Array.from({ length: 7 }, (_, level) => ({ id: String(level), label: `M${level}` }));
    fillSelect($("#mindscape-level"), mindscapeOptions, (item) => item.label);
    const refinementOptions = Array.from({ length: 5 }, (_, index) => ({ id: String(index + 1), label: `R${index + 1}` }));
    fillSelect($("#engine-refinement"), refinementOptions, (item) => item.label);
    fillSelect($("#engine-select"), engines, (engine) => `${engine.kr} / ${roleLabels[engine.role] || "전체"}`);
    fillSelect($("#disc-four"), driveDiscs, (disc) => disc.kr);
    fillSelect($("#disc-two"), driveDiscs, (disc) => disc.kr);
    fillCoreSelect($("#current-core"));
    fillCoreSelect($("#target-core"));

    const activeRoles = new Set(agents.map((agent) => agent.role));
    const activeAttributes = new Set(agents.map((agent) => agent.attribute));
    const activeRanks = new Set(agents.map((agent) => agent.rank));
    $("#agent-role-filter").replaceChildren(
      ...["all", "attack", "stun", "anomaly", "support", "defense", "rupture"]
        .filter((role) => role === "all" || activeRoles.has(role))
        .map((role) => option(roleLabels[role], role)),
    );
    $("#agent-attribute-filter").replaceChildren(
      ...["all", "physical", "fire", "ice", "frost", "electric", "ether", "wind", "auricInk"]
        .filter((attribute) => attribute === "all" || activeAttributes.has(attribute))
        .map((attribute) => option(attributeLabels[attribute], attribute)),
    );
    $("#agent-rank-filter").replaceChildren(
      ...["all", "S", "A", "B", "I"]
        .filter((rank) => rank === "all" || activeRanks.has(rank))
        .map((rank) => option(rankLabels[rank], rank)),
    );

    $("#target-core").value = "6";
    $("#disc-four").value = "woodpecker-electro";
    $("#disc-two").value = "hormone-punk";
    syncDamagePartyFromAgent(selectedAgentId);
  }

  function bindEvents() {
    $$(".tab-button").forEach((button) => {
      button.addEventListener("click", () => switchTab(button.dataset.tab));
    });

    $$("[data-jump]").forEach((button) => {
      button.addEventListener("click", () => switchTab(button.dataset.jump));
    });

    $$("input, select, textarea").forEach((field) => {
      if (field.type === "file" || field.classList.contains("select-search")) return;
      field.addEventListener("input", renderAll);
      field.addEventListener("change", renderAll);
    });

    $("#agent-select").addEventListener("change", () => selectAgent($("#agent-select").value));
    $("#growth-agent-select").addEventListener("change", () => selectAgent($("#growth-agent-select").value));
    $("#reset-stats").addEventListener("click", resetStats);
    $("#download-data").addEventListener("click", downloadData);
    $("#copy-growth").addEventListener("click", copyGrowth);
  }

  async function init() {
    initThemeToggle();
    initFieldHelp();
    await loadApiAgentRoster();
    await loadApiEngineNames();
    applyDisplayData();
    initSelects();
    initSearchableSelects();
    await loadEffectDb();
    restoreSnapshot();
    normalizeSelectValue("#engine-select", "manual");
    normalizeSelectValue("#engine-refinement", "1");
    normalizeSelectValue("#disc-four", "woodpecker-electro");
    normalizeSelectValue("#disc-two", "hormone-punk");
    normalizeSelectValue("#mindscape-level", "0");
    normalizeSelectValue("#agent-select", agents[0].id);
    normalizeSelectValue("#growth-agent-select", agents[0].id);
    normalizeSelectValue("#party-slot-1", "none");
    normalizeSelectValue("#party-slot-2", "none");
    normalizeSelectValue("#party-disc-1", "none");
    normalizeSelectValue("#party-disc-2", "none");
    selectAgent(selectedAgentId, false, false);
    bindEvents();
    renderAll();
  }

  document.addEventListener("DOMContentLoaded", () => {
    void init();
  });
})();
