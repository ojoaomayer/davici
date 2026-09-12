'use client'

import * as xlsx from 'xlsx'
import { Download, FileDown } from 'lucide-react'

type ExportSectionProps = {
  results: any[]
  config: { uf: string; desonerado: boolean }
}

export default function ExportSection({ results, config }: ExportSectionProps) {
  const handleExport = () => {
    // Prepare data
    const exportData: any[] = []
    let currentRow = 2 // Row 1 is header

    results.forEach((row) => {
      const { original, match } = row
      
      const precoUnit = match 
        ? (config.desonerado ? match.custo_desonerado : match.custo_nao_desonerado) 
        : 0
      
      exportData.push({
        'Descrição Original': original.descricao,
        'Quantidade': original.quantidade,
        'Unidade Original': original.unidade,
        'Código SINAPI': match?.codigo || 'N/A',
        'Descrição SINAPI': match?.descricao || 'Sem correspondência',
        'Unidade SINAPI': match?.unidade || '-',
        'Preço Unitário (R$)': precoUnit,
        'Preço Total (R$)': { f: `B${currentRow}*G${currentRow}` } // Excel Formula: Qtd * Preço
      })
      currentRow++
    })

    // Add Total Row
    const totalRowFormula = { f: `SUM(H2:H${currentRow - 1})` }
    exportData.push({
      'Descrição Original': 'TOTAL GERAL',
      'Quantidade': '',
      'Unidade Original': '',
      'Código SINAPI': '',
      'Descrição SINAPI': '',
      'Unidade SINAPI': '',
      'Preço Unitário (R$)': '',
      'Preço Total (R$)': totalRowFormula
    })

    const worksheet = xlsx.utils.json_to_sheet(exportData)
    
    // Adjust column widths
    worksheet['!cols'] = [
      { wch: 40 }, // Descrição Orig
      { wch: 10 }, // Qtd
      { wch: 15 }, // Unidade Orig
      { wch: 15 }, // Codigo
      { wch: 50 }, // Descrição SINAPI
      { wch: 15 }, // Unid
      { wch: 20 }, // Preço Unit
      { wch: 20 }, // Preço Total
    ]

    const workbook = xlsx.utils.book_new()
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Orçamento Conciliado')
    
    // Trigger download
    xlsx.writeFile(workbook, `Orcamento_SINAPI_${config.uf}_${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  return (
    <div className="w-full bg-blue-600 rounded-xl p-8 flex flex-col md:flex-row items-center justify-between text-white shadow-xl shadow-blue-600/20">
      <div>
        <h3 className="text-2xl font-bold flex items-center gap-2 mb-2">
          <CheckCircle className="w-6 h-6 text-blue-200" /> Tudo Pronto!
        </h3>
        <p className="text-blue-100 max-w-xl">
          Seu orçamento foi processado e compatibilizado com a base SINAPI ({config.uf} - {config.desonerado ? 'Desonerado' : 'Não Desonerado'}). Baixe a planilha final com as fórmulas integradas.
        </p>
      </div>
      
      <button 
        onClick={handleExport}
        className="mt-6 md:mt-0 px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl shadow-lg transition-all flex items-center gap-3 hover:scale-105 active:scale-95"
      >
        <FileDown className="w-6 h-6" />
        Baixar Planilha Orçada
      </button>
    </div>
  )
}

function CheckCircle(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}
