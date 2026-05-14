import XLSX from "xlsx";
import { writeFileSync } from "fs";
import path from "path";

const SHEET_INVERSIONES = "Inversiones";
const SHEET_ET_DE = "ET_DE";
const SHEET_AVANCE_FISICO = "Avance Fisico";
const SHEET_CONTRATOS = "Contratos";

function sheetToRows(workbook, sheetName) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.warn(`Sheet "${sheetName}" not found`);
    return [];
  }
  // The sheet has title/metadata rows before the real header.
  // Find the row that contains "CUI" as the first real header.
  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: null });
  const headerRowIdx = raw.findIndex(
    (r) => Array.isArray(r) && r.some((cell) => String(cell ?? "").trim() === "CUI")
  );
  if (headerRowIdx === -1) {
    console.warn(`Could not find header row in sheet "${sheetName}"`);
    return [];
  }
  return XLSX.utils.sheet_to_json(sheet, { defval: null, range: headerRowIdx });
}

function normalizeKey(row, candidates) {
  for (const key of Object.keys(row)) {
    if (candidates.includes(key.trim())) return key;
  }
  return null;
}

function getCUI(row) {
  const key = normalizeKey(row, ["CUI", "Cui", "cui"]);
  if (!key) return null;
  const val = row[key];
  return val !== null && val !== undefined ? String(val).trim() : null;
}

function extractData(filePath) {
  const workbook = XLSX.readFile(filePath);

  const inversionesRows = sheetToRows(workbook, SHEET_INVERSIONES);
  const etDeRows = sheetToRows(workbook, SHEET_ET_DE);
  const avanceFisicoRows = sheetToRows(workbook, SHEET_AVANCE_FISICO);
  const contratosRows = sheetToRows(workbook, SHEET_CONTRATOS);

  const result = {};

  for (const row of inversionesRows) {
    const cui = getCUI(row);
    if (!cui) continue;
    result[cui] = {
      cui,
      inversion: row,
      et_de: [],
      avance_fisico: [],
      contratos: [],
    };
  }

  for (const row of etDeRows) {
    const cui = getCUI(row);
    if (!cui) continue;
    if (!result[cui]) result[cui] = { cui, inversion: null, et_de: [], avance_fisico: [], contratos: [] };
    result[cui].et_de.push(row);
  }

  for (const row of avanceFisicoRows) {
    const cui = getCUI(row);
    if (!cui) continue;
    if (!result[cui]) result[cui] = { cui, inversion: null, et_de: [], avance_fisico: [], contratos: [] };
    result[cui].avance_fisico.push(row);
  }

  for (const row of contratosRows) {
    const cui = getCUI(row);
    if (!cui) continue;
    if (!result[cui]) result[cui] = { cui, inversion: null, et_de: [], avance_fisico: [], contratos: [] };
    result[cui].contratos.push(row);
  }

  return Object.values(result);
}

export { extractData };

if (import.meta.main) {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error("Usage: bun extractData.js <path-to-excel>");
    process.exit(1);
  }

  const data = extractData(inputFile);

  const baseName = path.basename(inputFile, path.extname(inputFile));
  const outputFile = path.join(path.dirname(inputFile), `${baseName}.json`);

  writeFileSync(outputFile, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Extracted ${data.length} CUIs → ${outputFile}`);
}
