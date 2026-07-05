import { readFile, writeFile } from "node:fs/promises";

const BASE_URL = "https://static.nanoka.cc";
const APP_SOURCE_PATH = "app.js";
const OUTPUT_PATH = "data/effects.mock.json";

const agentApiNamesById = {
  anby: ["Anby"],
  anton: ["Anton"],
  billy: ["Billy"],
  nicole: ["Nicole"],
  "zhu-yuan": ["Zhu Yuan"],
  qingyi: ["Qingyi", "QingYi"],
  ellen: ["Ellen"],
  lycaon: ["Lycaon"],
  rina: ["Rina"],
  soukaku: ["Soukaku"],
  miyabi: ["Miyabi"],
  harumasa: ["Harumasa"],
  jane: ["Jane"],
  seth: ["Seth"],
  burnice: ["Burnice"],
  lighter: ["Lighter"],
  astra: ["Astra Yao", "Astra"],
  yanagi: ["Yanagi"],
  yixuan: ["Yixuan", "YiXuan"],
  "ju-fufu": ["Ju Fufu"],
  "pan-yinhu": ["Pan Yinhu", "Yinhu"],
  yuzuha: ["Yuzuha"],
  alice: ["Alice"],
  ben: ["Ben"],
  corin: ["Corin"],
  grace: ["Grace"],
  koleda: ["Koleda"],
  nekomata: ["Nekomata"],
  "soldier-11": ["Soldier 11"],
  lucy: ["Lucy"],
  piper: ["Piper"],
  caesar: ["Caesar"],
  evelyn: ["Evelyn"],
  trigger: ["Trigger"],
  pulchra: ["Pulchra"],
  hugo: ["Hugo"],
  vivian: ["Vivian"],
  pyrois: ["Pyrois"],
  velina: ["Velina"],
  norma: ["Norma"],
};

function versionArg() {
  const raw = process.argv.find((arg) => arg.startsWith("--version="));
  return raw ? raw.slice("--version=".length) : "live";
}

