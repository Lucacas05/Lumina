import { avatarOptions, type AvatarConfig } from "@/lib/sanctuary/store";

export type WardrobeField = "accessory" | "upper" | "lower" | "socks";

export type WardrobeValueMap = {
  accessory: AvatarConfig["accessory"];
  upper: AvatarConfig["upper"];
  lower: AvatarConfig["lower"];
  socks: AvatarConfig["socks"];
};

export interface WardrobeUnlockRule<T extends WardrobeField = WardrobeField> {
  id: string;
  field: T;
  value: WardrobeValueMap[T];
  label: string;
  unlockLevel: number;
}

export interface WardrobeConfig {
  levelStepFocusSeconds: number;
  rules: WardrobeUnlockRule[];
}

const WARDROBE_CONFIG_STORAGE_KEY = "lumina:wardrobe-config";
export const WARDROBE_CONFIG_EVENT = "lumina:wardrobe-config-changed";
const DEFAULT_LEVEL_STEP_FOCUS_SECONDS = 60 * 60;

const ruleValueSets = {
  accessory: new Set(avatarOptions.accessory.map((option) => option.value)),
  upper: new Set(avatarOptions.upper.map((option) => option.value)),
  lower: new Set(avatarOptions.lower.map((option) => option.value)),
  socks: new Set(avatarOptions.socks.map((option) => option.value)),
} as const;

function hasWardrobeValue(field: WardrobeField, value: unknown) {
  switch (field) {
    case "accessory":
      return ruleValueSets.accessory.has(
        value as WardrobeValueMap["accessory"],
      );
    case "upper":
      return ruleValueSets.upper.has(value as WardrobeValueMap["upper"]);
    case "lower":
      return ruleValueSets.lower.has(value as WardrobeValueMap["lower"]);
    case "socks":
      return ruleValueSets.socks.has(value as WardrobeValueMap["socks"]);
  }
}

function createRuleId<T extends WardrobeField>(
  field: T,
  value: WardrobeValueMap[T],
) {
  return `${field}:${value}`;
}

function createRule<T extends WardrobeField>(
  field: T,
  value: WardrobeValueMap[T],
  label: string,
  unlockLevel: number,
): WardrobeUnlockRule<T> {
  return {
    id: createRuleId(field, value),
    field,
    value,
    label,
    unlockLevel,
  };
}

function buildDefaultWardrobeUnlockRules(): WardrobeUnlockRule[] {
  return [
    createRule("upper", "shirt-01-longsleeve", "Camisa larga 01", 1),
    createRule("upper", "shirt-04-tee", "Camiseta 01", 1),
    createRule("upper", "shirt-02-vneck-longsleeve", "Camisa larga 02", 3),
    createRule("upper", "shirt-03-scoop-longsleeve", "Camisa larga 03", 6),
    createRule("upper", "shirt-05-vneck-tee", "Camiseta 02", 10),
    createRule("upper", "shirt-06-scoop-tee", "Camiseta 03", 15),
    createRule("lower", "pants-03-pants", "Pantalon 03", 1),
    createRule("lower", "pants-01-hose", "Pantalon 01", 2),
    createRule("lower", "pants-02-leggings", "Pantalon 02", 4),
    createRule("lower", "pants-04-cuffed", "Pantalon 04", 8),
    createRule("lower", "pants-05-overalls", "Pantalon 05", 13),
    createRule("socks", "socks-01-ankle", "Calcetines bajos", 1),
    createRule("socks", "socks-02-high", "Calcetines altos", 3),
    createRule("accessory", "ninguno", "Sin accesorio", 1),
    createRule("accessory", "bigote", "Bigote", 2),
    createRule("accessory", "barba-corta", "Barba corta", 3),
    createRule("accessory", "barbarian", "Casco barbaro", 5),
    createRule("accessory", "barbarian-nasal", "Casco barbaro nasal", 7),
    createRule("accessory", "barbarian-viking", "Casco vikingo", 9),
    createRule("accessory", "barbuta", "Barbuta", 11),
    createRule("accessory", "barbuta-simple", "Barbuta simple", 13),
    createRule("accessory", "close", "Casco cerrado", 15),
    createRule("accessory", "flattop", "Flat top", 17),
    createRule("accessory", "greathelm", "Greathelm", 19),
    createRule("accessory", "nasal", "Casco nasal", 21),
    createRule("accessory", "spangenhelm", "Spangenhelm", 23),
    createRule("accessory", "spangenhelm-viking", "Spangenhelm vikingo", 25),
    createRule("accessory", "sugarloaf", "Sugarloaf", 27),
    createRule("accessory", "sugarloaf-simple", "Sugarloaf simple", 29),
  ];
}

