# Arquitetura do Ecossistema mim-core

## Estado

**Proposta / Experimental.** Este documento não tem autoridade canônica, não é metodologia oficial do Sistema MIM, e não altera nenhum ADR, documento metodológico ou o NEF. Registra apenas o entendimento atual sobre como as camadas hoje se relacionam.

**Origem:** sessão de auditoria de estrutura do mim-core, 2026-07-28.

**Escopo declarado:** este documento descreve **exclusivamente o ecossistema governado pelo mim-core** — não a arquitetura da Neurônio Capital como um todo. Partes da empresa que não passam pela governança do mim-core estão fora deste documento.

---

## 1. Contexto e motivação

Uma auditoria de estrutura do mim-core (2026-07-28) identificou uma lacuna: nenhum documento existente trata o mim-core, o NEF e os projetos consumidores como uma unidade arquitetural. Cada projeto vive isolado em `base-canonica/projetos/<nome>/`, e a única referência estrutural a mais de um projeto é o placeholder `indice-global.yaml` ("populado só quando existir um 2º projeto").

O ADR-000 (`docs/adr/ADR-000-arquitetura-tecnica-sistema-mim.md`) descreve a arquitetura *interna* do mim-core (Base Canônica, Motor de Convergência, Context Builder etc.), mas não descreve como o mim-core se relaciona com o NEF nem com os projetos que consome. Este documento preenche esse ponto específico, sem reabrir ou substituir o ADR-000.

## 2. Escopo e não-escopo

**Este documento descreve:**
- o que é o mim-core, o NEF e um projeto consumidor, no nível de camada;
- como as três camadas se relacionam entre si;
- como o conhecimento flui entre elas, em termos gerais;
- quais responsabilidades pertencem claramente a cada camada.

**Este documento explicitamente não descreve:**
- protocolos de comunicação entre camadas;
- esquema de metadados;
- regras de governança específicas (quem aprova o quê, com que critério);
- o mecanismo interno do NEF;
- a arquitetura da Neurônio Capital além do que o mim-core governa.

Esses pontos ficam para propostas futuras, apoiadas neste documento como referência de camadas.

## 3. As três camadas

### 3.1 O que é o mim-core

O mim-core é a **biblioteca de governança reutilizável** do Sistema MIM (ADR-000: "biblioteca de governança reutilizável (library/core), não... aplicação SaaS"). Organiza o conhecimento de cada projeto consumidor em uma Base Canônica própria (`base-canonica/projetos/<nome>/`), separando `fontes/` (escrito por humanos), `derivados/` (recalculado a partir das fontes) e `indices/` (reservado para busca). É consumido por outros projetos como dependência, não como serviço hospedado.

Neste documento, o mim-core é tratado como a camada de **governança da evolução do conhecimento** — decide o que entra na Base Canônica, sob qual autoridade (ADR-001: o repositório de código do projeto é a fonte primária; `fontes/` é representação governada, não a fonte em si) e sob qual estado metodológico (Experimental / Validado / Canônico, conforme `VALIDACAO-EXPERIMENTAL.md`).

### 3.2 O que é o NEF

O NEF é mencionado no repositório apenas de forma indireta até o momento (ex.: "a Hero do NEF" em `PROPOSTAS-EM-OBSERVACAO.md`; "validações no NEF" em `VALIDACAO-EXPERIMENTAL.md`). Nenhum documento do NEF existe nesta Base Canônica, e este documento **não define nem altera** a natureza interna do NEF.

Para os fins deste documento, o NEF é tratado, por caracterização fornecida nesta sessão (2026-07-28), como a camada que **materializa os padrões aprovados** — ou seja, onde um padrão de conhecimento, uma vez validado pela governança do mim-core, ganha forma concreta e reutilizável. Esta caracterização é Experimental e depende de confirmação a partir da documentação própria do NEF, que está fora do escopo e da autoridade deste documento.

### 3.3 O que são os projetos consumidores

Projetos consumidores são os produtos que usam o mim-core como dependência e cuja Base Canônica vive sob `base-canonica/projetos/<nome>/`. Hoje:

- **FullCommerce** — único projeto consumidor com representação real na Base Canônica (`base-canonica/projetos/FullCommerce/`), com `Constituicao.md`, ADRs e timeline próprios.
- **Lime** e **NeuroHub** — citados nesta sessão (2026-07-28) como projetos consumidores atuais ou futuros. Nenhum dos dois tem, até o momento, qualquer representação na Base Canônica deste repositório — a afirmação de que existem consta apenas como relato desta conversa, não como fato verificado neste repositório.
- **Futuros** — qualquer novo projeto que venha a consumir o mim-core segue, por extensão, o mesmo padrão estrutural do FullCommerce (`fontes/`, `derivados/`, `indices/`, `manifesto.yaml`, `timeline/`).

## 4. Relação entre as camadas

```
Produtos consumidores
   (FullCommerce, Lime, NeuroHub, futuros)
        │
        │  produzem
        ▼
   Evidências
        │
        │  governadas por
        ▼
      mim-core
        │
        │  aprova e envia para
        ▼
        NEF
        │
        │  materializa e devolve como
        ▼
Produtos consumidores
   (reuso dos padrões aprovados — fecha o ciclo)
```

