// Pretty-prints content/*.json so it stays easy to edit by hand:
// objects one key per line, short lists of plain values on a single line.
// Usage: node scripts/format-content.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = join(import.meta.dirname, "..", "content");
const MAX = 110;

function fmt(value, indent = "") {
  const inner = indent + "  ";
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]";
    const flat = value.every((v) => v === null || typeof v !== "object");
    const oneLine = `[${value.map((v) => JSON.stringify(v)).join(", ")}]`;
    if (flat && oneLine.length + indent.length <= MAX) return oneLine;
    return `[\n${value.map((v) => inner + fmt(v, inner)).join(",\n")}\n${indent}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 0) return "{}";
    const oneLine = `{ ${entries.map(([k, v]) => `${JSON.stringify(k)}: ${JSON.stringify(v)}`).join(", ")} }`;
    if (entries.every(([, v]) => v === null || typeof v !== "object") && oneLine.length + indent.length <= MAX && entries.length <= 4) return oneLine;
    return `{\n${entries.map(([k, v]) => `${inner}${JSON.stringify(k)}: ${fmt(v, inner)}`).join(",\n")}\n${indent}}`;
  }
  return JSON.stringify(value);
}

for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const path = join(dir, file);
  writeFileSync(path, fmt(JSON.parse(readFileSync(path, "utf8"))) + "\n");
}
console.log("formatted content/*.json");
