# Milestone 06 (Sistema Circulatório) — Achados Preliminares

Este documento **não inicia** o Milestone 06. É um registro de evidências datadas, acumuladas antes da priorização formal do milestone, para uso quando ele for aberto (ver ADR-000, roadmap: Sistema Circulatório é o sincronizador que roda após aprovação de um Documento Canônico e recalcula os derivados a partir da Base Canônica).

## Achado 1 — Defasagem de `EstadoAtual.yaml` observável um dia após a sincronização

**Linha do tempo:**

- **2026-07-14** — última sincronização real de `base-canonica/projetos/FullCommerce/derivados/EstadoAtual.yaml`, feita manualmente (bootstrap do Milestone 01) a partir de `docs/milestones/MILESTONE-02-FECHAMENTO.md` e do cabeçalho de status de `fontes/ADRs/ADR-001-*.md` no repositório de código do FullCommerce. O registro afirma explicitamente: *"Não definido nos documentos-fonte disponíveis nesta cópia — nenhum Milestone 03 encontrado em docs/ do repositório de código no momento desta migração (2026-07-14)."*
- **2026-07-15** — **1 dia depois** da sincronização, essa afirmação já está incorreta: o Milestone 03 do FullCommerce (Primitives + primeiro Pattern) está em execução, registrado em `docs/metodologia/VALIDACAO-EXPERIMENTAL.md` (Caso 1: auditoria arquitetural do Milestone 03; Caso 2: smoke test de integração do NUX Engine em `apps/web`, também datado de 2026-07-15).
- **2026-07-18** — a divergência é identificada durante um diagnóstico de status do mim-core e corrigida manualmente: `milestone_atual`, `proximo_milestone` e `objetivo_ativo` em `EstadoAtual.yaml` são atualizados para refletir o Milestone 03 em execução (Primitives completos; Patterns Hero e ProductCard implementados e commitados).

**Contagem de dias (duas medidas, para evitar ambiguidade):**

- Da última sincronização real (2026-07-14) até a correção (2026-07-18): **4 dias corridos** com o derivado desatualizado.
- Do momento em que a divergência já era detectável na prática (2026-07-15) até a correção (2026-07-18): **3 dias** em que o erro já existia e não foi percebido nem sinalizado por nenhum mecanismo.

**Por que isso importa para o Milestone 06:** a correção só aconteceu porque um humano cruzou manualmente um documento de metodologia (`VALIDACAO-EXPERIMENTAL.md`) com o derivado (`EstadoAtual.yaml`) e notou a inconsistência. Não existe hoje nenhum sincronizador automático — essa é exatamente a função descrita para o Sistema Circulatório no ADR-000 (`Documento aprovado -> Atualiza Base Canônica -> Recalcula índices -> Atualiza derivações (DNA, Algoritmo, Linha do Tempo) -> Disponibiliza para consultas`). Este achado é evidência concreta e datada de que a ausência desse componente já produz divergência mensurável em prazo curto (1 dia para a divergência aparecer, 4 dias até ser corrigida), não apenas um risco teórico antecipado no ADR-000.

## Achado 2 — Correção do Achado 1 pulou a cadeia de autoridade que o ADR-001 formaliza

**Linha do tempo:**

- **2026-07-18 (correção do Achado 1)** — `derivados/EstadoAtual.yaml` é atualizado manualmente para refletir o Milestone 03 em execução (Primitives completos; Patterns Hero e ProductCard implementados e commitados), com base em `docs/metodologia/VALIDACAO-EXPERIMENTAL.md` (Casos 1-2) e confirmação direta do fundador na sessão — não a partir do repositório de código do FullCommerce nem de um `fontes/` atualizado.
- **2026-07-18 (mesmo dia, etapa seguinte)** — o ADR-001 (Autoridade das Fontes na Base Canônica) é aprovado e publicado, formalizando DEC-1 (o repositório de código de cada projeto é a fonte primária) e DEC-3 (`derivados/` é processado a partir de `fontes/`, nunca uma fonte independente).
- **2026-07-18 (mesma sessão, verificação de consistência)** — ao confirmar se `EstadoAtual.yaml` está consistente com o ADR-001 recém-publicado, identifica-se que a correção do Achado 1 não seguiu a cadeia repositório de código → `fontes/` → `derivados/`: `base-canonica/projetos/FullCommerce/fontes/ADRs/` continua com apenas ADR-000, ADR-001 e ADR-002 do FullCommerce; nenhum artefato em `fontes/` documenta o Milestone 03, os Primitives ou os Patterns Hero/ProductCard.

**O que está conforme:**

- **DEC-4** (sincronização manual deve declarar fonte e data) — satisfeito. O cabeçalho de `EstadoAtual.yaml` declara explicitamente a data (2026-07-18) e a base usada (`VALIDACAO-EXPERIMENTAL.md` + confirmação do fundador).
- **Correção factual** — o conteúdo atual de `EstadoAtual.yaml` (Milestone 03 em execução; Primitives completos; Patterns Hero e ProductCard implementados e commitados) é considerado **factualmente correto**, verificado nesta sessão via confirmação direta do fundador.

**O que não está conforme:**

- **DEC-1** (repositório de código é a fonte primária) — não seguido nesta atualização: a base usada foi um documento de metodologia do `mim-core` e uma confirmação verbal na sessão, não o repositório de código do FullCommerce.
- **DEC-3** (`derivados/` deriva de `fontes/`, nunca é fonte independente) — quebrado: `fontes/ADRs/` do FullCommerce não tem nenhum artefato correspondente ao Milestone 03; `derivados/EstadoAtual.yaml` carrega uma afirmação sem lastro em `fontes/`.

Em resumo: o conteúdo é **factualmente correto**, mas **procedimentalmente não conforme** ao DEC-1/DEC-3 até que `fontes/` seja atualizado com um artefato real do repositório do FullCommerce documentando o Milestone 03. Popular `fontes/` está fora do escopo deste achado — é trabalho novo, não parte deste diagnóstico.

**Por que isso importa para o Milestone 06:** reforça o padrão do Achado 1 por um ângulo diferente — sem sincronização automática, mesmo uma correção feita com cuidado e transparência (fonte e data declaradas, DEC-4 cumprido) ainda pode pular a cadeia de autoridade que o próprio ADR-001 formaliza, porque não há nada que force a atualização a passar por `fontes/` antes de chegar a `derivados/`. Esse é exatamente o tipo de verificação que um Sistema Circulatório automatizado tornaria estrutural em vez de dependente de uma auditoria manual.

## Status

Dois achados registrados até o momento. Novas ocorrências da mesma natureza (derivados desatualizados ou desalinhados da cadeia de autoridade por falta de sincronização automática) devem ser adicionadas a este documento com sua própria linha do tempo, para acumular evidência antes da priorização do Milestone 06.
