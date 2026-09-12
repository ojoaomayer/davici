import * as xlsx from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

const XLSX_PATH = 'scripts/SINAPI_Referência_2026_08.xlsx';
const OUTPUT_PATH = 'data/sinapi_db.json';

// State column mappings for CSD/CCD
// In CSD, row 10 has state headers:
// Let's dynamically find the column for each state
function extractAll() {
  console.log('Reading Excel file...');
  const wb = xlsx.readFile(XLSX_PATH, { sheets: ['CSD', 'CCD', 'ISD', 'ICD'] });

  // 1. Process Composições
  console.log('Extracting Composições (CSD & CCD)...');
  const sheetCSD = wb.Sheets['CSD'];
  const sheetCCD = wb.Sheets['CCD'];

  // Identify state columns from row 10 in CSD
  // Range A1:BF10557
  const states = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];
  
  // Find column letters for each state in CSD
  const csdColMap: Record<string, string> = {};
  const ccdColMap: Record<string, string> = {};

  // Find headers in row 9
  for (let c = 4; c <= 70; c++) {
    const colLetter = xlsx.utils.encode_col(c);
    const cellCSD = sheetCSD[`${colLetter}9`];
    if (cellCSD && cellCSD.v) {
      const v = String(cellCSD.v).trim().toUpperCase();
      if (states.includes(v)) csdColMap[v] = colLetter;
    }
    const cellCCD = sheetCCD ? sheetCCD[`${colLetter}9`] : null;
    if (cellCCD && cellCCD.v) {
      const v = String(cellCCD.v).trim().toUpperCase();
      if (states.includes(v)) ccdColMap[v] = colLetter;
    }
  }
  console.log('Found CSD state columns:', Object.keys(csdColMap).length, Object.keys(csdColMap));
  console.log('Found CCD state columns:', Object.keys(ccdColMap).length);

  const items: any[] = [];
  const codeRegex = /,\s*(\d{4,7})\s*\)/;
  const matchRegex = /MATCH\((\d{4,7})/;

  // Total rows in CSD ~ 10557
  for (let r = 11; r <= 10600; r++) {
    const bCell = sheetCSD[`B${r}`];
    const cCell = sheetCSD[`C${r}`];
    const dCell = sheetCSD[`D${r}`];
    if (!cCell || !cCell.v) continue;

    let codigo = '';
    if (bCell) {
      if (bCell.f) {
        const m = bCell.f.match(codeRegex) || bCell.f.match(matchRegex);
        if (m) codigo = m[1];
      }
      if (!codigo && bCell.v && bCell.v !== 0) {
        codigo = String(bCell.v);
      }
    }
    if (!codigo) continue;

    const descricao = String(cCell.v).trim();
    const unidade = dCell && dCell.v ? String(dCell.v).trim() : 'UN';

    // Prices by state
    const precos_nao_desonerado: Record<string, number> = {};
    const precos_desonerado: Record<string, number> = {};

    for (const st of states) {
      const colCSD = csdColMap[st];
      if (colCSD && sheetCSD[`${colCSD}${r}`]) {
        const p = parseFloat(sheetCSD[`${colCSD}${r}`].v) || 0;
        precos_nao_desonerado[st] = p;
      }
      const colCCD = ccdColMap[st];
      if (colCCD && sheetCCD && sheetCCD[`${colCCD}${r}`]) {
        const p = parseFloat(sheetCCD[`${colCCD}${r}`].v) || 0;
        precos_desonerado[st] = p;
      } else {
        precos_desonerado[st] = precos_nao_desonerado[st] || 0;
      }
    }

    items.push({
      codigo,
      descricao,
      unidade,
      tipo: 'composicao',
      precos_nao_desonerado,
      precos_desonerado,
    });
  }

  console.log(`Extracted ${items.length} composições!`);

  // 2. Process Insumos (ISD & ICD)
  console.log('Extracting Insumos (ISD)...');
  const sheetISD = wb.Sheets['ISD'];
  const isdRows = xlsx.utils.sheet_to_json(sheetISD, { range: 9 }) as any[];
  console.log(`ISD raw rows: ${isdRows.length}`);

  for (const row of isdRows) {
    const codigo = String(row['CÓDIGO'] || row['CODIGO'] || row['Código do\r\nInsumo'] || row['Código do Insumo'] || '').trim();
    const descricao = String(row['DESCRIÇÃO'] || row['DESCRICAO'] || row['Descrição do Insumo'] || '').trim();
    const unidade = String(row['UNIDADE'] || row['UNID'] || row['Unidade'] || '').trim();
    if (!codigo || !descricao || codigo === 'undefined' || isNaN(Number(codigo))) continue;

    const precos_nao_desonerado: Record<string, number> = {};
    const precos_desonerado: Record<string, number> = {};

    for (const st of states) {
      const val = row[st];
      const p = typeof val === 'number' ? val : parseFloat(String(val || '0').replace(',', '.')) || 0;
      precos_nao_desonerado[st] = p;
      precos_desonerado[st] = p;
    }

    items.push({
      codigo,
      descricao,
      unidade,
      tipo: 'insumo',
      precos_nao_desonerado,
      precos_desonerado,
    });
  }

  console.log(`Total database items (composições + insumos): ${items.length}`);

  if (!fs.existsSync('data')) fs.mkdirSync('data');
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(items));
  console.log(`Saved database to ${OUTPUT_PATH} (${(fs.statSync(OUTPUT_PATH).size / (1024 * 1024)).toFixed(2)} MB)`);
}

extractAll();
