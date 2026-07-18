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

## Status

Duas propostas registradas até o momento. Novas propostas deliberadamente adiadas devem ser adicionadas a este documento, cada uma com estado, motivo e critério de revisão explícitos.
