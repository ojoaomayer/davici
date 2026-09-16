'use client'

import { useState } from 'react'
import * as xlsx from 'xlsx'
import { FileDown, CloudUpload, CheckCircle2, Building2, ArrowRight, Zap } from 'lucide-react'
import Link from 'next/link'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { storage, db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'

type ExportSectionProps = {
  results: any[]
  config: { uf: string; desonerado: boolean }
}

export default function ExportSection({ results, config }: ExportSectionProps) {
  const { user, refreshUserData } = useAuth()
  const [nomeObra, setNomeObra] = useState('Orçamento de Obras')
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const generateWorkbook = () => {
    const exportData: any[] = []
    let currentRow = 2

    let totalGeralCalculado = 0

    results.forEach((row) => {
      const { original, match } = row
      const precoUnit = match
        ? config.desonerado
          ? match.custo_desonerado
          : match.custo_nao_desonerado
        : 0
      const precoTotal = (original.quantidade || 0) * precoUnit
      totalGeralCalculado += precoTotal

      exportData.push({
        'Descrição Original': original.descricao,
        'Quantidade': original.quantidade,
        'Unidade Original': original.unidade,
        'Código SINAPI': match?.codigo || 'N/A',
        'Descrição SINAPI': match?.descricao || 'Sem correspondência',
        'Unidade SINAPI': match?.unidade || '-',
        'Preço Unitário (R$)': precoUnit,
        'Preço Total (R$)': { f: `B${currentRow}*G${currentRow}` },
      })
      currentRow++
    })

    const totalRowFormula = { f: `SUM(H2:H${currentRow - 1})` }
    exportData.push({
      'Descrição Original': 'TOTAL GERAL DA OBRA',
      'Quantidade': '',
      'Unidade Original': '',
      'Código SINAPI': '',
      'Descrição SINAPI': '',
      'Unidade SINAPI': '',
      'Preço Unitário (R$)': '',
      'Preço Total (R$)': totalRowFormula,
    })

    const worksheet = xlsx.utils.json_to_sheet(exportData)
    worksheet['!cols'] = [
      { wch: 40 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
      { wch: 55 },
      { wch: 15 },
      { wch: 20 },
      { wch: 22 },
    ]

    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Orçamento SINAPI')

    return { workbook, totalGeralCalculado }
  }

  const handleExport = () => {
    const { workbook } = generateWorkbook()
    xlsx.writeFile(workbook, `Orcamento_SINAPI_${config.uf}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  const handleSaveToCloud = async () => {
    if (!user) return
    setIsSaving(true)

    try {
      const { workbook, totalGeralCalculado } = generateWorkbook()
      const wbout = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

      const timestamp = Date.now()
      const storagePath = `users/${user.uid}/orcamentos/${timestamp}_orcamento.xlsx`
      const storageRef = ref(storage, storagePath)

      let downloadUrl = ''
      try {
        await uploadBytes(storageRef, blob)
        downloadUrl = await getDownloadURL(storageRef)
      } catch (stErr) {
        console.warn('Storage upload fallback:', stErr)
      }

      await addDoc(collection(db, 'users', user.uid, 'orcamentos'), {
        nome_obra: nomeObra || 'Orçamento de Obra',
        criado_em: serverTimestamp(),
        total_itens: results.length,
        valor_total: totalGeralCalculado,
        uf: config.uf,
        desonerado: config.desonerado,
        download_url: downloadUrl,
        storage_path: storagePath,
      })

      try {
        await updateDoc(doc(db, 'users', user.uid), {
          planilhas_usadas: increment(1),
        })
        await refreshUserData()
      } catch (upErr) {
        console.warn('Could not increment user usage count:', upErr)
      }

      setSavedSuccess(true)
    } catch (err: any) {
      console.error('Error saving budget to cloud:', err)
      alert('Erro ao salvar no painel: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full glass-panel rounded-2xl p-6 sm:p-7 space-y-6 blueprint-box">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-white/[0.08] pb-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 neon-dot-emerald" />
            <span className="text-xs font-mono uppercase font-semibold text-emerald-400">
              Processamento Concluído • SINAPI {config.uf} ({config.desonerado ? 'Desonerado' : 'Não Desonerado'})
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Exportação do Orçamento Executivo
          </h3>
          <p className="text-xs text-slate-400 max-w-xl font-normal">
            A planilha gerada inclui fórmulas nativas de multiplicação (<span className="font-mono text-slate-300">Qtd × Preço</span>) e totalizadores compatíveis com auditorias oficiais.
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="btn-primary px-6 py-3 text-xs font-semibold flex items-center justify-center gap-2 shrink-0 group"
        >
          <FileDown className="w-4 h-4 text-slate-900" />
          <span>Baixar Planilha (.xlsx)</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-900 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Cloud Workspace Save */}
      <div className="pt-1">
        {user ? (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-[#0b132b]/50 p-3.5 rounded-xl border border-white/[0.08]">
            <div className="flex-1 relative">
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={nomeObra}
                onChange={(e) => setNomeObra(e.target.value)}
                placeholder="Identificação da Obra / Contrato"
                className="w-full pl-10 pr-3 py-2 bg-[#030712]/80 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:border-blue-500/50 outline-none font-mono transition-colors"
              />
            </div>

            {savedSuccess ? (
              <Link
                href="/dashboard"
                className="px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(52,211,153,0.15)]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvo no Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleSaveToCloud}
                disabled={isSaving}
                className="btn-secondary px-5 py-2 text-xs font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CloudUpload className="w-4 h-4 text-blue-400" />
                    <span>Salvar no Histórico</span>
                  </>
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between bg-[#0b132b]/40 p-4 rounded-xl border border-white/[0.08] text-xs">
            <span className="text-slate-400">
              Deseja salvar esta obra no seu workspace corporativo na nuvem?
            </span>
            <Link
              href="/login?mode=signup"
              className="btn-secondary px-4 py-1.5 text-xs font-medium"
            >
              Criar Conta Gratuita
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
