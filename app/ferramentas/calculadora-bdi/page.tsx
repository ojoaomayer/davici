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
    let col = 'text-emerald-400 bg-emerald-950/30 border-emerald-800/60'

    if (bdiResult < range.q1) {
      stat = 'baixo'
      label = 'Abaixo do 1º Quartil do TCU (Possível subavaliação)'
      col = 'text-amber-400 bg-amber-950/30 border-amber-800/60'
    } else if (bdiResult > range.q3) {
      stat = 'alto'
      label = 'Acima do 3º Quartil do TCU (Exige justificativa técnica formal)'
      col = 'text-red-400 bg-red-950/30 border-red-800/60'
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
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-100 selection:bg-zinc-800 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="border-b border-zinc-800 pb-5 space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>MÓDULO TÉCNICO • ACÓRDÃO 2622/2013 - TCU PLENÁRIO</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Calculadora de BDI Oficial do TCU
          </h1>
          <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
            Cálculo de Benefícios e Despesas Indiretas para obras públicas e privadas de edificações com verificação de quartis de aceitabilidade.
          </p>
        </div>

        {/* Workspace Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-zinc-900/40 border border-zinc-800 rounded-lg p-5 space-y-5">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2 flex items-center justify-between">
              <span>1. Parâmetros da Fórmula</span>
              <span className="text-[10px] text-zinc-500 lowercase font-normal">faixas edificações</span>
            </div>

            <div className="space-y-3.5">
              {/* AC */}
              <div className="bg-zinc-950/60 p-3 rounded border border-zinc-800/80 space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-300">Administração Central (AC)</span>
                  <span className="font-bold text-zinc-100">{ac.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.05"
                  value={ac}
                  onChange={(e) => setAc(parseFloat(e.target.value))}
                  className="w-full accent-zinc-200 bg-zinc-800 h-1.5 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Mín: 3,00%</span>
                  <span>Médio: 4,00%</span>
                  <span>Máx: 5,50%</span>
                </div>
              </div>

              {/* SG */}
              <div className="bg-zinc-950/60 p-3 rounded border border-zinc-800/80 space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-300">Seguros e Garantias (S+G)</span>
                  <span className="font-bold text-zinc-100">{sg.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.05"
                  value={sg}
                  onChange={(e) => setSg(parseFloat(e.target.value))}
                  className="w-full accent-zinc-200 bg-zinc-800 h-1.5 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Mín: 0,80%</span>
                  <span>Médio: 0,80%</span>
                  <span>Máx: 1,00%</span>
                </div>
              </div>

              {/* R */}
              <div className="bg-zinc-950/60 p-3 rounded border border-zinc-800/80 space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-300">Riscos (R)</span>
                  <span className="font-bold text-zinc-100">{r.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.05"
                  value={r}
                  onChange={(e) => setR(parseFloat(e.target.value))}
                  className="w-full accent-zinc-200 bg-zinc-800 h-1.5 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Mín: 0,97%</span>
                  <span>Médio: 0,97%</span>
                  <span>Máx: 1,27%</span>
                </div>
              </div>

              {/* DF */}
              <div className="bg-zinc-950/60 p-3 rounded border border-zinc-800/80 space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-300">Despesas Financeiras (DF)</span>
                  <span className="font-bold text-zinc-100">{df.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3"
                  step="0.05"
                  value={df}
                  onChange={(e) => setDf(parseFloat(e.target.value))}
                  className="w-full accent-zinc-200 bg-zinc-800 h-1.5 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Mín: 0,59%</span>
                  <span>Médio: 1,23%</span>
                  <span>Máx: 1,39%</span>
                </div>
              </div>

              {/* L */}
              <div className="bg-zinc-950/60 p-3 rounded border border-zinc-800/80 space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-300">Lucro / Remuneração da Construtora (L)</span>
                  <span className="font-bold text-emerald-400">{l.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="15"
                  step="0.1"
                  value={l}
                  onChange={(e) => setL(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 bg-zinc-800 h-1.5 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>Mín: 6,16%</span>
                  <span>Médio: 7,40%</span>
                  <span>Máx: 8,96%</span>
                </div>
              </div>
            </div>

            {/* Tributos */}
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800 pb-2 pt-2">
              2. Tributos Diretos sobre Faturamento
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800 space-y-1">
                <label className="text-[11px] font-mono text-zinc-400">PIS (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pis}
                  onChange={(e) => setPis(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-1.5 rounded text-xs font-mono text-zinc-100"
                />
              </div>

              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800 space-y-1">
                <label className="text-[11px] font-mono text-zinc-400">COFINS (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={cofins}
                  onChange={(e) => setCofins(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-1.5 rounded text-xs font-mono text-zinc-100"
                />
              </div>

              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-800 space-y-1">
                <label className="text-[11px] font-mono text-zinc-400">ISS (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={iss}
                  onChange={(e) => setIss(parseFloat(e.target.value) || 0)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-1.5 rounded text-xs font-mono text-zinc-100"
                />
              </div>
            </div>

            {/* Desoneração Toggle */}
            <div className="bg-zinc-950 border border-zinc-800 p-3 rounded flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-zinc-200">Desoneração da Folha (CPRB +4,50%)</div>
                <div className="text-[11px] text-zinc-500">Conforme Lei 12.844/2013 para construção civil</div>
              </div>
              <input
                type="checkbox"
                checked={comDesoneracao}
                onChange={(e) => setComDesoneracao(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-lg p-5 space-y-4">
              <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                Resultado Consolidado
              </div>

              <div className="text-center py-2 bg-zinc-950 rounded border border-zinc-800/80">
                <div className="text-4xl font-mono font-bold text-emerald-400 tabular-nums">
                  {bdi.toFixed(2)}%
                </div>
                <div className="text-[11px] font-mono text-zinc-500 mt-1">
                  Total de Tributos: {totalTributos.toFixed(2)}%
                </div>
              </div>

              {/* Status Alert */}
              <div className={`p-3 rounded border text-xs font-mono space-y-0.5 ${statusColor}`}>
                <div className="font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-current" />
                  <span>Diagnóstico TCU:</span>
                </div>
                <div className="text-[11px] leading-tight">{statusLabel}</div>
              </div>

              {/* Quartile Table */}
              <div className="border border-zinc-800 rounded overflow-hidden text-xs font-mono">
                <div className="bg-zinc-900 p-2 text-zinc-400 text-[10px] uppercase font-bold border-b border-zinc-800">
                  Quartis TCU para Edificações
                </div>
                <div className="grid grid-cols-3 divide-x divide-zinc-800 text-center bg-zinc-950 text-xs">
                  <div className="p-2">
                    <div className="text-[10px] text-zinc-500">1º Quartil</div>
                    <div className="font-bold text-zinc-300">
                      {comDesoneracao ? TCU_RANGES.bdiComDeson.q1 : TCU_RANGES.bdiSemDeson.q1}%
                    </div>
                  </div>
                  <div className="p-2 bg-zinc-900/40">
                    <div className="text-[10px] text-emerald-400">Médio</div>
                    <div className="font-bold text-emerald-400">
                      {comDesoneracao ? TCU_RANGES.bdiComDeson.med : TCU_RANGES.bdiSemDeson.med}%
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="text-[10px] text-zinc-500">3º Quartil</div>
                    <div className="font-bold text-zinc-300">
                      {comDesoneracao ? TCU_RANGES.bdiComDeson.q3 : TCU_RANGES.bdiSemDeson.q3}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Copy Memorial Button */}
              <button
                type="button"
                onClick={copyMemorial}
                className="w-full py-2 px-3 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 text-xs font-mono font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Memorial Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copiar Memorial para ART / Licitação</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Workflow Link */}
            <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded-lg space-y-2 text-xs">
              <div className="font-semibold text-zinc-200">
                Aplicar BDI na Planilha SINAPI
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                O DeVici aplica este percentual automaticamente nas colunas com BDI em todas as etapas da sua planilha.
              </p>
              <Link
                href="/orcamento"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 pt-1"
              >
                <span>Abrir Orçamentador</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
