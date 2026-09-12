'use client'

import { useState } from 'react'
import Dropzone from '@/components/Dropzone'
import ReviewTable from '@/components/ReviewTable'
import ExportSection from '@/components/ExportSection'
import { HardHat, Sparkles } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function Home() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [config, setConfig] = useState({ uf: 'PR', desonerado: true })

  const handleProcess = async (data: any[], runConfig: { uf: string; desonerado: boolean }) => {
    setIsLoading(true)
    setConfig(runConfig)
    
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: data, filter_uf: runConfig.uf }),
      })
      
      const json = await response.json()
      
      if (json.results) {
        setResults(json.results)
        setStep(2)
      } else {
        alert("Erro ao processar orçamento.")
      }
    } catch (error) {
      console.error(error)
      alert("Falha na comunicação com o servidor.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateMatch = (index: number, newMatch: any) => {
    const newResults = [...results]
    newResults[index].match = {
      ...newMatch,
      status: 'alto', // We assume manual selection means high confidence
      match_score: 100,
    }
    setResults(newResults)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-900 selection:text-blue-50 pb-20">
      {/* Header Background */}
      <div className="absolute top-0 inset-x-0 h-[400px] bg-gradient-to-br from-slate-900 via-blue-950 to-blue-900 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/30 blur-[120px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/20 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Navigation & Branding */}
        <header className="flex flex-col items-center justify-center text-center mb-16 text-white animate-in slide-in-from-top-6 duration-700">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 flex items-center gap-4 justify-center">
            <HardHat className="w-12 h-12 text-blue-400" />
            <span>De<span className="text-blue-400">Vici</span></span>
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl font-light leading-relaxed">
            O orçamentista autônomo da sua obra.
          </p>
        </header>

        {/* Stepper */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 w-full h-0.5 bg-white/20 -z-0"></div>
            <div className="absolute left-0 top-1/2 h-0.5 bg-blue-500 transition-all duration-500 ease-out -z-0" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
            
            {[1, 2, 3].map((s) => (
              <div key={s} className={cn(
                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300",
                step === s ? "bg-blue-600 text-white ring-4 ring-blue-600/30 shadow-lg scale-110" : 
                step > s ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"
              )}>
                {s}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-3 px-2 text-sm font-medium text-slate-400">
            <span className={cn(step >= 1 && "text-slate-100")}>Upload</span>
            <span className={cn(step >= 2 && "text-slate-100")}>Revisão</span>
            <span className={cn(step >= 3 && "text-slate-100")}>Exportação</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="transition-all duration-500 ease-in-out">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <Dropzone onProcess={handleProcess} isLoading={isLoading} />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Revisão de Correspondências</h2>
                  <p className="text-slate-400">Foram encontrados {results.length} itens. Verifique os matches da IA.</p>
                </div>
                <button 
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                >
                  Concluir Revisão &rarr;
                </button>
              </div>
              
              <ReviewTable results={results} config={config} onUpdateMatch={handleUpdateMatch} />
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500 max-w-4xl mx-auto">
              <button 
                onClick={() => setStep(2)}
                className="mb-6 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                &larr; Voltar para Revisão
              </button>
              <ExportSection results={results} config={config} />
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
