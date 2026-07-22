# Propostas em Observação

Este documento registra decisões conscientes de **não formalizar algo ainda** — propostas deliberadamente adiadas. Nenhum item aqui tem autoridade canônica, nenhum altera ADRs existentes, e nenhum reordena o roadmap de Milestones do ADR-000. É o mesmo tipo de registro que `REVISAO-ADR000-MILESTONE01.md` já usa na seção "Melhorias sugeridas" — reunido aqui para não depender de reabrir um documento de revisão já concluído a cada nova proposta adiada.

---

## Proposta 1 — Arquitetura conceitual futura do Sistema MIM ("Base Filosófica")

- **Estado:** adiada.
- **Motivo:** nenhum problema concreto justifica sua criação agora. Os bloqueadores reais hoje são `BottomNavigation` e `CartDrawer` no FullCommerce, a Hero do NEF, e os próximos Milestones do mim-core.
- **Diretriz para quando for retomada:**
  - (i) Nome preferencial **"Base Filosófica"**, não "Arquitetura Alvo" — evita colisão semântica com "Base Canônica", que já significa conhecimento governado.
  - (ii) Deve declarar explicitamente que **não possui autoridade canônica** e serve apenas como contexto de pesquisa.
  - (iii) Antes de escrever, verificar se o **ADR-000 já cobre visão e princípios**, para não duplicar.
  - (iv) Manter a **graduação por documento inteiro** (Experimental → Validado → Canônico) — não criar mecanismo de promoção por afirmação individual sem evidência de que a granularidade atual seja insuficiente.
- **Critério de revisão:** reconsiderar apenas quando houver um problema concreto e recorrente que a justifique.

## Proposta 2 — Engineering Patterns

- **Estado:** adiada.
- **Natureza do registro:** esta é uma decisão de governança **inédita** — busca em `docs/metodologia/`, `docs/revisoes/` e em todo o histórico de commits do `mim-core` (arquivos e mensagens, todos os branches) não encontrou nenhum registro prévio, parcial ou com outro nome, sobre adiar a camada Engineering Patterns. Não é a reconstrução de uma conversa anterior que nunca chegou a ser commitada — é a primeira vez que essa decisão é formalizada neste repositório.
- **Motivo:** existe apenas **um caso de evidência** (CartDrawer no FullCommerce), abaixo do critério objetivo de **dois casos independentes** (o mesmo critério usado em `docs/metodologia/VALIDACAO-EXPERIMENTAL.md` para graduar observações metodológicas de Experimental para Validado).
- **Fonte desta afirmação:** o caso CartDrawer aconteceu no repositório de código do FullCommerce, ao qual esta sessão não tem acesso. A afirmação "existe apenas um caso de evidência" vem de **relato verbal nesta conversa**, não de verificação direta contra o repositório do FullCommerce — não é tratada aqui como fato verificado, no mesmo espírito da declaração de fonte já usada em `derivados/EstadoAtual.yaml` e no Achado 2 de `MILESTONE-06-ACHADOS-PRELIMINARES.md`.
- **Critério de revisão:** reconsiderar apenas quando surgir um **segundo caso independente**.

---

## Proposta 3 (Experimental) — Registro da sessão de revisão metodológica (mim-core + FullCommerce)

- **Estado:** registro de sessão, em caráter Experimental — não é uma proposta de mudança de metodologia. Fica adiada, no sentido deste documento, qualquer incorporação das convergências abaixo à metodologia oficial.

### Contexto

