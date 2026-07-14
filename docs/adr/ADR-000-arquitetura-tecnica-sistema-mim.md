# ADR-000 — Arquitetura Técnica do Sistema MIM

**Repositório:** `mim-core`
**Ecossistema:** Neurônio Capital
**Autor:** Rodrigo Silva de Aquino
**Status:** CONGELADO (aprovado como base do Milestone 01 — não editar até o MVP estar funcionando; evoluções futuras entram como ADR-001, ADR-002 etc., motivadas por problemas reais de implementação)
**Versão do documento:** 1.0 (baseado na "Arquitetura Técnica do Sistema MIM v3.0")
**Histórico:** Substitui as versões conceituais anteriores, arquivadas em `sistema-mim-historico-v1.md` e `sistema-mim-historico-v2.md`.

## Natureza do projeto

O `mim-core` nasce como **biblioteca de governança reutilizável** (library/core), não como aplicação SaaS. Ele será consumido por outros projetos (FullCommerce, Aura, e futuros) como dependência, não como serviço hospedado. A camada SaaS (API + web), se e quando fizer sentido, é construída *sobre* o núcleo já validado — não ao mesmo tempo:

```text
mim-core (biblioteca)
   -> Context Builder
   -> Motor de Convergência
   -> API (futuro)
   -> SaaS (futuro)
```

Essa ordem permite validar cada camada isoladamente antes de expor qualquer aplicação completa.

## Contexto

O Sistema MIM nasceu como um modelo conceitual de governança do conhecimento da Neurônio Capital. As primeiras versões descreviam a IA como "treinada" e "subordinada" ao Sistema MIM de forma permanente e, em parte, invisível ao usuário. Isso não corresponde a como modelos de linguagem funcionam: uma IA generativa raciocina apenas a partir do contexto fornecido numa sessão específica; não há memória persistente entre sessões, nem execução de processos ocultos do usuário.

Precisamos de uma arquitetura que preserve o objetivo original do Sistema MIM — organizar o conhecimento dos projetos, manter contexto consistente ao longo do tempo, e governar a evolução do patrimônio estrutural — usando apenas componentes de software reais: bancos de dados, pipelines determinísticos, validadores e um processo explícito (não oculto) de montagem de contexto.

## Decisão

Adotar a arquitetura descrita abaixo como referência técnica oficial do Sistema MIM.

### Princípio fundamental

O Sistema MIM não controla nem modifica uma IA generativa. É uma camada de software que prepara contexto, organiza conhecimento e governa sua evolução antes que uma IA seja usada. A IA continua sendo um componente de raciocínio e geração de linguagem, substituível por qualquer modelo (Claude, GPT, Gemini etc.).

### Arquitetura geral

A IA fica na ponta da arquitetura, não no centro: Neurônio Capital -> Sistema MIM -> Base Canônica / Motor de Convergência / Governança Estrutural -> Context Builder -> IA (Claude Code, ChatGPT, Gemini etc.) -> Resposta ao Usuário. Ela não conhece o Sistema MIM, não consulta banco de dados sozinha, e não sabe onde os documentos estão — ela recebe um bloco de contexto já montado e responde a partir dele.

### Componentes

**Base Canônica** — memória oficial dos projetos. Implementável em PostgreSQL, SQLite, Git, Markdown ou banco vetorial; a tecnologia não altera a função.

A estrutura separa explicitamente três categorias, para deixar claro o que é escrito por humanos e o que é gerado automaticamente:

