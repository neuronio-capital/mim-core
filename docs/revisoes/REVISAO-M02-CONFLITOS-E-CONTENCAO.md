# Revisão — M02 (Context Builder): Conflitos (β1) e Contenção de Path

## Estado

**Não canônica.** Este documento é uma **decisão humana pós-auditoria adversarial**, registrada antes da conclusão da implementação do Milestone 02. **Não é um ADR.** Não modifica, não edita e não substitui o ADR-000 (CONGELADO) nem o ADR-001 (Aceito). Segue o mesmo gênero documental de `docs/revisoes/REVISAO-ADR000-FRONTEIRA-M02-M03.md` — uma decisão consolidada, sem status formal de Aceito/Canônico, subordinada às fontes superiores.

## Origem e contexto

Uma auditoria adversarial pré-staging da implementação do M02 (Context Builder), conduzida sobre o checkpoint experimental untracked, identificou:

1. **Um defeito objetivo** — o campo de entrada `projeto` permitia escapar de `base-canonica/projetos/` por `../`, `..\`, caminho absoluto ou normalização, e (com estrutura compatível no destino) ler e transportar para o bloco de contexto o conteúdo de arquivos fora do universo autorizado. Exploit demonstrado.
2. **Uma ambiguidade documental real** — o `MILESTONE-02-PLANO.md` exige "sinalização de conflito/divergência **conhecida**" e "preservar essa divergência… nunca escolher silenciosamente", sem deixar claro se M02 deve **apenas representar** conflitos já conhecidos ou também **detectá-los** entre as evidências recuperadas; e o canal `conflitos` do pipeline conectado nunca era populado, tornando `conflitos: []` um possível falso negativo epistemológico.

O fundador adjudicou ambos os pontos. Este documento registra a adjudicação e os limites que a implementação corretiva respeitou.

## Decisão 1 — Conflitos no M02 V1: β1 (relay-only)

**M02 V1 transporta como conflito somente divergências que já estejam explicitamente declaradas/estruturadas no material recuperado, de forma mecanicamente relayável.** M02 **não**:

- compara valores entre documentos distintos para inferir conflito (isto era a opção **β2 — rejeitada**);
- infere identidade conceitual entre campos;
- descobre contradição semântica em texto livre / prosa;
- compara repositório de código com `fontes/` para descobrir divergência;
- usa NLP, IA, embeddings ou score semântico;
- adjudica conflito, escolhe posição vencedora ou atribui severidade.

A detecção ampla **código ↔ `fontes/`** permanece onde o corpus já a posiciona: **Milestone 06 (Sistema Circulatório)**, conforme ADR-001 (*"não existe, nesta fase, nenhum mecanismo automático de detecção de divergência entre o repositório de código real e a Base Canônica — essa é responsabilidade futura do Milestone 06"*). A contradição semântica aberta permanece **fora do M02** (matéria de julgamento — M03/M05).

### Formatos reais compatíveis com β1, hoje

Inspeção da Base Canônica atual: **nenhum documento usa uma declaração de conflito estruturada e relayável.** `derivados/EstadoAtual.yaml` traz `bloqueios_conhecidos` (lista de *bloqueios*, não *conflitos*, em prosa livre, cuja classificação exigiria interpretação — e cujo item conflituoso é matéria código ↔ `fontes/`, reservada ao M06). Portanto, **nenhum novo formato ou detector foi inventado**.

### Implementação (relay-only, verbatim)

`montarBlocoContexto` já era um canal verbatim: transporta `conflitos` sem alterar, sem `resolucao`, sem `vencedor`. A rodada corretiva apenas **explicitou o fio**: `src/contexto.js` passa `{ conflitos: [] }` de forma deliberada, com comentário declarando que o parâmetro `conflitos` é o **único** ponto de entrada e apenas transporta o que uma fonte ou componente competente já tenha entregue identificado — do mesmo modo que `estado` (`MILESTONE-02-PLANO.md`: *"se fornecido explicitamente por uma fonte ou componente competente… M02 transporta esse valor… sem reinterpretá-lo"*).

## Decisão 2 — Semântica estrita de `conflitos: []`

**Nenhum campo novo de schema.** O campo `conflitos_nao_verificados` foi **considerado e rejeitado**. O schema de saída permanece: `projeto, objetivo, estado, pergunta, evidencias[], conflitos[], ausencia_evidencia[]` (`+ falhas_leitura[]` quando aplicável).

`conflitos: []` significa **estritamente**:

> "Nenhum conflito explicitamente declarado e relayável pelo mecanismo do M02 V1 foi encontrado nas evidências selecionadas."

**Não** significa:

- que não existem conflitos;
- que as evidências foram semanticamente comparadas;
- que a inexistência de contradições foi verificada.

Essa limitação está registrada aqui e no comentário de `src/montagem.js`. O código não afirma capacidade maior do que possui.

## Decisão 3 — Ausência de evidência

`ausencia_evidencia` é acionada quando **`evidencias.length === 0`** (mecanismo de seleção ratificado). M02 **não** julga suficiência semântica, qualidade nem completude cognitiva da evidência recuperada — essas noções pertencem à determinação de necessidade informacional (M03) e não são introduzidas no M02 V1. Compatível com `MILESTONE-02-PLANO.md` (l. 80: *"'ausência de evidência' (recuperação documental sem resultado)"*) e com a fronteira H3.

## Decisão 4 — Contenção de path (correção do defeito)

**Invariante:** um projeto resolvido nunca pode permitir leitura fora de `base-canonica/projetos/` por manipulação do input `projeto`.

Implementado em `src/descoberta.js`, `resolverRaizProjeto(baseCanonicaDir, projeto)`, usado por `descobrirUniverso`:

1. **Gate sintático** — `projeto` tem de ser um único segmento de diretório: rejeita string vazia, `.`, `..`, `/`, `\`, `NUL`, caminho absoluto e qualquer valor cujo `path.basename` difira de si mesmo. Erro: `Nome de projeto inválido: "<v>" (deve ser um único segmento de diretório dentro de base-canonica/projetos/).`
2. **Contenção lexical** — o diretório resolvido tem de ser **filho direto** de `projetos/`. Erro: `Projeto fora do universo autorizado: "<v>".`
3. **Existência** — `Projeto inexistente na Base Canônica: "<v>" (esperado <raiz>/manifesto.yaml).` (mensagem preservada).
4. **Contenção física** — `fs.realpathSync` do diretório do projeto e de `projetos/`; se o diretório real deixar de ser filho direto do `projetos/` real (symlink/junction que aponta para fora), erro `Projeto fora do universo autorizado: "<v>".`

Projeto legítimo (segmento único existente) continua funcionando sem alteração de comportamento. Correção mínima — **não** é um framework genérico de segurança.

## Fronteira M02 × outros milestones (reafirmada)

M02 **não**: determina objetivo, estado ou próximo passo; executa M03/M04/M05/M06; usa IA para raciocinar; cria memória persistente; resolve conflito normativo; promove autoridade ou maturidade; altera a Base Canônica. A tokenização de `pergunta` + `objetivo` como critério de recuperação é a derivação interna permitida (não é função de Motor de Convergência).

## Limitações conhecidas e aceitas do V1

Registradas explicitamente, **não** corrigidas nesta rodada (não são bloqueadores):

- **Seleção textual ampla** — a seleção é por **substring literal** (não por fronteira de token) entre o conteúdo do documento e os termos (3+ caracteres) de `pergunta`/`objetivo`, com inclusão por `OR`. Perguntas com termos genéricos ("estado", "projeto", "atual") tendem a selecionar grande parte ou todo o universo. É o comportamento ratificado (`MILESTONE-02-PLANO.md` Q3: sem ranking, score, embeddings ou heurística sofisticada). Melhoria de retrieval não pertence ao V1.
- **`extrairMaturidade`** — heurística de regex sobre o cabeçalho `Status:`; captura linha parcial e pode cair no rótulo de natureza quando não há cabeçalho. Não promove autoridade; preserva a maturidade de forma explícita, como o contrato exige.
- **Descoberta** — symlink/junction de **arquivo** dentro de um projeto válido é ignorado (não seguido); arquivo real de 0 byte é pulado. Sem impacto de contrato.

## Rede mínima de testes (implementada nesta rodada)

Contenção de path (`../`, `..\`, caminho absoluto, segmento aninhado, `.`/`..`, string vazia, escape via symlink/junction — com `skip` gracioso se o ambiente negar criação de link, projeto inexistente, projeto legítimo); YAML de entrada malformado (unidade + CLI); traversal via CLI; determinismo do fluxo completo (saída serializada byte-idêntica); β1 relay verbatim de conflito entregue por fonte competente, sem `resolucao`/`vencedor`; ausência de conflito relayável → `conflitos: []`; **prova negativa de β2** (dois documentos com valores diferentes não geram conflito); `ausencia_evidencia` com zero evidências; `estado` ausente → sentinela distinta de ausência de evidência; `proximo_passo`/`next_step` inexistente no contrato e no output.

## Proveniência da adjudicação

Decisão do fundador registrada nas rodadas de adjudicação pós-auditoria (β1 ratificado; β2 rejeitado; `conflitos_nao_verificados` rejeitado; `ausencia_evidencia = evidencias.length === 0` ratificado; contenção de path ratificada como bloqueador; achados menores #2/#3/#4/#6/#7 mantidos como limitação conhecida V1; documento de fechamento `MILESTONE-02-FECHAMENTO.md` adiado ao gate seguinte).

## Autoridade

Não canônica. Subordinada a ADR-000 e ADR-001, que permanecem inalterados. Este documento registra apenas o que foi decidido para **fechar a implementação do M02 V1** — não abre nem antecipa M03–M06, não cria componente nomeado e não constitui precedente de detecção de conflito além do relay verbatim aqui descrito.
