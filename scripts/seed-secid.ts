import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import OpenAI from 'openai'
import * as xlsx from 'xlsx'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const openaiKey = process.env.GEMINI_API_KEY
let openai: OpenAI | null = null
if (openaiKey) {
  openai = new OpenAI({ apiKey: openaiKey, baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/' })
} else {
  console.warn('GEMINI_API_KEY não encontrada em .env. A geração de embeddings será simulada/omitida.')
}

let db: FirebaseFirestore.Firestore | null = null
try {
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  let serviceAccount
  if (serviceAccountRaw) {
    serviceAccount = JSON.parse(serviceAccountRaw)
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')
    }
  }

  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
    })
    db = getFirestore()
    console.log('Firebase Admin inicializado com sucesso.')
  } else {
    console.warn('FIREBASE_SERVICE_ACCOUNT_KEY não configurada. Itens serão salvos em data/secid_db.json.')
  }
} catch (error) {
  console.warn('Aviso na inicialização do Firebase Admin:', error instanceof Error ? error.message : error)
}

export interface SecidDbItem {
  id: string
  codigo: string
  descricao: string
  unidade: string
  tipo: string
  origem: 'SECID_PR'
  resolucao: string
  custo_desonerado: number
  custo_nao_desonerado: number
  precos_nao_desonerado: Record<string, number>
  precos_desonerado: Record<string, number>
  observacao?: string
  embedding?: number[]
}

