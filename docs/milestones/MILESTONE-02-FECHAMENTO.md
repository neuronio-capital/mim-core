# MIM-CORE — Milestone 02: Context Builder

## A. Identificação

- **Milestone:** 02 — Context Builder
- **Versão:** V1
- **Repositório:** https://github.com/neuronio-capital/mim-core
- **Branch oficial:** `main`
- **Data deste registro:** 10/09/2026

## B. Estado

Implementação material concluída. Auditoria final pré-fechamento, conduzida de forma estritamente read-only sobre o checkpoint untracked, foi aprovada: M02 apto para fechamento documental e staging controlado.

Neste momento não há commit nem push do Milestone 02. A publicação Git permanece pendente e será executada em gate posterior, sob controle humano. Este documento registra somente fatos já provados até aqui.

## Escopo implementado

- `src/entrada.js` — contrato interno de entrada: validação de presença e tipo de `projeto`, `pergunta`, `objetivo` e do opcional `estado`; nunca infere nenhum deles.
- `src/descoberta.js` — resolução contida da raiz do projeto (`resolverRaizProjeto`) e leitura sequencial completa de `fontes/` + `derivados/` + `timeline/` (`descobrirUniverso`).
- `src/selecao.js` — seleção textual determinística por substring literal de tokens (3+ caracteres) de `pergunta`/`objetivo`, ordenada por path.
- `src/montagem.js` — montagem do bloco final, com campos estruturalmente distintos para estado, evidências, conflitos e ausência de evidência; sentinela `"não determinado"` para estado.
- `src/saida.js` — serialização YAML determinística, ordem de inserção das chaves preservada.
- `src/contexto.js` — orquestração do contrato interno (entrada → descoberta → seleção → montagem); ponto único de injeção de `conflitos: []` (β1) e de sinalização de `falhas_leitura`.
- `bin/context-builder.js` — CLI fina (Q2): apenas I/O de borda; lê o arquivo YAML de entrada, constrói o objeto interno e delega ao Context Builder.
- `test/` — 55 testes (unidade, integração de fluxo completo e CLI), incluindo probes de contenção de path e prova negativa de β2; `test/helpers/fixtureBaseCanonica.js` cria uma Base Canônica sintética fora do repositório.
- `package.json` / `package-lock.json` — metadados e trava da única dependência (`js-yaml`); nenhuma dependência instalada.
- `.gitignore` — ignora `node_modules/`.

## C. Contrato de entrada

Entradas obrigatórias e explícitas: `projeto`, `pergunta`, `objetivo`. Entrada opcional: `estado`.

- `objetivo` nunca é inferido — não é derivado de projeto, pergunta, documentos ou qualquer outra evidência; é apenas transportado.
- `estado` nunca é inferido, calculado ou exigido por M02. Quando fornecido explicitamente por fonte ou componente competente, é transportado para o bloco final sem reinterpretação, recálculo ou substituição.
- `estado` ausente permanece semanticamente **"não determinado"** no bloco final.
- "Próximo passo" não existe no contrato de entrada nem no de saída de M02 — está fora do contrato (fronteira H3 / M02×M03). Nenhum campo do objeto bruto além dos quatro acima é transportado para o contrato interno.

## D. Contrato de saída

Bloco de contexto serializado em YAML determinístico, com chaves em ordem de inserção. Campos: `projeto`, `objetivo`, `estado`, `pergunta`, `evidencias[]`, `conflitos[]`, `ausencia_evidencia[]` — e `falhas_leitura[]` quando algum documento do universo não pôde ser lido ou usa formato não suportado.

`estado`, `evidencias`, `conflitos` e `ausencia_evidencia` são estruturas tecnicamente distintas entre si — nenhuma reutiliza um `null` genérico com múltiplos significados. Nenhum schema novo foi introduzido além do já ratificado; nenhum campo técnico obrigatório e independente foi inventado para as propriedades conceituais (proveniência, autoridade, maturidade), que são carregadas por evidência.

## E. Descoberta

Universo de descoberta: `fontes/`, `derivados/` e `timeline/` do projeto na Base Canônica. Leitura sequencial completa de todo o universo elegível **antes** de qualquer seleção — nenhuma correspondência textual decide se um arquivo é aberto. Documentos são tratados como texto puro, nunca parseados como YAML estruturado. `.gitkeep` e arquivos de 0 byte são excluídos mecanicamente (não é falha técnica); formato não suportado dentro do universo é sinalizado explicitamente em `falhas_leitura`, nunca omitido silenciosamente.

