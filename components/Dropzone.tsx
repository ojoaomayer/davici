'use client'

import { useState } from 'react'
import * as xlsx from 'xlsx'
import { UploadCloud, FileSpreadsheet, Settings, Hash, Tag, Layers, RefreshCw, FileText } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type DropzoneProps = {
  onProcess: (data: any[], config: { uf: string; desonerado: boolean }) => void
  isLoading: boolean
}

interface ParsedSheetInfo {
  headerRowIndex: number
  columns: string[]
  rows: any[]
}

function analyzeSheetData(worksheet: xlsx.WorkSheet): ParsedSheetInfo {
  const rawGrid = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[][]
  if (!rawGrid || rawGrid.length === 0) return { headerRowIndex: 0, columns: [], rows: [] }

  let bestRowIdx = 0
  let maxScore = -1

  for (let i = 0; i < Math.min(40, rawGrid.length); i++) {
    const row = rawGrid[i]
    if (!row || !Array.isArray(row)) continue

    let score = 0
    const rowText = row.map(c => String(c || '').toLowerCase().trim()).join(' ')

    if (rowText.includes('descri') || rowText.includes('serviço') || rowText.includes('servico') || rowText.includes('discriminacao')) score += 5
    if (rowText.includes('qtd') || rowText.includes('quant')) score += 4
    if (rowText.includes('unid') || rowText.includes('medida')) score += 3
    if (rowText.includes('codigo') || rowText.includes('código') || rowText.includes('cod')) score += 3
    if (rowText.includes('item') || rowText.includes('preco') || rowText.includes('preço') || rowText.includes('custo')) score += 2

    const textCells = row.filter(c => typeof c === 'string' && c.trim().length > 0).length
    score += textCells

    if (score > maxScore) {
      maxScore = score
      bestRowIdx = i
    }
  }

  const rawHeaders = rawGrid[bestRowIdx] || []
  const columns: string[] = []
  const colCounts: Record<string, number> = {}

  rawHeaders.forEach((h, colIdx) => {
    let name = String(h || '').trim()
    if (!name) name = `Coluna_${colIdx + 1}`
    if (colCounts[name]) {
      colCounts[name]++
      name = `${name}_${colCounts[name]}`
    } else {
      colCounts[name] = 1
    }
    columns.push(name)
  })

  const rows: any[] = []
  for (let r = bestRowIdx + 1; r < rawGrid.length; r++) {
    const row = rawGrid[r]
    if (!row || row.length === 0) continue
    const obj: Record<string, any> = {}
    let hasAnyValue = false
    columns.forEach((colName, cIdx) => {
      const val = row[cIdx]
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        hasAnyValue = true
        obj[colName] = val
      }
    })
    if (hasAnyValue) {
      rows.push(obj)
    }
  }

  return { headerRowIndex: bestRowIdx, columns, rows }
}