const defaultWardrobeConfig: WardrobeConfig = {
  levelStepFocusSeconds: DEFAULT_LEVEL_STEP_FOCUS_SECONDS,
  rules: buildDefaultWardrobeUnlockRules(),
};

function cloneRule(rule: WardrobeUnlockRule): WardrobeUnlockRule {
  return { ...rule };
}

function dispatchWardrobeConfigEvent() {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(WARDROBE_CONFIG_EVENT));
}

export function getDefaultWardrobeConfig(): WardrobeConfig {
  return {
    levelStepFocusSeconds: defaultWardrobeConfig.levelStepFocusSeconds,
    rules: defaultWardrobeConfig.rules.map(cloneRule),
  };
}

function isValidWardrobeField(value: unknown): value is WardrobeField {
  return (
    value === "accessory" ||
    value === "upper" ||
    value === "lower" ||
    value === "socks"
  );
}

function normalizeLevel(value: unknown, fallback: number) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(1, Math.round(value));
}

function normalizeLevelStepFocusSeconds(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_LEVEL_STEP_FOCUS_SECONDS;
  }

  return Math.max(15 * 60, Math.round(value));
}

function normalizeStoredRule(
  value: unknown,
  fallbackRule: WardrobeUnlockRule,
): WardrobeUnlockRule {
  if (!value || typeof value !== "object") {
    return cloneRule(fallbackRule);
  }

  const record = value as Record<string, unknown>;
  if (!isValidWardrobeField(record.field)) {
    return cloneRule(fallbackRule);
  }

  if (!hasWardrobeValue(record.field, record.value)) {
    return cloneRule(fallbackRule);
  }

  return {
    id: createRuleId(
      record.field,
      record.value as WardrobeValueMap[typeof record.field],
    ),
    field: record.field,
    value: record.value as WardrobeValueMap[typeof record.field],
    label:
      typeof record.label === "string" && record.label.trim().length > 0
        ? record.label.trim()
        : fallbackRule.label,
    unlockLevel: normalizeLevel(record.unlockLevel, fallbackRule.unlockLevel),
  };
}

function normalizeStoredConfig(value: unknown): WardrobeConfig {
  const fallback = getDefaultWardrobeConfig();

  if (!value || typeof value !== "object") {
    return fallback;
  }

  const record = value as Record<string, unknown>;
  const storedRules = Array.isArray(record.rules) ? record.rules : [];
  const storedRuleMap = new Map<string, unknown>();

  storedRules.forEach((rule) => {
    if (!rule || typeof rule !== "object") {
      return;
    }

    const entry = rule as Record<string, unknown>;
    if (!isValidWardrobeField(entry.field)) {
      return;
    }

    if (!hasWardrobeValue(entry.field, entry.value)) {
      return;
    }

    storedRuleMap.set(
      createRuleId(
        entry.field,
        entry.value as WardrobeValueMap[typeof entry.field],
      ),
      rule,
    );
  });

  return {
    levelStepFocusSeconds: normalizeLevelStepFocusSeconds(
      record.levelStepFocusSeconds,
    ),
    rules: fallback.rules.map((rule) =>
      normalizeStoredRule(storedRuleMap.get(rule.id), rule),
    ),
  };
}

export function loadWardrobeConfig(): WardrobeConfig {
  if (typeof window === "undefined") {
    return getDefaultWardrobeConfig();
  }

  const raw = window.localStorage.getItem(WARDROBE_CONFIG_STORAGE_KEY);
  if (!raw) {
    return getDefaultWardrobeConfig();
  }

  try {
    return normalizeStoredConfig(JSON.parse(raw));
  } catch {
    return getDefaultWardrobeConfig();
  }
}