- **Origem:** sessão de revisão metodológica do `mim-core`.
- **Data:** 2026-07-22.
- **Contexto:** revisão de leitura e verificação de consistência entre ADR-000 (`docs/adr/ADR-000-arquitetura-tecnica-sistema-mim.md`), ADR-001 (`docs/adr/ADR-001-autoridade-das-fontes-na-base-canonica.md`), `docs/metodologia/VALIDACAO-EXPERIMENTAL.md`, `docs/milestones/MILESTONE-06-ACHADOS-PRELIMINARES.md` e este documento. Nenhum desses documentos foi alterado durante a sessão.
- **Projetos envolvidos:** `mim-core` (governança da própria Base Canônica, Critério de Graduação de `VALIDACAO-EXPERIMENTAL.md`, Propostas 1 e 2 acima) e FullCommerce (Achado 1 e Achado 2 registrados em `MILESTONE-06-ACHADOS-PRELIMINARES.md`).
- **Problemas reais que motivaram a discussão:**
  - Achado 1: `derivados/EstadoAtual.yaml` do FullCommerce ficou desatualizado por 4 dias corridos sem nenhum mecanismo de detecção.
  - Achado 2: a correção do Achado 1 usou `VALIDACAO-EXPERIMENTAL.md` como substituto de fonte primária, sem rastreabilidade verificável (commit hash, PR ou branch) ao repositório de código do FullCommerce, descumprindo DEC-1/DEC-3 do ADR-001 — mesmo com DEC-4 (fonte e data declaradas) satisfeito.
  - A coexistência de mais de um documento de observação/metodologia (`VALIDACAO-EXPERIMENTAL.md`, este `PROPOSTAS-EM-OBSERVACAO.md`) levantou a necessidade de não confundir a qualidade de uma evidência com o estado de governança do documento que a registra.

### Convergências (Experimentais)

Esta sessão convergiu para as observações abaixo. Todas ficam registradas em caráter **Experimental**, no mesmo sentido em que `VALIDACAO-EXPERIMENTAL.md` usa o termo, e aguardam validação em casos reais antes de qualquer promoção. Nenhuma delas altera o Critério de Graduação daquele documento, nem cria novo estado metodológico, componente ou Milestone.

#### Separação entre qualidade da evidência e estado de governança

Esta sessão convergiu para observar que **qualidade da evidência** (o quanto uma afirmação é rastreável, verificável, factual) e **estado metodológico do documento** (Experimental / Validado / Canônico, conforme `VALIDACAO-EXPERIMENTAL.md`) são dimensões diferentes. Fica registrado em caráter Experimental que essas duas dimensões não devem ser confundidas — um documento em estado Validado pode conter uma afirmação com evidência fraca (caso do Achado 2), e o inverso também é possível. Aguarda validação em casos reais.

#### Workflow como fonte primária

Esta sessão convergiu para observar que o **workflow** (o processo real de trabalho, tal como ocorre — commits, sessões, decisões) tende a funcionar como fonte primária, e que qualquer matriz, índice, dashboard ou visão consolidada sobre esse workflow tenderia a ser tratada como **derivado**. Fica registrado em caráter Experimental, por analogia a DEC-1/DEC-3 do ADR-001, sem alterar aquele ADR nem propor sua revisão. Aguarda validação em casos reais.

#### Padronização de metadados antes da automação

Esta sessão convergiu para observar que uma eventual automação futura poderia se beneficiar de metadados padronizados — exemplos discutidos: `Fonte`, `Origem`, `Status`, `Nível`. Fica registrado em caráter Experimental, sem definir esquema, obrigatoriedade ou onde esses metadados viveriam, e sem constituir novo componente do Sistema MIM ou antecipar o Milestone 06. Aguarda validação em casos reais.

#### Ciclo de vida do Achado (refinamento experimental)

Esta sessão convergiu para observar o seguinte workflow para o ciclo de vida de um Achado (como os já registrados em `MILESTONE-06-ACHADOS-PRELIMINARES.md`):

```
Aberto
  ↓
Investigação
  ↓
Correção
  ↓
Verificação
  ↓
Resultado
  - Corrigido
  - Descartado
  - Aceito
  ↓
Encerrado
```

Fica registrado em caráter Experimental. Os critérios de **Verificação** (que tipo de evidência rastreável seria exigida) e os critérios de cada ramo de **Resultado** (Corrigido / Descartado / Aceito) permanecem Experimentais e não estão definidos por este registro. Este workflow não substitui, altera nem antecipa a estrutura de "Achado" já usada em `MILESTONE-06-ACHADOS-PRELIMINARES.md`. Aguarda validação em casos reais.

#### Evidências Preventivas

Esta sessão convergiu para observar uma possível distinção entre:

