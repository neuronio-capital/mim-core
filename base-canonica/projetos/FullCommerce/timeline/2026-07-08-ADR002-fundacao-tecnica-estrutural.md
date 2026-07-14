# 2026-07-08 — ADR-002: Fundação Técnica e Estrutural da Plataforma

**Status:** Aceito — aprovado conceitualmente pelo fundador em 2026-07-08. DEC-11 a DEC-13 formalizadas na mesma data.

Decide stack tecnológica (TypeScript/Node.js, NestJS, Next.js, PostgreSQL, Prisma, Redis, BullMQ, autenticação própria, OpenTelemetry, Jest/Vitest/Playwright, Docker, GitHub Actions), estrutura física do monorepo (`apps/{api,web}` + `packages/` + `infra/` + `docs/` + `scripts/`), a arquitetura de isolamento multi-tenant via Row-Level Security do Postgres (Bloco C) e as estratégias de versionamento de API, de Evento Canônico e de release (Bloco D). Formaliza também DEC-11 a DEC-13 (bypass de RLS do relay da outbox, transação automática por tenant, invalidação de cache orientada a evento).

Ver texto completo em `../fontes/ADRs/ADR-002-fundacao-tecnica-e-estrutural-da-plataforma.md`.