Leitura do fluxo: os projetos consumidores produzem evidências no curso do próprio trabalho (decisões, achados, correções). O mim-core governa a evolução desse conhecimento — decide, sob a autoridade e o estado metodológico já estabelecidos (ADR-001, `VALIDACAO-EXPERIMENTAL.md`), o que se torna parte confiável da Base Canônica. O NEF materializa os padrões que o mim-core já validou, tornando-os disponíveis para reuso.

Este é o sentido geral do fluxo, não um protocolo. Não há, neste documento, definição de como uma evidência é formalmente promovida, nem de como o NEF consome o que o mim-core aprova.

## 5. Como o conhecimento evolui entre as camadas

Caracterização fornecida nesta sessão (2026-07-28), registrada aqui em caráter Experimental:

- **Projetos consumidores geram evidências** — fatos observáveis produzidos pelo trabalho real (commits, decisões, achados), no mesmo sentido em que `VALIDACAO-EXPERIMENTAL.md` usa "evidência".
- **O mim-core governa essa evolução** — aplica a autoridade de fontes já decidida (ADR-001) e o critério de graduação já em uso (Experimental → Validado → Canônico) para decidir o que passa a fazer parte confiável do conhecimento do ecossistema.
- **O NEF materializa os padrões aprovados** — uma vez que o mim-core valida um padrão, o NEF o torna concreto e reutilizável pelos projetos consumidores.

Nenhum critério objetivo de quando uma evidência se torna padrão, nem o mecanismo de materialização no NEF, é definido aqui — permanecem fora de escopo (seção 2).

## 6. Responsabilidades por camada

| Camada | Responsabilidade clara | O que claramente não faz |
|---|---|---|
| **Projetos consumidores** | Produzir o trabalho real e as evidências que dele resultam (decisões, ADRs próprios, achados) | Não define nem impõe padrões para outros projetos; não altera a governança do mim-core |
| **mim-core** | Governar a evolução do conhecimento: autoridade das fontes, estado metodológico, o que entra na Base Canônica | Não gera o trabalho original dos projetos consumidores; não materializa padrões (isso é papel do NEF); nunca aprova nada sozinho sem o processo de validação já estabelecido |
| **NEF** | Materializar, de forma concreta e reutilizável, os padrões já aprovados pelo mim-core | Não decide sozinho o que é aprovado; não é fonte primária de evidência — consome o que o mim-core já validou |

## 7. Fora de escopo desta proposta

- Protocolos de comunicação entre as três camadas.
- Esquema de metadados (`Fonte`, `Origem`, `Status`, `Nível` — já citados como observação Experimental em `PROPOSTAS-EM-OBSERVACAO.md`, Proposta 3).
- Regras de governança específicas (quem aprova, com que critério, em que instância).
- O mecanismo interno do NEF.
- A arquitetura da Neurônio Capital além do que o mim-core governa.

## 8. Critério de futura validação/promoção

Este documento segue exatamente o mesmo modelo de três estados definido em `VALIDACAO-EXPERIMENTAL.md`, com o mesmo vocabulário — sem redefinir nem flexibilizar nenhum dos critérios.

### Experimental (estado atual)

Estado de origem. As caracterizações existem, mas ainda não foram testadas fora desta sessão.

### Validado

Atingido **automaticamente**, sem intervenção humana adicional, assim que os critérios técnicos objetivos abaixo forem cumpridos, aplicados individualmente a cada afirmação Experimental deste documento:

- aplicação bem-sucedida em pelo menos **dois casos reais independentes**;
- registro dos resultados de ambos;
- registro explícito de quais afirmações precisaram de ajuste durante a validação, classificando cada ajuste como:
  - **refinamento de redação** — não impede a graduação para Validado; ou
  - **mudança de substância** — reinicia a contagem de casos válidos **especificamente** para aquela afirmação (as demais não são afetadas).

### Canônico

Atingido **somente** após revisão explícita do fundador sobre o conteúdo em estado Validado. Essa revisão tem três resultados possíveis:

- **Incorporação** — o conteúdo passa a existir como documento canônico novo, ou como conteúdo de um ADR não-congelado do mim-core;
- **Permanência em Validado** — a revisão é adiada; o conteúdo continua demonstradamente repetível, mas aguarda revisão;
- **Reabertura** — a revisão identifica um problema; o conteúdo (ou a afirmação específica afetada) volta a exigir mais casos antes de nova tentativa de revisão.

Candidatas à validação, nos termos acima:

- a caracterização do NEF (seção 3.2);
- a existência e natureza de Lime e NeuroHub como projetos consumidores (seção 3.3);
- o modelo de ciclo Produtos → Evidências → mim-core → NEF → Produtos (seções 4 e 5).

## 9. Nota metodológica

O objetivo deste documento é registrar fielmente o entendimento atual sobre as três camadas do ecossistema governado pelo mim-core — não antecipar, propor ou insinuar uma evolução da metodologia oficial do Sistema MIM, nem definir nada sobre o NEF que não tenha sido fornecido nesta sessão. Tudo o que está descrito acima é observação Experimental, não decisão.
