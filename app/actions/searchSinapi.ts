'use server'

import { getSinapiDb, SinapiItem } from '@/lib/sinapi-search'

export interface SinapiSearchResult {
  codigo: string
  descricao: string
  unidade: string
  tipo: 'composicao' | 'insumo'
  custo_desonerado: number
  custo_nao_desonerado: number
}

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export async function searchSinapi(
  query: string = '',
  uf: string = 'PR',
  tipo: 'todos' | 'composicao' | 'insumo' = 'todos',
  limit: number = 50,
  page: number = 1
): Promise<{ items: SinapiSearchResult[]; total: number }> {
  try {
    const db = getSinapiDb()
    const upperUf = (uf || 'PR').toUpperCase()

    let filtered = db

    // Filter by type
    if (tipo === 'composicao') {
      filtered = filtered.filter(item => item.tipo === 'composicao')
    } else if (tipo === 'insumo') {
      filtered = filtered.filter(item => item.tipo === 'insumo')
    }

    // Filter by text query if provided
    if (query && query.trim() !== '') {
      const cleanQuery = query.trim()
      const isNumericCode = /^\d+$/.test(cleanQuery)

      if (isNumericCode) {
        // Direct or prefix code match
        filtered = filtered.filter(item => String(item.codigo).startsWith(cleanQuery))
      } else {
        const normQuery = normalize(cleanQuery)
        const tokens = normQuery.split(/\s+/).filter(t => t.length >= 2)

        filtered = filtered.filter(item => {
          const normDesc = normalize(item.descricao)
          // All tokens must be present
          return tokens.every(token => normDesc.includes(token))
        })
      }
    }

    const total = filtered.length
    const startIndex = (page - 1) * limit
    const paginated = filtered.slice(startIndex, startIndex + limit)

    const items: SinapiSearchResult[] = paginated.map(item => ({
      codigo: item.codigo,
      descricao: item.descricao,
      unidade: item.unidade,
      tipo: item.tipo,
      custo_desonerado: item.precos_desonerado[upperUf] || 0,
      custo_nao_desonerado: item.precos_nao_desonerado[upperUf] || 0,
    }))

    return { items, total }
  } catch (error) {
    console.error('Error searching SINAPI items:', error)
    return { items: [], total: 0 }
  }
}
