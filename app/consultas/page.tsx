'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Loader2, Database, Copy, Check, Filter, Layers, RefreshCw, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
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
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-500/30 selection:text-white flex flex-col relative overflow-hidden">
      {/* Background Lighting & Blueprint Grid */}
      <div className="absolute inset-0 blueprint-grid pointer-events-none opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cinematic-glow pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header Bar */}
        <div className="animate-fade-in flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 neon-dot-blue animate-pulse" />
              <span>Base Oficial SINAPI 08/2026 • 15.420 Itens Indexados</span>
            </div>
            <h1 className="text-2xl font-light tracking-tight text-white">
              Consulta de Preços & <span className="font-semibold text-blue-300">Serviços SINAPI</span>
            </h1>
            <p className="text-xs text-slate-400 font-normal">
              Pesquise composições oficiais de serviços e insumos em tempo real para todos os 27 estados do Brasil.
            </p>
          </div>

          {/* Quick UF Selector */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <div className="flex items-center gap-2 glass-pill px-3.5 py-1.5 rounded-full text-xs">
              <span className="text-slate-400 font-mono font-medium">Estado / UF:</span>
              <select
                value={uf}
                onChange={(e) => { setUf(e.target.value); setPage(1); }}
                className="bg-[#030712] text-white font-mono font-bold text-xs p-1 rounded-md border border-white/15 cursor-pointer focus:outline-none transition-colors"
              >
                {UFS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="animate-fade-in-up delay-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="glass-card p-3 rounded-xl flex items-center gap-3 blueprint-box">
            <span className="w-2 h-2 rounded-full bg-blue-400 neon-dot-blue" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Consultas</div>
              <div className="text-sm font-bold text-white tabular-nums mt-0.5">
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

          <div className="glass-card p-3 rounded-xl flex items-center gap-3 blueprint-box">
            <span className="w-2 h-2 rounded-full bg-cyan-400 neon-dot-blue" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Hoje</div>
              <div className="text-sm font-bold text-white tabular-nums mt-0.5">
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

          <div className="glass-card p-3 rounded-xl flex items-center gap-3 blueprint-box">
            <span className="w-2 h-2 rounded-full bg-emerald-400 neon-dot-emerald" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Latência</div>
              <div className="text-sm font-bold text-emerald-400 tabular-nums mt-0.5">
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

          <div className="glass-card p-3 rounded-xl flex items-center gap-3 blueprint-box">
            <span className="w-2 h-2 rounded-full bg-slate-300" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">Ativos</div>
              <div className="text-sm font-bold text-white tabular-nums mt-0.5">
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
        <div className="animate-fade-in-up delay-200 glass-panel rounded-2xl p-5 space-y-4 blueprint-box">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Digite o código (ex: 105009) ou termos como 'locação gabarito', 'concreto 25 mpa', 'escavação'..."
              className="w-full pl-11 pr-28 py-3 bg-[#030712]/90 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:border-blue-500/50 outline-none transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); setPage(1); }}
                className="absolute right-20 text-slate-400 hover:text-white text-xs px-2 py-1 transition-colors"
              >
                Limpar
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary absolute right-2 px-4 py-1.5 text-xs font-semibold disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" /> : 'Buscar'}
            </button>
          </form>

          {/* Type Filter Pills & Counters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 bg-[#030712] p-1 rounded-full border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => { setTipo('todos'); setPage(1); }}
                className={`px-3 py-1 rounded-full transition-all ${
                  tipo === 'todos' ? 'bg-white text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Todos ({totalCount.toLocaleString('pt-BR')})
              </button>
              <button
                type="button"
                onClick={() => { setTipo('composicao'); setPage(1); }}
                className={`px-3 py-1 rounded-full transition-all ${
                  tipo === 'composicao' ? 'bg-white text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Serviços / Composições
              </button>
              <button
                type="button"
                onClick={() => { setTipo('insumo'); setPage(1); }}
                className={`px-3 py-1 rounded-full transition-all ${
                  tipo === 'insumo' ? 'bg-white text-slate-950 font-semibold shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                Insumos
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              Página <span className="text-white font-bold">{page}</span> de <span className="text-white font-bold">{totalPages}</span> ({totalCount} registros)
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="glass-panel rounded-2xl overflow-hidden blueprint-box">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0b132b]/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-white/[0.08]">
                  <th className="py-3 px-4 w-28 font-semibold">Código</th>
                  <th className="py-3 px-3 w-28 font-semibold">Tipo</th>
                  <th className="py-3 px-4 font-semibold">Descrição Oficial SINAPI</th>
                  <th className="py-3 px-3 w-16 text-center font-semibold">Unid.</th>
                  <th className="py-3 px-4 w-36 text-right font-semibold">Preço Não Deson. ({uf})</th>
                  <th className="py-3 px-4 w-36 text-right font-semibold">Preço Desonerado ({uf})</th>
                  <th className="py-3 px-3 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] font-mono">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-14 text-center text-slate-400">
                      <div className="flex items-center justify-center gap-2.5">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                        <span className="font-mono text-xs">Consultando base SINAPI {uf}...</span>
                      </div>
                    </td>
                  </tr>
                ) : results.length > 0 ? (
                  results.map((item) => (
                    <tr key={item.codigo} className="hover:bg-white/[0.02] transition-colors group">
                      {/* Código */}
                      <td className="py-3.5 px-4 font-bold text-white">
                        <span className="text-blue-400">#{item.codigo}</span>
                      </td>

                      {/* Tipo */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] uppercase font-bold border ${
                            item.tipo === 'composicao'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : 'bg-white/[0.04] text-slate-400 border-white/10'
                          }`}
                        >
                          {item.tipo === 'composicao' ? 'Serviço' : 'Insumo'}
                        </span>
                      </td>

                      {/* Descrição */}
                      <td className="py-3.5 px-4 font-sans text-slate-200 max-w-xl">
                        <div className="line-clamp-2 leading-relaxed" title={item.descricao}>
                          {item.descricao}
                        </div>
                      </td>

                      {/* Unidade */}
                      <td className="py-3.5 px-3 text-center text-slate-400 font-bold">
                        {item.unidade || 'UN'}
                      </td>

                      {/* Preço Não Desonerado */}
                      <td className="py-3.5 px-4 text-right font-semibold text-slate-300 tabular-nums">
                        {item.custo_nao_desonerado > 0 ? formatCurrency(item.custo_nao_desonerado) : '-'}
                      </td>

                      {/* Preço Desonerado */}
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-400 tabular-nums">
                        {item.custo_desonerado > 0 ? formatCurrency(item.custo_desonerado) : '-'}
                      </td>

                      {/* Copy Action */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => handleCopyCode(item.codigo)}
                          title="Copiar código SINAPI"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
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
                    <td colSpan={7} className="py-14 text-center text-slate-400 space-y-1">
                      <div>Nenhum item encontrado para a busca &quot;{query}&quot;.</div>
                      <div className="text-[11px] text-slate-400">Tente buscar por termos técnicos mais genéricos ou pelo código numérico.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="bg-[#0b132b]/70 px-5 py-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
              <div className="text-slate-400">
                Exibindo {((page - 1) * pageSize) + 1}–{Math.min(page * pageSize, totalCount)} de {totalCount}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1 || isLoading}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="btn-secondary px-3 py-1.5 text-xs text-slate-300 disabled:opacity-30 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>

                <span className="text-white px-2 font-bold">
                  {page} / {totalPages}
                </span>

                <button
                  disabled={page >= totalPages || isLoading}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="btn-secondary px-3 py-1.5 text-xs text-slate-300 disabled:opacity-30 flex items-center gap-1"
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
