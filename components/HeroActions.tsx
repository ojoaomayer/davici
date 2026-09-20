'use client'

import Link from 'next/link'
import { FileSpreadsheet, ArrowRight, Play } from 'lucide-react'
import { useState } from 'react'
import { VideoModal } from '@/components/VideoModal'
import { CheckoutButton } from '@/components/CheckoutButton'

/**
 * HeroActions — Client Component mínimo que encapsula:
 * 1. O estado do VideoModal (isOpen/onClose)
 * 2. Os dois botões do CTA do hero
 * Todo o restante da landing page é Server Component (sem JS no cliente).
 */
export function HeroActions() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  return (
    <>
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoSrc="/video_hero_section.mp4"
      />

      <div className="animate-fade-in-up delay-300 flex flex-col items-center justify-center gap-3 pt-2 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto">
          <Link
            href="/orcamento"
            className="btn-primary w-full sm:w-auto px-7 py-3.5 text-sm font-semibold flex items-center justify-center gap-2.5 group"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-900" />
            <span>Orçar primeira planilha grátis</span>
            <div className="w-5 h-5 rounded-full bg-slate-900/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setIsVideoModalOpen(true)}
            className="btn-secondary w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-2.5 cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-400/40 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <Play className="w-2.5 h-2.5 text-blue-400 fill-blue-400 ml-0.5" />
            </div>
            <span>Ver demonstração</span>
          </button>
        </div>

        {/* Micro-copy de Confiança */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs text-slate-400 font-mono pt-2 text-center max-w-full px-2">
          <span>✓ Sem cartão de crédito</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span>✓ Bases SINAPI de todos os estados</span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span>✓ Exportação 100% editável em Excel</span>
        </div>
      </div>
    </>
  )
}

/**
 * PricingProButton — Client Component para os botões de checkout
 * isolados dos planos pagos (precisam de estado de loading)
 */
export { CheckoutButton }
