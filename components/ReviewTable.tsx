'use client'

import { useState, Fragment } from 'react'
import { AlertCircle, CheckCircle2, ChevronDown, Check, ArrowRight, Layers, Sparkles } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type ReviewTableProps = {
  results: any[]
  config: { uf: string; desonerado: boolean }
  onUpdateMatch: (index: number, newMatch: any) => void
}

export default function ReviewTable({ results, config, onUpdateMatch }: ReviewTableProps) {
  const [expandedRow, setExpandedRow] = useState<number | null>(null)

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'alto':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      case 'medio':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      case 'baixo':
      default:
        return 'bg-slate-800/50 text-slate-400 border-white/10'
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
  }

  return (
    <div className="w-full glass-panel rounded-xl overflow-hidden blueprint-box">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0b132b]/80 text-slate-400 font-mono text-[11px] uppercase tracking-wider border-b border-white/[0.08]">
              <th className="py-3 px-4 w-[34%]">Item Original (Planilha)</th>
              <th className="py-3 px-4 w-[36%]">Referência SINAPI Oficial</th>
              <th className="py-3 px-4 text-right">Preço Unit.</th>
              <th className="py-3 px-4 text-right">Preço Total</th>
              <th className="py-3 px-3 text-center">Score</th>
              <th className="py-3 px-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06] text-xs">
            {results.map((row, idx) => {
              const { original, match, candidates, judgment } = row
              const status = match?.status || 'baixo'
              const isExpanded = expandedRow === idx

              const precoUnit = match
                ? config.desonerado
                  ? match.custo_desonerado
                  : match.custo_nao_desonerado
                : 0
              const precoTotal = (original.quantidade || 0) * precoUnit

              return (
                <Fragment key={idx}>
                  <tr className="hover:bg-white/[0.02] transition-colors group">
                    {/* Item Original */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-medium text-slate-200 line-clamp-2 leading-relaxed">
                        {original.descricao}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        {original.quantidade} {original.unidade || 'UN'}
                      </div>
                    </td>

                    {/* Sugestão SINAPI */}
                    <td className="py-3.5 px-4 align-top">
                      {match ? (
                        <div>
                          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-200 mb-0.5">
                            <span className="text-blue-400">#{match.codigo}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-normal">
                              • {match.tipo || 'composicao'} • {match.unidade}
                            </span>
                          </div>
                          <div className="text-slate-400 line-clamp-2 leading-relaxed text-[11px]">
                            {match.descricao}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Sem correspondência</span>
                      )}
                    </td>

                    {/* Preço Unitário */}
                    <td className="py-3.5 px-4 text-right font-mono text-slate-300 align-top tabular-nums">
                      {precoUnit > 0 ? formatCurrency(precoUnit) : '-'}
                    </td>

                    {/* Preço Total */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 align-top tabular-nums">
                      {precoTotal > 0 ? formatCurrency(precoTotal) : '-'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-3 text-center align-top">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold border',
                          getBadgeStyle(status)
                        )}
                      >
                        {match?.match_score ? `${match.match_score}%` : 'N/A'}
                      </span>
                    </td>

                    {/* Expand Button */}
                    <td className="py-3.5 px-3 text-right align-top">
                      <button
                        onClick={() => setExpandedRow(isExpanded ? null : idx)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-md transition-colors"
                        title="Ver justificativa técnica e candidatos alternativos"
                      >
                        <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isExpanded && 'rotate-180')} />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Candidates Drawer */}
                  {isExpanded && (
                    <tr className="bg-[#030712]/90 border-t-0 border-white/[0.08]">
                      <td colSpan={6} className="p-4 sm:p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                          {/* Technical Justification */}
                          <div className="lg:col-span-4 bg-[#0b132b]/50 p-4 rounded-xl border border-white/[0.08] space-y-2">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3 text-blue-400" />
                              <span>Justificativa Técnica</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-normal">
                              {judgment?.justificativa || match?.justificativa || 'Correspondência estabelecida por análise vetorial e proximidade semântica de termos técnicos.'}
                            </p>
                          </div>

                          {/* Alternative Candidates */}
                          <div className="lg:col-span-8 space-y-2">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                              Outras Opções na Base SINAPI ({candidates?.length || 0})
                            </div>

                            <div className="space-y-2">
                              {candidates?.map((cand: any) => {
                                const isCurrent = String(cand.codigo) === String(match?.codigo)
                                const candPreco = config.desonerado ? cand.custo_desonerado : cand.custo_nao_desonerado

                                return (
                                  <div
                                    key={cand.id || cand.codigo}
                                    className={cn(
                                      'flex items-center justify-between p-3 rounded-xl border text-xs transition-colors',
                                      isCurrent
                                        ? 'border-blue-500/50 bg-blue-950/30 text-white'
                                        : 'bg-[#0b132b]/30 border-white/[0.06] hover:border-white/20 text-slate-400'
                                    )}
                                  >
                                    <div className="flex-1 pr-4 min-w-0">
                                      <div className="flex items-center gap-2 font-mono text-[11px] mb-0.5">
                                        <span className="font-bold text-white">#{cand.codigo}</span>
                                        <span className="text-slate-400">• {cand.unidade}</span>
                                        {cand.match_score && (
                                          <span className="text-[10px] text-blue-400 font-mono">
                                            ({cand.match_score}% similaridade)
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-slate-300 truncate text-[11px]" title={cand.descricao}>
                                        {cand.descricao}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                      <span className="font-mono font-semibold text-white text-xs tabular-nums">
                                        {formatCurrency(candPreco)}
                                      </span>
                                      <button
                                        onClick={() => onUpdateMatch(idx, cand)}
                                        disabled={isCurrent}
                                        className={cn(
                                          'px-3 py-1.5 text-[11px] font-medium rounded-full transition-all',
                                          isCurrent
                                            ? 'bg-blue-500 text-slate-950 font-semibold cursor-default'
                                            : 'bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/10'
                                        )}
                                      >
                                        {isCurrent ? 'Selecionado' : 'Substituir'}
                                      </button>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