export function saveWardrobeConfig(config: WardrobeConfig) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeStoredConfig(config);
  window.localStorage.setItem(
    WARDROBE_CONFIG_STORAGE_KEY,
    JSON.stringify(normalized),
  );
  dispatchWardrobeConfigEvent();
}

export function resetWardrobeConfig() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(WARDROBE_CONFIG_STORAGE_KEY);
  dispatchWardrobeConfigEvent();
}

export function formatWardrobeDuration(totalFocusSeconds: number) {
  const totalMinutes = Math.max(0, Math.round(totalFocusSeconds / 60));

  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return minutes > 0 ? `${hours} h ${minutes} min` : `${hours} h`;
  }

  return `${totalMinutes} min`;
}

export function getFocusSecondsForLevel(
  unlockLevel: number,
  levelStepFocusSeconds = DEFAULT_LEVEL_STEP_FOCUS_SECONDS,
) {
  return (
    Math.max(0, normalizeLevel(unlockLevel, 1) - 1) *
    normalizeLevelStepFocusSeconds(levelStepFocusSeconds)
  );
}

export function getWardrobeLevel(
  totalFocusSeconds: number,
  levelStepFocusSeconds = DEFAULT_LEVEL_STEP_FOCUS_SECONDS,
) {
  return (
    Math.floor(
      Math.max(0, totalFocusSeconds) /
        normalizeLevelStepFocusSeconds(levelStepFocusSeconds),
    ) + 1
  );
}

export function getWardrobeUnlockRule<T extends WardrobeField>(
  field: T,
  value: WardrobeValueMap[T],
  config: WardrobeConfig = defaultWardrobeConfig,
) {
  return config.rules.find(
    (rule) => rule.field === field && rule.value === value,
  ) as WardrobeUnlockRule<T> | undefined;
}

export function getWardrobeRequirementLevel<T extends WardrobeField>(
  field: T,
  value: WardrobeValueMap[T],
  config: WardrobeConfig = defaultWardrobeConfig,
) {
  return getWardrobeUnlockRule(field, value, config)?.unlockLevel ?? 1;
}

export function getWardrobeRequirement<T extends WardrobeField>(
  field: T,
  value: WardrobeValueMap[T],
  config: WardrobeConfig = defaultWardrobeConfig,
) {
  return getFocusSecondsForLevel(
    getWardrobeRequirementLevel(field, value, config),
    config.levelStepFocusSeconds,
  );
}

export function isWardrobeItemUnlocked<T extends WardrobeField>(
  field: T,
  value: WardrobeValueMap[T],
  totalFocusSeconds: number,
  config: WardrobeConfig = defaultWardrobeConfig,
) {
  return totalFocusSeconds >= getWardrobeRequirement(field, value, config);
}

export function listWardrobeRulesByField(
  field: WardrobeField,
  config: WardrobeConfig = defaultWardrobeConfig,
) {
  return config.rules.filter((rule) => rule.field === field);
}

export function getWardrobeUnlockSummary(
  totalFocusSeconds: number,
  config: WardrobeConfig = defaultWardrobeConfig,
) {
  const enrichedRules = config.rules.map((rule) => {
    const requiredFocusSeconds = getFocusSecondsForLevel(
      rule.unlockLevel,
      config.levelStepFocusSeconds,
    );

    return {
      ...rule,
      requiredFocusSeconds,
      unlocked: totalFocusSeconds >= requiredFocusSeconds,
    };
  });

  const unlockedCount = enrichedRules.filter((rule) => rule.unlocked).length;
  const nextUnlock =
    enrichedRules
      .filter((rule) => !rule.unlocked)
      .sort((left, right) => left.unlockLevel - right.unlockLevel)[0] ?? null;
  const currentLevel = getWardrobeLevel(
    totalFocusSeconds,
    config.levelStepFocusSeconds,
  );
  const maxLevel = Math.max(...config.rules.map((rule) => rule.unlockLevel));

  return {
    unlockedCount,
    totalItems: config.rules.length,
    currentLevel,
    maxLevel,
    nextUnlock: nextUnlock
      ? {
          ...nextUnlock,
          remainingFocusSeconds:
            nextUnlock.requiredFocusSeconds - totalFocusSeconds,
        }
      : null,
  };
}