// Catálogo com as descrições técnicas canônicas da Resolução SECID nº 094/2026
const PROJETOS_CANONICOS: Array<{
  item: string
  codigo: string
  descricao: string
  unidade: string
  valorBase: number
  observacao: string
}> = [
  {
    item: '1',
    codigo: 'SECID-01',
    descricao: 'Sondagem Geológica a Percussão SPT (Reconhecimento de Solo e Subsolo com ART)',
    unidade: 'FURO',
    valorBase: 1139.26,
    observacao: 'Taxa mínima de mobilização R$ 2.136,12. Custo por furo de sondagem SPT.',
  },
  {
    item: '2',
    codigo: 'SECID-02',
    descricao: 'Ensaio de Percolação do Solo para Fossa Séptica, Filtro Anaeróbio e Sumidouro',
    unidade: 'FURO',
    valorBase: 560.73,
    observacao: 'Determinação da taxa de percolação para dimensionamento de tratamento de esgoto.',
  },
  {
    item: '3',
    codigo: 'SECID-03',
    descricao: 'Levantamento Topográfico Planialtimétrico Cadastral com Estação Total ou GNSS RTK',
    unidade: 'M2',
    valorBase: 0.74,
    observacao: 'Planialtimetria cadastral completa, curvas de nível e amarração georreferenciada.',
  },
  {
    item: '4',
    codigo: 'SECID-04',
    descricao: 'Projeto de Canteiro de Obras, Instalações Provisórias de Vivência e Segurança',
    unidade: 'M2',
    valorBase: 0.78,
    observacao: 'Dimensionamento de alojamento, sanitários, tapumes e layouts de canteiro conforme NR-18.',
  },
  {
    item: '5',
    codigo: 'SECID-05',
    descricao: 'Projeto de Terraplenagem, Geometria de Platôs e Volumes de Corte e Aterro',
    unidade: 'M2',
    valorBase: 0.40,
    observacao: 'Perfis longitudinais e transversais com cálculo de cubagem de bota-fora ou empréstimo.',
  },
  {
    item: '6',
    codigo: 'SECID-06',
    descricao: 'Projeto de Arquitetura (Estudo Preliminar, Anteprojeto e Projeto Executivo de Edificações)',
    unidade: 'M2',
    valorBase: 39.16,
    observacao: 'Elaboração completa de arquitetura, plantas, cortes, fachadas, ampliações e memoriais.',
  },
  {
    item: '6.1',
    codigo: 'SECID-06.1',
    descricao: 'Projeto de Implantação Arquitetônica, Locação e Níveis de Edificações',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Implantação no terreno, cotas de nível de piso e acessos.',
  },
  {
    item: '7',
    codigo: 'SECID-07',
    descricao: 'Compatibilização e Coordenação de Projetos de Engenharia e Arquitetura (BIM / Clash Detection)',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Coordenação interdisciplinar de interferências entre arquitetura, estrutura e instalações.',
  },
  {
    item: '8',
    codigo: 'SECID-08',
    descricao: 'Projeto de Comunicação Visual, Sinalização Tátil e Acessibilidade (NBR 9050)',
    unidade: 'M2',
    valorBase: 3.92,
    observacao: 'Sinalização visual interna, totens, mapas táteis e rotas acessíveis.',
  },
  {
    item: '9',
    codigo: 'SECID-09',
    descricao: 'Projeto de Paisagismo, Arborização, Áreas Verdes e Espécies Nativas',
    unidade: 'M2',
    valorBase: 0.59,
    observacao: 'Especificação botânica, irrigação paisagística e tratamento de canteiros.',
  },
  {
    item: '10',
    codigo: 'SECID-10',
    descricao: 'Projeto de Pavimentação, Arruamento, Guias, Sarjetas e Passeios Públicos',
    unidade: 'M2',
    valorBase: 0.59,
    observacao: 'Dimensionamento de subleito, base, sub-base e revestimento asfáltico ou paver.',
  },
  {
    item: '11',
    codigo: 'SECID-11',
    descricao: 'Projeto de Impermeabilização e Proteção de Estruturas (NBR 9575)',
    unidade: 'M2',
    valorBase: 0.59,
    observacao: 'Sistemas rígidos e flexíveis em lajes, reservatórios, baldrames e áreas molhadas.',
  },
  {
    item: '11.1',
    codigo: 'SECID-11.1',
    descricao: 'Projeto de Implantação e Detalhamento de Impermeabilização',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Locação e detalhes executivos de impermeabilização.',
  },
  {
    item: '12',
    codigo: 'SECID-12',
    descricao: 'Projeto Estrutural de Fundações (Sapatas, Blocos, Estacas e Tubulões)',
    unidade: 'M2',
    valorBase: 11.87,
    observacao: 'Dimensionamento geotécnico e estrutural de infraestrutura profunda e rasa.',
  },
  {
    item: '12.1',
    codigo: 'SECID-12.1',
    descricao: 'Projeto de Implantação e Locação de Fundações e Contenções',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Planta de locação de cargas e centros de gravidade de pilares.',
  },
  {
    item: '13',
    codigo: 'SECID-13',
    descricao: 'Projeto Estrutural em Concreto Armado (Superestrutura, Pilares, Vigas e Lajes)',
    unidade: 'M2',
    valorBase: 17.80,
    observacao: 'Cálculo estrutural, armações, fôrmas, tabela de ferros e memoriais de cálculo.',
  },
  {
    item: '13.1',
    codigo: 'SECID-13.1',
    descricao: 'Projeto de Implantação Estrutural de Concreto Armado',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Implantação e interface com as fundações.',
  },
  {
    item: '14',
    codigo: 'SECID-14',
    descricao: 'Projeto Estrutural Metálico (Estruturas de Aço, Coberturas, Mezaninos e Galpões)',
    unidade: 'M2',
    valorBase: 16.32,
    observacao: 'Perfis laminados e soldados, ligações parafusadas, soldas e contraventamentos.',
  },
  {
    item: '14.1',
    codigo: 'SECID-14.1',
    descricao: 'Projeto de Implantação de Estrutura Metálica',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Locação de chumbadores e placas de base.',
  },
  {
    item: '15',
    codigo: 'SECID-15',
    descricao: 'Projeto Estrutural em Madeira (Tesouras, Galpões e Coberturas de Madeira)',
    unidade: 'M2',
    valorBase: 16.32,
    observacao: 'Cálculo de estruturas em madeira conforme NBR 7190.',
  },
  {
    item: '15.1',
    codigo: 'SECID-15.1',
    descricao: 'Projeto de Implantação de Estruturas de Madeira',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Pontos de ancoragem e apoio.',
  },
  {
    item: '16',
    codigo: 'SECID-16',
    descricao: 'Projeto de Instalações Hidrossanitárias e Drenagem Pluvial (Água Fria, Quente, Esgoto e Chuva)',
    unidade: 'M2',
    valorBase: 13.35,
    observacao: 'Dimensionamento de ramais, colunas, barriletes, caixas de gordura e captação pluvial.',
  },
  {
    item: '16.1',
    codigo: 'SECID-16.1',
    descricao: 'Projeto de Implantação de Redes Hidrossanitárias e Drenagem Externa',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Conexão com a rede pública de esgoto e concessionária de água.',
  },
  {
    item: '17',
    codigo: 'SECID-17',
    descricao: 'Projeto de Instalações de Gases Combustíveis (GLP, GN e Centrais de Gás)',
    unidade: 'M2',
    valorBase: 1.19,
    observacao: 'Redes de distribuição, reguladores de pressão e abrigos de botijões.',
  },
  {
    item: '18',
    codigo: 'SECID-18',
    descricao: 'Projeto de Instalações de Gases Medicinais (Oxigênio, Óxido Nitroso, Vácuo e Ar Medicinal)',
    unidade: 'M2',
    valorBase: 1.19,
    observacao: 'Para unidades básicas de saúde, clínicas e hospitais conforme normas Anvisa.',
  },
  {
    item: '19',
    codigo: 'SECID-19',
    descricao: 'Projeto de Instalações Elétricas, Cabeamento Estruturado, SPDA e Telecomunicações',
    unidade: 'M2',
    valorBase: 14.83,
    observacao: 'Circuitos, quadros de distribuição, proteção contra surtos, dados, voz e fibra óptica.',
  },
  {
    item: '19.1',
    codigo: 'SECID-19.1',
    descricao: 'Projeto de Implantação Elétrica e Entrada de Serviço de Energia',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Ramal de entrada da concessionária de energia (Copel).',
  },
  {
    item: '20',
    codigo: 'SECID-20',
    descricao: 'Projeto de Geração Fotovoltaica e Energia Solar On-Grid / Off-Grid',
    unidade: 'M2',
    valorBase: 3.70,
    observacao: 'Dimensionamento de módulos fotovoltaicos, inversores, proteções e acesso à rede.',
  },
  {
    item: '21',
    codigo: 'SECID-21',
    descricao: 'Projeto de Entrada e Transformação de Energia (Subestação Abrigada / Padrão Copel)',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Transformador, cabine de medição e proteção de média tensão.',
  },
  {
    item: '22',
    codigo: 'SECID-22',
    descricao: 'Projeto Preventivo contra Incêndio e a Desastres (PPCI / Corpo de Bombeiros)',
    unidade: 'M2',
    valorBase: 3.70,
    observacao: 'Extintores, hidrantes, sinalização de emergência, iluminação de rota e alarme.',
  },
  {
    item: '23',
    codigo: 'SECID-23',
    descricao: 'Projeto de Climatização, Ventilação e Exaustão Mecânica (HVAC / Ar Condicionado)',
    unidade: 'M2',
    valorBase: 7.42,
    observacao: 'Carga térmica, dutos, split/VRF e renovação de ar conforme NBR 16401 e PMOC.',
  },
  {
    item: '24',
    codigo: 'SECID-24',
    descricao: 'PGRCC Simplificado - Plano de Gerenciamento de Resíduos da Construção Civil',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Classificação de resíduos classe A, B, C e D para obras de pequeno porte.',
  },
  {
    item: '25',
    codigo: 'SECID-25',
    descricao: 'PGRCC Completo - Plano de Gerenciamento de Resíduos da Construção Civil',
    unidade: 'UN',
    valorBase: 3204.18,
    observacao: 'Plano executivo com áreas de triagem, destinação final licenciada e transporte.',
  },
  {
    item: '26',
    codigo: 'SECID-26',
    descricao: 'PGRSS - Plano de Gerenciamento de Resíduos de Serviços de Saúde',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Para edificações com atendimento médico, odontológico ou ambulatorial.',
  },
  {
    item: '27',
    codigo: 'SECID-27',
    descricao: 'PGRS Simplificado - Plano de Gerenciamento de Resíduos Sólidos Urbanos',
    unidade: 'UN',
    valorBase: 2136.12,
    observacao: 'Estimativa de geração de resíduos e logística reversa básica.',
  },
  {
    item: '28',
    codigo: 'SECID-28',
    descricao: 'PGRS Completo - Plano de Gerenciamento de Resíduos Sólidos Integrado',
    unidade: 'UN',
    valorBase: 3560.20,
    observacao: 'Diagnóstico e diretrizes completas de resíduos sólidos.',
  },
  {
    item: '30',
    codigo: 'SECID-30',
    descricao: 'Orçamento Executivo de Obras, Levantamento de Quantitativos, Caderno de Encargos e Curva ABC',
    unidade: 'M2',
    valorBase: 7.42,
    observacao: 'Planilha orçamentária detalhada com base SINAPI/SECID, composições e BDI.',
  },
  {
    item: '31',
    codigo: 'SECID-31',
    descricao: 'Consultoria Técnica Especializada de Engenharia / Parecer Técnico / Hora Técnica',
    unidade: 'H',
    valorBase: 178.01,
    observacao: 'Hora técnica de engenheiro sênior para consultorias, laudos e perícias técnicas.',
  },
]