## F. Seleção

Seleção simples, textual e determinística. Um documento é incluído se seu conteúdo contém, como substring literal e caso-insensível, ao menos um dos termos (tokens de 3+ caracteres) extraídos de `pergunta`/`objetivo`. Resultado ordenado por path. Sem ranking, sem score, sem embeddings, sem IA, sem heurística sofisticada. A correspondência textual decide apenas o que é incluído no bloco final, após a leitura completa do corpus.

## G. Autoridade

Descoberta ≠ autoridade: presença no universo de descoberta não concede autoridade como evidência entregue no bloco final. `derivados/` não é promovido a fonte primária e nunca substitui silenciosamente `fontes/`. Natureza (`primaria` / `derivada` / `timeline`), maturidade/estado de origem e proveniência (path concreto) de cada evidência são preservados no bloco final. Recuperar uma informação não promove sua autoridade nem sua maturidade.

## H. Conflitos

`conflitos` é um canal **relay-only (β1)**: transporta verbatim apenas conflitos/divergências que uma fonte ou componente competente já tenha entregue explicitamente identificados — do mesmo modo que `estado`. É estrutura sempre presente, sem campo de resolução: M02 nunca adjudica, não escolhe posição vencedora, não atribui severidade.

M02 V1 **não** detecta conflito por conta própria (β2 — considerada e rejeitada): não compara valores entre documentos distintos, não infere identidade conceitual entre campos, não descobre contradição semântica em prosa, não compara repositório de código com `fontes/`, não usa IA, NLP, embeddings ou score semântico.

Nenhum formato atual da Base Canônica declara conflito estruturado e relayável; nenhum formato ou detector novo foi inventado. Por isso `conflitos: []` significa **estritamente**:

> "Nenhum conflito explicitamente declarado e relayável pelo mecanismo do M02 V1 foi encontrado nas evidências selecionadas."

Não significa inexistência universal de conflitos, nem que as evidências foram semanticamente comparadas, nem que a ausência de contradições foi verificada.

Não existe o campo `conflitos_nao_verificados` — foi considerado e rejeitado.

## I. Ausência de evidência

`ausencia_evidencia` é acionada quando `evidencias.length === 0`. M02 não julga suficiência semântica, qualidade nem completude da evidência recuperada — essas noções pertencem à determinação de necessidade informacional (M03) e não são introduzidas no V1. "Ausência de evidência" (recuperação documental sem resultado) e "estado não determinado" (M02 não recebeu determinação de estado de fonte competente) permanecem condições conceitualmente distintas e estruturalmente separadas no bloco (`ausencia_evidencia` vs. `estado`), nunca sinalizadas como a mesma coisa.

## J. Contenção de path

