'use client'

import { useState, Fragment } from 'react'
import { AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react'
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

  const getBadgeColor = (status: string) => {
    switch (status) {
      case 'alto': return 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50'
      case 'medio': return 'bg-amber-900/30 text-amber-400 border-amber-800/50'
      case 'baixo': return 'bg-red-900/30 text-red-400 border-red-800/50'
      default: return 'bg-slate-800 text-slate-300 border-slate-700'
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
  }

  return (
    <div className="w-full bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/50 text-slate-300 text-sm font-semibold border-b border-slate-800">
              <th className="p-4 w-1/3">Item Original (Seu Orçamento)</th>
              <th className="p-4 w-1/3">Sugestão SINAPI (IA)</th>
              <th className="p-4 text-right">Preço Unit.</th>
              <th className="p-4 text-right">Preço Total</th>
              <th className="p-4 text-center">Confiança</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {results.map((row, idx) => {
              const { original, match, candidates, judgment } = row
              const status = match?.status || 'baixo'
              const isExpanded = expandedRow === idx
              
              const precoUnit = match 
                ? (config.desonerado ? match.custo_desonerado : match.custo_nao_desonerado) 
                : 0
              const precoTotal = original.quantidade * precoUnit

              return (
                <Fragment key={idx}>
                  <tr className="hover:bg-slate-800/50 transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-slate-200 line-clamp-2">{original.descricao}</div>
                      <div className="text-sm text-slate-500 mt-1 flex gap-2">
                        <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">{original.quantidade} {original.unidade}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {match ? (
                        <>
                          <div className="text-xs font-mono text-blue-600 font-bold mb-1">{match.codigo}</div>
                          <div className="text-sm text-slate-300 line-clamp-2">{match.descricao}</div>
                        </>
                      ) : (
                        <span className="text-sm text-slate-500 italic">Sem correspondência adequada</span>
                      )}
                    </td>
                    <td className="p-4 text-right font-medium text-slate-300">
                      {precoUnit ? formatCurrency(precoUnit) : '-'}
                    </td>
                    <td className="p-4 text-right font-bold text-slate-200">
                      {precoTotal ? formatCurrency(precoTotal) : '-'}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5", getBadgeColor(status))}>
                          {status === 'alto' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {status === 'baixo' && <AlertCircle className="w-3.5 h-3.5" />}
                          {match?.match_score ? `${match.match_score}%` : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => setExpandedRow(isExpanded ? null : idx)}
                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-900/30 rounded-lg transition-colors"
                      >
                        <ChevronDown className={cn("w-5 h-5 transition-transform", isExpanded && "rotate-180")} />
                      </button>
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr className="bg-slate-900/80 border-t-0 shadow-inner border-slate-800">
                      <td colSpan={6} className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          <div className="lg:col-span-1 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Justificativa da IA</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {judgment?.justificativa || 'Nenhuma justificativa fornecida.'}
                            </p>
                          </div>
                          <div className="lg:col-span-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Outros Candidatos (Top 5)</h4>
                            <div className="space-y-2">
                              {candidates.map((cand: any, cIdx: number) => {
                                const isCurrent = cand.codigo === match?.codigo
                                const candPreco = config.desonerado ? cand.custo_desonerado : cand.custo_nao_desonerado
                                
                                return (
                                  <div key={cand.id} className={cn("flex items-center justify-between p-3 rounded-lg border text-sm transition-colors", isCurrent ? "border-blue-500 bg-blue-900/30" : "bg-slate-800/50 border-slate-700 hover:border-slate-600")}>
                                    <div className="flex-1 pr-4">
                                      <div className="flex gap-2 items-center mb-1">
                                        <span className="font-mono text-xs font-bold text-slate-300">{cand.codigo}</span>
                                        <span className="text-xs text-slate-500">| {cand.unidade}</span>
                                      </div>
                                      <div className="text-slate-300 line-clamp-1" title={cand.descricao}>{cand.descricao}</div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <span className="font-medium text-slate-300">{formatCurrency(candPreco)}</span>
                                      <button 
                                        onClick={() => onUpdateMatch(idx, cand)}
                                        disabled={isCurrent}
                                        className="px-3 py-1.5 text-xs font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed bg-slate-700 hover:bg-slate-600 text-slate-200"
                                      >
                                        {isCurrent ? 'Selecionado' : 'Escolher'}
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
