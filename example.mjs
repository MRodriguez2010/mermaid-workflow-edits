import { parse, applyPatch } from "./dist/index.js";

const original = `flowchart LR
  A[Receive file]
  B[Check totals]
  C[Publish report]
  A --> B
  B -->|balanced| C`;

const check = parse(original).items.find(item => item.sourceId === "B" && item.kind === "node");
const revised = applyPatch(original, {
  type: "renameNode",
  itemId: check.id,
  label: "Reconcile totals",
});
console.log(revised);
