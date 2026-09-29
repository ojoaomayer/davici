'use client'

import Link from 'next/link'
import { ArrowRight, HardHat, Compass } from 'lucide-react'
import { CheckoutButton } from '@/components/CheckoutButton'

/**
 * HeroActions — Client Component com botões de CTA com seleção direta de escopo:
 * 1. "Execução de Obra" (SINAPI)
 * 2. "Projetos e Serviços Técnicos" (SECID/PR)
 */
export function HeroActions() {
  return (
    <div className="animate-fade-in-up delay-300 flex flex-col items-center justify-center gap-3.5 pt-2 w-full">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
        {/* Opção A: Execução de Obra (SINAPI) */}
        <Link
          href="/orcamento?modo=execucao"
          className="h-[50px] px-6 rounded-[50px] bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_20px_30px_-6px_rgba(59,130,246,0.5)] outline-none cursor-pointer border-none text-white text-[14px] sm:text-[16px] font-semibold flex items-center justify-center transition-all duration-300 ease-in-out hover:translate-y-[3px] hover:shadow-none active:opacity-50"
        >
          Execução de Obra (SINAPI)
        </Link>

        {/* Opção B: Projetos e Serviços Técnicos (SECID/PR) */}
        <Link
          href="/orcamento?modo=projetos"
          className="h-[50px] px-6 rounded-[50px] bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-[0_20px_30px_-6px_rgba(6,182,212,0.5)] outline-none cursor-pointer border-none text-white text-[14px] sm:text-[16px] font-semibold flex items-center justify-center transition-all duration-300 ease-in-out hover:translate-y-[3px] hover:shadow-none active:opacity-50"
        >
          Projetos e Serviços (SECID/PR)
        </Link>
      </div>

      {/* Micro-copy de Confiança */}
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-400 font-mono pt-2 text-center max-w-full px-2">
        <span>✓ Sem cartão de crédito</span>
        <span className="hidden sm:inline text-slate-600">•</span>
        <span>✓ Bases SINAPI (27 UFs) e SECID/PR Integradas</span>
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
