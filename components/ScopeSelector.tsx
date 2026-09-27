'use client'

import { HardHat, Compass, CheckCircle2, Database, Sparkles } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type ModoOrcamento = 'execucao' | 'projetos'

interface ScopeSelectorProps {
  value: ModoOrcamento
  onChange: (modo: ModoOrcamento) => void
  disabled?: boolean
}

export default function ScopeSelector({ value, onChange, disabled = false }: ScopeSelectorProps) {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 neon-dot-blue" />
          <span>Escopo do Orçamento</span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Base selecionada: <strong className={value === 'projetos' ? 'text-cyan-400' : 'text-blue-400'}>{value === 'projetos' ? 'SECID/PR' : 'SINAPI'}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Opção A: Execução de Obra */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('execucao')}
          className={cn(
            'group relative text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 border text-slate-100 flex flex-col justify-between overflow-hidden cursor-pointer',
            value === 'execucao'
              ? 'bg-gradient-to-b from-blue-950/40 via-slate-900/60 to-slate-950/80 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.18)]'
              : 'bg-slate-900/30 border-white/[0.08] hover:border-white/20 hover:bg-slate-900/50'
          )}
        >
          {/* Subtle Glow & Corner accents */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                  value === 'execucao'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.25)]'
                    : 'bg-white/[0.04] text-slate-400 border border-white/10 group-hover:text-slate-200'
                )}
              >
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                  <span>Execução de Obra</span>
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                    <Database className="w-2.5 h-2.5" /> Base SINAPI
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">27 UFs</span>
                </div>
              </div>
            </div>

            <div
              className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center transition-all mt-0.5',
                value === 'execucao'
                  ? 'bg-blue-500 text-slate-950 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                  : 'border border-white/20 bg-white/[0.02]'
              )}
            >
              {value === 'execucao' && <CheckCircle2 className="w-4 h-4 fill-current stroke-slate-950" />}
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            Para obras com quantitativos de materiais, alvenaria, estrutura e mão de obra física.
          </p>
        </button>

        {/* Opção B: Projetos e Serviços Técnicos */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange('projetos')}
          className={cn(
            'group relative text-left p-4 sm:p-5 rounded-2xl transition-all duration-300 border text-slate-100 flex flex-col justify-between overflow-hidden cursor-pointer',
            value === 'projetos'
              ? 'bg-gradient-to-b from-cyan-950/40 via-slate-900/60 to-slate-950/80 border-cyan-400/50 shadow-[0_0_30px_rgba(6,182,212,0.18)]'
              : 'bg-slate-900/30 border-white/[0.08] hover:border-white/20 hover:bg-slate-900/50'
          )}
        >
          {/* Subtle Glow & Corner accents */}
          <div className="absolute top-0 right-0 w-28 h-28 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center transition-all',
                  value === 'projetos'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-white/[0.04] text-slate-400 border border-white/10 group-hover:text-slate-200'
                )}
              >
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                  <span>Projetos e Serviços Técnicos</span>
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">
                    <Database className="w-2.5 h-2.5" /> Base SECID/PR
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">Res. 094/2026</span>
                </div>
              </div>
            </div>

            <div
              className={cn(
                'w-5 h-5 rounded-full flex items-center justify-center transition-all mt-0.5',
                value === 'projetos'
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                  : 'border border-white/20 bg-white/[0.02]'
              )}
            >
              {value === 'projetos' && <CheckCircle2 className="w-4 h-4 fill-current stroke-slate-950" />}
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            Para contratação de projetos complementares, arquitetura, sondagem, topografia e laudos.
          </p>
        </button>
      </div>
    </div>
  )
}
