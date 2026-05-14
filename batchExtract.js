import { readdirSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { extractData } from "./extractData.js";

const INPUT_DIR = path.join(import.meta.dir, "descarga_opmis");
const OUTPUT_DIR = path.join(import.meta.dir, "descarga_opmis_json");

mkdirSync(OUTPUT_DIR, { recursive: true });

const files = readdirSync(INPUT_DIR).filter((f) => f.endsWith(".xlsx"));

console.log(`Processing ${files.length} files...`);

let ok = 0;
let errors = 0;

for (const file of files) {
  const inputFile = path.join(INPUT_DIR, file);
  const baseName = path.basename(file, ".xlsx");
  const outputFile = path.join(OUTPUT_DIR, `${baseName}.json`);
  try {
    const data = extractData(inputFile);
    writeFileSync(outputFile, JSON.stringify(data, null, 2), "utf-8");
    ok++;
    if (ok % 50 === 0) console.log(`  ${ok}/${files.length} done...`);
  } catch (err) {
    console.error(`  ERROR [${file}]: ${err.message}`);
    errors++;
  }
}

console.log(`\nDone. ${ok} converted, ${errors} errors → ${OUTPUT_DIR}`);
