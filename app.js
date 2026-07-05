(function () {
  "use strict";

  const DATA_VERSION = "2026-07-05-v0.4-en-3.0";
  const DATA_PROFILE = {
    label: "3.0",
    agents: 40,
    wEngines: 93,
    driveDiscs: 21,
    naming: "English source names are used throughout the app.",
  };
  const GUIDE_STORAGE_KEY = "zzz-calc-community-guides";
  const STATE_STORAGE_KEY = "zzz-calc-state";
  const REPO_ISSUE_URL = "https://github.com/suhyeong10/zzz-calc/issues/new";
  const TRANSIENT_FIELD_IDS = new Set(["agent-role-filter", "agent-attribute-filter", "database-search"]);

  const roleLabels = {
    all: "All",
    attack: "Attack",
    stun: "Stun",
    anomaly: "Anomaly",
    support: "Support",
    defense: "Defense",
    rupture: "Rupture",
  };

  const attributeLabels = {
    all: "All",
    physical: "Physical",
    fire: "Fire",
    ice: "Ice",
    frost: "Frost",
    electric: "Electric",
    ether: "Ether",
    wind: "Wind",
    auricInk: "Auric Ink",
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
      rank: "I",
      attribute: "ether",
      role: "attack",
      faction: "Phaethon",
      image: fandomAvatar("Avatar Pyrois.png"),
      stats: { hp: 7673, def: 612, atk: 849, critRate: 5, critDmg: 50, penRatio: 0, impact: 90, anomalyMastery: 92, energy: 1.2 },
      engines: ["Sol Exuvia", "The Brimstone"],
      discs: ["Chaotic Metal 4 + Woodpecker Electro 2"],
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
      discs: ["Freedom Blues 4 + Swing Jazz 2"],
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
      discs: ["Shockstar Disco 4 + Swing Jazz 2"],
      teams: [{ name: "3.0 Stun Preview", members: ["norma", "pyrois", "velina"], note: "Preview Fire Stun slot; details may change before full release data is published." }],
    },
  );

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
    { id: "iris-enigma", kr: "Iris Enigma", en: "Iris Enigma", rank: "A", role: "support", baseAtk: 594, stats: { atkPct: 25 }, effect: "궁극기 후 에너지 회복 보정" },
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
    { id: "moonlight-lullaby", kr: "달빛 기사의 칭송", en: "Moonlight Lullaby", two: "에너지 자동 회복 +20%", four: "지원 캐릭터 파티 피해 보정", stats: { energyRegenPct: 20 } },
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

  const discEnglishEffects = {
    none: { kr: "None", two: "None", four: "None" },
    "fanged-metal": { two: "Physical DMG +10%", four: "After Assault, the target takes increased damage." },
    "polar-metal": { two: "Ice DMG +10%", four: "Basic and Dash Attack DMG increases, with extra value after Freeze/Shatter." },
    "thunder-metal": { two: "Electric DMG +10%", four: "ATK increases while an enemy is Shocked." },
    "chaotic-metal": { two: "Ether DMG +10%", four: "CRIT DMG increases, with extra stacks after Corruption damage." },
    "inferno-metal": { two: "Fire DMG +10%", four: "CRIT Rate increases against Burning enemies." },
    "swing-jazz": { two: "Energy Regen +20%", four: "Chain Attack or Ultimate increases squad DMG." },
    "soul-rock": { two: "DEF +16%", four: "Taking damage reduces incoming damage briefly." },
    "hormone-punk": { two: "ATK +10%", four: "ATK increases on combat entry or swap-in." },
    "freedom-blues": { two: "Anomaly Proficiency +30", four: "EX Special Attack hits reduce Anomaly Buildup RES." },
    "shockstar-disco": { two: "Impact +6%", four: "Basic, Dash, and Dodge Counter Daze increases." },
    "puffer-electro": { two: "PEN Ratio +8%", four: "Ultimate DMG increases and grants ATK after Ultimate." },
    "woodpecker-electro": { two: "CRIT Rate +8%", four: "CRIT hits grant stacking ATK." },
    "proto-punk": { two: "Shield Effect +15%", four: "Defensive or Evasive Assist increases squad DMG." },
    "chaos-jazz": { two: "Anomaly Proficiency +30", four: "Fire/Electric DMG and off-field EX/Assist DMG increase." },
    "astral-voice": { two: "ATK +10%", four: "Quick Assist entries grant Astral stacks." },
    "branch-blade": { two: "CRIT DMG +16%", four: "High Anomaly Mastery and Freeze/Shatter boost CRIT." },
    "shadow-harmony": { two: "Aftershock and Dash Attack DMG +15%", four: "Aftershock or Dash hits grant ATK and CRIT Rate." },
    "phaethon-melody": { two: "Anomaly Mastery +8%", four: "EX Special Attacks increase Anomaly Proficiency and Ether DMG." },
    "yunkui-tales": { two: "HP +10%", four: "EX, Chain, or Ultimate grants CRIT Rate; max stacks boost Sheer DMG." },
    "king-summit": { two: "Daze +6%", four: "Stun specialty users boost squad CRIT DMG." },
    "moonlight-lullaby": { two: "Energy Regen +20%", four: "Support EX Special Attack or Ultimate increases squad DMG." },
  };

  function needsEnglishText(value) {
    return typeof value === "string" && /[^\x00-\x7F]/.test(value);
  }

  function applyEnglishData() {
    agents.forEach((agent) => {
      agent.kr = agent.en;
      const recommendation = englishAgentRecommendations[agent.id];
      if (recommendation) {
        agent.faction = recommendation.faction;
        agent.engines = recommendation.engines;
        agent.discs = recommendation.discs;
        agent.teams = recommendation.teams;
      }
      if (needsEnglishText(agent.faction)) agent.faction = "Unknown";
      agent.teams = agent.teams.map((team) => ({
        ...team,
        name: needsEnglishText(team.name) ? `${agent.en} Core` : team.name,
        note: needsEnglishText(team.note) ? "Starter recommendation; verify rotations against current endgame data." : team.note,
      }));
    });

    engines.forEach((engine) => {
      engine.kr = engine.en;
      if (engine.id === "manual") {
        engine.effect = "Manual stat input only.";
      } else if (needsEnglishText(engine.effect)) {
        engine.effect = "Effect text pending English verification; calculator uses the structured stat fields.";
      }
    });

    driveDiscs.forEach((disc) => {
      const effects = discEnglishEffects[disc.id] || {};
      disc.kr = disc.en;
      disc.two = effects.two || disc.two;
      disc.four = effects.four || disc.four;
    });

    materialNames.role = {
      attack: ["Basic Attack Certification Seal", "Advanced Attack Certification Seal", "Pioneer's Certification Seal"],
      stun: ["Basic Stun Certification Seal", "Advanced Stun Certification Seal", "Buster Certification Seal"],
      anomaly: ["Basic Anomaly Certification Seal", "Advanced Anomaly Certification Seal", "Controller Certification Seal"],
      support: ["Basic Support Certification Seal", "Advanced Support Certification Seal", "Ruler Certification Seal"],
      defense: ["Basic Defense Certification Seal", "Advanced Defense Certification Seal", "Defender Certification Seal"],
      rupture: ["Basic Rupture Certification Seal", "Advanced Rupture Certification Seal", "Arbiter Certification Seal"],
    };
    materialNames.chips = {
      physical: ["Basic Physical Chip", "Advanced Physical Chip", "Specialized Physical Chip"],
      fire: ["Basic Burn Chip", "Advanced Burn Chip", "Specialized Burn Chip"],
      ice: ["Basic Freeze Chip", "Advanced Freeze Chip", "Specialized Freeze Chip"],
      frost: ["Basic Freeze Chip", "Advanced Freeze Chip", "Specialized Freeze Chip"],
      electric: ["Basic Shock Chip", "Advanced Shock Chip", "Specialized Shock Chip"],
      ether: ["Basic Ether Chip", "Advanced Ether Chip", "Specialized Ether Chip"],
      wind: ["Basic Wind Chip", "Advanced Wind Chip", "Specialized Wind Chip"],
      auricInk: ["Basic Auric Ink Chip", "Advanced Auric Ink Chip", "Specialized Auric Ink Chip"],
    };
  }

  applyEnglishData();

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

  let selectedAgentId = agents[0].id;
  let guides = [];

  function number(id) {
    const value = Number($(id).value);
    return Number.isFinite(value) ? value : 0;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getAgent(id) {
    return agents.find((agent) => agent.id === id) || agents[0];
  }

  function getEngine(id) {
    return engines.find((engine) => engine.id === id) || engines[0];
  }

  function getDisc(id) {
    return driveDiscs.find((disc) => disc.id === id) || driveDiscs[0];
  }

  function option(label, value) {
    const item = document.createElement("option");
    item.value = value;
    item.textContent = label;
    return item;
  }

  function fillSelect(select, items, labeler) {
    select.replaceChildren(...items.map((item) => option(labeler(item), item.id)));
  }

  function fillCoreSelect(select) {
    const items = [
      { id: 0, label: "None" },
      { id: 1, label: "A" },
      { id: 2, label: "B" },
      { id: 3, label: "C" },
      { id: 4, label: "D" },
      { id: 5, label: "E" },
      { id: 6, label: "F" },
    ];
    select.replaceChildren(...items.map((item) => option(item.label, item.id)));
  }

  function switchTab(tabName) {
    $$(".tab-button").forEach((button) => button.classList.toggle("active", button.dataset.tab === tabName));
    $$(".tab-panel").forEach((panel) => panel.classList.toggle("active", panel.id === `${tabName}-panel`));
  }

  function selectAgent(id, shouldRender = true) {
    selectedAgentId = getAgent(id).id;
    ["#agent-select", "#growth-agent-select", "#guide-agent", "#guide-slot-1"].forEach((selector) => {
      const field = $(selector);
      if (field) field.value = selectedAgentId;
    });
    if (shouldRender) renderAll();
  }

  function renderAgentGrid() {
    const role = $("#agent-role-filter").value;
    const attribute = $("#agent-attribute-filter").value;
    const filtered = agents.filter((agent) => {
      const roleOk = role === "all" || agent.role === role;
      const attrOk = attribute === "all" || agent.attribute === attribute;
      return roleOk && attrOk;
    });

    $("#agent-count").textContent = `${filtered.length} Agents`;
    $("#agent-grid").replaceChildren(
      ...filtered.map((agent) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = `agent-card ${agent.id === selectedAgentId ? "selected" : ""}`;
        card.dataset.agentId = agent.id;
        card.innerHTML = `
          <div class="portrait">
            <img src="${agent.image}" alt="${agent.kr}" loading="lazy" />
            <span class="portrait-fallback" aria-hidden="true"></span>
          </div>
          <div class="agent-card-body">
            <strong>${agent.kr}</strong>
            <span>${attributeLabels[agent.attribute]} / ${roleLabels[agent.role]}</span>
          </div>
          <span class="rank-badge">${agent.rank}</span>
        `;
        card.querySelector("img").addEventListener("error", (event) => {
          event.currentTarget.classList.add("broken");
        });
        card.addEventListener("click", () => selectAgent(agent.id));
        return card;
      }),
    );
  }

  function teamMemberChip(id) {
    const agent = getAgent(id);
    return `
      <span class="team-chip">
        <span class="mini-portrait"><img src="${agent.image}" alt="" loading="lazy" /></span>
        ${agent.kr}
      </span>
    `;
  }

  function renderAgentDetail() {
    const agent = getAgent(selectedAgentId);
    $("#agent-detail").innerHTML = `
      <div class="detail-portrait">
        <img src="${agent.image}" alt="${agent.kr}" />
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
          <div><dt>ATK</dt><dd>${fmt.format(agent.stats.atk)}</dd></div>
          <div><dt>CRIT Rate</dt><dd>${fmt1.format(agent.stats.critRate)}%</dd></div>
          <div><dt>Impact</dt><dd>${fmt.format(agent.stats.impact)}</dd></div>
          <div><dt>Anomaly Mastery</dt><dd>${fmt.format(agent.stats.anomalyMastery)}</dd></div>
        </dl>
        <div class="recommend-block">
          <span>W-Engine</span>
          <strong>${agent.engines.join(" / ")}</strong>
        </div>
        <div class="recommend-block">
          <span>Drive Disc</span>
          <strong>${agent.discs.join(" / ")}</strong>
        </div>
      </div>
    `;
    $("#agent-detail img").addEventListener("error", (event) => {
      event.currentTarget.classList.add("broken");
    });

    $("#team-list").replaceChildren(
      ...agent.teams.map((team) => {
        const card = document.createElement("article");
        card.className = "team-card";
        card.innerHTML = `
          <div class="section-heading compact">
            <h3>${team.name}</h3>
            <button class="ghost-button apply-team" type="button">Apply</button>
          </div>
          <div class="team-chip-row">${team.members.map(teamMemberChip).join("")}</div>
          <p>${team.note}</p>
        `;
        card.querySelector(".apply-team").addEventListener("click", () => applyTeam(team));
        card.querySelectorAll("img").forEach((img) => {
          img.addEventListener("error", (event) => event.currentTarget.classList.add("broken"));
        });
        return card;
      }),
    );
  }

  function applyTeam(team) {
    $("#guide-agent").value = selectedAgentId;
    $("#guide-slot-1").value = team.members[0] || selectedAgentId;
    $("#guide-slot-2").value = team.members[1] || selectedAgentId;
    $("#guide-slot-3").value = team.members[2] || selectedAgentId;
    $("#guide-title").value = team.name;
    $("#guide-body").value = team.note;
    $("#guide-tags").value = `${roleLabels[getAgent(selectedAgentId).role]}, Recommended Team`;
    updateIssueLink();
    switchTab("community");
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

    const attackerLevel = number("#attacker-level");
    const enemyLevel = number("#enemy-level");
    const baseAtk = agent.stats.atk + engine.baseAtk;
    const atkPct = number("#atk-percent") + (engine.stats.atkPct || 0) + sumStatFromDiscs(discs, "atkPct");
    const flatAtk = number("#flat-atk");
    const totalAtk = baseAtk * (1 + atkPct / 100) + flatAtk;

    const critRate = clamp(
      agent.stats.critRate + (engine.stats.critRate || 0) + sumStatFromDiscs(discs, "critRate") + number("#crit-rate"),
      0,
      100,
    );
    const critDmg = agent.stats.critDmg + (engine.stats.critDmg || 0) + sumStatFromDiscs(discs, "critDmg") + number("#crit-dmg");

    const baseDmgBonus =
      number("#dmg-bonus") +
      matchingAttributeBonus(agent, discs) +
      sumStatFromDiscs(discs, "basicDmg") +
      sumStatFromDiscs(discs, "aftershockDmg") +
      number("#disc-conditional") +
      number("#team-bonus");
    const vulnerability = number("#vulnerability");
    const damageBonusMultiplier = (1 + baseDmgBonus / 100) * (1 + vulnerability / 100);

    const penRatio = clamp(
      number("#pen-ratio") + (engine.stats.penRatio || 0) + sumStatFromDiscs(discs, "penRatio") + agent.stats.penRatio,
      0,
      100,
    );
    const flatPen = number("#flat-pen");
    const levelCoef = attackerLevel + 100;
    const enemyDefPart = Math.max((enemyLevel + 100) * (1 - penRatio / 100) - flatPen, 1);
    const defMultiplier = levelCoef / (levelCoef + enemyDefPart);

    const effectiveRes = number("#enemy-res") - number("#res-shred");
    const resMultiplier = clamp(1 - effectiveRes / 100, 0.05, 2);
    const stunMultiplier = $("#enemy-stunned").checked ? number("#stun-multiplier") / 100 : 1;

    const skillMultiplier = number("#skill-multiplier") / 100;
    const nonCrit = totalAtk * skillMultiplier * damageBonusMultiplier * defMultiplier * resMultiplier * stunMultiplier;
    const crit = nonCrit * (1 + critDmg / 100);
    const expected = nonCrit * (1 + (critRate / 100) * (critDmg / 100));

    const anomalyProficiency =
      number("#anomaly-proficiency") + (engine.stats.anomalyProficiency || 0) + sumStatFromDiscs(discs, "anomalyProficiency");
    const anomalyMastery = agent.stats.anomalyMastery + (engine.stats.anomalyMastery || 0) + sumStatFromDiscs(discs, "anomalyMastery");
    const anomaly = totalAtk * 4.5 * (1 + anomalyProficiency / 100) * damageBonusMultiplier * defMultiplier * resMultiplier;

    return {
      agent,
      engine,
      discFour,
      discTwo,
      totalAtk,
      critRate,
      critDmg,
      baseDmgBonus,
      defMultiplier,
      resMultiplier,
      stunMultiplier,
      anomalyMastery,
      anomalyProficiency,
      nonCrit,
      crit,
      expected,
      anomaly,
    };
  }

  function renderDamage() {
    const result = calculateDamage();
    $("#agent-meta").textContent = `${attributeLabels[result.agent.attribute]} / ${roleLabels[result.agent.role]} / ${result.agent.faction}`;
    $("#disc-summary").textContent = `${result.discFour.kr} 4 / ${result.discTwo.kr} 2`;
    $("#normal-damage").textContent = fmt.format(result.nonCrit);
    $("#crit-damage").textContent = fmt.format(result.crit);
    $("#expected-damage").textContent = fmt.format(result.expected);
    $("#anomaly-damage").textContent = fmt.format(result.anomaly);

    const lines = [
      ["Total ATK", fmt.format(result.totalAtk)],
      ["CRIT", `${fmt1.format(result.critRate)}% / ${fmt1.format(result.critDmg)}%`],
      ["DMG Bonus", `${fmt1.format(result.baseDmgBonus)}%`],
      ["DEF Multiplier", fmt1.format(result.defMultiplier)],
      ["RES Multiplier", fmt1.format(result.resMultiplier)],
      ["Stun Multiplier", fmt1.format(result.stunMultiplier)],
      ["Anomaly Mastery", fmt1.format(result.anomalyMastery)],
      ["Anomaly Proficiency", fmt1.format(result.anomalyProficiency)],
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
    addResource(map, label === "Agent" ? "Senior Investigator Log Equivalent" : "W-Engine Energy Module Equivalent", Math.ceil(exp / 3000));
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

    addExpResources(resources, "Agent", expBetween(tables.agentExpByBand, currentLevel, targetLevel));

    for (const step of tables.agentPromotion) {
      if (currentLevel < step.level && targetLevel >= step.level) {
        addResource(resources, roleMats[step.tier], step.count);
        addResource(resources, "Denny", step.denny);
      }
    }

    const currentSkill = number("#current-skill");
    const targetSkill = number("#target-skill");
    const skillCount = number("#skill-count");
    for (const step of tables.skill) {
      if (currentSkill < step.to && targetSkill >= step.to) {
        addResource(resources, chipMats[step.tier], step.count * skillCount);
        addResource(resources, "Denny", step.denny * skillCount);
        addResource(resources, "Hamster Cage Pass", (step.hamster || 0) * skillCount);
      }
    }

    const currentCore = Number($("#current-core").value);
    const targetCore = Number($("#target-core").value);
    for (const step of tables.core) {
      if (currentCore < step.to && targetCore >= step.to) {
        addResource(resources, "Denny", step.denny);
        addResource(resources, "Agent High-Dimensional Data", step.highDim || 0);
        addResource(resources, "Agent Weekly Boss Material", step.weekly || 0);
      }
    }

    const currentEngineLevel = number("#current-engine-level");
    const targetEngineLevel = number("#target-engine-level");
    addExpResources(resources, "W-Engine", expBetween(tables.engineExpByBand, currentEngineLevel, targetEngineLevel));
    for (const step of tables.enginePromotion) {
      if (currentEngineLevel < step.level && targetEngineLevel >= step.level) {
        addResource(resources, step.advanced ? "Specialized W-Engine Component" : "W-Engine Component", step.part);
        addResource(resources, "Denny", step.denny);
      }
    }

    return { agent, resources };
  }

  function renderGrowth() {
    const { agent, resources } = calculateGrowth();
    $("#growth-agent-meta").textContent = `${attributeLabels[agent.attribute]} / ${roleLabels[agent.role]}`;
    const rows = Array.from(resources.entries())
      .sort(([a], [b]) => {
        if (a === "Denny") return -1;
        if (b === "Denny") return 1;
        return a.localeCompare(b, "en");
      })
      .map(([name, amount]) => {
        const row = document.createElement("div");
        row.className = "resource-row";
        row.innerHTML = `<span>${name}</span><strong>${fmt.format(amount)}</strong>`;
        return row;
      });
    $("#resource-list").replaceChildren(...rows);
  }

  function loadGuides() {
    try {
      guides = JSON.parse(localStorage.getItem(GUIDE_STORAGE_KEY) || "[]");
      if (!Array.isArray(guides)) guides = [];
    } catch (_error) {
      guides = [];
      localStorage.removeItem(GUIDE_STORAGE_KEY);
    }
  }

  function persistGuides() {
    localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(guides));
  }

  function guidePayloadFromForm() {
    return {
      id: `guide-${Date.now()}`,
      author: $("#guide-author").value.trim() || "Anonymous",
      title: $("#guide-title").value.trim() || `${getAgent($("#guide-agent").value).kr} Team`,
      agentId: $("#guide-agent").value,
      team: [$("#guide-slot-1").value, $("#guide-slot-2").value, $("#guide-slot-3").value],
      tags: $("#guide-tags").value.trim(),
      body: $("#guide-body").value.trim(),
      createdAt: new Date().toISOString(),
    };
  }

  function renderGuides() {
    if (guides.length === 0) {
      $("#guide-list").innerHTML = `<div class="empty-state">No saved guides yet.</div>`;
      return;
    }

    $("#guide-list").replaceChildren(
      ...guides.map((guide) => {
        const card = document.createElement("article");
        card.className = "guide-card";
        const mainAgent = getAgent(guide.agentId);
        card.innerHTML = `
          <div class="section-heading compact">
            <h3>${guide.title}</h3>
            <button class="ghost-button delete-guide" type="button">Delete</button>
          </div>
          <div class="guide-meta">${guide.author} / ${mainAgent.kr}${guide.tags ? ` / ${guide.tags}` : ""}</div>
          <div class="team-chip-row">${guide.team.map(teamMemberChip).join("")}</div>
          <p>${guide.body || "No content"}</p>
        `;
        card.querySelector(".delete-guide").addEventListener("click", () => {
          guides = guides.filter((item) => item.id !== guide.id);
          persistGuides();
          renderGuides();
        });
        card.querySelectorAll("img").forEach((img) => {
          img.addEventListener("error", (event) => event.currentTarget.classList.add("broken"));
        });
        return card;
      }),
    );
  }

  function updateIssueLink() {
    const guide = guidePayloadFromForm();
    const body = [
      `Author: ${guide.author}`,
      `Main Agent: ${getAgent(guide.agentId).kr}`,
      `Team: ${guide.team.map((id) => getAgent(id).kr).join(" / ")}`,
      `Tags: ${guide.tags}`,
      "",
      guide.body,
    ].join("\n");
    const params = new URLSearchParams({
      title: `[Guide] ${guide.title}`,
      body,
      labels: "community-guide",
    });
    $("#issue-link").href = `${REPO_ISSUE_URL}?${params.toString()}`;
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
          row.innerHTML = `<td><strong>${engine.kr}</strong><br>${engine.en}</td><td><span class="pill">${engine.rank}</span></td><td>${roleLabels[engine.role] || "All"}</td><td>${fmt.format(engine.baseAtk)}</td>`;
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
    const hasValue = Array.from(field.options).some((item) => item.value === field.value);
    if (!hasValue) field.value = fallbackValue;
  }

  function resetStats() {
    const agent = getAgent($("#agent-select").value);
    $("#crit-rate").value = Math.max(0, 50 - agent.stats.critRate);
    $("#crit-dmg").value = Math.max(0, 120 - agent.stats.critDmg);
    $("#atk-percent").value = 70;
    $("#flat-atk").value = 316;
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
    $("#copy-growth").textContent = "Copied";
    window.setTimeout(() => {
      $("#copy-growth").textContent = "Copy";
    }, 1200);
  }

  function renderAll() {
    renderAgentGrid();
    renderAgentDetail();
    renderDamage();
    renderGrowth();
    renderDatabase();
    updateIssueLink();
    saveSnapshot();
  }

  function initSelects() {
    const agentLabel = (agent) => `${agent.kr} (${attributeLabels[agent.attribute]} / ${roleLabels[agent.role]})`;
    fillSelect($("#agent-select"), agents, agentLabel);
    fillSelect($("#growth-agent-select"), agents, agentLabel);
    fillSelect($("#guide-agent"), agents, agentLabel);
    fillSelect($("#guide-slot-1"), agents, (agent) => agent.kr);
    fillSelect($("#guide-slot-2"), agents, (agent) => agent.kr);
    fillSelect($("#guide-slot-3"), agents, (agent) => agent.kr);
    fillSelect($("#engine-select"), engines, (engine) => `${engine.kr} / ${roleLabels[engine.role] || "All"}`);
    fillSelect($("#disc-four"), driveDiscs, (disc) => disc.kr);
    fillSelect($("#disc-two"), driveDiscs, (disc) => disc.kr);
    fillCoreSelect($("#current-core"));
    fillCoreSelect($("#target-core"));

    const activeRoles = new Set(agents.map((agent) => agent.role));
    const activeAttributes = new Set(agents.map((agent) => agent.attribute));
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

    $("#target-core").value = "6";
    $("#disc-four").value = "woodpecker-electro";
    $("#disc-two").value = "hormone-punk";
    $("#guide-slot-2").value = agents[1].id;
    $("#guide-slot-3").value = agents[2].id;
  }

  function bindEvents() {
    $$(".tab-button").forEach((button) => {
      button.addEventListener("click", () => switchTab(button.dataset.tab));
    });

    $$("[data-jump]").forEach((button) => {
      button.addEventListener("click", () => switchTab(button.dataset.jump));
    });

    $$("input, select, textarea").forEach((field) => {
      if (field.type === "file") return;
      field.addEventListener("input", renderAll);
      field.addEventListener("change", renderAll);
    });

    $("#agent-select").addEventListener("change", () => selectAgent($("#agent-select").value));
    $("#growth-agent-select").addEventListener("change", () => selectAgent($("#growth-agent-select").value));
    $("#guide-agent").addEventListener("change", () => selectAgent($("#guide-agent").value));
    $("#reset-stats").addEventListener("click", resetStats);
    $("#download-data").addEventListener("click", downloadData);
    $("#copy-growth").addEventListener("click", copyGrowth);

    $("#guide-form").addEventListener("submit", (event) => {
      event.preventDefault();
      const guide = guidePayloadFromForm();
      guides.unshift(guide);
      persistGuides();
      renderGuides();
      $("#guide-title").value = "";
      $("#guide-body").value = "";
      saveSnapshot();
    });

    $("#export-guides").addEventListener("click", () => {
      downloadJson({ version: DATA_VERSION, guides }, "zzz-calc-guides.json");
    });

    $("#import-guides").addEventListener("change", async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const text = await file.text();
      const payload = JSON.parse(text);
      const imported = Array.isArray(payload) ? payload : payload.guides;
      if (Array.isArray(imported)) {
        guides = [...imported, ...guides];
        persistGuides();
        renderGuides();
      }
      event.target.value = "";
    });

    $("#clear-guides").addEventListener("click", () => {
      guides = [];
      persistGuides();
      renderGuides();
    });
  }

  function init() {
    initSelects();
    loadGuides();
    restoreSnapshot();
    normalizeSelectValue("#engine-select", "manual");
    normalizeSelectValue("#disc-four", "woodpecker-electro");
    normalizeSelectValue("#disc-two", "hormone-punk");
    normalizeSelectValue("#agent-select", agents[0].id);
    normalizeSelectValue("#growth-agent-select", agents[0].id);
    normalizeSelectValue("#guide-agent", agents[0].id);
    selectAgent(selectedAgentId, false);
    bindEvents();
    renderAll();
    renderGuides();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