- **Preventiva Observada** — um risco identificado e mitigado antes de se manifestar, sem confirmação posterior de que o risco de fato ocorreria.
- **Preventiva Confirmada** — um risco identificado, mitigado, e posteriormente confirmado (por evidência real) como algo que de fato teria ocorrido sem a mitigação.

Fica registrado em caráter Experimental que essa distinção ainda não houve validação em casos reais, e que ela não altera a Observação 4 de `VALIDACAO-EXPERIMENTAL.md` ("todo risco identificado deve vir acompanhado de uma forma de verificação"). Aguarda validação em casos reais.

### Questões em aberto

Os itens abaixo permanecem **sem decisão metodológica** nesta sessão; nenhum deles deve ser promovido a metodologia, componente ou critério oficial a partir deste registro:

- protocolo geral para complementos de documentos em estado Validado;
- solução definitiva para a lacuna de rastreabilidade do Achado 2 de `MILESTONE-06-ACHADOS-PRELIMINARES.md` — incluindo a alternativa de um documento complementar identificado como **CP01**, discutida nesta sessão mas **ainda sem decisão**; nenhum documento CP01 foi criado, e a discussão permanece deliberadamente em aberto para evitar criar, por precedente, um protocolo geral de emenda para documentos Validado;
- formalização do eixo **Independência** entre casos, hoje usado sem definição explícita no Critério de Graduação de `VALIDACAO-EXPERIMENTAL.md` ("dois casos reais independentes");
- eventual **Índice de Saúde** (métrica agregada sobre o estado da Base Canônica ou dos Achados) — não especificado nesta sessão;
- eventual **Matriz de Proveniência** como visão derivada (relacionando afirmações a suas fontes) — não especificada nesta sessão.

### Critérios de futura validação

Nenhuma das convergências acima deixa o estado Experimental por força deste registro. A promoção futura de cada uma seguiria o mesmo tipo de critério objetivo já em uso em `VALIDACAO-EXPERIMENTAL.md` (aplicação bem-sucedida em casos reais, independentes, com resultados registrados) — critério citado aqui por precedente, não redefinido:

- **Separação evidência/governança:** casos reais em que a separação explícita entre as duas dimensões tenha evitado um erro de interpretação que, sem ela, teria ocorrido.
- **Workflow como fonte primária:** casos reais, em pelo menos um projeto além do FullCommerce, em que tratar uma matriz/índice/dashboard como derivado (e não como fonte) tenha sido decisivo para resolver uma divergência.
- **Metadados padronizados:** existência de uma automação real que consuma esses metadados e produza valor verificável — não a mera definição do esquema.
- **Ciclo de vida do Achado:** pelo menos dois Achados reais conduzidos integralmente pelo workflow observado (Aberto → Investigação → Correção → Verificação → Resultado → Encerrado), com evidência rastreável registrada em cada etapa de Verificação.
- **Evidências Preventivas:** pelo menos um caso real em que a distinção entre Preventiva Observada e Preventiva Confirmada tenha sido aplicada e o risco correspondente tenha, de fato, se manifestado ou não.

Nenhuma convergência acima poderá sair do estado Experimental sem evidência produzida em projetos reais que justifique sua incorporação definitiva.

### Decisão da sessão

Esta sessão não altera a metodologia oficial do mim-core. As convergências registradas permanecem em estado Experimental e deverão ser exercitadas em projetos reais antes de qualquer promoção para a metodologia oficial.

### Critério de revisão

Reconsiderar esta proposta apenas quando os princípios aqui registrados forem exercitados em casos reais e produzirem evidências suficientes para **confirmar, refinar ou rejeitar** as observações experimentais listadas em "Convergências (Experimentais)". Até lá, nenhuma delas deve ser tratada como metodologia vigente.

### Nota metodológica

O objetivo desta entrada é registrar fielmente o estado atual da compreensão alcançada nesta sessão — não antecipar, propor ou insinuar uma evolução da metodologia oficial do Sistema MIM. Tudo o que está descrito acima é observação, não decisão.

---

## Status

Três propostas registradas até o momento. Novas propostas deliberadamente adiadas devem ser adicionadas a este documento, cada uma com estado, motivo e critério de revisão explícitos.
