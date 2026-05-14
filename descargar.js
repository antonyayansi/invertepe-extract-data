import { mkdir } from "fs/promises";
import { existsSync, readFileSync } from "fs";
import path from "path";

const OUTPUT_DIR = "./descarga_opmis";

const COOKIES =
  "visid_incap_2825906=rCV47Ga0TAecnwSYoYcd25kZ8GkAAAAAQUIPAAAAAACBtt5BvXi904u2opBjg8C3; JSESSIONID=342689034.20480.0000; f5avr1604567244aaaaaaaaaaaaaaaa_cspm_=KJDEOEPDAEIHLKCPFJJMFAAANNCCLDBDEDGOOEDPLNKAJOBLBIKEJMENNAONMHKADFICJBIJBOHOLJNCADPADOJBAMKEOLIPOCCMLKCADACMOEICMCPCGIGFIKBEBLKF";

const BASE_HEADERS = {
  "Accept-Language": "es-419,es;q=0.7",
  Connection: "keep-alive",
  Cookie: COOKIES,
  Origin: "https://ofi5.mef.gob.pe",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "Sec-GPC": "1",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "sec-ch-ua": '"Chromium";v="148", "Brave";v="148", "Not/A)Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
};

async function traeOPMI(opmi) {
  const res = await fetch(
    "https://ofi5.mef.gob.pe/invierteWS/Repseguim/traeOPMI",
    {
      method: "POST",
      headers: {
        ...BASE_HEADERS,
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Referer: `https://ofi5.mef.gob.pe/inviertews/Repseguim/RepOpmi?opmi=${opmi}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      body: `id=${opmi}`,
    }
  );

  if (!res.ok) throw new Error(`traeOPMI HTTP ${res.status}`);
  const data = await res.json();
//   console.log(data)
  const sector = data[0].COD_SECTOR;
  const pliego = data[0].COD_PLIEGO;
  if (sector == null || pliego == null || sector === "" || pliego === "") {
    throw new Error(`Sin COD_SECTOR/COD_PLIEGO (sector=${sector}, pliego=${pliego}, nivel=${data.NIVEL})`);
  }
  return { sector, pliego };
}

async function descargarExcel(opmi, sector, pliego) {
  const body = JSON.stringify({
    sector,
    pliego,
    tipo: "GL",
    pim_bus: "Todos",
    plie_bus: "Todos",
    uei_bus: "Todas",
    est_bus: "Todos",
    tinv_bus: "Todos",
    var_datgral:
      "Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No,No",
    var_et: "Yes,Yes,Yes,Yes,Yes,Yes,Yes",
    var_avfis:
      "Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes",
    var_contr: "Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes,Yes",
  });

  const res = await fetch(
    "https://ofi5.mef.gob.pe/invierteWS/Repseguim/expRepOPMIDet",
    {
      method: "POST",
      headers: {
        ...BASE_HEADERS,
        Accept: "*/*",
        "Content-Type": "application/json; charset=UTF-8",
        Referer: `https://ofi5.mef.gob.pe/inviertews/Repseguim/RepOpmi?opmi=${opmi}`,
      },
      body,
    }
  );

  if (!res.ok) throw new Error(`expRepOPMIDet HTTP ${res.status}`);
  const buffer = await res.arrayBuffer();
  const filePath = path.join(OUTPUT_DIR, `opmi_${opmi}.xlsx`);
  await Bun.write(filePath, buffer);
  return filePath;
}

// Leer lista de OPMIs
const opmis = readFileSync("./opmis.txt", "utf-8")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l.length > 0);

if (!existsSync(OUTPUT_DIR)) {
  await mkdir(OUTPUT_DIR, { recursive: true });
}

console.log(`Procesando ${opmis.length} OPMIs...`);

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

for (let i = 0; i < opmis.length; i++) {
  const opmi = opmis[i];
  try {
    const { sector, pliego } = await traeOPMI(opmi);
    const filePath = await descargarExcel(opmi, sector, pliego);
    console.log(`[${i + 1}/${opmis.length}] ✓ OPMI ${opmi} (sector=${sector} pliego=${pliego}) → ${filePath}`);
  } catch (err) {
    console.error(`[${i + 1}/${opmis.length}] ✗ OPMI ${opmi}: ${err.message}`);
  }
  await delay(300);
}
