# Validação Experimental — Observações Metodológicas do Sistema MIM

## Estado

**Validado.**

**Classificação (provisória):** Metodologia experimental de validação.

Esta classificação é provisória enquanto o documento permanece em estado Validado. A eventual promoção destas observações a conhecimento epistemológico do Sistema MIM — isto é, a princípio permanente sobre como o próprio método MIM avalia evidência, confiança e risco, e não apenas sobre como uma auditoria pontual deve ser conduzida — depende exclusivamente da revisão do fundador descrita na seção "Critério de Graduação" abaixo, que decide entre Incorporação, Permanência em Validado ou Reabertura. Até lá, nenhuma afirmação deste documento deve ser tratada como regra definitiva do Sistema MIM.

## Origem

As observações abaixo emergiram durante a auditoria arquitetural conduzida no **Milestone 03 do FullCommerce** (Primitives + primeiro Pattern), num exercício que passou a ser chamado de **Stress Test Pluricelular** (ver seção dedicada abaixo). Nasceram da prática, não de uma decisão de arquitetura prévia — por isso vivem aqui como registro metodológico separado, e não como extensão de nenhum documento canônico.

## Relação com o Sistema MIM

O ADR-000 (`docs/adr/ADR-000-arquitetura-tecnica-sistema-mim.md`) já antecipa, entre os riscos do Milestone 05 (Lateralidade), que o **Validador de Paradoxos** está "bem especificado conceitualmente, mas ainda precisa de critérios objetivos de severidade para ser automatizável de forma consistente". As observações 1–4 abaixo são candidatas diretas a preencher essa lacuna — não como uma prática isolada de auditoria, mas como regras sobre como qualquer parecer, validador ou revisão dentro do Sistema MIM deve declarar certeza e risco. É por essa razão que este documento é tratado como uma tentativa de epistemologia do método, ainda não confirmada, e não como um simples log operacional de uma auditoria específica.

---

## Observações metodológicas (em avaliação)

1. **Evidência ≠ Hipótese.** Toda conclusão deve declarar explicitamente se está baseada em fato observado, evidência direta ou hipótese ainda não testada.

2. **Não existe nota/score sem evidência observável.** Quando não há evidência, o resultado é um status qualitativo (ex.: "hipótese favorável, não validada"), nunca um número.

3. **Grau de confiança acompanha toda conclusão**, com base declarada (fato / evidência / hipótese).

4. **Todo risco identificado deve vir acompanhado de uma forma de verificação** — que pode ser uma ação corretiva ou "continuar monitorando"; não é obrigatório gerar uma ação nova quando monitorar já é suficiente.

## Explicitamente não congelado ainda

Os itens abaixo permanecem em validação e não fazem parte destas observações:

- Estrutura do painel (quantidade de células, quais existem).
- Separação entre células primárias e indicadores derivados.
- Pesos ou fórmulas de agregação.

## Critério de Graduação

A graduação não é uma transição única — este documento percorre três estados:

### 1. Experimental

Estado de origem. As observações existem, mas ainda não foram testadas fora do caso que as originou.

### 2. Validado (estado atual)

Atingido **automaticamente**, sem intervenção humana adicional, assim que os critérios técnicos objetivos abaixo forem cumpridos:

- aplicação bem-sucedida em pelo menos **dois casos reais independentes**;
- registro dos resultados de ambos;
- registro explícito de quais observações precisaram de ajuste durante a validação, classificando cada ajuste como:
  - **refinamento de redação** — não impede a graduação para Validado; ou
  - **mudança de substância** — reinicia a contagem de casos válidos **especificamente** para aquela observação (as demais observações não são afetadas).

O estado Validado indica que a observação demonstrou **repetibilidade**, mas ainda **não foi formalmente incorporada** ao Sistema MIM — é uma condição necessária, não suficiente, para virar padrão oficial.

### 3. Canônico

Atingido **somente** após revisão explícita do fundador sobre o conteúdo em estado Validado. Essa revisão tem três resultados possíveis:

- **Incorporação** — o conteúdo passa a existir como documento canônico novo, ou como conteúdo de um ADR não-congelado do mim-core.
- **Permanência em Validado** — a revisão é adiada; o conteúdo continua demonstradamente repetível, mas aguarda revisão.
- **Reabertura** — a revisão identifica um problema; o conteúdo (ou a observação específica afetada) volta a exigir mais casos antes de nova tentativa de revisão.

## O Stress Test Pluricelular

