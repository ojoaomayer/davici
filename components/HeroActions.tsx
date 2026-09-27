'use client'

import Link from 'next/link'
import { ArrowRight, HardHat, Compass } from 'lucide-react'
import { CheckoutButton } from '@/components/CheckoutButton'

/**
 * HeroActions — Client Component com botões de CTA com seleção direta de escopo:
 * 1. "Execução de Obra" (SINAPI)
 * 2. "Projetos & Serviços Técnicos" (SECID/PR)
 */
export function HeroActions() {
  return (
    <div className="animate-fade-in-up delay-300 flex flex-col items-center justify-center gap-3.5 pt-2 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
        {/* Opção A: Execução de Obra (SINAPI) */}
        <Link
          href="/orcamento?modo=execucao"
          className="btn-primary w-full sm:w-auto px-7 py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 group cursor-pointer"
        >
          <HardHat className="w-4 h-4 text-slate-900" />
          <span>Execução de Obra (SINAPI)</span>
          <div className="w-5 h-5 rounded-full bg-slate-900/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </div>
        </Link>

        {/* Opção B: Projetos & Serviços Técnicos (SECID/PR) */}
        <Link
          href="/orcamento?modo=projetos"
          className="w-full sm:w-auto px-7 py-3.5 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 rounded-full bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 dark:bg-gradient-to-r dark:from-cyan-500/20 dark:to-blue-500/20 dark:hover:from-cyan-500/30 dark:hover:to-blue-500/30 dark:border-cyan-400/40 dark:text-white transition-all dark:shadow-[0_0_20px_rgba(6,182,212,0.15)] group cursor-pointer"
        >
          <Compass className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
          <span>Projetos &amp; Serviços (SECID/PR)</span>
          <div className="w-5 h-5 rounded-full bg-sky-200/70 dark:bg-cyan-400/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3.5 h-3.5 text-sky-700 dark:text-white" />
          </div>
        </Link>
      </div>

      {/* Micro-copy de Confiança */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-400 font-mono pt-2 text-center max-w-full px-2">
        <span>✓ Sem cartão de crédito</span>
        <span className="hidden sm:inline text-slate-600">•</span>
        <span>✓ Bases SINAPI (27 UFs) &amp; SECID/PR Integradas</span>
        <span className="hidden sm:inline text-slate-600">•</span>
        <span>✓ Exportação 100% editável em Excel</span>
      </div>
    </div>
  )
}

/**
 * PricingProButton — Client Component para os botões de checkout
 * isolados dos planos pagos (precisam de estado de loading)
 */
export { CheckoutButton }
