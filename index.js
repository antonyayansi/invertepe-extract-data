import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const OUTPUT_DIR = "./descargas";

const HEADERS = {
  Accept: "*/*",
  "Accept-Language": "es-419,es;q=0.7",
  Connection: "keep-alive",
  "Content-Type": "application/json; charset=UTF-8",
  Cookie:
    "f5_cspm=1234; visid_incap_2825906=rCV47Ga0TAecnwSYoYcd25kZ8GkAAAAAQUIPAAAAAACBtt5BvXi904u2opBjg8C3; JSESSIONID=342689034.20480.0000",
  Origin: "https://ofi5.mef.gob.pe",
  Referer:
    "https://ofi5.mef.gob.pe/inviertePub/ConsultaPublica/DirectorioInvierte",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "Sec-GPC": "1",
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
  "sec-ch-ua":
    '"Chromium";v="148", "Brave";v="148", "Not/A)Brand";v="99"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"macOS"',
};

async function descargar(dpto) {
  const body = JSON.stringify({
    IDTIPO: "GR",
    IDROL: "7",
    SECTOR_ODI: "",
    U_DPTO: String(dpto),
    U_PROV: null,
    U_DIST: null,
    ENTIDAD: "",
  });

  const res = await fetch(
    "https://ofi5.mef.gob.pe/inviertePub/ConsultaPublica/DirectorioInvierteDescargar",
    { method: "POST", headers: HEADERS, body }
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} para DPTO ${dpto}`);
  }

  const buffer = await res.arrayBuffer();
  const filePath = path.join(OUTPUT_DIR, `dpto_${String(dpto).padStart(2, "0")}.xlsx`);
  await Bun.write(filePath, buffer);
  console.log(`✓ DPTO ${dpto} → ${filePath}`);
}

if (!existsSync(OUTPUT_DIR)) {
  await mkdir(OUTPUT_DIR, { recursive: true });
}

for (let dpto = 1; dpto <= 25; dpto++) {
  try {
    await descargar(dpto);
  } catch (err) {
    console.error(`✗ DPTO ${dpto}: ${err.message}`);
  }
}
