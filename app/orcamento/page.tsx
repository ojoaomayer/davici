'use client'

import { useState } from 'react'
import { ChevronRight, RotateCcw, FileSpreadsheet, ArrowLeft, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import Dropzone from '@/components/Dropzone'
import ReviewTable from '@/components/ReviewTable'
import ExportSection from '@/components/ExportSection'

export default function OrcamentoPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [config, setConfig] = useState({ uf: 'PR', desonerado: false })

  const handleProcess = async (data: any[], runConfig: { uf: string; desonerado: boolean }) => {
    setIsLoading(true)
    setConfig(runConfig)

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: data, filter_uf: runConfig.uf, desonerado: runConfig.desonerado }),
      })

      const json = await response.json()

      if (json.results) {
        setResults(json.results)
        setStep(2)
      } else {
        alert('Erro ao processar orçamento.')
      }
    } catch (error) {
      console.error(error)
      alert('Falha na comunicação com o servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateMatch = (index: number, newMatch: any) => {
    const newResults = [...results]
    newResults[index].match = {
      ...newMatch,
      status: 'alto',
      match_score: 100,
    }
    setResults(newResults)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Top Workflow Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 mb-1 uppercase">
              <span>Módulo Executivo</span>
              <span>•</span>
              <span className="text-emerald-400">SINAPI 08/2026</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              Orçamento de Obras & Conciliação
            </h1>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                step === 1
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500'
              }`}
            >
              <span>1. Upload</span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-zinc-700" />

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                step === 2
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500'
              }`}
            >
              <span>2. Revisão</span>
            </div>

            <ChevronRight className="w-3.5 h-3.5 text-zinc-700" />

            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                step === 3
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-100'
                  : 'bg-zinc-950 border-zinc-800 text-zinc-500'
              }`}
            >
              <span>3. Exportação</span>
            </div>
          </div>
        </div>

        {/* Step 1: Upload */}
        {step === 1 && (
          <div className="space-y-4 py-4">
            <Dropzone onProcess={handleProcess} isLoading={isLoading} />
          </div>
        )}

        {/* Step 2: Review Table */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg text-xs">
              <div className="font-mono text-zinc-400">
                <strong className="text-zinc-100 font-bold">{results.length}</strong> itens processados • Base <strong className="text-emerald-400 font-bold">{config.uf}</strong> ({config.desonerado ? 'Desonerado' : 'Não Desonerado'})
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setStep(1); setResults([]); }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs transition-colors"
                >
                  <RotateCcw className="w-3 h-3" /> Reiniciar
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs border border-zinc-200 transition-colors"
                >
                  <span>Avançar para Exportação</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <ReviewTable results={results} config={config} onUpdateMatch={handleUpdateMatch} />

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Voltar ao Upload
              </button>

              <button
                onClick={() => setStep(3)}
                className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded border border-zinc-200 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Concluir Orçamento</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Export & Save */}
        {step === 3 && (
          <div className="space-y-6">
            <ExportSection results={results} config={config} />

            <div className="flex justify-between items-center text-xs font-mono pt-2">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <ArrowLeft className="w-3 h-3" /> Revisar Itens Novamente
              </button>

              <button
                onClick={() => { setStep(1); setResults([]); }}
                className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Novo Orçamento
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
