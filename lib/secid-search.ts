import fs from 'fs'
import path from 'path'

export interface SecidItem {
  id: string
  codigo: string
  descricao: string
  unidade: string
  tipo: string
  origem: 'SECID_PR'
  resolucao?: string
  custo_desonerado: number
  custo_nao_desonerado: number
  precos_nao_desonerado: Record<string, number>
  precos_desonerado: Record<string, number>
  observacao?: string
  embedding?: number[]
}

let cachedSecidDb: SecidItem[] | null = null

export function getSecidDb(): SecidItem[] {
  if (cachedSecidDb && cachedSecidDb.length > 0) return cachedSecidDb

  const dbPath = path.resolve(process.cwd(), 'data/secid_db.json')
  if (!fs.existsSync(dbPath)) {
    console.warn('Database file data/secid_db.json not found!')
    return []
  }

  try {
    const raw = fs.readFileSync(dbPath, 'utf8')
    cachedSecidDb = JSON.parse(raw)
    console.log(`Loaded ${cachedSecidDb?.length} items from SECID/PR database into memory.`)
  } catch (err) {
    console.error('Error loading SECID database:', err)
    cachedSecidDb = []
  }

  return cachedSecidDb || []
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
  'se', 'ao', 'aos', 'af', 'utilizando', 'atraves', 'ate', 'sobre', 'sob'
])

// Termos sinônimos essenciais em orçamentos de projetos de engenharia e arquitetura
const SYNONYMS: Record<string, string[]> = {
  'eletrico': ['eletrica', 'eletricas', 'eletricos', 'telecomunicacoes', 'energia', 'spda', 'copel', 'cabeamento'],
  'hidrossanitario': ['hidrossanitaria', 'hidraulica', 'hidraulico', 'pluvial', 'esgoto', 'agua', 'drenagem'],
  'incendio': ['ppci', 'bombeiros', 'prevencao', 'panico', 'desastres', 'combate'],
  'arquiteto': ['arquitetura', 'arquitetonico', 'arquitetonica', 'anteprojeto', 'executivo', 'urbanismo'],
  'concreto': ['armado', 'superestrutura', 'vigas', 'pilares', 'lajes'],
  'estrutural': ['estrutura', 'estruturas', 'calculo', 'dimensionamento'],
  'fundacao': ['fundacoes', 'estacas', 'sapatas', 'blocos', 'tubuloes'],
  'metalico': ['metalica', 'metalicas', 'aco', 'galpao', 'cobertura'],
  'sondagem': ['spt', 'subsolo', 'percussao', 'geologica', 'furo'],
  'topografia': ['topografico', 'topografica', 'planialtimetrico', 'planialtimetria', 'agrimensura', 'nivelamento'],
  'climatizacao': ['hvac', 'ar condicionado', 'ventilacao', 'exaustao', 'pmoc'],
  'fotovoltaico': ['solar', 'geracao', 'modulos', 'inversor'],
  'orcamento': ['quantitativos', 'custos', 'composicao', 'sinapi', 'bdi'],
  'compatibilizacao': ['coordenacao', 'bim', 'clash', 'interferencias'],
  'laudo': ['vistoria', 'pericia', 'cautelar', 'inspecao', 'parecer'],
  'consultoria': ['honorario', 'honorarios', 'hora tecnica', 'parecer']
}

export interface SecidSearchResult {
  match: {
    id: string
    codigo: string
    descricao: string
    unidade: string
    custo_desonerado: number
    custo_nao_desonerado: number
    tipo: string
    origem: 'SECID_PR'
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
    origem: 'SECID_PR'
    match_score: number
  }>
  judgment?: {
    matched_codigo?: string
    match_score?: number
    justificativa?: string
    status?: 'alto' | 'medio' | 'baixo'
  }
}

