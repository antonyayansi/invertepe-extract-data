import axios from "axios";
import { readdirSync, readFileSync } from "fs";
import path from "path";

const BASE_URL = process.env.BASE_BACKEND_URL;
if (!BASE_URL) {
  console.error("Falta BASE_BACKEND_URL en .env");
  process.exit(1);
}

const INPUT_DIR = path.join(import.meta.dir, "descarga_opmis_json");
const ENDPOINT = `${BASE_URL}/opmis`;

const files = readdirSync(INPUT_DIR).filter((f) => f.endsWith(".json"));
console.log(`Enviando ${files.length} archivos a ${ENDPOINT}...`);

let ok = 0;
let errors = 0;

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const filePath = path.join(INPUT_DIR, file);
  const data = JSON.parse(readFileSync(filePath, "utf-8"));

  try {
    await axios.post(ENDPOINT, data);
    ok++;
    if (ok % 50 === 0 || ok === files.length) {
      console.log(`  [${i + 1}/${files.length}] ✓ ${file}`);
    }
  } catch (err) {
    const status = err.response?.status ?? "sin respuesta";
    const body = err.response?.data
      ? JSON.stringify(err.response.data, null, 2)
      : "(sin cuerpo)";
    console.error(`  [${i + 1}/${files.length}] ✗ ${file} → HTTP ${status}: ${err.message}`);
    console.error(`    Detalle: ${body}`);
    errors++;
  }
}

console.log(`\nDone. ${ok} enviados, ${errors} errores.`);