* **fontes/** — documentos escritos por humanos (Constituição, ADRs, Documentos Canônicos). Fonte de verdade.
* **derivados/** — arquivos recalculados a partir das fontes (DNA, Algoritmo, Estado Atual). Nunca editados manualmente.
* **indices/** — pasta reservada para artefatos de busca (relacionamentos, temas) que o Context Builder (Milestone 02) e o Sistema Circulatório (Milestone 06) vão gerar. No Milestone 01, essa pasta só existe vazia — nenhuma lógica de indexação é implementada ainda.

```text
base-canonica/
  indice-global.yaml        (placeholder - populado só quando existir um 2o projeto)
  projetos/
    FullCommerce/
      manifesto.yaml
      fontes/
        Constituicao.md
        ADRs/
        DocumentosCanonicos/
      derivados/
        DNA.yaml
        Algoritmo.yaml
        EstadoAtual.yaml
      indices/              (vazia neste milestone)
      timeline/
        2026-07-01-ADR000.md
```

manifesto.yaml é a porta de entrada do projeto (nome, versão, status, responsável, referências aos arquivos-chave). timeline/ usa arquivos prefixados por data para ordem natural.

**Motor de Convergência** — não gera texto. Recebe três entradas explícitas — projeto, objetivo e pergunta — e determina quais documentos precisam ser carregados. O objetivo é sempre uma entrada explícita, nunca inferido; sem isso, o motor corre o risco de responder corretamente a uma pergunta errada. Prepara o raciocínio; quem raciocina é a IA.

**Context Builder** — monta o bloco de contexto final enviado à IA (projeto, objetivo, estado, documentos relevantes, pergunta do usuário). É o único ponto de entrega de informação para a IA.

**Engenharia Reversa em Camadas** — pipeline de decomposição de um objetivo em módulos, dependências, riscos e Checklist-Mãe. Cada etapa é automatizável.

**Checklist-Mãe** e **DNA** — estruturas de metadados versionadas (YAML), não conceitos abstratos. Exemplo de DNA:

```yaml
nome: FullCommerce
objetivo: Construir uma plataforma SaaS de e-commerce.
restricoes: [WordPress, WooCommerce, Multiempresa]
principios: [simplicidade, convergencia, modularidade]
```

**Algoritmo** — descreve o fluxo lógico esperado do projeto (planejamento -> execução -> validação -> entrega).

**Documentos Canônicos** — especificações versionadas, no formato ADR/RFC (DC-014: Título, Status, Autor, Resumo, Motivação, Decisão, Impactos, Referências). Constituem a principal fonte de verdade do projeto.

**Profundidade 3.0** — pipeline de extração e normalização de conhecimento. Entrada: um documento. Saída: escopo, DNA, padrões, algoritmo, checklist, metadados estruturados e relacionamentos (referências a outros documentos/decisões), permitindo montar uma malha de dependências entre documentos sem precisar reestruturar o sistema depois.

**Lateralidade** — pipeline de validação antes da aprovação de um Documento Canônico: Documento -> Validador Jurídico -> Validador LGPD -> Validador Plataforma -> Validador Arquitetural -> Validador de Consistência -> Validador de Paradoxos -> Revisão Humana (quando necessária) -> Documento Aprovado. Cada validador pode ser código, regra determinística, IA ou revisão humana.

**Validador de Paradoxos** — avalia tensões arquiteturais antes da aprovação final. Pares avaliados: Convergência x Flexibilidade, Simplicidade x Profundidade, Transparência x Encapsulamento, Automação x Controle Humano, Regeneração x Estabilidade, Reutilização x Contaminação, Velocidade x Segurança. Saída: relatório estruturado de conflitos, severidade e ações mitigadoras.

**Sistema Circulatório** — sincronizador que roda após aprovação de um Documento Canônico. DNA e Algoritmo não são entidades editadas manualmente — são derivações recalculadas a partir da Base Canônica, o que evita que fiquem dessincronizados dela: Documento aprovado -> Atualiza Base Canônica -> Recalcula índices -> Atualiza derivações (DNA, Algoritmo, Linha do Tempo) -> Disponibiliza para consultas.

### O que a IA nunca faz

A IA nunca altera o DNA do projeto sozinha, nunca altera a Constituição, nunca modifica a Governança, nunca aprova Documentos Canônicos e nunca publica patrimônio estrutural automaticamente. Essas ações pertencem ao Sistema MIM e, quando aplicável, exigem validação humana.

## Consequências

**Positivas:**
- Compatível com qualquer modelo de linguagem, presente ou futuro, porque não depende de memória persistente da IA.
- Cada componente é implementável e testável isoladamente (banco de dados, pipeline, validador).
- Mantém o controle humano sobre decisões permanentes (a IA nunca aprova sozinha).
- Reaproveita o formato de Documento Canônico já validado no FullCommerce (ADRs).

**Negativas / riscos:**
- É um projeto de engenharia real, não um documento — exige implementação (Base Canônica, Context Builder, validadores) antes de gerar valor.
- O Validador de Paradoxos, apesar de bem especificado conceitualmente, ainda precisa de critérios objetivos de severidade para ser automatizável de forma consistente.
- Risco de escopo crescer antes do MVP existir — recomenda-se iniciar pela menor versão funcional (Base Canônica como pasta Git + Context Builder simples) antes de implementar Profundidade 3.0, Lateralidade completa ou Sistema Circulatório.

## MVP — restrição de stack obrigatória

Para proteger contra over-engineering nesta fase, o MVP do mim-core deve funcionar usando apenas: Git; Markdown; SQLite (ou, na primeira versão, apenas arquivos); um script simples (Node ou Python).

Explicitamente fora de escopo até o MVP estar funcionando e validado na prática: banco de dados vetorial; Kubernetes; filas de mensagens; microserviços; Redis; embeddings. Essas peças podem entrar depois, motivadas por uma limitação real encontrada ao usar o MVP — não antes.

## Roadmap de milestones (build, not document)

A partir daqui, o trabalho é implementação, não documentação. Este ADR fica congelado; cada milestone abaixo constrói sobre ele.

1. Milestone 01 — Base Canônica. Estrutura /base-canonica (Constituição, DNA, Algoritmo, ADRs, Documentos Canônicos, Linha do Tempo) versionada em Git/Markdown.
2. Milestone 02 — Context Builder. Script que recebe projeto + pergunta, busca na Base Canônica, seleciona documentos relevantes e monta o bloco de contexto pronto para colar em qualquer IA.
3. Milestone 03 — Motor de Convergência. Determina objetivo atual, estado do projeto e próximo passo, a partir da Base Canônica.
4. Milestone 04 — Profundidade 3.0. Pipeline de extração de metadados (escopo, DNA, padrões) a partir de um documento novo.
5. Milestone 05 — Lateralidade. Validadores (incluindo o Validador de Paradoxos) antes da aprovação de um Documento Canônico.
6. Milestone 06 — Sistema Circulatório. Sincronização automática da Base Canônica após aprovação de um documento.

## Próximo passo imediato

Abrir o Milestone 01 (mim-core, Base Canônica) no Claude Code, seguindo a mesma disciplina de governança já validada no FullCommerce: ADR (este documento, congelado) -> aprovação -> implementação -> validação empírica -> revisão -> commit -> push.