export function searchSecidItem(
  item: { descricao: string; unidade?: string; quantidade?: number; codigo_usuario?: string | number },
  limit = 5
): SecidSearchResult {
  const db = getSecidDb()

  // 1. Direct code lookup if user provided one
  if (item.codigo_usuario) {
    const rawCode = String(item.codigo_usuario).trim().toUpperCase()
    const cleanCode = rawCode.replace(/^SECID-?/, '')
    const exact = db.find(d => {
      const dbClean = d.codigo.replace(/^SECID-?/, '')
      return d.codigo.toUpperCase() === rawCode || dbClean === cleanCode || d.id === rawCode
    })

    if (exact) {
      const matchObj = {
        id: exact.codigo,
        codigo: exact.codigo,
        descricao: exact.descricao,
        unidade: exact.unidade,
        custo_desonerado: exact.custo_desonerado,
        custo_nao_desonerado: exact.custo_nao_desonerado,
        tipo: exact.tipo || 'projeto_servico_tecnico',
        origem: 'SECID_PR' as const,
        match_score: 100,
        status: 'alto' as const,
        justificativa: `Match direto pelo código oficial SECID/PR (${exact.codigo}) informado.`,
      }
      return {
        match: matchObj,
        candidates: [matchObj],
        judgment: {
          matched_codigo: exact.codigo,
          match_score: 100,
          status: 'alto',
          justificativa: `Match direto pelo código SECID/PR ${exact.codigo}.`,
        }
      }
    }
  }

  // 2. Tokenized & semantic keyword search
  const normQuery = normalize(item.descricao || '')
  const queryTokens = normQuery.split(' ').filter(t => t.length > 2 && !STOP_WORDS.has(t))

  if (queryTokens.length === 0) {
    return { match: null, candidates: [] }
  }

  // Expansão de sinônimos na query
  const expandedTokens = new Set<string>(queryTokens)
  for (const token of queryTokens) {
    for (const [key, list] of Object.entries(SYNONYMS)) {
      if (token.includes(key) || list.some(syn => token.includes(syn))) {
        expandedTokens.add(key)
        list.forEach(syn => expandedTokens.add(syn))
      }
    }
  }

  const scored: Array<{ item: SecidItem; score: number }> = []

  for (const dbItem of db) {
    const normDesc = normalize(dbItem.descricao)
    const normObs = normalize(dbItem.observacao || '')

    let matchedWeight = 0
    let totalWeight = 0

    for (const token of Array.from(expandedTokens)) {
      const isCoreWord = token.length >= 5
      const weight = isCoreWord ? 2 : 1
      totalWeight += weight

      if (normDesc.includes(token)) {
        matchedWeight += weight * 1.2
      } else if (normObs.includes(token)) {
        matchedWeight += weight * 0.7
      }
    }

    const tokenScore = totalWeight > 0 ? (matchedWeight / totalWeight) * 100 : 0

    let boost = 0
    // Exact phrase or consecutive words
    if (normQuery.length >= 10 && normDesc.includes(normQuery.slice(0, 20))) {
      boost += 25
    }
    // Unit match (m² com m², furo com furo, hora com hora)
    if (item.unidade && dbItem.unidade) {
      const u1 = normalize(item.unidade)
      const u2 = normalize(dbItem.unidade)
      if (u1 === u2 || (u1.includes('m2') && u2.includes('m2')) || (u1.includes('h') && u2.includes('h'))) {
        boost += 15
      }
    }

    const finalScore = Math.min(100, Math.round(tokenScore + boost))

    if (finalScore >= 30) {
      scored.push({ item: dbItem, score: finalScore })
    }
  }

  scored.sort((a, b) => b.score - a.score)

  const topCandidates = scored.slice(0, limit).map(s => ({
    id: s.item.codigo,
    codigo: s.item.codigo,
    descricao: s.item.descricao,
    unidade: s.item.unidade,
    custo_desonerado: s.item.custo_desonerado,
    custo_nao_desonerado: s.item.custo_nao_desonerado,
    tipo: s.item.tipo || 'projeto_servico_tecnico',
    origem: 'SECID_PR' as const,
    match_score: s.score,
  }))

  if (topCandidates.length === 0) {
    return { match: null, candidates: [] }
  }

  const best = topCandidates[0]
  let status: 'alto' | 'medio' | 'baixo' = 'baixo'
  if (best.match_score >= 68) status = 'alto'
  else if (best.match_score >= 40) status = 'medio'

  const matchObj = {
    ...best,
    status,
    justificativa: `Melhor correspondência técnica na tabela de Serviços Técnicos da SECID/PR (${best.match_score}% similaridade).`,
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
