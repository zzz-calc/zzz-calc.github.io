import { readFile, writeFile } from "node:fs/promises";

const appSource = await readFile("app.js", "utf8");

function sliceBetween(start, end) {
  const startIndex = appSource.indexOf(start);
  const endIndex = appSource.indexOf(end, startIndex);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Could not find section ${start} -> ${end}`);
  }
  return appSource.slice(startIndex, endIndex);
}

function extractEntries(section, nameKey = "en") {
  return Array.from(section.matchAll(/\{\s*id:\s*"([^"]+)"[\s\S]*?en:\s*"([^"]+)"/g))
    .map((match) => ({ id: match[1], name: match[2] }))
    .filter((entry, index, entries) => entries.findIndex((item) => item.id === entry.id) === index);
}

const agents = extractEntries(sliceBetween("const agents = [", "const engines = ["));
const engines = extractEntries(sliceBetween("const engines = [", "const driveDiscs = [")).filter((engine) => engine.id !== "manual");

function placeholderBuff(id, label, sourceRefs) {
  return {
    id,
    label,
    target: "self",
    trigger: "source-pending",
    condition: "원문 효과를 구조화 수치로 변환 대기 중입니다.",
    appliesTo: ["all-damage"],
    stats: {},
    stacking: { mode: "manual", uptimeMode: "manual" },
    sourceRefs,
    notes: "HoYoWiki/Hakush/in-game 검증 후 mockValue를 false로 바꾸세요.",
    mockValue: true,
  };
}

function skillLevelHook(id, label, sourceRefs) {
  return {
    id,
    kind: "formulaNote",
    targetSkillTags: ["all-agent-skill-levels"],
    formula: "검증된 스킬 계수 테이블이 준비되면 여기에 연결합니다.",
    sourceRefs,
    notes: label,
    mockValue: true,
  };
}

function mindscapeLevels(agent) {
  return Array.from({ length: 7 }, (_, level) => {
    if (level === 0) {
      return { level, label: "M0", shortEffect: "No mindscape effect.", buffs: [], damageHooks: [] };
    }
    if (level === 3 || level === 5) {
      return {
        level,
        label: `M${level}`,
        shortEffect: "스킬 레벨 또는 계산식 효과 변환 대기.",
        buffs: [],
        damageHooks: [skillLevelHook(`${agent.id}-m${level}-skill-level-pending`, `M${level} 구조화 수치 입력 대기.`, ["hoyowiki", "hakush-api"])],
      };
    }
    return {
      level,
      label: `M${level}`,
      shortEffect: "돌파 구조화 수치 입력 대기.",
      buffs: [placeholderBuff(`${agent.id}-m${level}-effect-pending`, `M${level} effect pending`, ["hoyowiki", "hakush-api"])],
      damageHooks: [],
    };
  });
}

function refinementRows(engine) {
  return Array.from({ length: 5 }, (_, index) => {
    const refinement = index + 1;
    return {
      refinement,
      label: `R${refinement}`,
      buffs: [placeholderBuff(`${engine.id}-r${refinement}-effect-pending`, `R${refinement} effect pending`, ["hoyowiki", "hakush-api"])],
      damageHooks: [],
    };
  });
}

const database = {
  $schema: "./effect-db.schema.json",
  schemaVersion: "0.2.0",
  gameVersion: "3.0",
  status: "mock",
  lastUpdated: "2026-07-05",
  sourcePolicy: {
    officialMachineReadableApi: false,
    notes:
      "No documented official JSON or CSV data feed has been confirmed. This file keeps full calculator coverage with source-pending mock entries until numeric values are verified.",
  },
  sourceRefs: {
    "official-site": {
      kind: "official",
      url: "https://zenless.hoyoverse.com/en-us/",
      note: "Official Zenless Zone Zero website and current version landing page.",
    },
    hoyowiki: {
      kind: "official",
      url: "https://wiki.hoyolab.com/pc/zzz/home",
      note: "Official HoYoWiki browser source for human-readable character and item pages.",
    },
    "hakush-api": {
      kind: "community",
      url: "https://api.hakush.in/zzz/data/",
      note: "Community-maintained structured JSON used as a conversion source when reachable.",
    },
    "manual-test": {
      kind: "manual-test",
      url: "local://zzz-calc/manual-verification",
      note: "Use for in-game or calculator regression checks before marking values verified.",
    },
  },
  statFields: [
    "atkPct",
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
  ],
  mindscapes: Object.fromEntries(
    agents.map((agent) => [
      agent.id,
      {
        agentId: agent.id,
        agentName: agent.name,
        verification: "mock",
        levels: mindscapeLevels(agent),
      },
    ]),
  ),
  wEngines: Object.fromEntries(
    engines.map((engine) => [
      engine.id,
      {
        engineId: engine.id,
        engineName: engine.name,
        verification: "mock",
        baseStatsAreRefinementIndependent: true,
        refinements: refinementRows(engine),
      },
    ]),
  ),
};

await writeFile("data/effects.mock.json", `${JSON.stringify(database, null, 2)}\n`);

console.log(`Generated ${agents.length} agent mindscape entries and ${engines.length} W-Engine refinement entries.`);
