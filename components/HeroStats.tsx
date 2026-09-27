'use client'

import AnimatedCounter from '@/components/AnimatedCounter'
import { TrendingUp, FileSpreadsheet, Clock } from 'lucide-react'

const stats = [
  {
    icon: FileSpreadsheet,
    value: 14830,
    suffix: '+',
    label: 'Planilhas orçadas',
    sub: 'na plataforma',
    color: 'text-blue-400 dark:text-blue-400',
    iconBg: 'bg-blue-500/10 dark:bg-blue-500/10',
    flash: 'text-blue-300',
    live: true,
    intervalMin: 4000,
    intervalMax: 9000,
  },
  {
    icon: TrendingUp,
    value: 96.4,
    suffix: '%',
    decimals: 1,
    label: 'Taxa de assertividade',
    sub: 'de correspondência SINAPI',
    color: 'text-emerald-400 dark:text-emerald-400',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/10',
    live: false,
  },
  {
    icon: Clock,
    value: 87,
    suffix: '%',
    label: 'Tempo economizado',
    sub: 'vs. busca manual em PDF',
    color: 'text-amber-400 dark:text-amber-400',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/10',
    live: false,
  },
]

export function HeroStats() {
  return (
    <div className="w-full max-w-3xl mx-auto pt-8 px-1 sm:px-0">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map(({ icon: Icon, value, suffix, decimals, label, sub, color, iconBg, live, intervalMin, intervalMax }) => (
          <div
            key={label}
            className="relative flex flex-col items-center text-center gap-1.5 py-4 px-2 sm:px-4 rounded-2xl
              bg-white/60 dark:bg-white/[0.04]
              border border-slate-200 dark:border-white/[0.07]
              backdrop-blur-sm
              shadow-[0_2px_12px_rgba(15,23,42,0.06)] dark:shadow-none
              transition-all duration-300 hover:border-slate-300 dark:hover:border-white/[0.12]
              hover:shadow-[0_4px_20px_rgba(15,23,42,0.09)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.04)]"
          >
            {/* Ícone */}
            <div className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
              <Icon className={`w-3.5 h-3.5 ${color}`} />
            </div>

            {/* Número */}
            <span className={`text-xl sm:text-2xl font-extrabold font-mono tabular-nums leading-none ${color}`}>
              <AnimatedCounter
                to={value}
                duration={1800}
                suffix={suffix ?? ''}
                decimals={decimals ?? 0}
                enableLiveIncrement={live ?? false}
                incrementIntervalMin={intervalMin}
                incrementIntervalMax={intervalMax}
              />
            </span>

            {/* Label */}
            <span className="text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">
              {label}
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 leading-tight font-mono">
              {sub}
            </span>

            {/* Pulse indicator para o live counter */}
            {live && (
              <span className="absolute top-3 right-3 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-400" />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
