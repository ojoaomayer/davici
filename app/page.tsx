'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileSpreadsheet,
  Calculator,
  ArrowRight,
  Database,
  Cpu,
  Table,
  Check,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Download,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import AnimatedCounter from '@/components/AnimatedCounter'
import ParticlesComponent from '@/components/ui/particles-bg'

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

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col selection:bg-blue-500/30 selection:text-white relative bg-gradient-to-b from-[#020617] via-[#050b14] via-60% to-[#020617] w-full overflow-x-hidden max-w-full">
      <Navbar />

      {/* 1. HERO SECTION (DOBRA PRINCIPAL) */}
      <section className="relative z-10 w-full overflow-hidden flex flex-col justify-center max-w-full">
        {/* Localized Particles Container */}
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden max-w-full">
          <ParticlesComponent />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 lg:pt-20 pb-10 sm:pb-16 text-center space-y-8 w-full">
          {/* Headline (H1) */}
          <div className="max-w-4xl mx-auto space-y-4 sm:space-y-5">
            <h1 className="animate-fade-in-up delay-100 text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-light tracking-tight text-white leading-[1.2] max-w-full">
              Seu orçamento pronto <br className="hidden sm:inline" />
              <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-blue-200">
                enquanto você toma um{' '}
                <span className="relative inline-block px-1">
                  <span className="relative z-10 text-amber-100 font-semibold">café.</span>
                  <span className="absolute left-0 right-0 top-[38%] bottom-0 bg-[#451a03]/75 border-t border-[#b45309]/70 shadow-[0_0_20px_rgba(180,83,9,0.25)] -z-0 pointer-events-none" />
                </span>
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="animate-fade-in-up delay-200 text-xs sm:text-sm md:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal px-2">
              Esqueça o copia-e-cola em planilhas intermináveis da Caixa. O DeVici lê a sua lista de quantitativos, encontra a composição exata na SINAPI e entrega seu orçamento fechado e conferido em minutos.
            </p>
          </div>

          {/* CTAs Principais */}
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

              <a
                href="#demonstracao"
                className="btn-secondary w-full sm:w-auto px-6 py-3.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
              >
                <span>Ver demonstração interativa</span>
              </a>
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

          {/* Demonstration Card (Preview Interativo) */}
          <div id="demonstracao" className="w-full max-w-4xl mx-auto pt-6 px-1 sm:px-0">
            <div className="glass-panel rounded-xl overflow-hidden text-left shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] blueprint-box w-full">
              <div className="bg-[#0b132b]/60 px-4 py-2.5 border-b border-white/[0.08] flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
                <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              </div>

              <div className="p-3 sm:p-6 font-mono text-xs space-y-3 overflow-x-auto bg-[#030712]/50 w-full">
                <div className="p-3 sm:p-3.5 bg-slate-900/40 rounded-lg border border-white/[0.06] space-y-2 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-slate-400">
                    <span className="text-slate-500 font-bold shrink-0">01</span>
                    <span className="truncate">&quot;Locação convencional de obra através de gabarito de tábuas corridas&quot; (50 M)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-slate-200">
                    <span className="text-blue-400 font-bold shrink-0">105009</span>
                    <span className="truncate max-w-md">LOCAÇÃO CONVENCIONAL DE OBRA, UTILIZANDO GABARITO... AF_03/2024</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-[11px] text-slate-400 pt-1.5 border-t border-white/[0.06]">
                    <span className="text-blue-300 font-bold">99.8% correspondência</span>
                    <span className="text-emerald-400 font-bold tabular-nums">Unit: R$ 108,58 | Total: R$ 5.429,00</span>
                  </div>
                </div>

                <div className="p-3 sm:p-3.5 bg-slate-900/40 rounded-lg border border-white/[0.06] space-y-2 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-slate-400">
                    <span className="text-slate-500 font-bold shrink-0">02</span>
                    <span className="truncate">&quot;Concreto usinado bombeável fck 25 MPa para vigas e pilares&quot; (15 M3)</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-slate-200">
                    <span className="text-blue-400 font-bold shrink-0">99439</span>
                    <span className="truncate max-w-md">CONCRETAGEM DE EDIFICAÇÕES (PAREDES E LAJES)... FCK 25 MPA AF_09/2024</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 text-[11px] text-slate-400 pt-1.5 border-t border-white/[0.06]">
                    <span className="text-blue-300 font-bold">100% correspondência</span>
                    <span className="text-emerald-400 font-bold tabular-nums">Unit: R$ 685,34 | Total: R$ 10.280,10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BARRA DE PROVA SOCIAL & INTEGRAÇÃO */}
      <section className="relative z-10 py-12 border-y border-white/[0.06] bg-[#030712]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6 text-center">
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400 font-medium">
            Desenvolvido para a rotina pesada de quem vive de obra e licitação
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl flex items-center justify-center gap-3 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-blue-400 neon-dot-blue shrink-0" />
              <span>Bases SINAPI &amp; SICRO atualizadas mensalmente</span>
            </div>

            <div className="glass-card p-4 rounded-xl flex items-center justify-center gap-3 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 neon-dot-emerald shrink-0" />
              <span>Algoritmo semântico de correspondência com 96% de assertividade</span>
            </div>

            <div className="glass-card p-4 rounded-xl flex items-center justify-center gap-3 text-xs font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400 neon-dot-blue shrink-0" />
              <span>Compatível com arquivos .XLSX, .CSV e tabelas extraídas de Revit</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO "O ANTES vs. DEPOIS" (A DOR REAL) */}
      <section className="relative z-10 py-20 max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3">
          <div className="text-xs font-mono uppercase text-blue-400 font-semibold tracking-wider flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 neon-dot-blue" />
            <span>Comparativo Operacional</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white max-w-2xl mx-auto">
            A engenharia não deveria perder dias caçando códigos no Excel.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* O jeito antigo */}
          <div className="glass-card p-6 sm:p-7 rounded-2xl space-y-5 border-white/[0.06] bg-[#0b132b]/30">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <X className="w-4 h-4" />
              <span>O ciclo exaustivo tradicional</span>
            </div>

            <ul className="space-y-4 text-xs text-slate-400 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-rose-400/80 font-mono mt-0.5">•</span>
                <span>3 a 5 dias úteis procurando descrições em PDFs e tabelas pesadas.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400/80 font-mono mt-0.5">•</span>
                <span>Risco constante de usar códigos defasados ou errar a unidade de medida.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-400/80 font-mono mt-0.5">•</span>
                <span>Orçamentos atrasados e noites perdidas para fechar propostas de licitação.</span>
              </li>
            </ul>
          </div>

          {/* Com o DeVici */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl space-y-5 border-blue-500/30 shadow-[0_0_30px_rgba(59,130,246,0.12)]">
            <div className="flex items-center gap-2 text-blue-300 font-semibold text-sm">
              <Check className="w-4 h-4 text-blue-400" />
              <span>O fluxo inteligente do DeVici</span>
            </div>

            <ul className="space-y-4 text-xs text-slate-200 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-mono mt-0.5">✓</span>
                <span>Faça o upload do memorial ou da planilha de quantidades.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-mono mt-0.5">✓</span>
                <span>DeVici cruza cada item técnico com o código oficial da sua UF.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-400 font-mono mt-0.5">✓</span>
                <span>Você apenas revisa o índice de confiança, ajusta o BDI e exporta pronto.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. COMO FUNCIONA (PASSO A PASSO OBJETIVO) */}
      <section id="como-funciona" className="relative z-10 py-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-3">
          <div className="text-xs font-mono uppercase text-blue-400 font-semibold tracking-wider flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 neon-dot-blue" />
            <span>Fluxo de Trabalho</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-light tracking-tight text-white">
            Como funciona o <span className="font-semibold text-blue-300">DeVici</span>
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Da planilha bruta ao orçamento oficial em 3 etapas simples.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Passo 01 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-4 blueprint-box">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-mono font-bold text-sm text-blue-400">
              01
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white">
                Suba sua planilha do jeito que ela estiver
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Não precisa reformatar nada. O sistema identifica automaticamente colunas de descrição, quantidade e unidade.
              </p>
            </div>
          </div>

          {/* Passo 02 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-4 blueprint-box">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-mono font-bold text-sm text-cyan-400">
              02
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white">
                A IA faz o pareamento técnico
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                O motor entende termos de obra — sabe a diferença entre bloco de concreto e cerâmico, e cruza com a composição certa.
              </p>
            </div>
          </div>

          {/* Passo 03 */}
          <div className="glass-card glass-card-hover p-6 rounded-2xl space-y-4 blueprint-box">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-sm text-emerald-400">
              03
            </div>
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-white">
                Revise com calma e baixe em Excel
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Cada linha ganha um selo de precisão (Verde/Amarelo). Baixe o arquivo limpo com fórmulas e BDI já calculados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEÇÃO DAS FERRAMENTAS GRATUITAS (VALOR ANTECIPADO) */}
      <section className="relative z-10 py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            Ferramentas essenciais para o seu dia a dia. <span className="font-semibold text-blue-300">100% gratuitas.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Calculadora BDI */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-5 blueprint-box">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase text-slate-200">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Calculadora de BDI TCU</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Calcule seu BDI rigorosamente alinhado às faixas permitidas pelo Acórdão 2622 do TCU para obras públicas e privadas.
              </p>
            </div>
            <Link
              href="/ferramentas/calculadora-bdi"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors pt-2"
            >
              <span>Calcular BDI agora</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Consulta Pública SINAPI */}
          <div className="glass-panel p-6 sm:p-7 rounded-2xl flex flex-col justify-between space-y-5 blueprint-box">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase text-slate-200">
                <Database className="w-4 h-4 text-blue-400" />
                <span>Consulta Pública SINAPI</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Encontre insumos e composições por estado em segundos, sem abrir arquivos de 40 MB.
              </p>
            </div>
            <Link
              href="/consultas"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors pt-2"
            >
              <span>Consultar preços</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. TABELA DE PREÇOS (TRANSPARENTE E DIRETA) */}
      <section id="precos" className="relative z-10 py-20 max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono uppercase text-blue-400 font-semibold tracking-wider flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 neon-dot-blue" />
            <span>Licenciamento</span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-white">
            Planos e Acesso
          </h2>
          <p className="text-xs text-slate-400">
            Sem fidelidade. Cancele quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plano Gratuito */}
          <div className="glass-card glass-card-hover rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Gratuito</h3>
                <p className="text-xs text-slate-400 mt-1">Ideal para ver o DeVici funcionando no seu projeto real.</p>
              </div>

              <div className="py-2">
                <span className="text-3xl font-extrabold font-mono text-white">R$ 0</span>
                <span className="text-xs text-slate-400 font-mono"> / mês</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/[0.08] font-mono">
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>1 orçamento completo</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Até 50 linhas por planilha</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Acesso às calculadoras</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Base SINAPI 27 UFs</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login?mode=signup"
              className="btn-secondary w-full py-2.5 text-xs font-semibold text-center"
            >
              Começar de graça
            </Link>
          </div>

          {/* Plano Profissional (Destaque) */}
          <div className="glass-panel rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 relative border-blue-500/40 shadow-[0_0_35px_rgba(59,130,246,0.18)]">
            <div className="absolute -top-3 right-6">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-500 text-slate-950 shadow-[0_0_12px_rgba(59,130,246,0.8)]">
                O preferido de projetistas e peritos
              </span>
            </div>

            <div className="space-y-4">
              <div className="pt-1">
                <h3 className="text-sm font-bold text-white">Profissional</h3>
                <p className="text-xs text-slate-400 mt-1">Economize mais de 20 horas de digitação técnica todo mês.</p>
              </div>

              <div className="py-2">
                <span className="text-3xl font-extrabold font-mono text-white">R$ 97</span>
                <span className="text-xs text-slate-400 font-mono"> / mês</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-200 pt-4 border-t border-white/[0.08] font-mono">
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span><strong>Até 10 planilhas completas por mês</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Exportação direta com BDI</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Atualização de todas as UFs</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Histórico corporativo em nuvem</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Suporte via WhatsApp</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login?mode=signup"
              className="btn-primary w-full py-2.5 text-xs font-semibold text-center"
            >
              Assinar Plano Profissional
            </Link>
          </div>

          {/* Plano Construtora */}
          <div className="glass-card glass-card-hover rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Construtora</h3>
                <p className="text-xs text-slate-400 mt-1">Para empresas com alto volume de licitações e orçamentos executivos.</p>
              </div>

              <div className="py-2">
                <span className="text-3xl font-extrabold font-mono text-white">R$ 247</span>
                <span className="text-xs text-slate-400 font-mono"> / mês</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-4 border-t border-white/[0.08] font-mono">
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span><strong>Planilhas ilimitadas</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Múltiplos usuários de engenharia</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Suporte a SINAPI e SICRO</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Memória de cálculo para licitação</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Atendimento prioritário</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login?mode=signup"
              className="btn-secondary w-full py-2.5 text-xs font-semibold text-center"
            >
              Automatizar meu escritório
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ (QUEBRA DE OBJEÇÕES DE ENGENHEIRO) */}
      <section className="relative z-10 py-20 w-full max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono uppercase text-blue-400 font-semibold tracking-wider flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 neon-dot-blue" />
            <span>Dúvidas Frequentes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            Perguntas de Engenheiro
          </h2>
        </div>

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
      </section>

      {/* 8. FOOTER & CHAMADA FINAL */}
      <section className="relative z-10 py-20 border-t border-white/[0.08] bg-[#030712]/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white">
            Pronto para orçar sua próxima obra em minutos?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-normal">
            Suba sua primeira planilha agora mesmo e veja o DeVici em ação.
          </p>
          <div className="pt-2">
            <Link
              href="/orcamento"
              className="btn-primary px-8 py-3.5 text-sm font-semibold inline-flex items-center gap-2 group"
            >
              <span>Experimentar sem compromisso</span>
              <ArrowRight className="w-4 h-4 text-slate-900 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Navigation */}
      <footer className="relative z-10 border-t border-white/[0.06] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 neon-dot-emerald" />
            <span>DeVici © {new Date().getFullYear()} • Engenharia de Orçamentos Autônoma</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-slate-400">
            <Link href="/consultas" className="hover:text-white transition-colors">
              Buscador SINAPI
            </Link>
            <Link href="/ferramentas/calculadora-bdi" className="hover:text-white transition-colors">
              Calculadora BDI
            </Link>
            <Link href="/orcamento" className="hover:text-white transition-colors">
              Orçamentador
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              Entrar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
