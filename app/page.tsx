'use client'

import Link from 'next/link'
import {
  FileSpreadsheet,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Layers,
  FileDown,
  Check,
  X,
  Terminal,
  Database,
  Cpu,
  Table,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import AnimatedCounter from '@/components/AnimatedCounter'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center space-y-6">
        {/* Status Pill */}
        <div className="animate-fade-in inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-mono transition-all duration-300 hover:border-zinc-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Base SINAPI 08/2026 • 15.420 Serviços & Insumos • 27 UFs</span>
        </div>

        {/* Headline */}
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-100 leading-[1.1]">
            Engenharia de orçamentos com precisão de código.
          </h1>

          <p className="animate-fade-in-up delay-200 text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Elimine a busca manual na tabela SINAPI. O DeVici interpreta planilhas de qualquer formato, cruza itens com as composições oficiais e gera o orçamento executivo em segundos.
          </p>
        </div>

        {/* CTAs */}
        <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/orcamento"
            className="hover-lift active:scale-[0.98] w-full sm:w-auto px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs rounded-md border border-zinc-200 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-zinc-800" />
            <span>Processar Planilha</span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-600" />
          </Link>

          <Link
            href="/consultas"
            className="hover-lift active:scale-[0.98] w-full sm:w-auto px-4 py-2.5 rounded-md border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 font-medium text-xs transition-all flex items-center justify-center gap-2"
          >
            <Database className="w-3.5 h-3.5 text-blue-400" />
            <span>Consultar SINAPI (15k Itens)</span>
          </Link>

          <Link
            href="/ferramentas/calculadora-bdi"
            className="hover-lift active:scale-[0.98] w-full sm:w-auto px-4 py-2.5 rounded-md border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 font-medium text-xs transition-all flex items-center justify-center gap-2"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Calculadora BDI TCU</span>
          </Link>
        </div>

        {/* Live Social Proof / Telemetry Grid */}
        <div className="animate-fade-in-up delay-400 max-w-4xl mx-auto pt-6">
          <div className="hover-glow grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-900/40 border border-zinc-800 rounded-lg p-3 sm:p-4 text-left font-mono transition-all duration-300">
            <div className="p-2 border-r border-zinc-800/60 last:border-none">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Consultas (30d)</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-zinc-100 tabular-nums mt-1">
                <AnimatedCounter
                  from={14750}
                  to={14830}
                  prefix="+"
                  enableLiveIncrement={true}
                  incrementIntervalMin={3500}
                  incrementIntervalMax={8000}
                />
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Em todas as 27 UFs</div>
            </div>

            <div className="p-2 sm:border-r border-zinc-800/60 last:border-none">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>Obras &amp; Projetos</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-zinc-100 tabular-nums mt-1">
                <AnimatedCounter
                  from={1.0}
                  to={4.8}
                  prefix="R$ "
                  suffix="M+"
                  decimals={1}
                  duration={1500}
                />
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Em orçamentos gerados</div>
            </div>

            <div className="p-2 border-r border-zinc-800/60 last:border-none">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Latência</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 tabular-nums mt-1">
                <AnimatedCounter
                  from={5}
                  to={17}
                  prefix="< "
                  suffix="ms"
                  duration={1200}
                />
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Busca indexada em RAM</div>
            </div>

            <div className="p-2">
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                <span>Precisão</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-zinc-100 tabular-nums mt-1">
                <AnimatedCounter
                  from={90}
                  to={99.8}
                  suffix="%"
                  decimals={1}
                  duration={1500}
                />
              </div>
              <div className="text-[10px] text-zinc-500 mt-0.5">Conformidade TCU/CEF</div>
            </div>
          </div>
        </div>

        {/* Technical Terminal Preview */}
        <div className="max-w-4xl mx-auto pt-8">
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden text-left shadow-2xl">
            {/* Terminal Tab Bar */}
            <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                <span className="text-zinc-500 ml-2">devici_engine.log</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono">STATUS: 200 OK</span>
            </div>

            {/* Code / Table Preview */}
            <div className="p-4 sm:p-5 font-mono text-xs space-y-3 overflow-x-auto">
              <div className="text-zinc-500">
                // Exemplo de conciliação automática com SINAPI Paraná (PR)
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-zinc-900/60 rounded border border-zinc-800/80 space-y-1">
                  <div className="flex justify-between text-zinc-400">
                    <span className="text-zinc-500">INPUT:</span>
                    <span>&quot;Locação convencional de obra através de gabarito de tábuas corridas&quot; (50 M)</span>
                  </div>
                  <div className="flex justify-between text-zinc-200">
                    <span className="text-emerald-400">MATCH [105009]:</span>
                    <span>LOCAÇÃO CONVENCIONAL DE OBRA, UTILIZANDO GABARITO... AF_03/2024</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60">
                    <span>Confiança: 100%</span>
                    <span className="text-emerald-400 font-bold tabular-nums">Unit: R$ 108,58 | Total: R$ 5.429,00</span>
                  </div>
                </div>

                <div className="p-3 bg-zinc-900/60 rounded border border-zinc-800/80 space-y-1">
                  <div className="flex justify-between text-zinc-400">
                    <span className="text-zinc-500">INPUT:</span>
                    <span>&quot;Concreto usinado bombeável fck 25 MPa para vigas e pilares&quot; (15 M3)</span>
                  </div>
                  <div className="flex justify-between text-zinc-200">
                    <span className="text-emerald-400">MATCH [99439]:</span>
                    <span>CONCRETAGEM DE EDIFICAÇÕES (PAREDES E LAJES)... FCK 25 MPA AF_09/2024</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/60">
                    <span>Confiança: 100%</span>
                    <span className="text-emerald-400 font-bold tabular-nums">Unit: R$ 685,34 | Total: R$ 10.280,10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Architecture Strip */}
      <section className="border-y border-zinc-800 bg-zinc-900/30 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="hover-lift p-4 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-900/40 space-y-2 transition-all">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-zinc-300">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>1. Base SINAPI Estruturada</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                10.547 composições de serviços e 4.876 insumos com custos desonerados e não desonerados indexados para todos os 27 estados.
              </p>
            </div>

            <div className="hover-lift p-4 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-900/40 space-y-2 transition-all">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-zinc-300">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>2. Processador Textual & Vetorial</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Algoritmo ponderado por termos de engenharia civil, unidade de medida e códigos numéricos com latência inferior a 20ms.
              </p>
            </div>

            <div className="hover-lift p-4 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-900/40 space-y-2 transition-all">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-zinc-300">
                <Table className="w-4 h-4 text-emerald-400" />
                <span>3. Fórmulas Nativas de Excel</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Exporta arquivos `.xlsx` com células de multiplicação dinâmica (`Qtd × Preço`) e somatórios compatíveis com auditoria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Structured Comparison Table */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-1">
          <div className="text-xs font-mono uppercase text-zinc-500 font-semibold">Comparativo Operacional</div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Orçamento Manual vs. DeVici
          </h2>
        </div>

        <div className="hover-glow bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden text-xs transition-all duration-300">
          <div className="grid grid-cols-2 bg-zinc-900 border-b border-zinc-800 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            <div className="p-3 border-r border-zinc-800">Processo Manual Tradicional</div>
            <div className="p-3 text-emerald-400 font-bold">Plataforma DeVici</div>
          </div>

          <div className="divide-y divide-zinc-800/60">
            <div className="grid grid-cols-2 p-3 items-center hover:bg-zinc-900/30 transition-colors">
              <div className="text-zinc-500 pr-3 border-r border-zinc-800">Baixar planilhas de 50MB da Caixa e filtrar manualmente</div>
              <div className="text-zinc-300 pl-3 font-medium">Base 100% indexada e pesquisável em tempo real</div>
            </div>

            <div className="grid grid-cols-2 p-3 items-center hover:bg-zinc-900/30 transition-colors">
              <div className="text-zinc-500 pr-3 border-r border-zinc-800">Digitar códigos um por um em cada linha de serviço</div>
              <div className="text-zinc-300 pl-3 font-medium">Auto-reconhecimento semântico por descrição ou código</div>
            </div>

            <div className="grid grid-cols-2 p-3 items-center hover:bg-zinc-900/30 transition-colors">
              <div className="text-zinc-500 pr-3 border-r border-zinc-800">Risco de misturar valores desonerados vs. não desonerados</div>
              <div className="text-zinc-300 pl-3 font-medium">Alternância estrita de regime com 1 clique</div>
            </div>

            <div className="grid grid-cols-2 p-3 items-center hover:bg-zinc-900/30 transition-colors">
              <div className="text-zinc-500 pr-3 border-r border-zinc-800">Cálculo de BDI isolado com risco de glosa em licitação</div>
              <div className="text-zinc-300 pl-3 font-medium">Calculadora integrada de BDI com quartis do TCU (Acórdão 2622)</div>
            </div>

            <div className="grid grid-cols-2 p-3 items-center hover:bg-zinc-900/30 transition-colors">
              <div className="text-zinc-500 pr-3 border-r border-zinc-800">Tempo médio: 6 a 12 horas por projeto</div>
              <div className="text-emerald-400 pl-3 font-bold font-mono">Tempo médio: &lt; 2 minutos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-16 max-w-6xl mx-auto px-4 sm:px-6 space-y-10 border-t border-zinc-800">
        <div className="text-center space-y-1">
          <div className="text-xs font-mono uppercase text-zinc-500 font-semibold">Licenciamento</div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
            Planos e Acesso
          </h2>
          <p className="text-xs text-zinc-400">
            Sem contratos de longo prazo. Cancele quando quiser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="hover-lift bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-lg p-6 flex flex-col justify-between space-y-6 transition-all duration-300">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-200">Plano Individual Free</h3>
                <p className="text-xs text-zinc-500">Para validação técnica da ferramenta.</p>
              </div>

              <div className="py-2">
                <span className="text-3xl font-extrabold font-mono text-zinc-100">R$ 0</span>
                <span className="text-xs text-zinc-500 font-mono"> / mês</span>
              </div>

              <ul className="space-y-2 text-xs text-zinc-400 pt-3 border-t border-zinc-800 font-mono">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>1 orçamento completo / mês</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Base SINAPI 08/2026</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Calculadora BDI TCU</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Exportação .xlsx com fórmulas</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login?mode=signup"
              className="hover-lift active:scale-[0.98] w-full py-2 px-3 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-semibold text-center transition-all"
            >
              Criar Conta Grátis
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="hover-lift bg-zinc-900/70 border-2 border-zinc-600 hover:border-emerald-500/80 rounded-lg p-6 flex flex-col justify-between space-y-6 relative transition-all duration-300 shadow-lg shadow-emerald-950/20">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">Plano Profissional</h3>
                  <p className="text-xs text-zinc-400">Para orçamentistas e engenheiros autônomos.</p>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800/60 animate-pulse">
                  Mais Usado
                </span>
              </div>

              <div className="py-2">
                <span className="text-3xl font-extrabold font-mono text-zinc-100">R$ 97</span>
                <span className="text-xs text-zinc-500 font-mono"> / mês</span>
              </div>

              <ul className="space-y-2 text-xs text-zinc-300 pt-3 border-t border-zinc-800 font-mono">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span><strong>Planilhas e obras ilimitadas</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Todas as 27 UFs do Brasil</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Regimes Desonerado e Não Desonerado</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Histórico corporativo em nuvem</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Suporte prioritário</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login?mode=signup"
              className="hover-lift active:scale-[0.98] w-full py-2 px-3 rounded-md bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold text-center transition-all shadow-sm"
            >
              Assinar Plano Pro
            </Link>
          </div>

          {/* Construtora Plan */}
          <div className="hover-lift bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 rounded-lg p-6 flex flex-col justify-between space-y-6 transition-all duration-300">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-zinc-200">Plano Construtora</h3>
                <p className="text-xs text-zinc-500">Para escritórios e empresas de engenharia.</p>
              </div>

              <div className="py-2">
                <span className="text-3xl font-extrabold font-mono text-zinc-100">R$ 247</span>
                <span className="text-xs text-zinc-500 font-mono"> / mês</span>
              </div>

              <ul className="space-y-2 text-xs text-zinc-400 pt-3 border-t border-zinc-800 font-mono">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tudo do Plano Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Até 5 acessos de engenheiros</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Memória de cálculo para licitação</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Adaptações &amp; novas funções sob demanda</span>
                </li>
              </ul>
            </div>

            <Link
              href="/login?mode=signup"
              className="hover-lift active:scale-[0.98] w-full py-2 px-3 rounded-md bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-semibold text-center transition-all"
            >
              Contatar Vendas
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-zinc-950 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            DeVici © {new Date().getFullYear()} • Plataforma de Engenharia de Custos
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="/consultas" className="hover:text-zinc-200 transition-colors">
              Consultar SINAPI
            </Link>
            <Link href="/ferramentas/calculadora-bdi" className="hover:text-zinc-200 transition-colors">
              Calculadora BDI TCU
            </Link>
            <Link href="/orcamento" className="hover:text-zinc-200 transition-colors">
              Orçamentador
            </Link>
            <Link href="/login" className="hover:text-zinc-200 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