function autoSelectColumns(cols: string[]) {
  const normCols = cols.map(c => ({ original: c, norm: c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') }))

  let desc = ''
  let qtd = ''
  let code = ''
  let unid = ''
  let name = ''

  for (const c of normCols) {
    if (c.norm.includes('descricao do servico') || c.norm.includes('descricao do insumo') || c.norm.includes('discriminacao')) {
      desc = c.original; break
    }
  }
  if (!desc) {
    for (const c of normCols) {
      if (c.norm.includes('descricao') || c.norm.includes('servico') || c.norm.includes('especificacao')) {
        desc = c.original; break
      }
    }
  }
  if (!desc) {
    for (const c of normCols) {
      if (c.norm.includes('item') && !c.norm.includes('codigo')) {
        desc = c.original; break
      }
    }
  }

  for (const c of normCols) {
    if (c.norm === 'qtd' || c.norm === 'quantidade' || c.norm === 'quant') {
      qtd = c.original; break
    }
  }
  if (!qtd) {
    for (const c of normCols) {
      if (c.norm.includes('qtd') || c.norm.includes('quant') || c.norm.includes('qte')) {
        qtd = c.original; break
      }
    }
  }

  for (const c of normCols) {
    if (c.norm.includes('codigo do servico') || c.norm.includes('codigo do insumo') || c.norm.includes('codigo sinapi') || c.norm.includes('cod. sinapi')) {
      code = c.original; break
    }
  }
  if (!code) {
    for (const c of normCols) {
      if (c.norm === 'codigo' || c.norm === 'cod' || c.norm.includes('codigo') || c.norm.includes('sinapi')) {
        code = c.original; break
      }
    }
  }

  for (const c of normCols) {
    if (c.norm.includes('unidade de medida') || c.norm.includes('unid. medida') || c.norm === 'unidade' || c.norm === 'unid' || c.norm === 'un') {
      unid = c.original; break
    }
  }
  if (!unid) {
    for (const c of normCols) {
      if (c.norm.includes('unid') || c.norm.includes('medida')) {
        unid = c.original; break
      }
    }
  }

  for (const c of normCols) {
    if (c.norm.includes('nome') || c.norm.includes('subitem') || c.norm.includes('titulo')) {
      name = c.original; break
    }
  }

  return { desc, qtd, code, unid, name }
}

export default function Dropzone({ onProcess, isLoading }: DropzoneProps) {
  const [dragActive, setDragActive] = useState(false)
  
  const [workbook, setWorkbook] = useState<xlsx.WorkBook | null>(null)
  const [sheetNames, setSheetNames] = useState<string[]>([])
  const [selectedSheet, setSelectedSheet] = useState<string>('')
  
  const [fileData, setFileData] = useState<any[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [headerRow, setHeaderRow] = useState<number>(1)
  
  const [descCol, setDescCol] = useState<string>('')
  const [codeCol, setCodeCol] = useState<string>('')
  const [nameCol, setNameCol] = useState<string>('')
  const [qtdCol, setQtdCol] = useState<string>('')
  const [unidCol, setUnidCol] = useState<string>('')
  
  const [uf, setUf] = useState<string>('PR')
  const [desonerado, setDesonerado] = useState<boolean>(false)

  const loadSheet = (wb: xlsx.WorkBook, sheetName: string) => {
    setSelectedSheet(sheetName)
    const worksheet = wb.Sheets[sheetName]
    if (!worksheet) return

    const parsed = analyzeSheetData(worksheet)
    setHeaderRow(parsed.headerRowIndex + 1)
    setColumns(parsed.columns)
    setFileData(parsed.rows)

    const auto = autoSelectColumns(parsed.columns)
    setDescCol(auto.desc)
    setQtdCol(auto.qtd)
    setCodeCol(auto.code)
    setUnidCol(auto.unid)
    setNameCol(auto.name)
  }

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const wb = xlsx.read(data, { type: 'array' })
        setWorkbook(wb)
        setSheetNames(wb.SheetNames)

        const preferred = ['planilha sintetica', 'planilha sintética', 'orcamento', 'orçamento', 'planilha', 'servicos', 'serviços', 'itens']
        let targetSheet = wb.SheetNames[0]
        for (const p of preferred) {
          const match = wb.SheetNames.find(s => s.toLowerCase().includes(p))
          if (match) {
            targetSheet = match
            break
          }
        }

        loadSheet(wb, targetSheet)
      } catch (err: any) {
        console.error('Error parsing spreadsheet file:', err)
        alert('Erro ao abrir o arquivo. Verifique se o formato é válido.')
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleSheetChange = (newSheet: string) => {
    if (!workbook) return
    loadSheet(workbook, newSheet)
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
    if (!descCol) {
      alert('Selecione ao menos a coluna de Descrição do Serviço.')
      return
    }
    
    const mappedData = fileData
      .map((row, index) => {
        const desc = nameCol ? (row[nameCol] || row[descCol]) : row[descCol]
        const rawQtd = qtdCol ? row[qtdCol] : 1
        const cleanQtd = typeof rawQtd === 'number' ? rawQtd : parseFloat(String(rawQtd || '1').replace(',', '.')) || 1
        const code = codeCol ? String(row[codeCol] || '').replace(/[^0-9]/g, '') : ''

        return {
          id: index,
          descricao: String(desc || '').trim(),
          descricao_original: String(row[descCol] || '').trim(),
          codigo_usuario: code,
          quantidade: cleanQtd,
          unidade: unidCol ? String(row[unidCol] || '').trim() : '',
        }
      })
      .filter(item => item.descricao && item.descricao.length >= 3 && item.descricao !== '-' && item.descricao !== 'undefined')

    if (mappedData.length === 0) {
      alert('Nenhum item válido encontrado na aba selecionada.')
      return
    }

    onProcess(mappedData, { uf, desonerado })
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {!fileData.length && !workbook ? (
        <div
          className={cn(
            "relative flex flex-col items-center justify-center p-12 border border-dashed rounded-lg transition-colors bg-zinc-900/30",
            dragActive ? "border-emerald-500 bg-emerald-950/10" : "border-zinc-800 hover:border-zinc-700"
          )}
          onDragEnter={onDrag}
          onDragLeave={onDrag}
          onDragOver={onDrag}
          onDrop={onDrop}
        >
          <div className="w-10 h-10 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
            <UploadCloud className="w-5 h-5 text-zinc-300" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200">Importar Planilha de Orçamento</h3>
          <p className="text-xs text-zinc-500 mt-1 mb-4">Formatos suportados: .xlsx, .xlsm (com macros), .xls e .csv</p>
          <label className="cursor-pointer bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold px-4 py-2 rounded-md border border-zinc-300 transition-colors shadow-sm">
            Selecionar Arquivo
            <input 
              type="file" 
              className="hidden" 
              accept=".xlsx,.xls,.xlsm,.csv,.ods" 
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
          </label>
        </div>
      ) : (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 space-y-6">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                <FileText className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-100">Configuração de Importação</h2>
                <div className="text-xs text-zinc-500 font-mono mt-0.5">
                  {fileData.length} registros detectados • Linha {headerRow} identificada como cabeçalho
                </div>
              </div>
            </div>

            {/* Sheet Selector */}
            {sheetNames.length > 1 && (
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-md">
                <Layers className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-[11px] font-medium text-zinc-400">Aba:</span>
                <select
                  value={selectedSheet}
                  onChange={e => handleSheetChange(e.target.value)}
                  className="bg-transparent text-zinc-200 font-mono text-xs focus:outline-none cursor-pointer"
                >
                  {sheetNames.map(s => (
                    <option key={s} value={s} className="bg-zinc-900 text-zinc-200">{s}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Mapping Grid */}
          <div className="space-y-4">
            <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
              Mapeamento de Colunas
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-md border border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-200">Descrição do Serviço / Insumo *</label>
                  <span className="text-[10px] text-emerald-400 font-mono">Obrigatório</span>
                </div>
                <select 
                  value={descCol} onChange={e => setDescCol(e.target.value)}
                  className="w-full p-2 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-200 text-xs font-mono focus:border-zinc-700 outline-none"
                >
                  <option value="">Selecione a coluna...</option>
                  {columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-md border border-zinc-800/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-zinc-200">Quantidade</label>
                  <span className="text-[10px] text-zinc-500 font-mono">Padrão: 1</span>
                </div>
                <select 
                  value={qtdCol} onChange={e => setQtdCol(e.target.value)}
                  className="w-full p-2 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-200 text-xs font-mono focus:border-zinc-700 outline-none"
                >
                  <option value="">Não especificada (assume 1)</option>
                  {columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-md border border-zinc-800/80">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-zinc-400" /> Código SINAPI (Opcional)
                </label>
                <select 
                  value={codeCol} onChange={e => setCodeCol(e.target.value)}
                  className="w-full p-2 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-200 text-xs font-mono focus:border-zinc-700 outline-none"
                >
                  <option value="">Não usar</option>
                  {columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-md border border-zinc-800/80">
                <label className="text-xs font-medium text-zinc-300 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-zinc-400" /> Nome do Item (Opcional)
                </label>
                <select 
                  value={nameCol} onChange={e => setNameCol(e.target.value)}
                  className="w-full p-2 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-200 text-xs font-mono focus:border-zinc-700 outline-none"
                >
                  <option value="">Não usar</option>
                  {columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1.5 bg-zinc-950/60 p-3 rounded-md border border-zinc-800/80">
                <label className="text-xs font-medium text-zinc-300">Unidade (Opcional)</label>
                <select 
                  value={unidCol} onChange={e => setUnidCol(e.target.value)}
                  className="w-full p-2 rounded-md border border-zinc-800 bg-zinc-900 text-zinc-200 text-xs font-mono focus:border-zinc-700 outline-none"
                >
                  <option value="">Não usar</option>
                  {columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Regional Settings Bar */}
          <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-md flex flex-wrap gap-4 items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-zinc-400 font-medium">
              <Settings className="w-3.5 h-3.5 text-zinc-400" />
              <span>Parâmetros de Consulta SINAPI:</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-mono">UF:</span>
                <select 
                  value={uf} onChange={e => setUf(e.target.value)}
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono font-bold text-xs"
                >
                  <option value="PR">PR</option>
                  <option value="SP">SP</option>
                  <option value="RJ">RJ</option>
                  <option value="SC">SC</option>
                  <option value="MG">MG</option>
                  <option value="RS">RS</option>
                  <option value="BA">BA</option>
                  <option value="DF">DF</option>
                  <option value="GO">GO</option>
                  <option value="PE">PE</option>
                  <option value="CE">CE</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 font-mono">Regime:</span>
                <select 
                  value={desonerado ? 'deson' : 'nao_deson'} 
                  onChange={e => setDesonerado(e.target.value === 'deson')}
                  className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs"
                >
                  <option value="nao_deson">Não Desonerado</option>
                  <option value="deson">Desonerado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex justify-between items-center pt-2">
            <button 
              onClick={() => {
                setFileData([])
                setWorkbook(null)
                setSheetNames([])
                setSelectedSheet('')
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-zinc-400 hover:text-zinc-200 text-xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Cancelar
            </button>

            <button 
              onClick={handleProcess}
              disabled={!descCol || isLoading}
              className="px-5 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-md border border-zinc-200 transition-colors disabled:opacity-40 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
                  Processando Itens...
                </>
              ) : 'Executar Orçamento'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