// Serviços Técnicos Complementares e Honorários Profissionais presentes na base SECID
const SERVICOS_COMPLEMENTARES: Array<{
  codigo: string
  descricao: string
  unidade: string
  valorBase: number
  tipo?: string
  observacao: string
}> = [
  {
    codigo: 'SECID-90768',
    descricao: 'Arquiteto de Obra Júnior com Encargos Complementares (Honorários Técnicos)',
    unidade: 'H',
    valorBase: 142.67,
    tipo: 'honorario_tecnico',
    observacao: 'Hora técnica de arquiteto júnior com encargos sociais e trabalhistas.',
  },
  {
    codigo: 'SECID-90769',
    descricao: 'Arquiteto de Obra Pleno com Encargos Complementares (Honorários Técnicos)',
    unidade: 'H',
    valorBase: 150.64,
    tipo: 'honorario_tecnico',
    observacao: 'Hora técnica de arquiteto pleno com encargos sociais e trabalhistas.',
  },
  {
    codigo: 'SECID-90770',
    descricao: 'Arquiteto de Obra Sênior com Encargos Complementares (Honorários Técnicos)',
    unidade: 'H',
    valorBase: 157.46,
    tipo: 'honorario_tecnico',
    observacao: 'Hora técnica de arquiteto sênior para elaboração e fiscalização de projetos.',
  },
  {
    codigo: 'SECID-90777',
    descricao: 'Engenheiro Civil de Obra Júnior com Encargos Complementares (Honorários Técnicos)',
    unidade: 'H',
    valorBase: 146.07,
    tipo: 'honorario_tecnico',
    observacao: 'Hora técnica de engenheiro civil júnior para suporte a projetos e orçamentação.',
  },
  {
    codigo: 'SECID-93565',
    descricao: 'Engenheiro Civil de Obra Júnior - Dedicação Mensal (Consultoria e Fiscalização Técnica)',
    unidade: 'MES',
    valorBase: 25185.04,
    tipo: 'honorario_tecnico',
    observacao: 'Custo mensal integral de engenheiro civil com encargos complementares.',
  },
  {
    codigo: 'SECID-90781',
    descricao: 'Topógrafo com Encargos Complementares (Hora Técnica de Campo/Gabinete)',
    unidade: 'H',
    valorBase: 38.48,
    tipo: 'servico_campo',
    observacao: 'Hora de topógrafo profissional para levantamentos e nivelamentos.',
  },
  {
    codigo: 'SECID-94296',
    descricao: 'Topógrafo com Encargos Complementares - Dedicação Mensal',
    unidade: 'MES',
    valorBase: 6615.40,
    tipo: 'servico_campo',
    observacao: 'Custo mensal integral de topógrafo com encargos.',
  },
  {
    codigo: 'SECID-6175',
    descricao: 'Técnico em Sondagem com Encargos Complementares (Operação de Amostrador SPT)',
    unidade: 'H',
    valorBase: 29.08,
    tipo: 'servico_campo',
    observacao: 'Hora técnica para sondagem geológica e coleta de amostras.',
  },
  {
    codigo: 'SECID-LAUDO-01',
    descricao: 'Laudo Pericial de Vistoria Cautelar de Vizinhança e Inspeção Predial de Imóveis Confrontantes',
    unidade: 'UN',
    valorBase: 3560.20,
    tipo: 'laudo_tecnico',
    observacao: 'Inspeção técnica com registro fotográfico e memorial de anomalias pré-obra com ART.',
  },
  {
    codigo: 'SECID-ASBUILT-01',
    descricao: 'Projeto As-Built (Como Construído) de Arquitetura e Instalações Prediais',
    unidade: 'M2',
    valorBase: 5.94,
    tipo: 'projeto_executivo',
    observacao: 'Levantamento cadastral da edificação construída e atualização dos desenhos técnicos.',
  },
  {
    codigo: 'SECID-ART-01',
    descricao: 'Emissão e Registro de ART / RRT de Cargo/Função e Elaboração de Projetos Técnicos',
    unidade: 'UN',
    valorBase: 350.00,
    tipo: 'taxa_tecnica',
    observacao: 'Anotação ou Registro de Responsabilidade Técnica junto ao CREA/CAU.',
  },
]

