# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Engenheiros, orçamentistas e construtoras que lidam com obras (públicas e privadas) e processos de licitação, precisando acelerar e garantir a precisão no levantamento de custos da obra.

## Product Purpose
Automatizar a elaboração de orçamentos de obras cruzando memoriais descritivos e planilhas diversas (XLSX, CSV, Revit) com bases oficiais (SINAPI/SICRO). O sistema visa economizar dias de trabalho manual (copia-e-cola) e eliminar erros, gerando orçamentos fechados e conferidos em minutos.

## Positioning
Um motor de correspondência semântica via IA com alta assertividade, que aceita os dados brutos exatamente do modo como o usuário os tem (sem exigir readequação a templates rígidos), pareando-os inteligentemente com as referências estaduais da SINAPI.

## Operating Context
Ocorre na rotina de fechamento de propostas de engenharia civil, onde há urgência para compor preços e BDI (Benefícios e Despesas Indiretas) visando entregar o orçamento final pronto para concorrências, licitações públicas ou precificações fechadas.

## Capabilities and Constraints
- Funcionalidade de upload nativo para planilhas sem necessidade de formatação prévia.
- Classificação automatizada do nível de confiança para cada item orçado.
- Exportação final em formato de planilha contendo as fórmulas calculadas e os respectivos BDIs (aderentes ao Acórdão 2622 do TCU).
- Integração de buscas diretas à base SINAPI para as 27 Unidades da Federação.
- Presença de planos de assinatura recorrentes para usuários profissionais e corporativos.

## Brand Commitments
- **Identidade Visual:** Preservar estritamente o tema Dark atual, focando especificamente em tons de slate, azul e o uso de âmbar para destaques.
- **Nome Oficial:** DeVici.

## Evidence on Hand
Projeto em andamento implementado com Next.js (App Router), React 19, TailwindCSS v4, Stripe, Firebase, integrando provedores de LLM. A interface possui alta maturidade técnica focada em um público exigente.

## Product Principles
1. **Redução de Fricção Inicial:** O sistema deve suportar os dados brutos do usuário. A complexidade de tradução técnica é responsabilidade da máquina.
2. **Confiança e Previsibilidade:** O usuário deve ter certeza absoluta da rastreabilidade do preço (bases do TCU/SINAPI) e saber a taxa de acerto do pareamento gerado pela IA.
3. **Agilidade Profissional:** Todo o design e as interações devem focar na produtividade e em atalhos que reduzam a carga cognitiva de quem trabalha elaborando propostas técnicas extensas.