Nome dado ao exercício de auditoria que originou estas observações: uma avaliação arquitetural conduzida célula a célula (por indicador/componente do painel em avaliação), forçando cada conclusão a declarar sua base (fato/evidência/hipótese) antes de ser aceita. O nome identifica a ferramenta/técnica usada nos casos abaixo — não o conteúdo das observações 1–4, que devem sobreviver a qualquer evolução futura do formato de auditoria. Por isso o arquivo que registra este conhecimento não leva o nome desta técnica.

## Registro de Casos

### Caso 1 — Auditoria arquitetural, Milestone 03 do FullCommerce (Primitives + primeiro Pattern)

- **Status:** Aplicado.
- **Data:** 2026-07-15.
- **Contexto:** Auditoria arquitetural conduzida durante a implementação de Primitives + primeiro Pattern do FullCommerce, usando o Stress Test Pluricelular.
- **Resultado:** originou as observações 1–4 registradas acima. Ajustes: nenhum ajuste foi necessário; não há ajuste a classificar por ser o caso de origem das observações.

### Caso 2 — Smoke test de integração do NUX Engine em `apps/web`

- **Status:** Aplicado.
- **Data:** 2026-07-15.
- **Contexto:** `apps/storefront` ainda não existe; sua criação está fora do escopo do Milestone 03 por restrição explícita do ADR-004 (FullCommerce). O smoke test usou `apps/web` como local temporário e não criou nenhuma aplicação nova.
- **Resultado:**
  - build do monorepo passou (Turborepo resolveu `packages/ui` antes de `apps/web`);
  - guard de produção confirmado via HTML gerado com `NODE_ENV=production`;
  - CSS Modules resolvidos corretamente através do workspace (classes hasheadas + regra `.Hero_highlight__Q27hq { color: var(--color-brand-accent); }` no CSS de produção);
  - Theme Engine aplicado de fato (CSS custom properties resolvidas inline a partir do `neutralTokens`);
  - verificação visual via Playwright sem overlay de erro.
- **Ajustes:** nenhuma das quatro observações metodológicas precisou de ajuste — nem refinamento de redação, nem mudança de substância.

---

## Verificação do Critério de Graduação (após reformulação do Caso 1)

- **Dois casos reais independentes aplicados:** satisfeito. Evidência: Caso 1 (auditoria arquitetural, Milestone 03 do FullCommerce, 2026-07-15) e Caso 2 (smoke test de integração do NUX Engine em `apps/web`, 2026-07-15) são casos de natureza distinta (auditoria arquitetural vs. smoke test de integração), ambos registrados com **Status: Aplicado**.
- **Registro dos resultados de ambos:** satisfeito. Evidência: o Caso 1 registra que a aplicação originou as observações 1–4; o Caso 2 registra os cinco resultados verificados do smoke test (build do monorepo, guard de produção, resolução de CSS Modules, aplicação do Theme Engine, verificação visual via Playwright).
- **Registro explícito de classificação de ajustes para ambos os casos:** satisfeito. Evidência: o Caso 1 agora declara, sem ambiguidade, "nenhum ajuste foi necessário; não há ajuste a classificar por ser o caso de origem das observações". O Caso 2 declara, também sem ambiguidade, que nenhuma das quatro observações metodológicas precisou de ajuste — nem refinamento de redação, nem mudança de substância. Nenhum dos dois registros deixa margem para interpretação dupla.

Os três critérios objetivos definidos na seção "Critério de Graduação" estão agora integralmente satisfeitos para os dois casos. Conforme a regra vigente, a transição de Experimental para Validado é **automática** e não depende de decisão do fundador — por isso ela é aplicada diretamente neste documento, e **o Estado passa a: Validado**.

## Revisão do Fundador (2026-07-18)

- **Decisão:** Permanência em Validado.
- **Justificativa:** o documento atingiu o critério objetivo de graduação com dois casos independentes, mas esse é o volume mínimo exigido pela regra, não um histórico extenso de uso real. Elevar a Canônico agora seria generalizar sem evidência acumulada suficiente, o que contraria a própria Observação 1 do documento (Evidência ≠ Hipótese). A metodologia permanece válida e vinculante em estado Validado.
- **Próxima revisão:** será revisitada quando houver mais casos aplicados em outros contextos do projeto (ex.: próximos milestones do FullCommerce ou validações no NEF).

## Próximo passo

Acumular mais casos aplicados em outros contextos do projeto (ex.: próximos milestones do FullCommerce ou validações no NEF), conforme indicado na Revisão do Fundador acima, para subsidiar uma futura revisão de Incorporação a Canônico. Até lá, o documento permanece em estado Validado — válido e vinculante.
