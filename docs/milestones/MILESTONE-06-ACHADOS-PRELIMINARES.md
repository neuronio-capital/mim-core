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

## Status

Achado único registrado até o momento. Novas ocorrências da mesma natureza (derivados desatualizados por falta de sincronização automática) devem ser adicionadas a este documento com sua própria linha do tempo, para acumular evidência antes da priorização do Milestone 06.