A auditoria adversarial pré-staging identificou um **defeito objetivo**: o campo de entrada `projeto` permitia escapar de `base-canonica/projetos/` por `../`, `..\`, caminho absoluto ou normalização e, com estrutura compatível no destino, ler e transportar para o bloco de contexto o conteúdo de arquivos fora do universo autorizado. Exploit demonstrado.

A rodada corretiva fechou o defeito em `src/descoberta.js` (`resolverRaizProjeto`, usada por `descobrirUniverso`), com contenção **lexical + física**:

1. **Gate sintático** — `projeto` tem de ser um único segmento de diretório: rejeita string vazia, `.`, `..`, `/`, `\`, `NUL`, caminho absoluto e qualquer valor cujo `path.basename` difira de si mesmo.
2. **Contenção lexical** — o diretório resolvido tem de ser filho direto de `projetos/`.
3. **Existência** — projeto sem `manifesto.yaml` falha explicitamente.
4. **Contenção física** — `fs.realpathSync` do diretório do projeto e de `projetos/`; se o diretório real deixar de ser filho direto do `projetos/` real (symlink/junction apontando para fora), falha.

Cobertura comprovada por probes/testes para: `../`, `..\`, caminho absoluto, segmento aninhado, `.`/`..`, string vazia, normalização, separadores Windows, projeto inexistente e escape via symlink/junction do diretório do projeto (com `skip` gracioso quando o ambiente nega criação de link). O exploit anteriormente demonstrado foi neutralizado; o projeto legítimo (segmento único existente) continua funcionando sem alteração de comportamento. Correção mínima — não é um framework genérico de segurança, e nenhuma alegação de segurança universal é feita.

## K. Validação

Fatos aprovados na auditoria final:

- suíte automatizada: **55/55 testes verdes**, 0 falhas, 0 skips;
- caso funcional real (FullCommerce, único projeto real da Base Canônica): verde;
- determinismo: 3 execuções produzindo saída serializada byte-idêntica;
- exploit de path traversal anteriormente demonstrado: neutralizado;
- projeto legítimo: preservado, conforme prova realizada;
- `package.json` / `package-lock.json` coerentes; nenhuma dependência instalada (`node_modules/` ausente e ignorado);
- nenhum segredo, nenhum path local hardcoded, nenhum artefato temporário, nenhum TODO/FIXME bloqueante, nenhum construto vedado.

Dois itens de cobertura foram classificados **PARCIAL**, não bloqueantes — conteúdo de `timeline/` e `extrairMaturidade` sobre formatos reais —, cobertos indiretamente pela execução real e enquadrados como limitações V1. Não reabertos neste fechamento.

## L. Limitações conhecidas e aceitas do V1

Registradas explicitamente, deliberadamente fora de escopo, não corrigidas nesta rodada e sem promessa de correção futura:

- **Seleção textual ampla** — correspondência por substring literal (não por fronteira de token), inclusão por `OR`; termos genéricos ("estado", "projeto", "atual") tendem a selecionar grande parte ou todo o universo. Comportamento ratificado (sem ranking, score, embeddings ou heurística sofisticada).
- **`extrairMaturidade`** — heurística de regex sobre o cabeçalho `Status:`; pode capturar linha parcial ou cair no rótulo de natureza quando não há cabeçalho. Não promove autoridade; preserva a maturidade de forma explícita.
- **Symlink/junction de arquivo** dentro de um projeto válido — ignorado (não seguido), conforme classificação registrada.
- **Arquivo real de 0 byte** — pulado silenciosamente (tratado como artefato de Git, não como falha).
- **`localeCompare` sem locale explícito** na ordenação por path.

## M. Fronteiras

M02 não implementa e não antecipa: Milestone 03 (Motor de Convergência), Milestone 04 (Profundidade 3.0), Milestone 05 (Lateralidade), Milestone 06 (Sistema Circulatório); IA, NLP ou embeddings; memória persistente; determinação de objetivo; determinação de estado; determinação de próximo passo; resolução normativa de conflitos. A tokenização de `pergunta` + `objetivo` como critério de recuperação documental é a única derivação interna permitida e não constitui função de Motor de Convergência.

## N. Documentos relacionados

Hierarquia documental preservada — este registro é subordinado às fontes superiores e não as altera:

- `docs/adr/ADR-000-arquitetura-tecnica-sistema-mim.md` — CONGELADO; não modificado.
- `docs/adr/ADR-001-autoridade-das-fontes-na-base-canonica.md` — Aceito; não modificado. A detecção ampla de divergência código ↔ `fontes/` permanece responsabilidade futura do Milestone 06, conforme DEC-4.
- `docs/milestones/MILESTONE-02-PLANO.md` — plano aprovado deste milestone.
- `docs/revisoes/REVISAO-ADR000-FRONTEIRA-M02-M03.md` — decisão humana não canônica da fronteira H3 (M02×M03).
- `docs/revisoes/REVISAO-M02-CONFLITOS-E-CONTENCAO.md` — decisão humana não canônica que adjudicou β1 (relay-only), a rejeição de β2 e de `conflitos_nao_verificados`, `ausencia_evidencia = evidencias.length === 0` e a contenção de path como bloqueador.

Este documento é um registro factual de fechamento — não é um ADR, não modifica ADR-000 nem ADR-001, e não cria precedente normativo.

## O. Publicação

Distinção explícita:

- **Implementação e validação: CONCLUÍDAS** — código, testes (55/55), caso real, determinismo e correção do defeito de contenção estão materialmente prontos e auditados.
- **Publicação Git: PENDENTE neste gate** — nenhum commit e nenhum push do Milestone 02 foram executados. O staging controlado do conjunto final é o único passo Git autorizado agora; commit e push ocorrerão em gate posterior, sob controle humano.

Nenhum hash de commit é registrado aqui: ele ainda não existe e não deve ser inventado. Esta é uma diferença de forma em relação ao `MILESTONE-01-FECHAMENTO.md`, que foi redigido após o commit e por isso pôde listar hashes no seu "Histórico Git". O M01 não define solução para a circularidade do hash do próprio documento de fechamento; aqui a circularidade é resolvida apenas registrando o estado de publicação como pendente e deixando o histórico Git para o gate de commit.
