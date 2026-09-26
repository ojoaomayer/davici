'use client'

import { useState } from 'react'
import * as xlsx from 'xlsx'
import { FileDown, CloudUpload, CheckCircle2, Building2, ArrowRight, Zap, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, doc, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { storage, db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'

type ExportSectionProps = {
  results: any[]
  config: { uf: string; desonerado: boolean; modoOrcamento?: 'execucao' | 'projetos' }
}

export default function ExportSection({ results, config }: ExportSectionProps) {
  const { user, refreshUserData } = useAuth()
  const isProjetos = config.modoOrcamento === 'projetos'

  const [nomeObra, setNomeObra] = useState(
    isProjetos ? 'Orçamento de Projetos & Serviços Técnicos' : 'Orçamento de Obras'
  )
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const generateWorkbook = () => {
    const exportData: any[] = []
    let currentRow = 2
    let totalGeralCalculado = 0

    const codeHeader = isProjetos ? 'Código SECID/PR' : 'Código SINAPI'
    const descHeader = isProjetos ? 'Descrição SECID/PR' : 'Descrição SINAPI'
    const unitHeader = isProjetos ? 'Unidade SECID/PR' : 'Unidade SINAPI'

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
        'Unidade Original': original.unidade || 'UN',
        [codeHeader]: match?.codigo || 'N/A',
        [descHeader]: match?.descricao || 'Sem correspondência',
        [unitHeader]: match?.unidade || '-',
        'Preço Unitário (R$)': precoUnit,
        'Preço Total (R$)': { f: `B${currentRow}*G${currentRow}` },
      })
      currentRow++
    })

    const totalRowFormula = { f: `SUM(H2:H${currentRow - 1})` }
    exportData.push({
      'Descrição Original': isProjetos
        ? 'TOTAL GERAL DE PROJETOS & SERVIÇOS TÉCNICOS'
        : 'TOTAL GERAL DA OBRA',
      'Quantidade': '',
      'Unidade Original': '',
      [codeHeader]: '',
      [descHeader]: '',
      [unitHeader]: '',
      'Preço Unitário (R$)': '',
      'Preço Total (R$)': totalRowFormula,
    })

    const worksheet = xlsx.utils.json_to_sheet(exportData)
    worksheet['!cols'] = [
      { wch: 42 },
      { wch: 12 },
      { wch: 16 },
      { wch: 16 },
      { wch: 60 },
      { wch: 16 },
      { wch: 20 },
      { wch: 24 },
    ]

    const workbook = xlsx.utils.book_new()
    const sheetName = isProjetos ? 'Orçamento SECID PR' : 'Orçamento SINAPI'
    xlsx.utils.book_append_sheet(workbook, worksheet, sheetName)

    return { workbook, totalGeralCalculado }
  }

  const handleExport = () => {
    const { workbook } = generateWorkbook()
    const dataFormatada = new Date().toISOString().split('T')[0]

    // Formato de nomeação requerido: Orcamento_Projetos_SECID_[Data].xlsx ou Orcamento_Obras_SINAPI_[UF]_[Data].xlsx
    const fileName = isProjetos
      ? `Orcamento_Projetos_SECID_${dataFormatada}.xlsx`
      : `Orcamento_Obras_SINAPI_${config.uf}_${dataFormatada}.xlsx`

    xlsx.writeFile(workbook, fileName)
  }

  const handleSaveToCloud = async () => {
    if (!user) return
    setIsSaving(true)

    try {
      const { workbook, totalGeralCalculado } = generateWorkbook()
      const wbout = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' })
      const blob = new Blob([wbout], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      const timestamp = Date.now()
      const storagePath = `users/${user.uid}/orcamentos/${timestamp}_${isProjetos ? 'secid' : 'sinapi'}.xlsx`
      const storageRef = ref(storage, storagePath)

      let downloadUrl = ''
      try {
        await uploadBytes(storageRef, blob)
        downloadUrl = await getDownloadURL(storageRef)
      } catch (stErr) {
        console.warn('Storage upload fallback:', stErr)
      }

      await addDoc(collection(db, 'users', user.uid, 'orcamentos'), {
        nome_obra: nomeObra || (isProjetos ? 'Orçamento SECID/PR' : 'Orçamento de Obra SINAPI'),
        criado_em: serverTimestamp(),
        total_itens: results.length,
        valor_total: totalGeralCalculado,
        uf: isProjetos ? 'PR' : config.uf,
        desonerado: config.desonerado,
        modo_orcamento: config.modoOrcamento || 'execucao',
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
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`w-2 h-2 rounded-full ${
                isProjetos ? 'bg-cyan-400 neon-dot-blue' : 'bg-emerald-400 neon-dot-emerald'
              }`}
            />
            <span
              className={`text-xs font-mono uppercase font-semibold ${
                isProjetos ? 'text-cyan-300' : 'text-emerald-400'
              }`}
            >
              {isProjetos
                ? `Processamento Concluído • SECID/PR (${config.desonerado ? 'Desonerado' : 'Não Desonerado'})`
                : `Processamento Concluído • SINAPI ${config.uf} (${config.desonerado ? 'Desonerado' : 'Não Desonerado'})`}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            {isProjetos
              ? 'Exportação de Projetos & Serviços Técnicos'
              : 'Exportação do Orçamento Executivo'}
          </h3>
          <p className="text-xs text-slate-400 max-w-xl font-normal">
            A planilha gerada inclui fórmulas nativas de multiplicação (
            <span className="font-mono text-slate-300">Qtd × Preço</span>) e totalizadores compatíveis com
            auditorias oficiais do Paraná e Tribunais de Contas.
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="btn-primary px-6 py-3 text-xs font-semibold flex items-center justify-center gap-2 shrink-0 group cursor-pointer"
        >
          <FileDown className="w-4 h-4 text-slate-900" />
          <span>
            {isProjetos ? 'Baixar Planilha SECID (.xlsx)' : 'Baixar Planilha (.xlsx)'}
          </span>
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
                placeholder="Identificação do Projeto / Obra / Contrato"
                className="w-full pl-10 pr-3 py-2 bg-[#030712]/80 border border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:border-blue-500/50 outline-none font-mono transition-colors"
              />
            </div>

            {savedSuccess ? (
              <Link
                href="/dashboard"
                className="px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(52,211,153,0.15)] cursor-pointer"
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
                className="btn-secondary px-5 py-2 text-xs font-medium flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
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
              Deseja salvar este orçamento no seu workspace corporativo na nuvem?
            </span>
            <Link
              href="/login?mode=signup"
              className="btn-secondary px-4 py-1.5 text-xs font-medium cursor-pointer"
            >
              Criar Conta Gratuita
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
