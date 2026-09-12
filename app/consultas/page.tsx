'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Loader2, Database, Copy, Check, Filter, Layers, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import { searchSinapi, SinapiSearchResult } from '@/app/actions/searchSinapi'

import AnimatedCounter from '@/components/AnimatedCounter'

const UFS = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN',
  'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'
]

export default function ConsultasPage() {
  const [query, setQuery] = useState('')
  const [uf, setUf] = useState('PR')
  const [tipo, setTipo] = useState<'todos' | 'composicao' | 'insumo'>('todos')
  const [page, setPage] = useState(1)
  const pageSize = 50

  const [results, setResults] = useState<SinapiSearchResult[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const fetchItems = useCallback(async (q: string, selectedUf: string, selectedTipo: 'todos' | 'composicao' | 'insumo', p: number) => {
    setIsLoading(true)
    try {
      const { items, total } = await searchSinapi(q, selectedUf, selectedTipo, pageSize, p)
      setResults(items)
      setTotalCount(total)
    } catch (error) {
      console.error('Failed to search SINAPI:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems(query, uf, tipo, page)
  }, [fetchItems, query, uf, tipo, page])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchItems(query, uf, tipo, 1)
  }

  const handleCopyCode = (codigo: string) => {
    navigator.clipboard.writeText(codigo)
    setCopiedCode(codigo)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
  }

  const totalPages = Math.ceil(totalCount / pageSize) || 1

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Base Oficial SINAPI 08/2026 • 15.420 Itens Indexados</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              Consulta de Preços & Serviços SINAPI
            </h1>
            <p className="text-xs text-zinc-400">
              Pesquise composições de serviços e insumos em tempo real para todos os 27 estados do Brasil.
            </p>
          </div>

          {/* Quick UF Selector & Live Telemetry */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-md text-xs">
              <span className="text-zinc-500 font-mono font-medium">Estado / UF:</span>
              <select
                value={uf}
                onChange={(e) => { setUf(e.target.value); setPage(1); }}
                className="bg-zinc-950 text-zinc-100 font-mono font-bold text-xs p-1 rounded border border-zinc-700 cursor-pointer focus:outline-none"
              >
                {UFS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Social Proof & Platform Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/30 border border-zinc-800/80 rounded-lg p-3 text-xs font-mono">
          <div className="flex items-center gap-2.5 p-2 rounded bg-zinc-950/60 border border-zinc-800/40">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Consultas (30 dias)</div>
              <div className="text-sm font-bold text-zinc-100 tabular-nums">
                <AnimatedCounter
                  from={14750}
                  to={14832}
                  prefix="+"
                  enableLiveIncrement={true}
                  incrementIntervalMin={3500}
                  incrementIntervalMax={8000}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded bg-zinc-950/60 border border-zinc-800/40">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Consultas Hoje</div>
              <div className="text-sm font-bold text-zinc-100 tabular-nums">
                <AnimatedCounter
                  from={410}
                  to={428}
                  enableLiveIncrement={true}
                  incrementIntervalMin={4000}
                  incrementIntervalMax={9000}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded bg-zinc-950/60 border border-zinc-800/40">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Tempo de Resposta</div>
              <div className="text-sm font-bold text-emerald-400 tabular-nums">
                <AnimatedCounter
                  from={5}
                  to={17}
                  prefix="< "
                  suffix="ms"
                  duration={1000}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded bg-zinc-950/60 border border-zinc-800/40">
            <div className="w-2 h-2 rounded-full bg-zinc-400" />
            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Engenheiros Ativos</div>
              <div className="text-sm font-bold text-zinc-100 tabular-nums">
                <AnimatedCounter
                  from={360}
                  to={384}
                  suffix="+"
                  enableLiveIncrement={true}
                  incrementIntervalMin={12000}
                  incrementIntervalMax={25000}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-4 space-y-3">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-3.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Digite o código (ex: 105009) ou termos como 'locação gabarito', 'concreto 25 mpa', 'escavação'..."
              className="w-full pl-10 pr-24 py-2.5 bg-zinc-950 border border-zinc-800 rounded-md text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:border-zinc-700 outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setPage(1); }}
                className="absolute right-16 text-zinc-500 hover:text-zinc-300 text-xs px-2 py-1"
              >
                Limpar
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-2 px-3 py-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Buscar'}
            </button>
          </form>

          {/* Type Filter Pills & Counters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded border border-zinc-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => { setTipo('todos'); setPage(1); }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  tipo === 'todos' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Todos ({totalCount.toLocaleString('pt-BR')})
              </button>
              <button
                type="button"
                onClick={() => { setTipo('composicao'); setPage(1); }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  tipo === 'composicao' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Serviços / Composições
              </button>
              <button
                type="button"
                onClick={() => { setTipo('insumo'); setPage(1); }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  tipo === 'insumo' ? 'bg-zinc-800 text-zinc-100 font-semibold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Insumos
              </button>
            </div>

            <div className="text-xs font-mono text-zinc-500">
              Página {page} de {totalPages} ({totalCount} itens)
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-900/80 text-zinc-500 font-mono text-[11px] uppercase tracking-wider border-b border-zinc-800">
                  <th className="py-2.5 px-4 w-28 font-semibold">Código</th>
                  <th className="py-2.5 px-3 w-24 font-semibold">Tipo</th>
                  <th className="py-2.5 px-4 font-semibold">Descrição Oficial SINAPI</th>
                  <th className="py-2.5 px-3 w-16 text-center font-semibold">Unid.</th>
                  <th className="py-2.5 px-4 w-36 text-right font-semibold">Preço Não Deson. ({uf})</th>
                  <th className="py-2.5 px-4 w-36 text-right font-semibold">Preço Desonerado ({uf})</th>
                  <th className="py-2.5 px-3 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-mono">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-500">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                        <span>Consultando base SINAPI {uf}...</span>
                      </div>
                    </td>
                  </tr>
                ) : results.length > 0 ? (
                  results.map((item) => (
                    <tr key={item.codigo} className="hover:bg-zinc-900/40 transition-colors group">
                      {/* Código */}
                      <td className="py-3 px-4 font-bold text-zinc-200">
                        <span className="text-emerald-400">#{item.codigo}</span>
                      </td>

                      {/* Tipo */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${
                            item.tipo === 'composicao'
                              ? 'bg-blue-950/40 text-blue-400 border-blue-800/50'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                          }`}
                        >
                          {item.tipo === 'composicao' ? 'Serviço' : 'Insumo'}
                        </span>
                      </td>

                      {/* Descrição */}
                      <td className="py-3 px-4 font-sans text-zinc-300 max-w-xl">
                        <div className="line-clamp-2 leading-relaxed" title={item.descricao}>
                          {item.descricao}
                        </div>
                      </td>

                      {/* Unidade */}
                      <td className="py-3 px-3 text-center text-zinc-400 font-bold">
                        {item.unidade || 'UN'}
                      </td>

                      {/* Preço Não Desonerado */}
                      <td className="py-3 px-4 text-right font-semibold text-zinc-200 tabular-nums">
                        {item.custo_nao_desonerado > 0 ? formatCurrency(item.custo_nao_desonerado) : '-'}
                      </td>

                      {/* Preço Desonerado */}
                      <td className="py-3 px-4 text-right font-bold text-emerald-400 tabular-nums">
                        {item.custo_desonerado > 0 ? formatCurrency(item.custo_desonerado) : '-'}
                      </td>

                      {/* Copy Action */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => handleCopyCode(item.codigo)}
                          title="Copiar código SINAPI"
                          className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                        >
                          {copiedCode === item.codigo ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-500 space-y-1">
                      <div>Nenhum item encontrado para a busca &quot;{query}&quot;.</div>
                      <div className="text-[11px] text-zinc-600">Tente buscar por termos mais genéricos ou pelo código numérico.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="bg-zinc-900/80 px-4 py-3 border-t border-zinc-800 flex items-center justify-between text-xs font-mono">
              <div className="text-zinc-500">
                Mostrando {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, totalCount)} de {totalCount}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 disabled:opacity-40 flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>

                <span className="text-zinc-400 px-2">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 disabled:opacity-40 flex items-center gap-1 transition-colors"
                >
                  <span>Próximo</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
