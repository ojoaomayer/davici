import fs from 'fs'
import path from 'path'

export interface SinapiItem {
  codigo: string
  descricao: string
  unidade: string
  tipo: 'composicao' | 'insumo'
  precos_nao_desonerado: Record<string, number>
  precos_desonerado: Record<string, number>
}

let cachedDb: SinapiItem[] | null = null

export function getSinapiDb(): SinapiItem[] {
  if (cachedDb) return cachedDb

  const dbPath = path.resolve(process.cwd(), 'data/sinapi_db.json')
  if (!fs.existsSync(dbPath)) {
    console.error('Database file data/sinapi_db.json not found!')
    return []
  }

  try {
    const raw = fs.readFileSync(dbPath, 'utf8')
    cachedDb = JSON.parse(raw)
    console.log(`Loaded ${cachedDb?.length} items from SINAPI database into memory.`)
  } catch (err) {
    console.error('Error loading SINAPI database:', err)
    cachedDb = []
  }

  return cachedDb || []
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const STOP_WORDS = new Set([
  'de', 'da', 'do', 'das', 'dos', 'em', 'com', 'sem', 'para', 'por', 'e', 'ou',
  'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'no', 'na', 'nos', 'nas',
  'se', 'ao', 'aos', 'af', 'utilizando', 'atraves', 'ate'
])

export interface SearchResult {
  match: {
    id: string
    codigo: string
    descricao: string
    unidade: string
    custo_desonerado: number
    custo_nao_desonerado: number
    tipo: string
    match_score: number
    status: 'alto' | 'medio' | 'baixo'
    justificativa: string
  } | null
  candidates: Array<{
    id: string
    codigo: string
    descricao: string
    unidade: string
    custo_desonerado: number
    custo_nao_desonerado: number
    tipo: string
    match_score: number
  }>
  judgment?: {
    matched_codigo?: string
    match_score?: number
    justificativa?: string
    status?: 'alto' | 'medio' | 'baixo'
  }
}

export function searchSinapiItem(
  item: { descricao: string; unidade?: string; quantidade?: number; codigo_usuario?: string | number },
  uf = 'PR',
  limit = 5
): SearchResult {
  const db = getSinapiDb()
  const upperUf = (uf || 'PR').toUpperCase()

  // 1. Direct code lookup if user provided one
  if (item.codigo_usuario) {
    const cleanCode = String(item.codigo_usuario).trim()
    const exact = db.find(d => d.codigo === cleanCode)
    if (exact) {
      const matchObj = {
        id: exact.codigo,
        codigo: exact.codigo,
        descricao: exact.descricao,
        unidade: exact.unidade,
        custo_desonerado: exact.precos_desonerado[upperUf] || 0,
        custo_nao_desonerado: exact.precos_nao_desonerado[upperUf] || 0,
        tipo: exact.tipo,
        match_score: 100,
        status: 'alto' as const,
        justificativa: `Match direto pelo código SINAPI ${cleanCode} informado.`,
      }
      return {
        match: matchObj,
        candidates: [matchObj],
        judgment: {
          matched_codigo: exact.codigo,
          match_score: 100,
          status: 'alto',
          justificativa: `Match direto pelo código SINAPI ${cleanCode}.`,
        }
      }
    }
  }

  // 2. Tokenized search
  const normQuery = normalize(item.descricao || '')
  const queryTokens = normQuery.split(' ').filter(t => t.length > 2 && !STOP_WORDS.has(t))

  if (queryTokens.length === 0) {
    return { match: null, candidates: [] }
  }

  const scored: Array<{ item: SinapiItem; score: number }> = []

  for (const dbItem of db) {
    const normDesc = normalize(dbItem.descricao)

    let matchedWeight = 0
    let totalWeight = 0

    for (const token of queryTokens) {
      const weight = token.length >= 6 || /\d/.test(token) ? 2 : 1
      totalWeight += weight

      if (normDesc.includes(token)) {
        matchedWeight += weight
      }
    }

    const tokenScore = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0

    // Boost if consecutive words or item type match
    let boost = 0
    if (normQuery.length >= 15 && normDesc.includes(normQuery.slice(0, 25))) {
      boost += 20
    }
    // Boost unit compatibility
    if (item.unidade && dbItem.unidade && normalize(item.unidade) === normalize(dbItem.unidade)) {
      boost += 5
    }
    // Composicoes get preference for construction tasks
    if (dbItem.tipo === 'composicao') {
      boost += 5
    }

    const finalScore = Math.min(100, Math.round(tokenScore + boost))

    if (finalScore >= 35) {
      scored.push({ item: dbItem, score: finalScore })
    }
  }

  scored.sort((a, b) => b.score - a.score)

  const topCandidates = scored.slice(0, limit).map(s => ({
    id: s.item.codigo,
    codigo: s.item.codigo,
    descricao: s.item.descricao,
    unidade: s.item.unidade,
    custo_desonerado: s.item.precos_desonerado[upperUf] || 0,
    custo_nao_desonerado: s.item.precos_nao_desonerado[upperUf] || 0,
    tipo: s.item.tipo,
    match_score: s.score,
  }))

  if (topCandidates.length === 0) {
    return { match: null, candidates: [] }
  }

  const best = topCandidates[0]
  let status: 'alto' | 'medio' | 'baixo' = 'baixo'
  if (best.match_score >= 70) status = 'alto'
  else if (best.match_score >= 45) status = 'medio'

  const matchObj = {
    ...best,
    status,
    justificativa: `Melhor correspondência técnica encontrada no banco SINAPI (${best.match_score}% similaridade).`,
  }

  return {
    match: matchObj,
    candidates: topCandidates,
    judgment: {
      matched_codigo: best.codigo,
      match_score: best.match_score,
      status,
      justificativa: matchObj.justificativa,
    }
  }
}