async function fetchJson(path) {
  const url = path.startsWith("https://") ? path : `${BASE_URL}${path}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return response.json();
}

function sliceBetween(source, start, end) {
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error(`Could not find section ${start} -> ${end}`);
  }
  return source.slice(startIndex, endIndex);
}

function extractEntries(section) {
  return Array.from(section.matchAll(/\{\s*id:\s*"([^"]+)"[\s\S]*?en:\s*"([^"]+)"/g))
    .map((match) => ({ id: match[1], name: match[2] }))
    .filter((entry, index, entries) => entries.findIndex((item) => item.id === entry.id) === index);
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/gi, "")
    .toLowerCase();
}

function sourceListToLookup(source, aliasesForItem) {
  const lookup = new Map();
  Object.entries(source).forEach(([sourceId, item]) => {
    aliasesForItem(item).forEach((name) => {
      const key = normalizeName(name);
      if (key && !lookup.has(key)) lookup.set(key, { sourceId, item });
    });
  });
  return lookup;
}

function matchSource(lookup, names) {
  for (const name of names) {
    const match = lookup.get(normalizeName(name));
    if (match) return match;
  }
  return null;
}

function stripMarkup(value) {
  return String(value || "")
    .replace(/<\/?color(?:=[^>]+)?>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function shortEffect(rawText) {
  const firstLine = rawText.split("\n").map((line) => line.trim()).find(Boolean) || "";
  return firstLine.length > 180 ? `${firstLine.slice(0, 177)}...` : firstLine;
}

function sentenceList(rawText) {
  return String(rawText || "")
    .replace(/\s+/g, " ")
    .split(/[.!?]\s+/g)
    .map((sentence) => sentence.trim().replace(/[.!?]$/, ""))
    .filter(Boolean) || [];
}

function addStat(stats, field, value) {
  const number = Number(value);
  if (!Number.isFinite(number) || number === 0) return;
  stats[field] = Number(((stats[field] || 0) + number).toFixed(3));
}

function hasStats(stats) {
  return Object.values(stats).some((value) => Number(value || 0) !== 0);
}

function stackMultiplier(sentences, index) {
  const previous = sentences.slice(Math.max(0, index - 3), index).join(" ");
  const current = sentences[index] || "";
  const next = sentences[index + 1] || "";
  const stackText = `${previous} ${current} ${next.match(/^Can stack/i) ? next : ""}`;
  const match = stackText.match(/(?:stacking up to|up to)\s+(\d+)\s+(?:stacks|times)/i);
  return match ? Number(match[1]) : 1;
}

function applyPercentMatches(stats, field, sentence, regex, multiplier = 1) {
  for (const match of sentence.matchAll(regex)) {
    addStat(stats, field, Number(match[1]) * multiplier);
  }
}

function parseEffectStats(rawText) {
  const stats = {};
  const sentences = sentenceList(rawText);

  sentences.forEach((sentence, index) => {
    const multiplier = stackMultiplier(sentences, index);
    const stackableMultiplier = /(?:stack|each stack|for every stack|for each stack)/i.test(sentence) ? multiplier : 1;

    applyPercentMatches(stats, "critRate", sentence, /Increases CRIT Rate by ([\d.]+)%/gi);
    applyPercentMatches(stats, "critRate", sentence, /CRIT Rate (?:is )?(?:increases|increased) by(?: an additional)? ([\d.]+)%/gi, stackableMultiplier);
    applyPercentMatches(stats, "critRate", sentence, /CRIT Rate [^.]{0,80}? increase by(?: an additional)? ([\d.]+)%/gi, stackableMultiplier);
    applyPercentMatches(stats, "critRate", sentence, /CRIT Rate increases .*?up to (?:a )?(?:max(?:imum)? )?(?:increase of )?([\d.]+)%/gi);

    applyPercentMatches(stats, "critDmg", sentence, /Increases CRIT DMG by ([\d.]+)%/gi);
    applyPercentMatches(stats, "critDmg", sentence, /CRIT DMG (?:is )?(?:increases|increased) by(?: an additional)? ([\d.]+)%/gi, stackableMultiplier);
    applyPercentMatches(stats, "critDmg", sentence, /(?:and|,)\s+CRIT DMG by ([\d.]+)%/gi);
    applyPercentMatches(stats, "critDmg", sentence, /gain(?:s)? ([\d.]+)% CRIT DMG/gi);

    applyPercentMatches(stats, "atkPct", sentence, /Increases ATK by ([\d.]+)%/gi);
    applyPercentMatches(stats, "atkPct", sentence, /(?:the equipper's|their|her|his|all squad members') ATK (?:is )?(?:increases|increased) by ([\d.]+)%/gi);
    applyPercentMatches(stats, "atkPct", sentence, /gain(?:s)? ([\d.]+)% ATK/gi);
    applyPercentMatches(stats, "hpPct", sentence, /(?:Max HP|HP) (?:is )?(?:increases|increased|increase) by ([\d.]+)%/gi);

    applyPercentMatches(stats, "dmgBonus", sentence, /Increases (?:the equipper's |their |her |his |all squad members' |all Agents' |all units' )?(?:Ice|Fire|Electric|Ether|Physical|Wind|Sheer|Attribute Anomaly|Disorder|Basic Attack|Dash Attack|Dodge Counter|Chain Attack|Ultimate|EX Special Attack|Aftershock|Vortex|Windswept|Frostburn - Break)? ?DMG by ([\d.]+)%/gi, multiplier);
    applyPercentMatches(stats, "dmgBonus", sentence, /(?:the equipper's|their|her|his|all squad members'|all Agents'|all units') [^.]{0,40}?(?<!CRIT )DMG (?:dealt )?(?:increases|is increased) by ([\d.]+)%/gi, multiplier);
    applyPercentMatches(stats, "dmgBonus", sentence, /^(?!.*(?:the equipper's|their|her|his|all squad members'|all Agents'|all units'))[^.]{0,140}(?<!CRIT )DMG (?:is )?(?:increases|increased) by ([\d.]+)%/gi, multiplier);
    applyPercentMatches(stats, "dmgBonus", sentence, /(?<!CRIT )DMG dealt to enemies [^.]+ increases by ([\d.]+)%/gi, multiplier);
    applyPercentMatches(stats, "dmgBonus", sentence, /gain(?:s)? (?:a buff(?: that)? )?(?:that )?increases DMG dealt by ([\d.]+)%/gi, multiplier);
    applyPercentMatches(stats, "dmgBonus", sentence, /gain(?:s)? ([\d.]+)% increased DMG/gi, multiplier);
    applyPercentMatches(stats, "dmgBonus", sentence, /deals? ([\d.]+)% increased DMG/gi, multiplier);
    applyPercentMatches(stats, "dmgBonus", sentence, /deal[s]? ([\d.]+)% more [^.]{0,120}DMG/gi, multiplier);
    applyPercentMatches(stats, "dmgBonus", sentence, /attacks? on enemies [^.]+ have ([\d.]+)% increased [^.]{0,40}DMG/gi);
    applyPercentMatches(stats, "dmgBonus", sentence, /(?<!CRIT )DMG [^.]{0,100}?up to (?:a )?maximum increase of ([\d.]+)%/gi);

    applyPercentMatches(stats, "penRatio", sentence, /PEN Ratio (?:is )?(?:increases|increased) by ([\d.]+)%/gi, stackableMultiplier);

    applyPercentMatches(stats, "defReduction", sentence, /ignore[s]? ([\d.]+)% (?:of )?(?:the target's |enemy |enemies' )?DEF/gi, multiplier);
    applyPercentMatches(stats, "defReduction", sentence, /([\d.]+)% of (?:the )?(?:enemy's|target's) DEF is ignored/gi, multiplier);
    applyPercentMatches(stats, "defReduction", sentence, /DEF of [^.]+? (?:is )?reduced by ([\d.]+)%/gi, multiplier);
    applyPercentMatches(stats, "defReduction", sentence, /reduce[s]? the DEF [^.]+? by ([\d.]+)%/gi, multiplier);

    applyPercentMatches(stats, "resShred", sentence, /(?:RES|All-Attribute RES|Fire RES|Ice RES|Electric RES|Ether RES|Physical RES|Attribute DMG RES) (?:is )?reduced by ([\d.]+)%/gi, multiplier);
    applyPercentMatches(stats, "resShred", sentence, /ignore[s]? ([\d.]+)% of (?:the target's |enemy's )?(?:Fire|Ice|Electric|Ether|Physical|All-Attribute|Attribute DMG)? ?RES/gi, multiplier);

    applyPercentMatches(stats, "stunDmg", sentence, /Stun DMG Multiplier increases by ([\d.]+)%/gi, stackableMultiplier);

    applyPercentMatches(stats, "impactPct", sentence, /Impact (?:is )?(?:increases|increased) by ([\d.]+)%/gi, stackableMultiplier);
    applyPercentMatches(stats, "energyRegenPct", sentence, /Energy Generation Rate (?:is )?(?:increases|increased) by ([\d.]+)%/gi);
    applyPercentMatches(stats, "energyRegenPct", sentence, /Energy Regen (?:is )?(?:increases|increased) by ([\d.]+)%/gi);

    for (const match of sentence.matchAll(/Anomaly Proficiency (?:is )?(?:increases|increased) by(?: an additional)? ([\d.]+)/gi)) {
      addStat(stats, "anomalyProficiency", Number(match[1]) * stackableMultiplier);
    }
    for (const match of sentence.matchAll(/gain(?:s)?(?: an additional)? ([\d.]+) Anomaly Proficiency/gi)) {
      addStat(stats, "anomalyProficiency", Number(match[1]) * stackableMultiplier);
    }
    for (const match of sentence.matchAll(/Anomaly Mastery (?:is )?(?:increases|increased) by ([\d.]+)/gi)) {
      addStat(stats, "anomalyMastery", Number(match[1]) * stackableMultiplier);
    }
    for (const match of sentence.matchAll(/gain(?:s)?(?: an additional)? ([\d.]+) Anomaly Mastery/gi)) {
      addStat(stats, "anomalyMastery", Number(match[1]) * stackableMultiplier);
    }
    for (const match of sentence.matchAll(/Anomaly Mastery and Anomaly Proficiency (?:is |are )?(?:increases|increased) by ([\d.]+)/gi)) {
      addStat(stats, "anomalyMastery", Number(match[1]) * stackableMultiplier);
      addStat(stats, "anomalyProficiency", Number(match[1]) * stackableMultiplier);
    }
    for (const match of sentence.matchAll(/Sheer Force (?:is )?(?:increases|increased) by ([\d.]+)/gi)) {
      addStat(stats, "sheerForce", Number(match[1]) * stackableMultiplier);
    }
    for (const match of sentence.matchAll(/(?:increases|increased) (?:the equipper's |their |her |his )?Sheer Force by ([\d.]+)/gi)) {
      addStat(stats, "sheerForce", Number(match[1]) * stackableMultiplier);
    }
  });

  return stats;
}

function importedBuff(id, label, rawText) {
  const stats = parseEffectStats(rawText);
  const structured = hasStats(stats);
  return {
    id,
    label,
    target: "self",
    trigger: structured ? "auto-parsed" : "source-text",
    condition: structured
      ? "Auto-parsed numeric values are assumed active while DB auto buffs are enabled."
      : "Imported source text; structured numeric parsing is pending.",
    rawText,
    sourceStatus: structured ? "structured" : "source-text",
    appliesTo: ["all-damage"],
    stats,
    stacking: { mode: "manual", uptimeMode: "manual" },
    sourceRefs: ["nanoka-static", "hakushin-py-docs"],
    notes: structured
      ? "Automatically parsed from source text. Check the original condition before trusting edge cases."
      : "Raw effect text imported. Leave stats empty until the value is parsed and checked.",
    mockValue: false,
  };
}

function pendingBuff(id, label) {
  return {
    id,
    label,
    target: "self",
    trigger: "source-pending",
    condition: "Source text was not matched for this row.",
    sourceStatus: "source-pending",
    appliesTo: ["all-damage"],
    stats: {},
    stacking: { mode: "manual", uptimeMode: "manual" },
    sourceRefs: ["nanoka-static"],
    notes: "No source text is available for this row in the 3.0 API snapshot.",
    mockValue: false,
  };
}

function importedDamageHook(id, label, rawText) {
  return {
    id,
    kind: "formulaNote",
    targetSkillTags: ["all-agent-skill-levels"],
    formula: "Source text imported; connect a structured skill multiplier table before calculator application.",
    condition: "Imported source text; structured numeric parsing is pending.",
    rawText,
    sourceStatus: "source-text",
    sourceRefs: ["nanoka-static", "hakushin-py-docs"],
    notes: label,
    mockValue: false,
  };
}

function pendingDamageHook(id, label) {
  return {
    id,
    kind: "formulaNote",
    targetSkillTags: ["all-agent-skill-levels"],
    formula: "Source text was not matched for this row.",
    sourceStatus: "source-pending",
    sourceRefs: ["nanoka-static"],
    notes: label,
    mockValue: false,
  };
}

function mindscapeLevels(agent, detail) {
  const talents = detail?.talent || {};
  return Array.from({ length: 7 }, (_, level) => {
    if (level === 0) {
      return { level, label: "M0", shortEffect: "No mindscape effect.", buffs: [], damageHooks: [] };
    }

    const talent = talents[String(level)];
    const label = `M${level}`;
    if (!talent) {
      const row = level === 3 || level === 5 ? pendingDamageHook(`${agent.id}-m${level}-pending`, `${label} source pending`) : null;
      return {
        level,
        label,
        shortEffect: "Source pending.",
        buffs: row ? [] : [pendingBuff(`${agent.id}-m${level}-pending`, `${label} source pending`)],
        damageHooks: row ? [row] : [],
      };
    }

    const rawText = stripMarkup(talent.desc);
    const effectLabel = talent.name || label;
    return {
      level,
      label,
      shortEffect: shortEffect(rawText),
      buffs: level === 3 || level === 5 ? [] : [importedBuff(`${agent.id}-m${level}`, effectLabel, rawText)],
      damageHooks: level === 3 || level === 5 ? [importedDamageHook(`${agent.id}-m${level}-skill-level`, effectLabel, rawText)] : [],
    };
  });
}

function refinementRows(engine, detail) {
  const talents = detail?.talents || {};
  return Array.from({ length: 5 }, (_, index) => {
    const refinement = index + 1;
    const talent = talents[String(refinement)];
    const label = `R${refinement}`;
    return {
      refinement,
      label,
      buffs: talent
        ? [importedBuff(`${engine.id}-r${refinement}`, talent.name || label, stripMarkup(talent.desc))]
        : [pendingBuff(`${engine.id}-r${refinement}-pending`, `${label} source pending`)],
      damageHooks: [],
    };
  });
}

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

function apiAgentDisplayName(name) {
  return name;
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

function apiAgents(characterIndex) {
  return Object.entries(characterIndex)
    .filter(([, item]) => item.icon && !String(item.en || "").startsWith("Avatar_"))
    .map(([sourceId, item]) => ({
      id: apiAgentId(item.en),
      name: apiAgentDisplayName(item.en),
      source: { sourceId, item },
    }));
}

const appSource = await readFile(APP_SOURCE_PATH, "utf8");
const engines = extractEntries(sliceBetween(appSource, "const engines = [", "const driveDiscs = [")).filter((engine) => engine.id !== "manual");

const manifest = await fetchJson("/manifest.json");
const requestedVersion = versionArg();
const version = requestedVersion === "latest" || requestedVersion === "live" ? manifest.zzz[requestedVersion] : requestedVersion;

const [characterIndex, weaponIndex] = await Promise.all([fetchJson(`/zzz/${version}/character.json`), fetchJson(`/zzz/${version}/weapon.json`)]);

const weaponLookup = sourceListToLookup(weaponIndex, (item) => [item.en]);

const matchedAgents = apiAgents(characterIndex);
const matchedEngines = engines.map((engine) => ({
  ...engine,
  source: matchSource(weaponLookup, [engine.name]),
}));

const agentDetails = await Promise.all(
  matchedAgents.map(async (agent) => ({
    ...agent,
    detail: agent.source ? await fetchJson(`/zzz/${version}/en/character/${agent.source.sourceId}.json`) : null,
  })),
);

const engineDetails = await Promise.all(
  matchedEngines.map(async (engine) => ({
    ...engine,
    detail: engine.source ? await fetchJson(`/zzz/${version}/en/weapon/${engine.source.sourceId}.json`) : null,
  })),
);

const database = {
  $schema: "./effect-db.schema.json",
  schemaVersion: "0.3.0",
  gameVersion: version,
  status: "draft",
  lastUpdated: new Date().toISOString().slice(0, 10),
  sourcePolicy: {
    officialMachineReadableApi: false,
    notes:
      "No documented official calculator JSON/CSV feed is confirmed. This file imports community static source text, then keeps structured numeric stats empty until parsed and verified.",
  },
  sourceRefs: {
    "official-site": {
      kind: "official",
      url: "https://zenless.hoyoverse.com/en-us/",
      note: "Official Zenless Zone Zero website.",
    },
    hoyowiki: {
      kind: "official",
      url: "https://wiki.hoyolab.com/pc/zzz/home",
      note: "Official HoYoWiki browser source for human-readable pages.",
    },
    "nanoka-static": {
      kind: "community",
      url: `${BASE_URL}/zzz/${version}/`,
      note: "Community static data endpoint used for Agent Mindscape and W-Engine refinement source text.",
    },
    "hakushin-py-docs": {
      kind: "community",
      url: "https://seria.is-a.dev/hakushin-py/api_reference/clients/zzz/",
      note: "Wrapper documentation that exposes the same ZZZ character, weapon, and drive disc detail concepts.",
    },
    "manual-test": {
      kind: "manual-test",
      url: "local://zzz-calc/manual-verification",
      note: "Use for in-game or calculator regression checks before marking values verified.",
    },
  },
  statFields: [
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
  ],
  mindscapes: Object.fromEntries(
    agentDetails.map((agent) => [
      agent.id,
      {
        agentId: agent.id,
        agentName: agent.name,
        verification: agent.detail ? "draft" : "mock",
        levels: mindscapeLevels(agent, agent.detail),
      },
    ]),
  ),
  wEngines: Object.fromEntries(
    engineDetails.map((engine) => [
      engine.id,
      {
        engineId: engine.id,
        engineName: engine.name,
        verification: engine.detail ? "draft" : "mock",
        baseStatsAreRefinementIndependent: true,
        refinements: refinementRows(engine, engine.detail),
      },
    ]),
  ),
};

await writeFile(OUTPUT_PATH, `${JSON.stringify(database, null, 2)}\n`);

const unmatchedAgents = matchedAgents.filter((agent) => !agent.source);
const unmatchedEngines = matchedEngines.filter((engine) => !engine.source);
console.log(`Imported ${matchedAgents.length - unmatchedAgents.length}/${matchedAgents.length} Agent effect sets.`);
console.log(`Imported ${engines.length - unmatchedEngines.length}/${engines.length} W-Engine effect sets.`);
console.log(`Source version: ${version}`);
if (unmatchedAgents.length) console.warn(`Unmatched Agents: ${unmatchedAgents.map((agent) => agent.name).join(", ")}`);
if (unmatchedEngines.length) console.warn(`Unmatched W-Engines: ${unmatchedEngines.map((engine) => engine.name).join(", ")}`);
