'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FileSpreadsheet,
  Plus,
  Download,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Calculator,
} from 'lucide-react'
import { collection, query, orderBy, onSnapshot, doc, deleteDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'

export interface OrcamentoDoc {
  id: string
  nome_obra: string
  criado_em: any
  total_itens: number
  valor_total: number
  uf: string
  desonerado: boolean
  download_url?: string
  storage_path?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, userData, loading } = useAuth()
  const [orcamentos, setOrcamentos] = useState<OrcamentoDoc[]>([])
  const [loadingDocs, setLoadingDocs] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return

    const orcRef = collection(db, 'users', user.uid, 'orcamentos')
    const q = query(orcRef, orderBy('criado_em', 'desc'))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as OrcamentoDoc[]
        setOrcamentos(docs)
        setLoadingDocs(false)
      },
      (error) => {
        console.error('Error fetching orcamentos:', error)
        setLoadingDocs(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  const handleDelete = async (orcId: string) => {
    if (!user) return
    if (confirm('Deseja excluir este registro de orçamento?')) {
      try {
        await deleteDoc(doc(db, 'users', user.uid, 'orcamentos', orcId))
      } catch (err) {
        console.error('Error deleting doc:', err)
      }
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0)
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Hoje'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-300 flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
          <span>Carregando workspace...</span>
        </div>
      </div>
    )
  }

  const planilhasUsadas = userData?.planilhas_usadas || orcamentos.length || 0
  const planilhasLimite = userData?.planilhas_limite || (userData?.plano === 'pro' || userData?.plano === 'construtora' ? 999 : 1)
  const isUnlimited = userData?.plano === 'pro' || userData?.plano === 'construtora'
  const usagePercent = isUnlimited ? 100 : Math.min(100, Math.round((planilhasUsadas / planilhasLimite) * 100))

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Workspace Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-zinc-900/50 border border-zinc-800 p-5 rounded-lg">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-zinc-100">
                Workspace • {user.displayName || user.email?.split('@')[0]}
              </h1>
              <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                Plano {userData?.plano || 'Free'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Histórico de orçamentos e conciliações SINAPI salvas na nuvem.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/consultas"
              className="px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
              <span>Consultar SINAPI</span>
            </Link>

            <Link
              href="/ferramentas/calculadora-bdi"
              className="px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>BDI TCU</span>
            </Link>

            <Link
              href="/orcamento"
              className="px-3.5 py-1.5 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold border border-zinc-200 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Orçamento</span>
            </Link>
          </div>
        </div>

        {/* Quota & Stat Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-lg space-y-2">
            <div className="text-[11px] font-mono uppercase text-zinc-500 font-semibold">
              Consumo de Planilhas
            </div>
            <div className="flex items-baseline justify-between font-mono">
              <span className="text-xl font-bold text-zinc-100">
                {planilhasUsadas} <span className="text-xs text-zinc-500 font-normal">/ {isUnlimited ? '∞' : planilhasLimite}</span>
              </span>
              <span className="text-xs text-zinc-400">
                {isUnlimited ? 'Ilimitado' : `${planilhasLimite - planilhasUsadas} restante(s)`}
              </span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${usagePercent >= 100 && !isUnlimited ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${isUnlimited ? 100 : usagePercent}%` }}
              />
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-lg space-y-2">
            <div className="text-[11px] font-mono uppercase text-zinc-500 font-semibold">
              Projetos Processados
            </div>
            <div className="text-xl font-bold font-mono text-zinc-100">
              {orcamentos.length}
            </div>
            <div className="text-[11px] text-zinc-500 font-mono">
              Base oficial SINAPI PR/BR
            </div>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-lg space-y-2">
            <div className="text-[11px] font-mono uppercase text-zinc-500 font-semibold">
              Status do Motor de IA
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Operacional (15.420 itens)</span>
            </div>
            <div className="text-[11px] text-zinc-500 font-mono">
              Acórdão TCU 2622 integrado
            </div>
          </div>
        </div>

        {/* Budgets Table */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden space-y-0">
          <div className="bg-zinc-900/80 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-200">
              <FileSpreadsheet className="w-4 h-4 text-zinc-400" />
              <span>Histórico de Planilhas Salvas</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500">{orcamentos.length} registro(s)</span>
          </div>

          {loadingDocs ? (
            <div className="p-8 text-center text-xs text-zinc-500 font-mono">
              Carregando histórico...
            </div>
          ) : orcamentos.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="text-zinc-500 text-xs font-mono">Nenhum orçamento salvo no momento.</div>
              <Link
                href="/orcamento"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Criar Primeiro Orçamento
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-900/40 text-zinc-500 font-mono text-[11px] uppercase tracking-wider border-b border-zinc-800">
                    <th className="py-2.5 px-4 font-semibold">Identificação da Obra</th>
                    <th className="py-2.5 px-4 font-semibold">Data</th>
                    <th className="py-2.5 px-4 font-semibold">Qtd. Itens</th>
                    <th className="py-2.5 px-4 font-semibold">UF / Regime</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Valor Total</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 font-mono">
                  {orcamentos.map((orc) => (
                    <tr key={orc.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 px-4 font-sans font-medium text-zinc-200">
                        <div>{orc.nome_obra || 'Orçamento de Obra'}</div>
                        <div className="text-[10px] text-zinc-500 font-mono">ID: {orc.id.slice(0, 8)}</div>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {formatDate(orc.criado_em)}
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {orc.total_itens || 0} itens
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        <span className="text-zinc-200 font-bold">{orc.uf || 'PR'}</span> • {orc.desonerado ? 'Desonerada' : 'Não Desonerada'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-emerald-400 tabular-nums">
                        {formatCurrency(orc.valor_total)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {orc.download_url && (
                            <a
                              href={orc.download_url}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Baixar planilha (.xlsx)"
                              className="p-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            onClick={() => handleDelete(orc.id)}
                            title="Remover registro"
                            className="p-1.5 rounded bg-zinc-900 hover:bg-red-950/40 text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-900/50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
