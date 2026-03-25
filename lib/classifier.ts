/**
 * lib/classifier.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Rule-based keyword scoring engine for campus issue severity classification.
 * Zero API calls — runs synchronously in < 1ms.
 *
 * Algorithm:
 *   1. Combine title + description into one lowercase string.
 *   2. Score against three keyword sets (critical=3pts, high=2pts, medium=1pt).
 *   3. Highest non-zero score wins. No matches → "low".
 *   4. Smart-boost: urgency words ("urgent", "asap", "immediately") promote by
 *      one level (low→medium, medium→high, high→critical).
 */

export type Severity = "critical" | "high" | "medium" | "low";

// ─── Keyword sets ─────────────────────────────────────────────────────────────

const CRITICAL_KEYWORDS: string[] = [
  "fire", "electric shock", "shock", "short circuit", "wire exposed",
  "exposed wire", "gas leak", "gas leakage", "danger", "hazard",
  "injury", "injured", "accident", "emergency", "explosion", "flood",
  "structural damage", "collapse", "smoke", "chemical", "unconscious",
  "bleeding", "health emergency", "power outage",
];

const HIGH_KEYWORDS: string[] = [
  "not working", "broken", "failure", "failed", "no water", "no electricity",
  "garbage not collected", "garbage overflow", "server down", "network down",
  "internet down", "wifi down", "no internet", "major leak", "leakage",
  "lift not working", "elevator not working", "projector not working",
  "classroom unusable", "lab closed", "ac not working", "sewage",
];

const MEDIUM_KEYWORDS: string[] = [
  "delay", "slow", "crowded", "inconvenience", "inconvenient", "issue",
  "problem", "not clean", "dirty", "smell", "noise", "noisy",
  "request", "repair", "replace", "maintenance", "canteen", "food quality",
  "chair broken", "desk broken", "fan not working", "light not working",
  "printer", "scanner", "washroom",
];

// Urgency boosters — promote severity up one level
const URGENCY_WORDS: string[] = [
  "urgent", "urgently", "immediately", "asap", "as soon as possible",
  "critical", "right now", "right away",
];

// ─── Score helpers ────────────────────────────────────────────────────────────

function score(text: string, keywords: string[]): number {
  return keywords.reduce((acc, kw) => acc + (text.includes(kw) ? 1 : 0), 0);
}

function boost(severity: Severity): Severity {
  const order: Severity[] = ["low", "medium", "high", "critical"];
  const idx = order.indexOf(severity);
  return idx < order.length - 1 ? order[idx + 1] : severity;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Classifies the severity of a campus complaint from its title and description.
 * @returns one of "critical" | "high" | "medium" | "low"
 */
export function classifySeverity(title: string, description: string): Severity {
  const text = `${title} ${description}`.toLowerCase();

  const criticalScore = score(text, CRITICAL_KEYWORDS);
  const highScore     = score(text, HIGH_KEYWORDS);
  const mediumScore   = score(text, MEDIUM_KEYWORDS);

  let severity: Severity;

  if (criticalScore > 0) {
    severity = "critical";
  } else if (highScore > 0) {
    severity = "high";
  } else if (mediumScore > 0) {
    severity = "medium";
  } else {
    severity = "low";
  }

  // Smart boost: urgency language promotes severity one level
  const isUrgent = URGENCY_WORDS.some((w) => text.includes(w));
  if (isUrgent && severity !== "critical") {
    severity = boost(severity);
  }

  return severity;
}

/**
 * Derives category from title + description using simple keyword matching.
 * Falls back to "Facility".
 */
export function classifyCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (/electric|wire|power|socket|plug|switch|short circuit/.test(text)) return "Electrical";
  if (/wifi|internet|network|server|connection|lan|router/.test(text))   return "Network";
  if (/fire|gas|smoke|hazard|danger|emergency|injury|safety/.test(text)) return "Safety";
  if (/toilet|washroom|bathroom|garbage|sewage|sanit|clean/.test(text))  return "Sanitary";
  if (/exam|lecture|course|class|lab|professor|faculty|academic/.test(text)) return "Academic";
  if (/theft|security|cctv|guard|lock|access|intruder/.test(text))       return "Security";
  return "Facility";
}

/**
 * Generates a short rule-based summary from the description.
 * No AI involved — simply trims to 120 chars and appends context.
 */
export function generateSummary(title: string, description: string): string {
  const trimmed = description.trim();
  if (trimmed.length <= 120) return trimmed;
  return trimmed.substring(0, 117).trimEnd() + "…";
}
