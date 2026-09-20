'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQ_ITEMS = [
  {
    question: 'E se a IA errar algum código ou insumo?',
    answer:
      'O DeVici não toma decisões às cegas. Ele atribui uma nota de confiança (de 0 a 100%) para cada linha. Linhas com correspondência duvidosa são destacadas em amarelo/vermelho com as 3 opções mais próximas para você validar com um clique.',
  },
  {
    question: 'As tabelas de preços estão atualizadas?',
    answer:
      'Sim. O banco de dados do DeVici é sincronizado mensalmente assim que a Caixa Econômica Federal e o DNIT publicam os relatórios oficiais desonerados e não desonerados.',
  },
  {
    question: 'Posso editar o arquivo depois de baixar?',
    answer:
      'Totalmente. O arquivo gerado é um .xlsx nativo, com as fórmulas originais de multiplicação e soma de BDI preservadas, permitindo qualquer ajuste fino no seu Excel.',
  },
]

/**
 * FaqSection — Client Component mínimo isolado apenas para o accordion do FAQ.
 * Todo o restante da landing page é Server Component.
 */
export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="w-full space-y-3">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openFaq === idx
        return (
          <div
            key={idx}
            className="w-full glass-card rounded-xl border border-white/[0.08] overflow-hidden transition-all duration-200"
          >
            <button
              type="button"
              onClick={() => setOpenFaq(isOpen ? null : idx)}
              className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-slate-100 hover:text-white transition-colors"
            >
              <span className="flex-1">{item.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-blue-400' : ''
                }`}
              />
            </button>

            {isOpen && (
              <div className="px-4 sm:px-5 pb-5 text-xs text-slate-400 leading-relaxed font-normal border-t border-white/[0.04] pt-3">
                {item.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