async function generateEmbedding(text: string): Promise<number[] | undefined> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return undefined

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: {
          parts: [{ text }],
        },
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.warn(`Erro na API Gemini (${response.status}):`, errText.slice(0, 100))
      return undefined
    }

    const data = await response.json()
    return data?.embedding?.values
  } catch (err: any) {
    console.warn(`Erro ao gerar embedding:`, err.message?.slice(0, 80))
    return undefined
  }
}

async function main() {
  console.log('=== Iniciando Ingestão da Base SECID/PR (Projetos & Serviços Técnicos) ===')

  // 1. Verificar planilhas na pasta /data/Secid
  const secidDir = path.resolve(process.cwd(), 'data/Secid')
  const defaultFile = path.join(secidDir, 'Planilha de Servicos Sintetica - NAO DESONERADA.xlsm')

  const targetPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultFile
  console.log(`Carregando planilha SECID de referência: ${targetPath}`)

  let parsedExcelRows: any[] = []
  if (fs.existsSync(targetPath)) {
    try {
      const wb = xlsx.readFile(targetPath)
      const wsProjetos = wb.Sheets['CUSTOS DE PROJETOS']
      if (wsProjetos) {
        console.log('Aba [CUSTOS DE PROJETOS] encontrada na planilha SECID/PR.')
        for (let r = 24; r <= 61; r++) {
          const itemNum = wsProjetos[`B${r}`]?.v
          const desc = wsProjetos[`C${r}`]?.v
          const unit = wsProjetos[`D${r}`]?.v
          const valF = wsProjetos[`F${r}`]?.v
          if (desc && String(desc).trim()) {
            parsedExcelRows.push({
              item: String(itemNum || '').trim(),
              descricaoExcel: String(desc).trim(),
              unidadeExcel: String(unit || 'UN').trim(),
              valorExcel: typeof valF === 'number' ? valF : parseFloat(String(valF || '0').replace(',', '.')) || 0,
            })
          }
        }
        console.log(`Extraídos ${parsedExcelRows.length} itens da aba oficial CUSTOS DE PROJETOS.`)
      }
    } catch (e: any) {
      console.warn('Leitura da planilha SECID gerou aviso:', e.message)
    }
  } else {
    console.warn(`Arquivo ${targetPath} não encontrado, usando catálogo canônico embutido da Resolução SECID nº 094/2026.`)
  }

  // 2. Montar lista consolidada de itens SECID/PR
  const allItems: SecidDbItem[] = []

  // Itens Canônicos da Resolução 094/2026
  for (const item of PROJETOS_CANONICOS) {
    const excelMatch = parsedExcelRows.find(p => p.item === item.item)
    const valorUnitario = excelMatch && excelMatch.valorExcel > 0 ? excelMatch.valorExcel : item.valorBase

    allItems.push({
      id: item.codigo,
      codigo: item.codigo,
      descricao: item.descricao,
      unidade: item.unidade,
      tipo: 'projeto_servico_tecnico',
      origem: 'SECID_PR',
      resolucao: 'Resolução SECID nº 094/2026',
      custo_desonerado: valorUnitario,
      custo_nao_desonerado: valorUnitario,
      precos_nao_desonerado: { PR: valorUnitario },
      precos_desonerado: { PR: valorUnitario },
      observacao: item.observacao,
    })
  }

  // Serviços Complementares & Honorários
  for (const s of SERVICOS_COMPLEMENTARES) {
    allItems.push({
      id: s.codigo,
      codigo: s.codigo,
      descricao: s.descricao,
      unidade: s.unidade,
      tipo: s.tipo || 'servico_tecnico',
      origem: 'SECID_PR',
      resolucao: 'Resolução SECID nº 094/2026 / SINAPI PR',
      custo_desonerado: s.valorBase,
      custo_nao_desonerado: s.valorBase,
      precos_nao_desonerado: { PR: s.valorBase },
      precos_desonerado: { PR: s.valorBase },
      observacao: s.observacao,
    })
  }

  console.log(`Total de ${allItems.length} itens técnicos preparados para ingestão.`)

  // 3. Gerar embeddings (se Gemini API estiver configurada)
  console.log('Processando embeddings para cada descrição...')
  let embeddingsCount = 0
  for (let i = 0; i < allItems.length; i++) {
    const it = allItems[i]
    if (openaiKey) {
      const emb = await generateEmbedding(`${it.descricao} ${it.unidade} ${it.observacao || ''}`)
      if (emb) {
        it.embedding = emb
        embeddingsCount++
      }
      // Pequena pausa para respeitar taxa de requisições
      if (i % 5 === 0 && i > 0) {
        await new Promise(r => setTimeout(r, 200))
      }
    }
  }
  console.log(`Embeddings gerados para ${embeddingsCount}/${allItems.length} itens.`)

  // 4. Salvar localmente em data/secid_db.json
  const dataDir = path.resolve(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

  const jsonOutputPath = path.join(dataDir, 'secid_db.json')
  fs.writeFileSync(jsonOutputPath, JSON.stringify(allItems, null, 2), 'utf8')
  console.log(`Base SECID salva localmente em: ${jsonOutputPath} (${(fs.statSync(jsonOutputPath).size / 1024).toFixed(1)} KB)`)

  // 5. Salvar no Firestore na coleção dedicada 'secid_itens' (se Firebase configurado)
  if (db) {
    try {
      db.settings({ ignoreUndefinedProperties: true })
    } catch {}

    console.log(`Gravando ${allItems.length} itens na coleção Firestore 'secid_itens' em lotes menores...`)
    const CHUNK_SIZE = 5
    for (let i = 0; i < allItems.length; i += CHUNK_SIZE) {
      const chunk = allItems.slice(i, i + CHUNK_SIZE)
      const batch = db.batch()
      for (const item of chunk) {
        const docRef = db.collection('secid_itens').doc(item.codigo)
        const dataToSave: any = { ...item }
        if (!dataToSave.embedding) delete dataToSave.embedding
        if (!dataToSave.observacao) delete dataToSave.observacao
        batch.set(docRef, dataToSave, { merge: true })
      }
      await batch.commit()
      console.log(`Gravados itens ${i + 1} a ${Math.min(i + CHUNK_SIZE, allItems.length)} no Firestore.`)
    }
    console.log(`Sucesso: Todos os ${allItems.length} itens gravados no Firestore na coleção 'secid_itens'!`)
  } else {
    console.log('Firebase não configurado para gravação direta. Base local data/secid_db.json está pronta.')
  }

  console.log('=== Ingestão SECID/PR concluída com sucesso! ===')
}

main().catch((err) => {
  console.error('Erro na execução do seed SECID:', err)
  process.exit(1)
})
