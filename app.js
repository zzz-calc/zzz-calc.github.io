(function () {
  "use strict";

  const DATA_VERSION = "2026-07-05-v0";

  const roleLabels = {
    attack: "강공",
    stun: "격파",
    anomaly: "이상",
    support: "지원",
    defense: "방어",
    rupture: "명파",
  };

  const attributeLabels = {
    physical: "물리",
    fire: "불",
    ice: "얼음",
    frost: "서리",
    electric: "전기",
    ether: "에테르",
    wind: "바람",
    auricInk: "현묵",
  };

  const agents = [
    {
      id: "anby",
      kr: "안비 데마라",
      en: "Anby Demara",
      rank: "A",
      attribute: "electric",
      role: "stun",
      faction: "교활한 토끼굴",
      stats: { hp: 7500, def: 612, atk: 658, critRate: 5, critDmg: 50, penRatio: 0, impact: 136, anomalyMastery: 94, energy: 1.2 },
    },
    {
      id: "billy",
      kr: "빌리 키드",
      en: "Billy Kid",
      rank: "A",
      attribute: "physical",
      role: "attack",
      faction: "교활한 토끼굴",
      stats: { hp: 6907, def: 606, atk: 787, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 91, anomalyMastery: 92, energy: 1.2 },
    },
    {
      id: "nicole",
      kr: "니콜 데마라",
      en: "Nicole Demara",
      rank: "A",
      attribute: "ether",
      role: "support",
      faction: "교활한 토끼굴",
      stats: { hp: 8145, def: 622, atk: 649, critRate: 5, critDmg: 50, penRatio: 0, impact: 88, anomalyMastery: 90, energy: 1.56 },
    },
    {
      id: "ellen",
      kr: "엘렌 조",
      en: "Ellen Joe",
      rank: "S",
      attribute: "ice",
      role: "attack",
      faction: "빅토리아 하우스키핑",
      stats: { hp: 7673, def: 606, atk: 938, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 93, anomalyMastery: 94, energy: 1.2 },
    },
    {
      id: "rina",
      kr: "알렉산드리나",
      en: "Alexandrina Sebastiane",
      rank: "S",
      attribute: "electric",
      role: "support",
      faction: "빅토리아 하우스키핑",
      stats: { hp: 8609, def: 600, atk: 717, critRate: 5, critDmg: 50, penRatio: 14, impact: 83, anomalyMastery: 93, energy: 1.2 },
    },
    {
      id: "zhu-yuan",
      kr: "주연",
      en: "Zhu Yuan",
      rank: "S",
      attribute: "ether",
      role: "attack",
      faction: "치안국 특수대응팀",
      stats: { hp: 7482, def: 600, atk: 919, critRate: 5, critDmg: 78.8, penRatio: 0, impact: 90, anomalyMastery: 93, energy: 1.2 },
    },
    {
      id: "jane",
      kr: "제인 도",
      en: "Jane Doe",
      rank: "S",
      attribute: "physical",
      role: "anomaly",
      faction: "치안국 특수대응팀",
      stats: { hp: 7788, def: 606, atk: 880, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 148, energy: 1.2 },
    },
    {
      id: "miyabi",
      kr: "호시미 미야비",
      en: "Hoshimi Miyabi",
      rank: "S",
      attribute: "frost",
      role: "anomaly",
      faction: "대공동 6과",
      stats: { hp: 7673, def: 606, atk: 880, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 116, energy: 1.2 },
    },
    {
      id: "yixuan",
      kr: "의현",
      en: "Yixuan",
      rank: "S",
      attribute: "auricInk",
      role: "rupture",
      faction: "운규산",
      stats: { hp: 8373, def: 441, atk: 872, critRate: 19.4, critDmg: 50, penRatio: 0, impact: 93, anomalyMastery: 92, energy: 1.2 },
    },
    {
      id: "yuzuha",
      kr: "우키나미 유즈하",
      en: "Ukinami Yuzuha",
      rank: "S",
      attribute: "physical",
      role: "support",
      faction: "스푸크 샥",
      stats: { hp: 8829, def: 612, atk: 758, critRate: 5, critDmg: 50, penRatio: 0, impact: 86, anomalyMastery: 124, energy: 1.2 },
    },
  ];

  const engines = [
    { id: "manual", kr: "수동 입력", en: "Manual", rank: "-", role: "any", baseAtk: 0, stats: {}, effect: "입력값만 반영" },
    { id: "deep-sea-visitor", kr: "딥 씨 비지터", en: "Deep Sea Visitor", rank: "S", role: "attack", baseAtk: 713, stats: { critRate: 24 }, effect: "얼음 피해 및 치명타 보정" },
    { id: "fusion-compiler", kr: "융합 컴파일러", en: "Fusion Compiler", rank: "S", role: "anomaly", baseAtk: 684, stats: { penRatio: 24 }, effect: "공격력 및 이상 숙련도 보정" },
    { id: "hellfire-gears", kr: "헬파이어 기어", en: "Hellfire Gears", rank: "S", role: "stun", baseAtk: 684, stats: { impact: 18 }, effect: "충격력 보정" },
    { id: "angel-shell", kr: "껍데기 속 영혼", en: "Angel in the Shell", rank: "S", role: "anomaly", baseAtk: 713, stats: { anomalyMastery: 30 }, effect: "이상 피해 보정" },
    { id: "chief-sidekick", kr: "수석 조수", en: "Chief Sidekick", rank: "S", role: "stun", baseAtk: 713, stats: { critRate: 24 }, effect: "불 속성 격파 지원 보정" },
    { id: "joyau-dore", kr: "영롱한 금빛 마음", en: "Joyau Dore", rank: "S", role: "anomaly", baseAtk: 713, stats: { energyRegen: 60 }, effect: "바람 이상 지원 보정" },
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
    { id: "freedom-blues", kr: "자유의 블루스", en: "Freedom Blues", two: "이상 숙련도 +30", four: "EX 명중 시 이상 축적 저항 감소", stats: { anomalyProficiency: 30 } },
    { id: "shockstar-disco", kr: "쇼크스타 디스코", en: "Shockstar Disco", two: "충격력 +6%", four: "그로기 축적 보정", stats: { impactPct: 6 } },
    { id: "puffer-electro", kr: "복어 일렉트로", en: "Puffer Electro", two: "관통률 +8%", four: "궁극기 피해 및 공격력 보정", stats: { penRatio: 8 } },
    { id: "woodpecker-electro", kr: "딱따구리 일렉트로", en: "Woodpecker Electro", two: "치명타 확률 +8%", four: "치명타 후 공격력 보정", stats: { critRate: 8 } },
    { id: "proto-punk", kr: "원시 펑크", en: "Proto Punk", two: "실드량 +15%", four: "지원 방어 후 파티 피해 보정", stats: {} },
    { id: "chaos-jazz", kr: "카오스 재즈", en: "Chaos Jazz", two: "이상 숙련도 +30", four: "불/전기 피해 및 오프필드 피해 보정", stats: { anomalyProficiency: 30 } },
    { id: "astral-voice", kr: "고요 속의 별", en: "Astral Voice", two: "공격력 +10%", four: "퀵 지원 진입 피해 보정", stats: { atkPct: 10 } },
    { id: "branch-blade", kr: "나뭇가지 검의 노래", en: "Branch & Blade Song", two: "치명타 피해 +16%", four: "빙결/쇄빙 후 치명타 보정", stats: { critDmg: 16 } },
    { id: "shadow-harmony", kr: "그림자처럼 함께", en: "Shadow Harmony", two: "여진/대시 피해 +15%", four: "여진/대시 후 공격력 및 치명타 보정", stats: { aftershockDmg: 15 } },
    { id: "phaethon-melody", kr: "파에톤의 노래", en: "Phaethon's Melody", two: "이상 장악력 +8%", four: "EX 후 이상 숙련도 및 에테르 피해 보정", stats: { anomalyMasteryPct: 8 } },
    { id: "yunkui-tales", kr: "운규 이야기", en: "Yunkui Tales", two: "HP +10%", four: "EX/콤보/궁극기 후 명파 피해 보정", stats: { hpPct: 10 } },
    { id: "king-summit", kr: "산림의 왕", en: "King of the Summit", two: "그로기 수치 +6%", four: "격파 캐릭터 파티 치명타 피해 보정", stats: { dazePct: 6 } },
    { id: "dawns-bloom", kr: "여명의 꽃", en: "Dawn's Bloom", two: "일반 공격 피해 +15%", four: "강공 캐릭터 일반 공격 보정", stats: { basicDmg: 15 } },
    { id: "moonlight-lullaby", kr: "달빛 기사의 칭송", en: "Moonlight Lullaby", two: "에너지 자동 회복 +20%", four: "지원 캐릭터 파티 피해 보정", stats: { energyRegenPct: 20 } },
    { id: "wuthering-salon", kr: "울부짖는 살롱", en: "Wuthering Salon", two: "바람 피해 +10%", four: "바람 이상 후 피해 보정", stats: { windDmg: 10 } },
    { id: "sky-ablaze", kr: "새벽녘 여행기", en: "The Sky Ablaze", two: "에테르 피해 +10%", four: "에테르 캐릭터 치명타 피해 및 공격력 보정", stats: { etherDmg: 10 } },
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
      { level: 30, part: 10, denny: 28000 },
      { level: 40, part: 16, denny: 60000 },
      { level: 50, part: 8, advanced: true, denny: 100000 },
      { level: 60, part: 16, advanced: true, denny: 200000 },
    ],
    engineExpByBand: [
      { from: 1, to: 10, exp: 12000 },
      { from: 10, to: 20, exp: 30000 },
      { from: 20, to: 30, exp: 60000 },
      { from: 30, to: 40, exp: 100000 },
      { from: 40, to: 50, exp: 160000 },
      { from: 50, to: 60, exp: 240000 },
    ],
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const fmt = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 0 });
  const fmt1 = new Intl.NumberFormat("ko-KR", { maximumFractionDigits: 1 });

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
    const atkPct =
      number("#atk-percent") +
      sumStatFromDiscs(discs, "atkPct");
    const flatAtk = number("#flat-atk");
    const totalAtk = baseAtk * (1 + atkPct / 100) + flatAtk;

    const critRate = clamp(
      agent.stats.critRate +
        (engine.stats.critRate || 0) +
        sumStatFromDiscs(discs, "critRate") +
        number("#crit-rate"),
      0,
      100,
    );
    const critDmg =
      agent.stats.critDmg +
      sumStatFromDiscs(discs, "critDmg") +
      number("#crit-dmg");

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
      number("#pen-ratio") +
        (engine.stats.penRatio || 0) +
        sumStatFromDiscs(discs, "penRatio") +
        agent.stats.penRatio,
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
    const nonCrit =
      totalAtk *
      skillMultiplier *
      damageBonusMultiplier *
      defMultiplier *
      resMultiplier *
      stunMultiplier;
    const crit = nonCrit * (1 + critDmg / 100);
    const expected = nonCrit * (1 + (critRate / 100) * (critDmg / 100));

    const anomalyProficiency =
      number("#anomaly-proficiency") +
      (engine.stats.anomalyProficiency || 0) +
      sumStatFromDiscs(discs, "anomalyProficiency");
    const anomalyMastery =
      agent.stats.anomalyMastery +
      (engine.stats.anomalyMastery || 0) +
      sumStatFromDiscs(discs, "anomalyMastery");
    const anomaly =
      totalAtk *
      4.5 *
      (1 + anomalyProficiency / 100) *
      damageBonusMultiplier *
      defMultiplier *
      resMultiplier;

    return {
      agent,
      engine,
      discFour,
      discTwo,
      totalAtk,
      critRate,
      critDmg,
      baseDmgBonus,
      damageBonusMultiplier,
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
    $("#agent-meta").textContent = `${attributeLabels[result.agent.attribute]} · ${roleLabels[result.agent.role]} · ${result.agent.faction}`;
    $("#disc-summary").textContent = `${result.discFour.kr} 4 / ${result.discTwo.kr} 2`;
    $("#normal-damage").textContent = fmt.format(result.nonCrit);
    $("#crit-damage").textContent = fmt.format(result.crit);
    $("#expected-damage").textContent = fmt.format(result.expected);
    $("#anomaly-damage").textContent = fmt.format(result.anomaly);

    const lines = [
      ["총 공격력", fmt.format(result.totalAtk)],
      ["치명타", `${fmt1.format(result.critRate)}% / ${fmt1.format(result.critDmg)}%`],
      ["피해 보너스", `${fmt1.format(result.baseDmgBonus)}%`],
      ["방어 배율", fmt1.format(result.defMultiplier)],
      ["저항 배율", fmt1.format(result.resMultiplier)],
      ["그로기 배율", fmt1.format(result.stunMultiplier)],
      ["이상 장악력", fmt1.format(result.anomalyMastery)],
      ["이상 숙련도", fmt1.format(result.anomalyProficiency)],
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
    addResource(map, "선임 조사원 기록 환산", Math.ceil(exp / 3000));
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
        addResource(resources, "캐릭터별 고차원 데이터", step.highDim || 0);
        addResource(resources, "캐릭터별 주간 보스 재료", step.weekly || 0);
      }
    }

    const currentEngineLevel = number("#current-engine-level");
    const targetEngineLevel = number("#target-engine-level");
    addResource(resources, "W-엔진 전원 EXP", Math.round(expBetween(tables.engineExpByBand, currentEngineLevel, targetEngineLevel)));
    for (const step of tables.enginePromotion) {
      if (currentEngineLevel < step.level && targetEngineLevel >= step.level) {
        addResource(resources, step.advanced ? "특화 W-엔진 부품" : "기본 W-엔진 부품", step.part);
        addResource(resources, "데니", step.denny);
      }
    }

    return { agent, resources };
  }

  function renderGrowth() {
    const { agent, resources } = calculateGrowth();
    $("#growth-agent-meta").textContent = `${attributeLabels[agent.attribute]} · ${roleLabels[agent.role]}`;
    const rows = Array.from(resources.entries())
      .sort(([a], [b]) => {
        if (a === "데니") return -1;
        if (b === "데니") return 1;
        return a.localeCompare(b, "ko");
      })
      .map(([name, amount]) => {
        const row = document.createElement("div");
        row.className = "resource-row";
        const left = document.createElement("span");
        const right = document.createElement("strong");
        left.textContent = name;
        right.textContent = fmt.format(amount);
        row.append(left, right);
        return row;
      });
    $("#resource-list").replaceChildren(...rows);
  }

  function renderDatabase() {
    const query = $("#database-search").value.trim().toLowerCase();
    const matches = (values) => values.join(" ").toLowerCase().includes(query);

    const agentRows = agents
      .filter((agent) => matches([agent.kr, agent.en, roleLabels[agent.role], attributeLabels[agent.attribute], agent.faction]))
      .map((agent) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td><strong>${agent.kr}</strong><br>${agent.en}</td><td><span class="pill">${agent.rank}</span></td><td>${attributeLabels[agent.attribute]}</td><td>${roleLabels[agent.role]}</td><td>${fmt.format(agent.stats.atk)}</td>`;
        return row;
      });

    const discRows = driveDiscs
      .filter((disc) => disc.id !== "none")
      .filter((disc) => matches([disc.kr, disc.en, disc.two, disc.four]))
      .map((disc) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td><strong>${disc.kr}</strong><br>${disc.en}</td><td>${disc.two}</td><td>${disc.four}</td>`;
        return row;
      });

    const engineRows = engines
      .filter((engine) => engine.id !== "manual")
      .filter((engine) => matches([engine.kr, engine.en, engine.role, engine.effect]))
      .map((engine) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td><strong>${engine.kr}</strong><br>${engine.en}</td><td><span class="pill">${engine.rank}</span></td><td>${engine.role === "any" ? "전체" : roleLabels[engine.role]}</td><td>${fmt.format(engine.baseAtk)}</td>`;
        return row;
      });

    $("#agent-table").replaceChildren(...agentRows);
    $("#disc-table").replaceChildren(...discRows);
    $("#engine-table").replaceChildren(...engineRows);
  }

  function saveSnapshot() {
    const fields = $$("input, select").filter((field) => field.id);
    const snapshot = Object.fromEntries(fields.map((field) => [field.id, field.type === "checkbox" ? field.checked : field.value]));
    localStorage.setItem("zzz-calc-state", JSON.stringify(snapshot));
  }

  function restoreSnapshot() {
    try {
      const snapshot = JSON.parse(localStorage.getItem("zzz-calc-state") || "{}");
      for (const [id, value] of Object.entries(snapshot)) {
        const field = document.getElementById(id);
        if (!field) continue;
        if (field.type === "checkbox") field.checked = Boolean(value);
        else field.value = value;
      }
    } catch (_error) {
      localStorage.removeItem("zzz-calc-state");
    }
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
    const payload = {
      version: DATA_VERSION,
      agents,
      engines,
      driveDiscs,
      materialNames,
      tables,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `zzz-calc-data-${DATA_VERSION}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
  }

  async function copyGrowth() {
    const { resources } = calculateGrowth();
    const text = Array.from(resources.entries())
      .map(([name, amount]) => `${name}: ${fmt.format(amount)}`)
      .join("\n");
    await navigator.clipboard.writeText(text);
    $("#copy-growth").textContent = "완료";
    window.setTimeout(() => {
      $("#copy-growth").textContent = "복사";
    }, 1200);
  }

  function renderAll() {
    renderDamage();
    renderGrowth();
    renderDatabase();
    saveSnapshot();
  }

  function init() {
    fillSelect($("#agent-select"), agents, (agent) => `${agent.kr} (${attributeLabels[agent.attribute]} · ${roleLabels[agent.role]})`);
    fillSelect($("#growth-agent-select"), agents, (agent) => `${agent.kr} (${attributeLabels[agent.attribute]} · ${roleLabels[agent.role]})`);
    fillSelect($("#engine-select"), engines, (engine) => `${engine.kr} · ${engine.role === "any" ? "전체" : roleLabels[engine.role] || engine.role}`);
    fillSelect($("#disc-four"), driveDiscs, (disc) => disc.kr);
    fillSelect($("#disc-two"), driveDiscs, (disc) => disc.kr);
    fillCoreSelect($("#current-core"));
    fillCoreSelect($("#target-core"));

    $("#target-core").value = "6";
    $("#disc-four").value = "woodpecker-electro";
    $("#disc-two").value = "hormone-punk";

    restoreSnapshot();

    $$(".tab-button").forEach((button) => {
      button.addEventListener("click", () => {
        $$(".tab-button").forEach((item) => item.classList.remove("active"));
        $$(".tab-panel").forEach((panel) => panel.classList.remove("active"));
        button.classList.add("active");
        $(`#${button.dataset.tab}-panel`).classList.add("active");
      });
    });

    $$("input, select").forEach((field) => {
      field.addEventListener("input", renderAll);
      field.addEventListener("change", renderAll);
    });

    $("#reset-stats").addEventListener("click", resetStats);
    $("#download-data").addEventListener("click", downloadData);
    $("#copy-growth").addEventListener("click", copyGrowth);

    renderAll();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

