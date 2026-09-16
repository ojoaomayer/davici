'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calculator,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ArrowRight,
  Info,
  Layers,
  Table,
  Sparkles,
} from 'lucide-react'
import Navbar from '@/components/Navbar'

const TCU_RANGES = {
  ac: { min: 3.00, med: 4.00, max: 5.50, label: 'Administração Central (AC)' },
  sg: { min: 0.80, med: 0.80, max: 1.00, label: 'Seguro e Garantia (S+G)' },
  r: { min: 0.97, med: 0.97, max: 1.27, label: 'Risco (R)' },
  df: { min: 0.59, med: 1.23, max: 1.39, label: 'Despesas Financeiras (DF)' },
  l: { min: 6.16, med: 7.40, max: 8.96, label: 'Lucro (L)' },
  bdiSemDeson: { q1: 20.97, med: 22.12, q3: 26.44 },
  bdiComDeson: { q1: 24.23, med: 26.50, q3: 30.00 },
}

export default function CalculadoraBDIPage() {
  const [ac, setAc] = useState<number>(4.00)
  const [sg, setSg] = useState<number>(0.80)
  const [r, setR] = useState<number>(0.97)
  const [df, setDf] = useState<number>(1.23)
  const [l, setL] = useState<number>(7.40)

  const [pis, setPis] = useState<number>(0.65)
  const [cofins, setCofins] = useState<number>(3.00)
  const [iss, setIss] = useState<number>(3.00)
  const [comDesoneracao, setComDesoneracao] = useState<boolean>(false)
  const [cprb, setCprb] = useState<number>(4.50)

  const [copied, setCopied] = useState(false)

  const { totalTributos, bdi, status, statusLabel, statusColor } = useMemo(() => {
    const trib = pis + cofins + iss + (comDesoneracao ? cprb : 0)

    const AC = ac / 100
    const SG = sg / 100
    const R = r / 100
    const DF = df / 100
    const L = l / 100
    const T = trib / 100

    let bdiResult = 0
    if (1 - T > 0) {
      const num = (1 + AC + SG + R) * (1 + DF) * (1 + L)
      const den = 1 - T
      bdiResult = (num / den - 1) * 100
    }

    const range = comDesoneracao ? TCU_RANGES.bdiComDeson : TCU_RANGES.bdiSemDeson

    let stat: 'baixo' | 'ideal' | 'alto' = 'ideal'
    let label = 'Dentro da faixa de aceitabilidade do TCU (Acórdão 2622/2013)'
    let col = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'

    if (bdiResult < range.q1) {
      stat = 'baixo'
      label = 'Abaixo do 1º Quartil do TCU (Possível subavaliação de custos indiretos)'
      col = 'text-amber-400 bg-amber-500/10 border-amber-500/30'
    } else if (bdiResult > range.q3) {
      stat = 'alto'
      label = 'Acima do 3º Quartil do TCU (Exige justificativa técnica formal em licitações)'
      col = 'text-rose-400 bg-rose-500/10 border-rose-500/30'
    }

    return {
      totalTributos: trib,
      bdi: bdiResult,
      status: stat,
      statusLabel: label,
      statusColor: col,
    }
  }, [ac, sg, r, df, l, pis, cofins, iss, comDesoneracao, cprb])

  const copyMemorial = () => {
    const text = `MEMORIAL DE CÁLCULO DE BDI (ACÓRDÃO 2622/2013 - TCU)
Fórmula: BDI = [((1 + AC + S + R + G) * (1 + DF) * (1 + L)) / (1 - Tributos)] - 1

1. PARÂMETROS ADOTADOS:
- Administração Central (AC): ${ac.toFixed(2)}%
- Seguros e Garantias (S+G): ${sg.toFixed(2)}%
- Riscos (R): ${r.toFixed(2)}%
- Despesas Financeiras (DF): ${df.toFixed(2)}%
- Lucro Operacional (L): ${l.toFixed(2)}%

2. TRIBUTOS INCIDENTES:
- PIS: ${pis.toFixed(2)}%
- COFINS: ${cofins.toFixed(2)}%
- ISS: ${iss.toFixed(2)}%
${comDesoneracao ? `- CPRB (Desoneração): ${cprb.toFixed(2)}%\n` : ''}- Total de Tributos (T): ${totalTributos.toFixed(2)}%

3. RESULTADO:
BDI CALCULADO = ${bdi.toFixed(2)}%
Regime: ${comDesoneracao ? 'Com Desoneração (CPRB)' : 'Sem Desoneração (Padrão)'}
Enquadramento: ${statusLabel}
Fonte: DeVici Software de Engenharia (Acórdão 2622/2013-TCU)`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-blue-500/30 selection:text-white relative overflow-hidden">
      {/* Background Lighting & Blueprint Grid */}
      <div className="absolute inset-0 blueprint-grid pointer-events-none opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cinematic-glow pointer-events-none" />

      <Navbar />

      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="animate-fade-in border-b border-white/[0.08] pb-6 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 neon-dot-blue animate-pulse" />
            <span>MÓDULO TÉCNICO • ACÓRDÃO 2622/2013 - TCU PLENÁRIO</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
            Calculadora de BDI Oficial <span className="font-semibold text-blue-300">do TCU</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Cálculo de Benefícios e Despesas Indiretas para obras de edificações com verificação analítica de quartis de conformidade do Tribunal de Contas da União.
          </p>
        </div>

        {/* Workspace Columns */}
        <div className="animate-fade-in-up delay-100 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="glass-panel lg:col-span-7 rounded-2xl p-6 space-y-6 blueprint-box">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 border-b border-white/[0.08] pb-3 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 neon-dot-blue" />
                1. Parâmetros da Fórmula
              </span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">faixas edificações</span>
            </div>

            <div className="space-y-4">
              {/* AC */}
              <div className="bg-[#0b132b]/50 p-3.5 rounded-xl border border-white/[0.06] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Administração Central (AC)</span>
                  <span className="font-bold text-white">{ac.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.05"
                  value={ac}
                  onChange={(e) => setAc(parseFloat(e.target.value))}
                  className="w-full accent-blue-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Mín: 3,00%</span>
                  <span>Médio: 4,00%</span>
                  <span>Máx: 5,50%</span>
                </div>
              </div>

              {/* SG */}
              <div className="bg-[#0b132b]/50 p-3.5 rounded-xl border border-white/[0.06] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Seguros e Garantias (S+G)</span>
                  <span className="font-bold text-white">{sg.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.05"
                  value={sg}
                  onChange={(e) => setSg(parseFloat(e.target.value))}
                  className="w-full accent-blue-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Mín: 0,80%</span>
                  <span>Médio: 0,80%</span>
                  <span>Máx: 1,00%</span>
                </div>
              </div>

              {/* R */}
              <div className="bg-[#0b132b]/50 p-3.5 rounded-xl border border-white/[0.06] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Riscos (R)</span>
                  <span className="font-bold text-white">{r.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.05"
                  value={r}
                  onChange={(e) => setR(parseFloat(e.target.value))}
                  className="w-full accent-blue-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Mín: 0,97%</span>
                  <span>Médio: 0,97%</span>
                  <span>Máx: 1,27%</span>
                </div>
              </div>

              {/* DF */}
              <div className="bg-[#0b132b]/50 p-3.5 rounded-xl border border-white/[0.06] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Despesas Financeiras (DF)</span>
                  <span className="font-bold text-white">{df.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.05"
                  value={df}
                  onChange={(e) => setDf(parseFloat(e.target.value))}
                  className="w-full accent-blue-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Mín: 0,59%</span>
                  <span>Médio: 1,23%</span>
                  <span>Máx: 1,39%</span>
                </div>
              </div>

              {/* L */}
              <div className="bg-[#0b132b]/50 p-3.5 rounded-xl border border-white/[0.06] space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-slate-300">Lucro / Remuneração da Construtora (L)</span>
                  <span className="font-bold text-emerald-400">{l.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="0.1"
                  value={l}
                  onChange={(e) => setL(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Mín: 6,16%</span>
                  <span>Médio: 7,40%</span>
                  <span>Máx: 8,96%</span>
                </div>
              </div>
            </div>

            {/* Tributos */}
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 border-b border-white/[0.08] pb-3 pt-2">
              2. Tributos Incidentes sobre Faturamento
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#0b132b]/50 p-3 rounded-xl border border-white/[0.06] space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">PIS (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pis}
                  onChange={(e) => setPis(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#030712] border border-white/10 p-2 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="bg-[#0b132b]/50 p-3 rounded-xl border border-white/[0.06] space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">COFINS (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={cofins}
                  onChange={(e) => setCofins(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#030712] border border-white/10 p-2 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>

              <div className="bg-[#0b132b]/50 p-3 rounded-xl border border-white/[0.06] space-y-1.5">
                <label className="text-[11px] font-mono text-slate-400">ISS (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={iss}
                  onChange={(e) => setIss(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#030712] border border-white/10 p-2 rounded-lg text-xs font-mono text-white focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            {/* Desoneração Toggle */}
            <div className="bg-[#0b132b]/50 border border-white/[0.08] p-4 rounded-xl flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-white">Desoneração da Folha (CPRB +4,50%)</div>
                <div className="text-[11px] text-slate-400">Conforme Lei 12.844/2013 para o setor de construção civil</div>
              </div>
              <input
                type="checkbox"
                checked={comDesoneracao}
                onChange={(e) => setComDesoneracao(e.target.checked)}
                className="w-4 h-4 accent-blue-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel rounded-2xl p-6 space-y-5 blueprint-box">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 neon-dot-emerald" />
                <span>Resultado Consolidado</span>
              </div>

              <div className="text-center py-4 bg-[#030712]/80 rounded-xl border border-white/[0.08]">
                <div className="text-4xl sm:text-5xl font-mono font-bold text-emerald-400 tabular-nums">
                  {bdi.toFixed(2)}%
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1.5">
                  Total de Tributos (T): {totalTributos.toFixed(2)}%
                </div>
              </div>

              {/* Status Alert */}
              <div className={`p-4 rounded-xl border text-xs font-mono space-y-1 ${statusColor}`}>
                <div className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>Diagnóstico TCU:</span>
                </div>
                <div className="text-[11px] leading-relaxed font-normal">{statusLabel}</div>
              </div>

              {/* Quartile Table */}
              <div className="border border-white/[0.08] rounded-xl overflow-hidden text-xs font-mono">
                <div className="bg-[#0b132b]/80 p-2.5 text-slate-400 text-[10px] uppercase font-bold border-b border-white/[0.08]">
                  Quartis TCU para Edificações
                </div>
                <div className="grid grid-cols-3 divide-x divide-white/[0.08] text-center bg-[#030712]/60 text-xs">
                  <div className="p-2.5">
                    <div className="text-[10px] text-slate-400">1º Quartil</div>
                    <div className="font-bold text-slate-200 mt-0.5">
                      {comDesoneracao ? TCU_RANGES.bdiComDeson.q1 : TCU_RANGES.bdiSemDeson.q1}%
                    </div>
                  </div>
                  <div className="p-2.5 bg-blue-500/10">
                    <div className="text-[10px] text-emerald-400">Médio</div>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      {comDesoneracao ? TCU_RANGES.bdiComDeson.med : TCU_RANGES.bdiSemDeson.med}%
                    </div>
                  </div>
                  <div className="p-2.5">
                    <div className="text-[10px] text-slate-400">3º Quartil</div>
                    <div className="font-bold text-slate-200 mt-0.5">
                      {comDesoneracao ? TCU_RANGES.bdiComDeson.q3 : TCU_RANGES.bdiSemDeson.q3}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Copy Memorial Button */}
              <button
                type="button"
                onClick={copyMemorial}
                className="btn-secondary w-full py-2.5 text-xs font-mono font-medium flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Memorial Copiado para a Área de Transferência</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-blue-400" />
                    <span>Copiar Memorial para ART / Licitação</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Workflow Link */}
            <div className="glass-card p-5 rounded-2xl space-y-2 text-xs">
              <div className="font-semibold text-white">
                Aplicar BDI na Planilha SINAPI
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                O DeVici aplica este percentual automaticamente nas colunas com BDI em todas as etapas da sua planilha orçamentária.
              </p>
              <Link
                href="/orcamento"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 pt-1"
              >
                <span>Ir para o Orçamentador</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
