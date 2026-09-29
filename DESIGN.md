---
name: DeVici
description: Orçamentador automatizado para engenharia com inteligência artificial
colors:
  primary: "#38bdf8"
  secondary: "#3b82f6"
  tertiary: "#fbbf24"
  neutral-bg: "#020617"
  neutral-card: "#0b132b"
  neutral-fg: "#f8fafc"
  neutral-border: "rgba(255, 255, 255, 0.08)"
typography:
  display:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontWeight: 300
  body:
    fontFamily: "var(--font-geist-sans), sans-serif"
    fontWeight: 400
  label:
    fontFamily: "var(--font-geist-mono), monospace"
    fontWeight: 500
rounded:
  md: "16px"
  full: "9999px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.neutral-fg}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.full}"
    padding: "12px 32px"
  button-secondary:
    backgroundColor: "rgba(255, 255, 255, 0.04)"
    textColor: "{colors.neutral-fg}"
    rounded: "{rounded.full}"
    padding: "12px 32px"
---

# Design System: DeVici

## Overview

**Creative North Star: "O Painel de Controle Executivo"**

O DeVici é voltado para negócios, interfaces limpas e relatórios de alta visibilidade. O tom de voz da interface é tranquilo, acessível, didático e limpo, visando simplificar a complexidade inerente da rotina de engenharia civil e licitações. O ambiente visual rejeita distrações e ornamentos desnecessários, preferindo um minimalismo invisível que deixa os dados em destaque.

**Key Characteristics:**
- Foco absoluto na visibilidade da tipografia e legibilidade dos dados (tabular-nums).
- Estética Dark predominante e madura (tons profundos de grafite e ardósia).
- Transparências vítreas (glassmorphism) sofisticadas ao invés de blocos maciços de cor.

## Colors

A paleta evoca precisão e tecnologia através de tons escuros profundos salpicados de brilhos luminosos.

### Primary
- **Azul Oceano** (#38bdf8 / #0284c7): Usado para ações afirmativas, halos de luz de fundo e indicativos de progresso calmos e confiantes.

### Secondary
- **Azul Clássico** (#3b82f6): Suporte à cor primária, criando gradientes de profundidade e estados de hover nas superfícies.

### Tertiary
- **Laranja Neon** (#fbbf24): Utilizado com muita parcimônia para destaques críticos, acentos luminosos ou status de aviso, garantindo alta atenção imediata (ex: neon-dots).

### Neutral
- **Grafite Fundo** (#020617): O ambiente infinito. Cor base do body que ancora toda a iluminação.
- **Grafite Superfície** (#0b132b): Cor sólida de base para cartões (quando não são totalmente em glass).
- **Texto Primário** (#f8fafc): Alta legibilidade para leitura principal e títulos.
- **Bordas Sutis** (rgba(255, 255, 255, 0.08)): Divisores quase invisíveis que estruturam sem gritar.

### Named Rules
**The Ghost Border Rule.** Bordas sólidas são evitadas. A separação entre elementos deve preferencialmente ocorrer via contraste de fundo (glass) ou bordas de extrema baixa opacidade (8% branco).

## Typography

**Display Font:** Geist Sans (com fallback para sans-serif do sistema)
**Body Font:** Geist Sans
**Label/Mono Font:** Geist Mono

**Character:** Limpa, neutra e geométrica. Não compete com o conteúdo e traz modernidade funcional.

### Hierarchy
- **Display** (300, textos massivos): Títulos de seções principais ou frases de impacto no Hero. Letra leve para contrastar com o tamanho.
- **Headline** (400/500, tamanhos médios): Cabeçalhos de painéis e de cartões.
- **Body** (400, 14px-16px): Instruções e descritivos.
- **Label** (500, Mono, uppercase opcional): Tags técnicas, crachás de status, valores orçamentários (onde os algarismos tabulares são fundamentais).

### Named Rules
**The Tabular Data Rule.** Todo dado numérico, custo ou medida deve adotar tipografia tabular (Geist Mono ou `font-variant-numeric: tabular-nums`) para permitir varredura vertical perfeita em tabelas.

## Layout

O espaço adota áreas negativas generosas (Minimalismo Invisível). As seções são contidas em larguras fixas em telas grandes (`max-w-6xl`) para manter a linha de visão do usuário controlada. O espaçamento vertical entre blocos lógicos (`space-y-12` ou mais) é usado como respiro ao invés de linhas divisórias.

## Elevation & Depth

Camadas de vidro e luz (Glassmorphism). A profundidade é criada por desfoque de fundo (backdrop-blur), bordas translúcidas (rgba branco) e brilhos radiais luminosos (glow) emergindo do fundo escuro, sem depender de sombras projetadas (drop shadows) densas e convencionais.

### Shadow Vocabulary
- **Glow Radial** (`bg-cinematic-glow` ou radial-gradients): Foco de atenção atrás do conteúdo crítico, simulando luz de LED.
- **Glass Drop** (`box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 20px 40px rgba(0,0,0,0.6)`): Ancora o painel flutuante de vidro ao fundo, dando sensação tátil à borda superior.

## Shapes

As formas favorecem cantos arredondados contidos e ergonômicos.
- Cartões adotam raios de tamanho médio (`16px` / `rounded-2xl`).
- Botões de ação principais adotam cantos totalmente arredondados (`9999px` / `rounded-full` / pills).
- Acessórios técnicos (blueprint-box) utilizam cantos com traços finos angulares simulando papel de projeto arquitetônico.

## Components

O minimalismo invisível guia cada componente: mínima borda, máxima tipografia.

### Buttons
- **Shape:** Pill (9999px).
- **Primary:** Fundo branco (#ffffff) sobre fundo dark, texto escuro (#020617). Hover suavizado (tons claros off-white).
- **Secondary (Ghost):** Fundo ultra-translúcido (4% branco), texto branco com borda levíssima (10% branco). Hover aplica mais branco (8%).

### Cards / Containers (Glass Panels)
- **Corner Style:** 16px (rounded-2xl).
- **Background:** Vidro desfocado (ex: rgba(15, 23, 42, 0.35) com blur de 12 a 16px).
- **Shadow Strategy:** Reflexo interno de borda superior (`inset 0 1px 0 rgba(255,255,255,0.08)`) para simular espessura.
- **Internal Padding:** Generoso (`p-6` a `p-7`), valorizando o respiro (white space).

### Inputs / Fields
- **Style:** Fundos translúcidos muito discretos e mínima delimitação externa. Priorizam o espaço interno para inserção clara dos valores do orçamento.

## Do's and Don'ts

### Do:
- **Do** usar o `glass-card` para hospedar informações modulares densas de engenharia, isolando visualmente o ruído do fundo.
- **Do** formatar valores e IDs de códigos SINAPI utilizando a fonte Mono do sistema para consistência horizontal.
- **Do** focar em interfaces onde a maior parte do fundo permanece escuro para descansar a vista (Painel de Controle Executivo).

### Don't:
- **Don't** adotar contornos sólidos e grossos (ex: borders em `#fff` de 2px ou mais) para delimitar contêineres.
- **Don't** saturar a tela com o Azul Oceano; ele deve permanecer como sotaque ou luz de fundo, não como cor de pintura maciça.
