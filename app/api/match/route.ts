import { NextResponse } from 'next/server'
import { openai } from '@/lib/openai'
import { searchSinapiItem } from '@/lib/sinapi-search'

// Next.js route segment config — allow up to 5 minutes for large spreadsheets
export const maxDuration = 300

async function processItem(item: any, filter_uf: string) {
  // 1. Search SINAPI items (composições e insumos) using local database
  const searchResult = searchSinapiItem(item, filter_uf, 5)

  if (!searchResult.candidates || searchResult.candidates.length === 0) {
    return {
      original: item,
      match: null,
      candidates: [],
      judgment: { status: 'baixo', match_score: 0, justificativa: 'Nenhuma correspondência encontrada no SINAPI.' },
    }
  }

  // If we already have a direct code match, return immediately
  if (searchResult.match && searchResult.match.match_score === 100 && item.codigo_usuario) {
    return {
      original: item,
      match: searchResult.match,
      candidates: searchResult.candidates,
      judgment: searchResult.judgment,
      via: 'codigo_direto',
    }
  }

  const candidates = searchResult.candidates
  let defaultMatch = searchResult.match

  // 2. Try AI judgment if API key is present and candidates exist
  const prompt = `
Você é um Engenheiro Civil orçamentista sênior especialista na base SINAPI.
Seu objetivo é analisar um item da planilha do usuário e escolher a melhor correspondência (match) entre as 5 opções candidatas da base SINAPI fornecidas.

CRITÉRIOS TÉCNICOS RÍGIDOS:
- Avalie a similaridade de materiais, dimensões, produtividade e processo executivo.
- Verifique a compatibilidade de unidade de medida (ex: se o usuário quer m², a opção em m³ é incompatível).
- Se não houver correspondência minimamente adequada, o status deve ser "baixo" e o match_codigo deve ser nulo.

Item do Usuário:
Descrição: ${item.descricao}
Unidade: ${item.unidade || 'N/A'}
Quantidade: ${item.quantidade}

Candidatos SINAPI:
${candidates.map((c: any, i: number) => `[Candidato ${i + 1}] Código: ${c.codigo} | Descrição: ${c.descricao} | Unidade: ${c.unidade} | R$ ${c.custo_nao_desonerado}`).join('\n')}

Retorne APENAS um JSON válido seguindo a exata estrutura abaixo, sem marcações markdown:
{
  "matched_codigo": "codigo_do_candidato_escolhido_ou_null",
  "match_score": 85,
  "justificativa": "Sua justificativa técnica de engenharia",
  "status": "alto"
}
`

  let judgment: any = null

  try {
    const aiResponse = await openai.chat.completions.create({
      model: 'gemini-3.6-flash',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    })
    judgment = JSON.parse(aiResponse.choices[0].message.content || '{}')
  } catch (error: any) {
    console.warn(`AI Judgment unavailable (${error.status || error.message}), using best candidate ranking:`, error.message?.slice(0, 100))
  }

  // If AI selected a valid candidate, use it
  if (judgment && judgment.matched_codigo) {
    const aiSelected = candidates.find((c: any) => String(c.codigo) === String(judgment.matched_codigo))
    if (aiSelected) {
      return {
        original: item,
        match: {
          ...aiSelected,
          ...judgment,
        },
        candidates,
        judgment,
      }
    }
  }

  // Fallback: If AI is in 429 quota limit or couldn't pick, use the top candidate with local justification
  const fallbackMatch = defaultMatch || candidates[0]
  const fallbackStatus = (defaultMatch as any)?.status || (fallbackMatch?.match_score >= 70 ? 'alto' : fallbackMatch?.match_score >= 45 ? 'medio' : 'baixo')
  const fallbackJustificativa = (defaultMatch as any)?.justificativa || `Melhor correspondência técnica encontrada no banco SINAPI (${fallbackMatch?.match_score || 0}% similaridade).`

  const fallbackJudgment = {
    matched_codigo: fallbackMatch?.codigo,
    match_score: fallbackMatch?.match_score || 70,
    status: fallbackStatus,
    justificativa: fallbackJustificativa,
  }

  return {
    original: item,
    match: fallbackMatch ? { ...fallbackMatch, ...fallbackJudgment } : null,
    candidates,
    judgment: fallbackJudgment,
  }
}

export async function POST(request: Request) {
  try {
    const { items, filter_uf = 'PR' } = await request.json()

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 })
    }

    const BATCH_SIZE = 10
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
