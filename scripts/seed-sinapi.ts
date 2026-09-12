import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import OpenAI from 'openai'
import * as xlsx from 'xlsx'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const openaiKey = process.env.GEMINI_API_KEY!

if (!openaiKey) {
  console.error("Missing GEMINI_API_KEY environment variable. Check .env")
  process.exit(1)
}

try {
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  let serviceAccount;
  if (serviceAccountRaw) {
    serviceAccount = JSON.parse(serviceAccountRaw);
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
  }

  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY not found. Falling back to application default credentials.");
    initializeApp();
  }
} catch (error) {
  console.error('Firebase admin initialization error', error);
  process.exit(1);
}

const db = getFirestore();
const openai = new OpenAI({ apiKey: openaiKey, baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/' })

const BATCH_SIZE = 100

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error("Usage: npx tsx scripts/seed-sinapi.ts <path-to-excel-file>")
    process.exit(1)
  }

  console.log(`Loading file: ${filePath}`)
  const workbook = xlsx.readFile(filePath)
  
  const sheetName = 'ISD'
  if (!workbook.Sheets[sheetName]) {
    console.error(`Aba ${sheetName} não encontrada no arquivo Excel!`)
    process.exit(1)
  }
  const sheet = workbook.Sheets[sheetName]
  
  // SINAPI files have 9 rows of headers before the actual data starts (0-indexed range: 9)
  const data = xlsx.utils.sheet_to_json(sheet, { range: 9 }) as any[]
  console.log(`Found ${data.length} rows. Processing...`)

  let batch = []
  
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    
    // Map Excel columns to our schema
    // Adjust these column names based on the actual SINAPI excel file structure
    const codigo = String(row['CÓDIGO'] || row['CODIGO'] || row['Código do\r\nInsumo'] || row['Código do Insumo'] || '').trim()
    const descricao = String(row['DESCRIÇÃO'] || row['DESCRICAO'] || row['Descrição do Insumo'] || '').trim()
    const unidade = String(row['UNIDADE'] || row['UNID'] || row['Unidade'] || '').trim()
    
    // For SINAPI, price usually comes in the column of the State (e.g., 'PR')
    const valPR = row['PR']
    const preco = typeof valPR === 'number' ? valPR : parseFloat(String(valPR || '0').replace(',', '.'))
    
    if (!codigo || !descricao || codigo === 'undefined' || descricao === 'undefined') continue

    batch.push({
      codigo,
      descricao,
      unidade,
      custo_desonerado: preco, // Using the same price for both for this MVP
      custo_nao_desonerado: preco,
      uf: 'PR',
      mes_ano: '01/2026'
    })

    if (batch.length >= BATCH_SIZE || i === data.length - 1) {
      await processBatch(batch)
      batch = []
      
      // No delay needed since we aren't using the Gemini API anymore
    }
  }
  
  console.log("Done seeding SINAPI items.")
}

async function processBatch(items: any[], retries = 3) {
  console.log(`Processing batch of ${items.length} items...`)
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      // Skip generating embeddings due to quota limits
      // We just use the items as they are
      const payload = items.map((item) => ({ ...item }))

      // Insert into Firestore using a Batch
      const batchOps = db.batch();
      payload.forEach(item => {
        const docRef = db.collection('sinapi_itens').doc(item.codigo); // Use codigo as document ID to prevent duplicates
        const docData = { ...item };
        
        // If there was any embedding logic, it would go here.
        // We delete it so merge:true doesn't overwrite existing embeddings from earlier runs.
        delete docData.embedding;
        
        batchOps.set(docRef, docData, { merge: true });
      });

      await batchOps.commit();
      console.log(`Successfully inserted ${items.length} items to Firestore.`);
      return; // Success, exit retry loop
      
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error instanceof Error ? error.message : String(error));
      if (attempt < retries) {
        const delay = 65000; // wait slightly more than 1 minute to clear quota
        console.log(`Waiting ${delay / 1000} seconds before retrying...`);
        await new Promise(r => setTimeout(r, delay));
      } else {
        console.error("Failed to process batch after max retries.");
      }
    }
  }
}

main().catch(console.error)
