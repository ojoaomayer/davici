import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import { openai } from '@/lib/openai'

// Next.js route segment config — allow up to 5 minutes for large spreadsheets
export const maxDuration = 300

async function processItem(item: any, filter_uf: string) {
  const queryText = `${item.descricao} (${item.unidade || ''})`

  // 1. Generate embedding
  let embedding: number[]
  try {
    const embedResponse = await openai.embeddings.create({
      model: 'gemini-embedding-2',
      input: queryText,
      dimensions: 768,
      encoding_format: 'float',
    })
    embedding = embedResponse.data[0].embedding
  } catch (error: any) {
    console.error('Embedding Error:', error)
    return { original: item, error: 'Embedding generation failed: ' + error.message }
  }

  // 2. Search Firestore for top 5 candidates via vector search
  let candidates: any[] = []
  try {
    const query = db.collection('sinapi_itens')
      .where('uf', '==', filter_uf)
      .findNearest('embedding', FieldValue.vector(embedding), {
        limit: 5,
        distanceMeasure: 'COSINE',
      })

    const snapshot = await query.get()
    // Strip 'embedding': it's a Firestore VectorValue (class instance),
    // not serializable by Next.js when passed to Client Components.
    candidates = snapshot.docs.map(doc => {
      const { embedding: _emb, ...rest } = doc.data() as any
      return { id: doc.id, ...rest }
    })
  } catch (error: any) {
    console.error('Firestore Vector Search Error:', error)
    return { original: item, error: 'Database search failed: ' + error.message }
  }

  if (!candidates || candidates.length === 0) {
    return { original: item, match: null, candidates: [] }
  }

  // 3. AI judgment to pick the best candidate
  const prompt = `
Você é um Engenheiro Civil orçamentista sênior especialista na base SINAPI.
Seu objetivo é analisar um item da planilha do usuário e escolher a melhor correspondência (match) entre as 5 opções candidatas da base SINAPI fornecidas via busca vetorial.

CRITÉRIOS TÉCNICOS RÍGIDOS:
- Avalie a similaridade de materiais, dimensões, produtividade e processo executivo.
- Verifique a compatibilidade de unidade de medida (ex: se o usuário quer m², a opção em m³ é incompatível).
- Se não houver correspondência minimamente adequada, o status deve ser "baixo" e o match_codigo deve ser nulo.

Item do Usuário:
Descrição: ${item.descricao}
Unidade: ${item.unidade || 'N/A'}
Quantidade: ${item.quantidade}

Candidatos SINAPI:
${candidates.map((c: any, i: number) => `[Candidato ${i + 1}] Código: ${c.codigo} | Descrição: ${c.descricao} | Unidade: ${c.unidade}`).join('\n')}

Retorne APENAS um JSON válido seguindo a exata estrutura abaixo, sem marcações markdown:
{
  "matched_codigo": "codigo_do_candidato_escolhido_ou_null",
  "match_score": 85,
  "justificativa": "Sua justificativa técnica de engenharia",
  "status": "alto"
}
`

  let judgment: any
  try {
    const aiResponse = await openai.chat.completions.create({
      model: 'gemini-3.6-flash',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    })
    judgment = JSON.parse(aiResponse.choices[0].message.content || '{}')
  } catch (error: any) {
    console.error('AI Judgment Error:', error)
    judgment = { status: 'baixo', match_score: 0, justificativa: 'Erro na análise da IA: ' + error.message }
  }

  const selectedMatch = candidates.find((c: any) => c.codigo === judgment.matched_codigo)

  return {
    original: item,
    match: selectedMatch ? { ...selectedMatch, ...judgment } : null,
    candidates,
    judgment,
  }
}

export async function POST(request: Request) {
  try {
    const { items, filter_uf = 'PR' } = await request.json()

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 })
    }

    const BATCH_SIZE = 5  // process 5 items concurrently to balance speed vs. rate limits
    const results: any[] = []

    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const batch = items.slice(i, i + BATCH_SIZE)
      console.log(`Processing items ${i + 1}–${Math.min(i + BATCH_SIZE, items.length)} of ${items.length}...`)
      const batchResults = await Promise.all(batch.map((item: any) => processItem(item, filter_uf)))
      results.push(...batchResults)
    }

    return NextResponse.json({ results })
  } catch (error: any) {
    console.error('Match API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}
