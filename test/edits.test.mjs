import assert from "node:assert/strict";
import test from "node:test";
import { parse, applyPatch } from "../dist/index.js";

const source = "flowchart LR\n  A[Receive file]\n  B[Check totals]\n  A -->|received| B";

test("a label edit leaves other diagram text intact", () => {
  const node = parse(source).items.find(item => item.kind === "node" && item.sourceId === "B");
  const edited = applyPatch(source, { type: "renameNode", itemId: node.id, label: "Reconcile totals" });
  assert.equal(edited, source.replace("Check totals", "Reconcile totals"));
  assert.equal(parse(edited).items.find(item => item.id === node.id).label, "Reconcile totals");
});

test("an edge label can change without changing its endpoints", () => {
  const edge = parse(source).items.find(item => item.kind === "edge");
  const output = applyPatch(source, { type: "editEdgeLabel", itemId: edge.id, label: "verified" });
  assert.equal(output, source.replace("|received|", "|verified|"));
  const next = parse(output).items.find(item => item.kind === "edge");
  assert.deepEqual([next.sourceId, next.targetId], ["A", "B"]);
});

test("unsupported diagram types report that editing is unavailable", () => {
  const result = parse("pie\n  \"Complete\" : 8");
  assert.equal(result.editable, false);
  assert.ok(result.warnings.length);
});
