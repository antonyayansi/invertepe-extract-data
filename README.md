# ofi5

Scripts para descargar y procesar datos de inversiones públicas del portal [OFI5 (MEF Perú)](https://ofi5.mef.gob.pe).

## Instalación

```bash
bun install
```

## Scripts

### `index.js`
Descarga el directorio de inversiones por departamento desde el portal OFI5. Itera los 25 departamentos del Perú, hace un POST a la API de OFI5 y guarda cada respuesta como un archivo `.xlsx` en `descargas/`.

```bash
bun index.js
```

### `descargar.js`
Descarga el reporte detallado en Excel de cada OPMI listado en `opmis.txt`. Para cada ID:
1. Consulta `traeOPMI` para obtener el código de sector y pliego.
2. Llama a `expRepOPMIDet` para descargar el Excel con las hojas de Inversiones, ET_DE, Avance Físico y Contratos.
3. Guarda el archivo como `opmi_<id>.xlsx` en `descarga_opmis/`.

Incluye un delay de 300 ms entre solicitudes para no saturar el servidor.

```bash
bun descargar.js
```

> **Requisito:** actualizar las cookies en el encabezado `COOKIES` antes de ejecutar.

### `extractData.js`
Extrae y estructura los datos de un archivo `.xlsx` de OPMI en formato JSON. Lee las hojas `Inversiones`, `ET_DE`, `Avance Fisico` y `Contratos`, agrupa las filas por CUI y exporta un array de objetos con la forma:

```json
[{ "cui": "...", "inversion": {}, "et_de": [], "avance_fisico": [], "contratos": [] }]
```

Puede usarse como CLI o importando la función `extractData`.

```bash
bun extractData.js <ruta-al-excel>
```

### `batchExtract.js`
Procesa en lote todos los archivos `.xlsx` de `descarga_opmis/` usando `extractData.js` y guarda un `.json` por cada archivo en `descarga_opmis_json/`.

```bash
bun batchExtract.js
```

## Archivos de datos

| Archivo / Carpeta | Descripción |
|---|---|
| `opmis.txt` | Lista de IDs de OPMI a descargar (uno por línea) |
| `descargas/` | Excels del directorio de inversiones por departamento |
| `descarga_opmis/` | Excels individuales por OPMI |
| `descarga_opmis_json/` | JSONs extraídos de cada OPMI |
