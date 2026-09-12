'use client'

import { useState, Fragment } from 'react'
import { AlertCircle, CheckCircle2, ChevronDown, Check, ArrowRight } from 'lucide-react'
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
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60'
      case 'medio':
        return 'bg-amber-950/40 text-amber-400 border-amber-800/60'
      case 'baixo':
      default:
        return 'bg-zinc-900 text-zinc-400 border-zinc-800'
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
  }

  return (
    <div className="w-full bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-900/90 text-zinc-400 font-mono text-[11px] uppercase tracking-wider border-b border-zinc-800">
              <th className="py-2.5 px-4 w-[34%]">Item Original (Planilha)</th>
              <th className="py-2.5 px-4 w-[36%]">Referência SINAPI Oficial</th>
              <th className="py-2.5 px-4 text-right">Preço Unit.</th>
              <th className="py-2.5 px-4 text-right">Preço Total</th>
              <th className="py-2.5 px-3 text-center">Score</th>
              <th className="py-2.5 px-3 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/70 text-xs">
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
                  <tr className="hover:bg-zinc-900/50 transition-colors group">
                    {/* Item Original */}
                    <td className="py-3 px-4 align-top">
                      <div className="font-medium text-zinc-200 line-clamp-2 leading-relaxed">
                        {original.descricao}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono mt-1">
                        {original.quantidade} {original.unidade || 'UN'}
                      </div>
                    </td>

                    {/* Sugestão SINAPI */}
                    <td className="py-3 px-4 align-top">
                      {match ? (
                        <div>
                          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-zinc-300 mb-0.5">
                            <span className="text-emerald-400">#{match.codigo}</span>
                            <span className="text-[10px] text-zinc-500 uppercase font-normal">
                              • {match.tipo || 'composicao'} • {match.unidade}
                            </span>
                          </div>
                          <div className="text-zinc-400 line-clamp-2 leading-relaxed text-[11px]">
                            {match.descricao}
                          </div>
                        </div>
                      ) : (
                        <span className="text-zinc-500 italic text-[11px]">Sem correspondência</span>
                      )}
                    </td>

                    {/* Preço Unitário */}
                    <td className="py-3 px-4 text-right font-mono text-zinc-300 align-top tabular-nums">
                      {precoUnit > 0 ? formatCurrency(precoUnit) : '-'}
                    </td>

                    {/* Preço Total */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 align-top tabular-nums">
                      {precoTotal > 0 ? formatCurrency(precoTotal) : '-'}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center align-top">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border',
                          getBadgeStyle(status)
                        )}
                      >
                        {match?.match_score ? `${match.match_score}%` : 'N/A'}
                      </span>
                    </td>

                    {/* Expand Button */}
                    <td className="py-3 px-3 text-right align-top">
                      <button
                        onClick={() => setExpandedRow(isExpanded ? null : idx)}
                        className="p-1 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded transition-colors"
                        title="Ver justificativa técnica e candidatos alternativos"
                      >
                        <ChevronDown className={cn('w-4 h-4 transition-transform duration-200', isExpanded && 'rotate-180')} />
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Candidates Drawer */}
                  {isExpanded && (
                    <tr className="bg-zinc-900/80 border-t-0 border-zinc-800">
                      <td colSpan={6} className="p-4 sm:p-5">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                          {/* Technical Justification */}
                          <div className="lg:col-span-4 bg-zinc-950 p-3.5 rounded-md border border-zinc-800 space-y-2">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                              Justificativa Técnica
                            </div>
                            <p className="text-xs text-zinc-300 leading-relaxed">
                              {judgment?.justificativa || match?.justificativa || 'Correspondência estabelecida por proximidade de termos e especificações técnicas.'}
                            </p>
                          </div>

                          {/* Alternative Candidates */}
                          <div className="lg:col-span-8 space-y-2">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                              Outras Opções Encontradas na Base SINAPI ({candidates?.length || 0})
                            </div>

                            <div className="space-y-1.5">
                              {candidates?.map((cand: any) => {
                                const isCurrent = String(cand.codigo) === String(match?.codigo)
                                const candPreco = config.desonerado ? cand.custo_desonerado : cand.custo_nao_desonerado

                                return (
                                  <div
                                    key={cand.id || cand.codigo}
                                    className={cn(
                                      'flex items-center justify-between p-2.5 rounded-md border text-xs transition-colors',
                                      isCurrent
                                        ? 'border-emerald-700/60 bg-emerald-950/20 text-zinc-200'
                                        : 'bg-zinc-950 border-zinc-800/80 hover:border-zinc-700 text-zinc-400'
                                    )}
                                  >
                                    <div className="flex-1 pr-4 min-w-0">
                                      <div className="flex items-center gap-2 font-mono text-[11px] mb-0.5">
                                        <span className="font-bold text-zinc-300">#{cand.codigo}</span>
                                        <span className="text-zinc-500">• {cand.unidade}</span>
                                        {cand.match_score && (
                                          <span className="text-[10px] text-zinc-500 font-mono">
                                            ({cand.match_score}% similaridade)
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-zinc-300 truncate text-[11px]" title={cand.descricao}>
                                        {cand.descricao}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                      <span className="font-mono font-semibold text-zinc-200 text-xs tabular-nums">
                                        {formatCurrency(candPreco)}
                                      </span>
                                      <button
                                        onClick={() => onUpdateMatch(idx, cand)}
                                        disabled={isCurrent}
                                        className={cn(
                                          'px-2.5 py-1 text-[11px] font-medium rounded transition-colors',
                                          isCurrent
                                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60 cursor-default'
                                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
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
