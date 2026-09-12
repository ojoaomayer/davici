'use client'

import { useState, useRef } from 'react'
import * as xlsx from 'xlsx'
import { UploadCloud, FileSpreadsheet, Settings } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type DropzoneProps = {
  onProcess: (data: any[], config: { uf: string; desonerado: boolean }) => void
  isLoading: boolean
}

export default function Dropzone({ onProcess, isLoading }: DropzoneProps) {
  const [dragActive, setDragActive] = useState(false)
  const [fileData, setFileData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  
  // Mapping state
  const [descCol, setDescCol] = useState<string>('')
  const [qtdCol, setQtdCol] = useState<string>('')
  const [unidCol, setUnidCol] = useState<string>('')
  
  // Config state
  const [uf, setUf] = useState<string>('PR')
  const [desonerado, setDesonerado] = useState<boolean>(true)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = xlsx.read(data, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 })
      
      if (jsonData.length > 0) {
        const headers = jsonData[0] as string[]
        setColumns(headers.filter(Boolean))
        
        // Convert to objects
        const rows = xlsx.utils.sheet_to_json(worksheet)
        setFileData(rows)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleProcess = () => {
    if (!descCol || !qtdCol) return
    
    const mappedData = fileData.map((row, index) => ({
      id: index,
      descricao: row[descCol],
      quantidade: parseFloat(row[qtdCol]) || 0,
      unidade: unidCol ? row[unidCol] : '',
    })).filter(item => item.descricao)

    onProcess(mappedData, { uf, desonerado })
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {!fileData.length ? (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-2xl transition-all duration-200 bg-slate-900/50 backdrop-blur-md",
            dragActive ? "border-blue-500 bg-blue-900/50" : "border-slate-700 hover:border-blue-500"
          )}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
        >
          <UploadCloud className="w-16 h-16 text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-200">Arraste seu orçamento aqui</h3>
          <p className="text-slate-400 mt-2 mb-6">Suporta arquivos .xlsx, .xls e .csv</p>
          <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm">
            Procurar Arquivo
            <input 
              type="file" 
              className="hidden" 
              accept=".xlsx,.xls,.csv" 
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
          </label>
        </div>
      ) : (
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-800 p-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-200">Mapeamento de Colunas</h2>
              <p className="text-sm text-slate-400">{fileData.length} linhas detectadas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Descrição do Item *</label>
              <select 
                value={descCol} onChange={e => setDescCol(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Selecione a coluna...</option>
                {columns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Quantidade *</label>
              <select 
                value={qtdCol} onChange={e => setQtdCol(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Selecione a coluna...</option>
                {columns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Unidade (Opcional)</label>
              <select 
                value={unidCol} onChange={e => setUnidCol(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Selecione a coluna...</option>
                {columns.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 mb-8 flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <Settings className="w-4 h-4" /> Configurações SINAPI
            </div>
            <div className="flex gap-2 items-center ml-auto">
              <span className="text-sm text-slate-400">UF:</span>
              <select 
                value={uf} onChange={e => setUf(e.target.value)}
                className="p-1.5 rounded-md border border-slate-700 bg-slate-800 text-slate-200 text-sm font-medium"
              >
                <option value="PR">PR</option>
                <option value="SP">SP</option>
                <option value="RJ">RJ</option>
                <option value="SC">SC</option>
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <span className="text-sm text-slate-400">Custo:</span>
              <select 
                value={desonerado ? 'deson' : 'nao_deson'} 
                onChange={e => setDesonerado(e.target.value === 'deson')}
                className="p-1.5 rounded-md border border-slate-700 bg-slate-800 text-slate-200 text-sm font-medium"
              >
                <option value="deson">Com Desoneração</option>
                <option value="nao_deson">Sem Desoneração</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setFileData([])}
              className="px-6 py-2.5 text-slate-300 font-medium hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleProcess}
              disabled={!descCol || !qtdCol || isLoading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processando (IA)...
                </>
              ) : 'Processar Orçamento'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
