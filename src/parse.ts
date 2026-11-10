import { scanClassDiagram } from "./scanners/class.js";
import { scanErDiagram } from "./scanners/er.js";
import { scanFlowchart } from "./scanners/flowchart.js";
import { scanSequence } from "./scanners/sequence.js";
import { scanStateDiagram } from "./scanners/state.js";
import { emptyParsedMermaid } from "./scanners/shared.js";
import type { ParsedMermaid } from "./types.js";

function detectDiagramType(code: string) {
  const firstCodeLine = code
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith("%%"));

  return firstCodeLine?.split(/\s+/)[0] ?? null;
}

export function parse(code: string): ParsedMermaid {
  const diagramType = detectDiagramType(code);

  switch (diagramType) {
    case "flowchart":
    case "graph":
      return scanFlowchart(code, diagramType);
    case "sequenceDiagram":
      return scanSequence(code);
    case "classDiagram":
    case "classDiagram-v2":
      return scanClassDiagram(code);
    case "stateDiagram":
    case "stateDiagram-v2":
      return scanStateDiagram(code, diagramType);
    case "erDiagram":
      return scanErDiagram(code);
    default:
      return emptyParsedMermaid(diagramType, diagramType ? [`${diagramType} visual editing is not available yet.`] : []);
  }
}
