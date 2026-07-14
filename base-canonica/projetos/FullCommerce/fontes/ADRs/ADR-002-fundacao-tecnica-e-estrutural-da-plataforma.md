# ADR-002 — Fundação Técnica e Estrutural da Plataforma

- **Data:** 2026-07-08
- **Status:** **Aceito** — aprovado conceitualmente pelo fundador em 2026-07-08. DEC-11 a DEC-13 formalizadas na mesma data, antes do início do esqueleto físico.
- **Base constitucional:** Constituição do FullCommerce **v1.0 RC1** (`docs/constitution/CONSTITUICAO_FULLCOMMERCE.md`)
- **Decorre de:** ADR-000 (D1 monólito modular, D2 três anéis, D3 três ciclos, D4 fluxo orientado a eventos, D5 IA como camada, D6 verticais por extensão, D7 anti-acoplamento) e ADR-001 (DEC-1 a DEC-10, em especial **DEC-3** — invariante multi-tenant, e o versionamento de schema de evento adiado)
- **Supera:** — (não contradiz nem substitui ADR-000/ADR-001; **reordena e consolida**, por decisão explícita do fundador, o que o roadmap do ADR-000 previa como ADR-002/003/004 separados — ver nota de escopo abaixo)

> **Escopo e limites deste ADR.** Decide **stack tecnológica**, **estrutura física do repositório**, **arquitetura de isolamento multi-tenant** (não o schema detalhado — isso permanece adiado), **estratégias de versionamento** (API, Evento Canônico, releases) e os **critérios não funcionais** que a arquitetura precisa satisfazer. **Não implementa código, não cria pastas, não define schema de banco, não decide provedor de nuvem/hospedagem, não decide o modelo de IA/LLM.** Essas concretizações permanecem adiadas para especificações técnicas e ADRs futuros (ver seção *Adiado*).
>
> **Nota de escopo em relação ao ADR-000.** O ADR-000 (seção "Próximos ADRs") sugeria a ordem ADR-002 (Persistência/Memória) → ADR-003 (multi-tenant) → ADR-004 (Stack). Por instrução explícita do fundador, este ADR-002 **consolida** stack + estrutura de repositório + arquitetura multi-tenant + versionamento num único documento de decisões estruturais. Isso não viola o Art. 53 (todo ADR continua citando os artigos que o fundamentam) nem o Art. 50 (nenhuma decisão anterior é contradita — apenas a ordem/agrupamento é adaptada). Os itens de granularidade mais fina que ADR-000/ADR-001 já haviam adiado (schema concreto de evento, algoritmo de resolução de identidade, curadoria detalhada da Memória, contrato de extensão de vertical, fronteira determinístico×generativo) **continuam adiados** e devem nascer como ADR-003 em diante.

---

## CONTEXTO

O ADR-000 fixou a forma (monólito modular, três anéis, três ciclos, fluxo orientado a eventos, IA como camada, verticais por extensão) e adiou toda tecnologia concreta. O ADR-001 fixou os invariantes da fundação de dados (evento canônico, imutabilidade, **tenant-scoping desde a origem — DEC-3**, proveniência/confiança, resolução de identidade probabilística) e adiou o mecanismo concreto de isolamento e o versionamento de schema de evento.

Este ADR precisa escolher tecnologia e estrutura **sem contradizer nenhuma dessas decisões**. Três restrições arquiteturais já fixadas governam toda escolha abaixo:

- A stack deve **caber dentro de um monólito modular** (D1/ADR-000) — não deve exigir, na origem, a complexidade operacional de microsserviços distribuídos.
- A stack deve **expressar** os três anéis (núcleo, verticais, integrações — D2) e as fronteiras de módulo por contrato/evento (D7), não apenas hospedá-los.
- O isolamento multi-tenant é **invariante desde a origem do dado** (DEC-3 do ADR-001), não um filtro de aplicação — a escolha arquitetural precisa **garantir isso estruturalmente**, não apenas por convenção de código.

Adicionalmente, a Constituição impõe critérios que pesam sobre toda decisão de tecnologia: **Simplicidade Operacional** e **Síntese/Custo Cognitivo** (Art. 15, 39), **Escalabilidade Multiempresa** do empreendedor individual a milhares de pedidos/dia (Art. 15), **Soberania do Dono** e **Portabilidade/Não-aprisionamento** (Art. 42 — o que pesa contra vendor lock-in), e o **Princípio do Foco** (Art. 46 — não adiantar infraestrutura que nenhuma decisão atual exige).

---

## CRITÉRIOS DE DECISÃO (aplicados a todas as escolhas abaixo)

Sempre que havia mais de uma alternativa tecnicamente viável, a escolha foi arbitrada pelos seguintes critérios, nesta ordem de peso para este estágio do produto:

1. **Simplicidade operacional** — menor número de peças móveis, menor superfície de falha, menor exigência de equipe dedicada a operar infraestrutura (Art. 15, 39).
2. **Menor vendor lock-in** — preferência por tecnologia portável e substituível sobre serviço proprietário de plataforma única (Art. 42 — Soberania do Dono, Portabilidade).
3. **Maturidade do ecossistema** — bibliotecas, documentação, tempo de mercado, previsibilidade de manutenção de longo prazo.
4. **Produtividade e experiência da equipe (DX)** — tempo até o primeiro valor de engenharia, curva de aprendizado, disponibilidade de talento no mercado brasileiro.
5. **Custo operacional** — custo de infraestrutura e de terceiros em função do crescimento de tenants/eventos, evitando modelos que penalizam desproporcionalmente a escala pretendida (Art. 15 — do individual a milhares de pedidos/dia).
6. **Escalabilidade futura sem reescrita** — a escolha não pode impedir a evolução prevista em D1 (extração futura de serviços) nem em D6 (novas verticais).

Cada decisão abaixo declara explicitamente quais destes critérios pesaram mais.

---

## DECISÕES — BLOCO A: STACK TECNOLÓGICA

### A.1 — Linguagem e runtime de backend: TypeScript sobre Node.js (LTS)

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **TypeScript/Node.js** | Uma só linguagem em todo o monorepo (backend, frontend, scripts); tipos compartilhados entre API e evento canônico; ecossistema enorme; talento abundante no Brasil | Single-thread por padrão (mitigado por I/O assíncrono e por workers para CPU-bound) |
| Python | Ecossistema de IA/dados muito forte | Tipagem estática mais fraca (mesmo com mypy); duas linguagens no monorepo (custo cognitivo de contexto); pior encaixe com módulos fortemente tipados exigidos por D7 |
| Go | Performance e concorrência excelentes | Ecossistema mais pobre para o tipo de produto (web app rico, iterações rápidas de produto); maior tempo de desenvolvimento; talento mais escasso no Brasil |
| Java/Kotlin | Maduro, tipado, robusto para módulos | Verboso, ciclo de desenvolvimento mais lento, cultura de microsserviços que tenta empurrar decomposição prematura — atrito com D1 |
| Elixir/Phoenix | Modelo de concorrência (atores) muito alinhado a "fluxo orientado a eventos" (D4) | Ecossistema e talento muito mais escassos no mercado brasileiro; risco de contratação/manutenção de longo prazo |

**Justificativa.** Critérios de peso: **produtividade da equipe** (uma linguagem única do banco de tipos ao componente de tela reduz custo cognitivo — Art. 39) e **maturidade/talento**. TypeScript permite que o **Modelo Canônico de Evento** (ADR-001) seja um único conjunto de tipos compartilhado entre núcleo, verticais e frontend — reforçando a Fonte Única da Verdade (Art. 15) também no nível de código, não só de dado.

**Fundamentação constitucional.** Simplicidade Operacional e Síntese (Art. 15, 39); Fonte Única da Verdade (Art. 15).

---

### A.2 — Framework de backend: NestJS

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **NestJS** | Sistema de módulos de primeira classe (`@Module`) mapeia diretamente para "módulos de domínio com fronteiras explícitas" (D1) e para os Três Ciclos (D3); injeção de dependência nativa; suporte oficial a OpenAPI, filas (BullMQ), CQRS/EventEmitter, testes | Opinativo — exige seguir suas convenções; curva de entrada um pouco maior que Express puro |
| Express/Fastify puro | Simples, minimalista, rápido | Não impõe nenhuma disciplina de módulo — o monólito modular (D1) dependeria inteiramente de convenção manual, com risco real de erosão de fronteira (o problema que D7 existe para evitar) |
| Python (Django/FastAPI) | Produtivo, FastAPI é rápido | Sem o sistema de módulos/DI nativo equivalente; exigiria construir a disciplina de fronteira do zero; descartado junto com A.1 |
| Go (Wire/Fx) | Performance, fronteiras explícitas possíveis | Maior esforço de desenvolvimento, ecossistema web mais pobre, descartado junto com A.1 |

**Justificativa.** Critério decisivo: o framework precisa **reforçar estruturalmente** a decisão D1 (monólito modular) e D7 (fronteiras explícitas), não apenas permiti-la por disciplina. O sistema de módulos do NestJS torna o núcleo, as verticais (Food/Moda) e as integrações (D2) unidades de código literais, não apenas uma convenção de pasta.

**Fundamentação constitucional.** ADR-000/D1, D2, D3, D7.

---

### A.3 — Frontend: Next.js (React) + TypeScript

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **Next.js** | SSR/SSG quando necessário; ecossistema React (o maior); mobile-first viável; auto-hospedável (sem lock-in em uma nuvem específica); mesma linguagem do backend | Framework opinativo sobre roteamento/build |
| SPA pura (Vite + React) | Mais simples, sem servidor de renderização | Perde SSR para futuras páginas públicas/SEO (marketing, onboarding); menos "baterias inclusas" |
| Vue/Nuxt | Curva de aprendizado suave | Ecossistema e talento menores no mercado brasileiro para produtos SaaS B2B |
| Remix | Boas ideias de data-loading | Ecossistema e comunidade menores que Next.js; menor maturidade de mercado |

**Justificativa.** Critérios: **maturidade do ecossistema** e **talento disponível** (React domina o mercado brasileiro de frontend), somado a **menor lock-in** (Next.js roda em qualquer host com Node/Docker, não depende de uma nuvem específica). Atende ao Art. 36 (Pele): mobile-first, rápido, com Progressão de Profundidade viável via rotas aninhadas.

**Fundamentação constitucional.** Art. 36 (a Pele); critério de menor lock-in (Art. 42).

---

### A.4 — Banco de dados: PostgreSQL

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **PostgreSQL** | Transacional forte (Fonte Única da Verdade), JSONB para payload flexível de evento, Row-Level Security nativo (chave para C — multi-tenant), extensível (ex.: séries temporais no futuro), maduro, sem lock-in de fornecedor | Não é um event store dedicado (aceito — ver alternativas) |
| MySQL | Maduro, popular | JSONB/RLS mais limitados; pior encaixe com o isolamento multi-tenant arquitetural decidido em C |
| MongoDB | Schema flexível, natural para "eventos" | Consistência transacional mais fraca entre agregados — risco direto para Fonte Única da Verdade em dados financeiros/pedido; pior ajuste ao Art. 3 (não é ERP de estado solto, mas também não pode perder consistência de fato) |
| Event store dedicado (EventStoreDB etc.) | Otimizado para append-only e replay | Introduz uma segunda tecnologia de persistência antes de qualquer necessidade concreta — contraria D1 (monólito, simplicidade) e D7 (adiar o adiável); reconsiderar apenas se volume/replay exigir |

**Justificativa.** Critério decisivo: **simplicidade operacional** (uma única tecnologia de persistência serve como fonte transacional **e** como log de eventos append-only, via tabela(s) dedicadas) e **menor lock-in** (Postgres roda em qualquer provedor ou on-premise). O RLS nativo do Postgres é o que torna viável a arquitetura multi-tenant do Bloco C sem tecnologia adicional.

**Fundamentação constitucional.** Fonte Única da Verdade, Escalabilidade Multiempresa (Art. 15); ADR-001 DEC-2 (append-only) e DEC-3 (tenant-scoped).

---

### A.5 — ORM: Prisma

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **Prisma** | Tipagem gerada a partir do schema, migrations declarativas, DX madura, grande adoção, curva de aprendizado baixa | Menor controle fino sobre SQL bruto; integração com Postgres RLS exige rodar cada requisição dentro de uma transação (`$transaction`) para que `SET LOCAL` valha — custo de implementação conhecido, não um bloqueio |
| Drizzle | Mais próximo do SQL, leve, sem "engine" binário, controle fino | Ecossistema mais novo, comunidade menor, menos padronizado para migrations em equipe |
| TypeORM | Integração "oficial" com Nest via decorators | Histórico de problemas de manutenção/performance apontados pela comunidade nos últimos anos |
| SQL cru / Kysely | Controle total | Perde produtividade de migrations/tipagem automática; mais código de infraestrutura para manter |

**Justificativa.** Critério de peso: **produtividade da equipe** e **maturidade do ecossistema** superam o custo conhecido de integrar RLS (mitigável com transações por requisição — ver C.2). Reavaliar para Drizzle é uma opção legítima se o custo de integração com RLS se mostrar alto na prática — decisão revisável, não definitiva (Art. 50 — Contestação Permanente).

**Fundamentação constitucional.** Critério de produtividade; nenhum artigo é violado por qualquer das alternativas — escolha é de eficiência de engenharia.

---

### A.6 — Cache: Redis

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **Redis** | Cache + pub/sub + estruturas de dados + base para filas (A.8) — uma peça de infraestrutura cobre múltiplos usos | Em memória, custo cresce com dados quentes (mitigável com TTL/curadoria) |
| Memcached | Simples | Sem pub/sub, sem persistência, sem estruturas ricas — exigiria uma segunda tecnologia para filas/pub-sub |
| KeyDB | Multi-thread | Ecossistema/comunidade menores, benefício não comprovado como necessário neste estágio |

**Justificativa.** Critério: **simplicidade operacional** — Redis substitui o que exigiria duas ou três tecnologias separadas (cache, pub/sub, backend de fila).

**Fundamentação constitucional.** Simplicidade Operacional (Art. 15).

---

### A.7 — Event Bus (interno): EventEmitter/CQRS do NestJS + Outbox em Postgres

**Decisão.** Na escala atual (monólito modular, D1), o "barramento de eventos" que materializa o fluxo orientado a eventos do Ciclo da Inteligência (D4) é implementado **dentro do processo**, via o mecanismo de eventos nativo do NestJS (EventEmitter2/CQRS), com **outbox transacional em Postgres**: todo evento relevante é persistido na mesma transação do fato que o originou, garantindo que nenhum evento se perca mesmo se o processo cair antes de propagar. Consumidores assíncronos (ex.: integrações, IA) leem da tabela de outbox ou de um stream do Redis alimentado a partir dela.

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **In-process (EventEmitter/CQRS) + outbox Postgres** | Zero infraestrutura nova; consistente com D1 (monólito); rastreabilidade nasce do outbox (Art. 16, 42) | Não serve, por si só, múltiplos processos distribuídos — aceitável, pois D1 não exige isso agora |
| Kafka | Altíssima escala, replay nativo | Complexidade operacional pesada (cluster, particionamento, operação) sem nenhuma necessidade concreta hoje — viola Foco (Art. 46) e o Portão (Art. 52) |
| RabbitMQ | Broker maduro, dedicado | Componente de infraestrutura adicional só para propagação de evento interno, quando o processo único já resolve — redundante com D1 |

**Justificativa.** Critério: **simplicidade operacional** e **não antecipar decomposição** (D7 — "adiar o adiável"). Um broker externo só se justifica quando o monólito precisar mesmo ser decomposto (decisão futura e registrada, conforme o próprio D1 prevê).

**Fundamentação constitucional.** ADR-000/D1, D4, D7; ADR-001/DEC-2 (rastreabilidade via outbox append-only).

---

### A.8 — Filas (jobs assíncronos): BullMQ sobre Redis

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **BullMQ** | Reaproveita o Redis já escolhido (A.6); retries, agendamento, taxa de repetição, painel de observação (Bull Board) | Redis como dependência única de durabilidade de fila (mitigado por persistência do Redis/AOF) |
| RabbitMQ | Recursos de fila mais ricos | Nova peça de infraestrutura sem necessidade comprovada |
| AWS SQS | Gerenciado, sem operação | Lock-in de nuvem específica; pior DX local (Art. 42 — menor lock-in pesa contra) |
| pg-boss (fila sobre Postgres) | Zero infraestrutura nova (usa o Postgres já existente) | Menor taxa de transferência/recursos que BullMQ para o volume de notificações e IA em tempo real que o produto exige (Voz — Art. 35) |

**Justificativa.** Critério: **simplicidade operacional** (reaproveita Redis) e **maturidade** (BullMQ é o padrão de mercado no ecossistema Node/Nest para este uso).

**Fundamentação constitucional.** Art. 34 (Reflexos — medição obrigatória de automação, que roda em jobs); Art. 35 (Voz — alertas assíncronos).

---

### A.9 — Autenticação: solução própria (NestJS + Passport + JWT + Argon2), sem provedor de identidade terceirizado

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **Própria (Passport.js + JWT access/refresh + Argon2)** | Zero lock-in de identidade; custo não cresce por usuário/tenant; controle total sobre claims (ex.: tenant_id embutido no token, essencial para C.2) | Mais código próprio para manter (login, recuperação de senha, rotação de refresh token) |
| Auth0 / Clerk (gerenciado) | Rapidez de implementação, recursos prontos (SSO, MFA) | Custo cresce com volume de usuários/tenants; lock-in de identidade — o dado de identidade do cliente passa a viver fora do produto, tensionando a Soberania do Dono (Art. 42) |
| Supabase Auth | Gerenciado, integrado a Postgres | Acopla a plataforma ao ecossistema Supabase, quando o banco já foi decidido como Postgres "puro" (A.4) — lock-in desnecessário |

**Justificativa.** Critérios decisivos: **menor lock-in** e **custo operacional** que não penaliza o crescimento de tenants (Art. 15 — do individual a milhares de pedidos/dia, sem custo por assento de terceiro). O controle total sobre o payload do token é também o que viabiliza a propagação do contexto de tenant (Bloco C).

**Fundamentação constitucional.** Soberania do Dono, Portabilidade e Não-aprisionamento (Art. 42); Escalabilidade Multiempresa (Art. 15).

---

### A.10 — Observabilidade: OpenTelemetry (instrumentação) + backend gerenciado de baixo custo inicial

**Decisão.** Instrumentação de código via **OpenTelemetry** (padrão neutro de mercado — logs, métricas e traces), com exportação inicial para um backend gerenciado de custo baixo (ex.: Grafana Cloud tier gratuito/entrada, ou equivalente). A escolha do backend de observabilidade fica **desacoplada do código** — pode trocar sem reescrever instrumentação.

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **OpenTelemetry + backend gerenciado leve** | Instrumentação neutra e portável; baixo custo/ops no início; troca de backend sem reescrita | Backend gerenciado ainda tem algum custo recorrente |
| Datadog | Recursos ricos, maduro | Custo alto e cresce rápido — desproporcional ao estágio atual |
| Stack self-hosted (Prometheus+Grafana+Loki+Tempo) desde já | Sem custo de terceiro, controle total | Ops própria de 4 sistemas distribuídos, incompatível com o tamanho de equipe atual e com o Princípio do Foco (Art. 46) — reavaliar quando a equipe de infraestrutura existir |

**Justificativa.** Critério: instrumentar de forma **portável desde o início** (menor lock-in futuro) enquanto se adia a decisão de **onde** operar o backend pesado, coerente com Foco (Art. 46) e Simplicidade Operacional (Art. 15).

**Fundamentação constitucional.** Art. 15, 39, 46; Art. 42 (Rastreabilidade Total — a instrumentação é o que a viabiliza tecnicamente).

---

### A.11 — Testes: Jest + Supertest (backend), Vitest + Testing Library (frontend), Playwright (E2E)

**Decisão.** Backend: **Jest** (suporte oficial e padrão do NestJS) para testes unitários e de integração, **Supertest** para contratos HTTP. Frontend: **Vitest** + **React Testing Library** para unidade/componente. Ponta a ponta: **Playwright**.

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **Jest (backend) / Vitest (frontend) / Playwright (E2E)** | Cada ferramenta é o padrão de fato do seu contexto (Nest ↔ Jest; Vite/Next moderno ↔ Vitest); Playwright supera Cypress em paralelismo e múltiplos contextos de navegador | Duas ferramentas de teste unitário no monorepo (Jest e Vitest) — aceito, pois cada uma é a nativa do seu framework |
| Vitest também no backend | Uma só ferramenta de unidade | Perde a integração "oficial" e testada do Nest com Jest (geradores de teste, mocks de módulo) |
| Cypress (E2E) | Muito popular, DX boa | Mais lento em paralelização e em cenários multi-aba/multi-contexto do que Playwright |

**Justificativa.** Critério: **maturidade específica de cada contexto** supera a uniformidade de ferramenta única — o custo de duas ferramentas de unidade é pequeno frente ao ganho de usar o caminho oficial de cada framework.

**Fundamentação constitucional.** Nenhum artigo diretamente; decisão de qualidade de engenharia a serviço da Confiabilidade implícita no Art. 42.

---

### A.12 — Docker: containerização de todos os serviços, do ambiente local à imagem de produção

**Decisão.** Todo serviço (API, worker de filas, frontend) roda em container Docker, com **Docker Compose** para paridade de ambiente local (Postgres, Redis, API, web). A imagem de produção é a mesma construída e testada em CI (ver A.13) — nenhuma diferença de artefato entre ambientes.

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **Docker + Compose** | Paridade dev/produção; portável entre qualquer provedor; sem lock-in de host | Alguma sobrecarga de aprendizado para quem nunca usou |
| Sem containers (execução direta na VM) | Mais simples à primeira vista | Deriva de ambiente (Art. 15 — o oposto de Simplicidade Operacional no médio prazo); acopla a um SO/host específico |

**Justificativa.** Critério: **menor lock-in** (a imagem roda em qualquer host compatível com Docker — decisão de **qual** host fica explicitamente adiada) e **experiência de desenvolvimento** (ambiente local idêntico ao de produção).

**Fundamentação constitucional.** Art. 42 (Portabilidade e Não-aprisionamento).

---

### A.13 — CI/CD: GitHub Actions

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **GitHub Actions** | O repositório já vive no GitHub; zero infraestrutura adicional; tier gratuito generoso; ecossistema enorme de actions prontas | Lock-in leve à plataforma GitHub (aceitável — o código em si permanece portável; só a definição do pipeline precisaria ser reescrita em outra plataforma) |
| GitLab CI | Recursos maduros | Exigiria migrar o repositório de hospedagem — custo desnecessário sem motivo |
| CircleCI/Travis | Maduros, dedicados | Custo e complexidade de mais um fornecedor sem ganho sobre GitHub Actions |
| Jenkins | Controle total, self-hosted | Ônus operacional de manter o próprio servidor de CI — contraria Simplicidade Operacional |

**Justificativa.** Critério: **simplicidade operacional** e **custo** — usar o que já está no lugar onde o código vive elimina uma integração inteira.

**Pipeline (arquitetura, não implementação).** Em cada push/PR: lint → typecheck → testes unitários/integração → build de imagem Docker → (em merge para `main`) testes E2E → publicação de imagem versionada → deploy. **Onde** o deploy acontece (provedor de nuvem, orquestrador) permanece **adiado** (ver seção Adiado) — decisão de infraestrutura, não de ferramenta de CI.

**Fundamentação constitucional.** Simplicidade Operacional (Art. 15); Rastreabilidade Total do processo de release (Art. 42).

---

## DECISÕES — BLOCO B: ESTRUTURA FÍSICA DO REPOSITÓRIO

### B.1 — Monorepo (não polyrepo)

**Decisão.** A plataforma vive em um **monorepo único**, gerenciado por **pnpm workspaces** + **Turborepo** (orquestração/cache de tarefas entre pacotes).

**Alternativas consideradas.**
- *Polyrepo (um repositório por aplicação/pacote)* — **rejeitado.** O Modelo Canônico de Evento (ADR-001) e os contratos de módulo (D7) precisam ser **um único conjunto de tipos compartilhado** entre núcleo, verticais e frontend. Em polyrepo, isso viraria um pacote versionado publicado externamente a cada mudança — atrito e latência direto contra a Fonte Única da Verdade (Art. 15) e o Foco (Art. 46), para uma equipe que ainda é uma só. Reavaliar apenas se/quando existirem times independentes com cadências de deploy verdadeiramente distintas.

**Justificativa.** Critério: **simplicidade operacional** e **produtividade da equipe** — uma mudança que atravessa núcleo + vertical + frontend (comum nesta fase) é um único PR revisável atomicamente.

**Fundamentação constitucional.** Fonte Única da Verdade (Art. 15); Foco (Art. 46); Simplicidade Operacional (Art. 15).

---

### B.2 — Layout de diretórios e responsabilidade de cada um

O enunciado do escopo lista nove convenções candidatas (`backend/`, `frontend/`, `packages/`, `shared/`, `apps/`, `libs/`, `infra/`, `docs/`, `scripts/`). Várias delas **descrevem o mesmo conceito com nomes diferentes** — mantê-las todas violaria o Portão e o Saldo Conceitual (Art. 52: "prefira fundir a adicionar"). A tabela abaixo resolve explicitamente cada uma:

| Convenção candidata | Decisão | Por quê |
|---|---|---|
| `backend/` + `frontend/` como irmãos na raiz | **Substituídos por `apps/api/` e `apps/web/`** | `apps/` é o padrão idiomático de monorepos com Turborepo/pnpm e permite adicionar `apps/worker/`, `apps/admin/` etc. no futuro sem renomear a raiz |
| `apps/` | **Adotado** | Contém as aplicações **deployáveis**: `apps/api` (o monólito modular NestJS — núcleo + verticais + integrações) e `apps/web` (o frontend Next.js) |
| `packages/` | **Adotado** | Contém código **compartilhado, não deployável isoladamente**, consumido via workspace pelos `apps/` |
| `libs/` | **Não adotado como diretório irmão de `packages/`** | No ecossistema JS/TS, `libs/` e `packages/` nomeiam o mesmo conceito (convenção Nx vs. convenção pnpm/Turborepo); manter os dois seria duplicar um conceito sob dois nomes — exatamente o que o Art. 52 (Portão/Saldo Conceitual) manda evitar. Usa-se apenas `packages/` |
| `shared/` como diretório irmão na raiz | **Não adotado como irmão de `packages/`** | Absorvido como `packages/shared` (utilitários genéricos sem lar próprio: formatação, constantes). Um `shared/` na raiz e um `packages/` lado a lado criariam dois lugares concorrentes para "coisa compartilhada" |
| `infra/` | **Adotado** | Dockerfiles, `docker-compose.yml` de desenvolvimento, scripts de apoio ao CI. Infraestrutura de nuvem (Terraform/IaC) entra aqui **quando** a decisão de hospedagem for tomada (adiada) |
| `docs/` | **Adotado (já existente)** | Constituição, ADRs e, futuramente, PRDs/especificações técnicas |
| `scripts/` | **Adotado** | Automação de desenvolvimento: setup de ambiente, seed de banco, geração de cliente a partir do schema, etc. |

**Layout resultante:**

```
/
├── apps/
│   ├── api/                    # Monólito modular (NestJS): núcleo + verticais + integrações
│   └── web/                    # Frontend (Next.js): Conselho Executivo Diário, telas, Pele
├── packages/
│   ├── canonical-events/       # Tipos/contratos do Modelo Canônico de Evento (ADR-001) e sua versão
│   ├── sdk/                    # Cliente TS gerado a partir do OpenAPI da API, consumido pelo web
│   ├── ui/                     # Design system / componentes compartilhados de interface
│   ├── config/                 # eslint, tsconfig, tailwind config compartilhados entre apps/pacotes
│   └── shared/                 # Utilitários genéricos sem lar próprio (datas, dinheiro, constantes)
├── infra/
│   ├── docker/                 # Dockerfiles e docker-compose de desenvolvimento
│   └── ci/                     # Scripts de apoio aos workflows de CI (os workflows em si vivem em .github/workflows)
├── docs/
│   ├── constitution/
│   ├── adr/
│   └── prd/                    # (a nascer conforme funcionalidades forem especificadas)
└── scripts/                    # Automação de dev: setup, seed, geração de clientes, migrations helpers
```

---

### B.3 — Neutralidade de vertical dentro de `apps/api` (Food lidera sem acoplar o núcleo)

**Decisão.** Dentro de `apps/api/src/`, a estrutura reflete diretamente D2 (três anéis) e D6 (verticais por extensão):

```
apps/api/src/
├── core/            # Núcleo horizontal, vertical-agnóstico: Ciclo da Inteligência, Memória,
│                    #   Genoma, Priorização (IVEA), Diretoria Digital, Três Ciclos do Negócio
├── verticals/
│   └── food/        # Única vertical implementada agora (DF-2 — Food lidera). Consome pontos
│                    #   de extensão do core; o core NUNCA importa nada de verticals/
└── integrations/    # Sentidos + Camada Anticorrupção (Art. 33): tradução de fontes externas
                     #   para o Modelo Canônico antes de tocar o core
```

`verticals/` nasce **plural e vazio de suposições** — hoje só `food/` existe, mas a pasta em si já expressa que o núcleo é reutilizável: adicionar `verticals/moda/` no futuro é **um novo diretório-irmão implementando o mesmo contrato de extensão**, nunca uma refatoração do `core/`. O contrato de extensão em si (a interface que toda vertical deve implementar) permanece **adiado** para um ADR próprio (ver Adiado), mas a convenção de pasta já garante, estruturalmente, a direção de dependência exigida por D6: `verticals → core`, nunca o inverso.

Isso satisfaz diretamente a exigência do enunciado: a estrutura **reflete que Food é a vertical inicial (DF-2)** sem acoplar o núcleo técnico a essa vertical, permitindo expansão para Moda e futuras verticais **sem refatoração estrutural** (Art. 45).

**Fundamentação constitucional.** ADR-000/D2, D6; Art. 45, 46 (Verticais, Foco); DF-2 (Food lidera).

---

## DECISÕES — BLOCO C: ISOLAMENTO MULTI-TENANT (arquitetura — operacionaliza DEC-3 do ADR-001)

> Esta seção decide **apenas a arquitetura** de isolamento. Schema detalhado de tabelas, nomes de colunas e políticas concretas de RLS ficam para especificação técnica posterior.

### C.1 — Modelo escolhido: banco e schema compartilhados, com isolamento imposto por Row-Level Security

**Decisão.** Todos os tenants compartilham **um único banco e um único schema físico**. Toda tabela que carrega dado de negócio possui uma coluna de identificação de tenant, e o isolamento é imposto **na camada do banco de dados**, via **Row-Level Security (RLS) do PostgreSQL** — não apenas por filtro em código de aplicação. Isso significa que, mesmo que uma consulta da aplicação **esqueça** de filtrar por tenant, o banco **recusa** o acesso cruzado.

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **Banco/schema compartilhados + RLS** | Uma única migração para todos os tenants; custo de infraestrutura constante independente do número de tenants; isolamento garantido em duas camadas (aplicação + banco) | Exige disciplina rigorosa de nunca introduzir tabela tenant-scoped sem sua política RLS — mitigado por revisão obrigatória (ver D7 do ADR-000) |
| Banco dedicado por tenant | Isolamento físico mais forte, natural para exigências de compliance extremas | Inviável operacionalmente na meta de "do empreendedor individual a milhares de pedidos/dia" (Art. 15) — centenas/milhares de bancos para migrar e monitorar; contraria Simplicidade Operacional |
| Schema dedicado por tenant (mesmo banco) | Isolamento intermediário | Migração precisa ser replicada por schema; pool de conexões e catálogo do Postgres degradam com centenas de schemas; complexidade cresce linearmente com a base de clientes — inadequado para uma meta de escala em **número de tenants**, não só em volume por tenant |

**Justificativa.** Critérios decisivos: **escalabilidade em número de tenants** (o produto mira do microempreendedor a operações grandes — Art. 15 — o que sugere **muitos** tenants, não poucos e enormes) e **simplicidade operacional** (uma só superfície de migração/monitoramento). O RLS entrega a garantia que a Constituição exige ("um cliente jamais vê o dado de outro", Art. 15/42) como **propriedade do banco**, não como promessa de disciplina de código — coerente com DEC-3 do ADR-001 ("o isolamento é uma propriedade do próprio dado, não um filtro aplicado depois").

**Reavaliação futura, não descartada.** Para tenants de porte excepcional que exijam isolamento físico contratual (compliance, contrato específico), um modelo híbrido (banco dedicado apenas para esses casos) pode ser decidido em ADR futuro, sem exigir reescrever a base compartilhada.

**Fundamentação constitucional.** ADR-001/DEC-3; Art. 15 (Escalabilidade Multiempresa); Art. 42 (Isolamento multi-tenant como garantia constitucional).

---

### C.2 — Mecanismo de propagação do contexto de tenant

**Decisão (arquitetura, não implementação).** O identificador do tenant é embutido nas claims do token de autenticação (A.9) no momento do login. A cada requisição, um interceptor do núcleo:

1. extrai o tenant autenticado do token;
2. abre a operação de banco dentro de uma transação que declara o tenant corrente para a sessão do Postgres;
3. as políticas de RLS de cada tabela leem essa declaração de sessão para decidir quais linhas são visíveis.

Isso garante que **nenhuma consulta** — nem as escritas pelo core, nem futuras consultas ad-hoc — escapem do isolamento, porque a garantia vive no banco, não em cada linha de código de aplicação.

**Fundamentação constitucional.** ADR-001/DEC-3 e DEC-9 (a Coleta como único portão — aqui, o equivalente para leitura/escrita é "nenhuma operação sem tenant declarado"); Art. 42.

---

## DECISÕES — BLOCO D: ESTRATÉGIA DE VERSIONAMENTO

### D.1 — Versionamento de API: por URI (`/api/v1/...`)

**Decisão.** A API expõe versão explícita no caminho da URL. Mudanças aditivas e retrocompatíveis **não** incrementam a versão; mudanças que quebram contrato existente nascem em `/v2` com **janela de depreciação anunciada** antes de desligar `/v1`.

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **Versionamento por URI** | Explícito, visível em logs/cache/documentação, simples de rotear | "Polui" a URL — aceitável frente ao ganho de clareza |
| Versionamento por header | Não polui a URL | Menos descobrível; mais fácil de esquecer/errar por consumidores externos |
| Sem versionamento (breaking changes in-place) | Mais simples no dia a dia | Quebra consumidores externos sem aviso — direto contra Soberania do Dono/Portabilidade (Art. 42), já que parceiros e futuras integrações do próprio cliente dependem de estabilidade de contrato |

**Justificativa.** Critério: **simplicidade** e **explicabilidade do contrato** para quem consome a API (incluindo o próprio dono exportando/integrando seus dados — Art. 42).

**Fundamentação constitucional.** Art. 42 (Portabilidade — o dono e seus parceiros dependem de contrato estável e declarado).

---

### D.2 — Versionamento do schema do Evento Canônico (item adiado do ADR-001)

**Decisão.** Todo evento canônico carrega um campo explícito de **versão de schema**. A evolução do vocabulário de evento segue três regras, decorrentes diretamente de DEC-2 (imutabilidade/append-only) do ADR-001:

1. **Mudanças aditivas são preferidas** (novo campo opcional) e **não** exigem nova versão de evento.
2. **Mudanças que quebram o formato anterior** (renomear/remover/mudar semântica de um campo) exigem uma **nova versão do tipo de evento**. O evento antigo **nunca é reescrito** — permanece exatamente como foi gravado (DEC-2 é inviolável).
3. Leitura de eventos históricos usa **funções de "upcasting"**: transformam, no momento da leitura, um evento de versão antiga para o formato que o código atual entende. A Memória (Art. 25–27) permanece append-only para sempre; é a **camada de leitura**, não o dado gravado, que reconcilia versões.

**Alternativas consideradas.**
- *Reescrever eventos antigos para o novo formato* — **rejeitado**, viola DEC-2 (imutabilidade) do ADR-001 diretamente.
- *Não versionar o schema de evento* — **rejeitado**, torna qualquer evolução do produto uma ameaça silenciosa à Honestidade dos Dados (Art. 26) e à Rastreabilidade (Art. 16, 42): o sistema não saberia mais interpretar corretamente seu próprio histórico.

**Fundamentação constitucional.** ADR-001/DEC-2 (imutabilidade), DEC-4 (proveniência), DEC-10 (tempo estrutural); Art. 16 (Rastreabilidade do Ciclo); Art. 26 (Honestidade dos Dados).

---

### D.3 — Versionamento de releases/deploy: SemVer + trunk-based + deploy contínuo gated por CI

**Decisão.** O artefato do monólito segue **Versionamento Semântico** (MAJOR.MINOR.PATCH). Desenvolvimento em **trunk-based** (branches de feature curtas, `main` sempre deployável). Todo merge em `main` que passa no pipeline de CI (A.13) é elegível a deploy; o deploy em si (automático vs. aprovação manual) é parametrizável por ambiente, mas a **mecânica de release é contínua**, não em lotes trimestrais.

| Alternativa | Vantagens | Desvantagens |
|---|---|---|
| **SemVer + trunk-based + deploy contínuo gated** | Lotes pequenos de mudança (menor risco por deploy); rastreável (cada versão = um commit = um conjunto de testes) | Exige disciplina de feature flags para funcionalidades incompletas em `main` |
| Git-flow com branches longas de release | Familiar em times grandes | Merges grandes e infrequentes aumentam risco por deploy; atrito com iteração rápida que o Foco (Art. 46) exige nesta fase |
| Deploy manual em lote, sem SemVer | Simples de início | Perde rastreabilidade de qual mudança está em produção — atrito direto com Rastreabilidade Total (Art. 42) |

**Justificativa.** Critério: **menor risco por unidade de mudança** e **rastreabilidade** — cada release é pequena, testada e correlacionável a um conjunto específico de commits/PRs.

**Fundamentação constitucional.** Art. 42 (Rastreabilidade Total); Art. 46 (Foco — iteração rápida e incremental).

---

## DECISÕES DERIVADAS — DEC-11 a DEC-13 (formalizadas após aprovação conceitual)

> Estas três decisões nasceram da *Análise de Compatibilidade Arquitetural* apresentada ao fundador junto com o resumo executivo deste ADR. Não alteram nenhuma decisão dos Blocos A–D; **fecham lacunas de implementação** que a própria análise identificou como necessárias antes do esqueleto físico. A numeração continua a sequência **DEC-** iniciada no ADR-001 (DEC-1 a DEC-10), por serem decisões da mesma natureza — invariantes estruturais de dado/execução — e não itens de escolha de tecnologia (por isso não entram na numeração A/B/C/D deste documento, reservada às decisões de stack, estrutura e versionamento).

### DEC-11 — Escopo do bypass de RLS pelo serviço de relay da outbox

**Decisão.** O processo que lê a tabela de outbox (A.7) para publicar eventos a consumidores opera sob um **papel de banco dedicado e exclusivo**, distinto do papel usado pela API, com `BYPASSRLS` (ou equivalente) restrito **somente à leitura da(s) tabela(s) de outbox** — nenhum outro acesso, nenhuma outra tabela, nenhuma escrita em dado de negócio. Nenhum outro caminho de código (API, workers de fila, qualquer rota autenticada) usa esse papel. Cada leitura feita por ele é atribuível ao processo de relay nos registros de auditoria (Art. 42), nunca a um usuário ou a uma credencial genérica de aplicação. O `tenant_id` de cada evento continua presente no registro e é usado pela lógica do relay para anexar o contexto correto ao publicar — o bypass elimina apenas o *filtro de sessão*, não a informação de tenant do evento.

**Alternativa considerada.** *Sessão por tenant no relay (`SET LOCAL` + iteração tenant a tenant)* — rejeitada: multiplicaria conexões/latência proporcionalmente ao número de tenants para uma única rotina de fan-out, contrariando a própria justificativa de escala em número de tenants que fundamenta C.1.

**Justificativa.** O relay precisa publicar eventos de **todos** os tenants; RLS por definição impediria isso sob o papel padrão da API (C.1/C.2). O bypass é a única exceção deliberada e documentada à garantia de isolamento no banco — por isso seu escopo é minimizado ao extremo (só leitura, só outbox, papel próprio, auditado) para não esvaziar a garantia que C.1 estabelece para todo o resto do sistema.

**Fundamentação constitucional.** Art. 42 (Isolamento multi-tenant e Rastreabilidade Total — toda exceção à regra precisa ser auditável); ADR-001/DEC-3; ADR-002/C.1, A.7.

---

### DEC-12 — Política de transação automática por tenant no middleware

**Decisão.** Todo request autenticado que toca dado tenant-scoped passa, **por padrão e estruturalmente**, por um interceptor global do núcleo que: (1) extrai o tenant a partir da claim do token (A.9); (2) abre uma transação interativa do Prisma; (3) executa `SET LOCAL app.tenant_id` como primeira instrução dessa transação, antes de qualquer query de repositório. Nenhum código de serviço/repositório abre essa transação manualmente — o comportamento é do framework, não da disciplina individual de quem escreve a rota. Endpoints que legitimamente não têm tenant (ex.: públicos, health-check) precisam de um **marcador explícito de exceção**; a ausência de marcador significa, por padrão, que o request é tenant-scoped. Ou seja: **o padrão é escopado; o não-escopo é que exige declaração explícita e revisável** — nunca o inverso.

**Alternativa considerada.** *Convenção manual por rota (cada handler abre sua própria transação com tenant)* — rejeitada: era exatamente o risco identificado na análise de compatibilidade (Prisma não garante isso nativamente); depender de que cada desenvolvedor lembre disso, rota a rota, cria uma classe de bug silencioso (RLS nega e a query retorna vazio, mascarando o erro como "dado sumiu").

**Justificativa.** Torna estrutural — e não opcional — a garantia que C.1/C.2 prometem. O padrão "seguro por omissão" (escopado por padrão, exceção precisa ser declarada) segue a mesma lógica de segurança de negação-por-padrão já presente no isolamento por RLS.

**Fundamentação constitucional.** Art. 42 (Isolamento); ADR-001/DEC-3; ADR-002/A.5, C.1, C.2.

---

### DEC-13 — Política de invalidação de cache baseada na emissão de eventos

**Decisão.** A invalidação do cache (Redis, A.6) é **orientada a evento**, não fundamentalmente por TTL. Sempre que um evento canônico é emitido (persistido na outbox — A.7), o mesmo barramento de eventos interno dispara um handler de invalidação que remove/atualiza as chaves de cache afetadas antes de qualquer nova leitura ser servida a partir delas. O TTL permanece como **rede de segurança secundária** (defesa em profundidade contra uma invalidação perdida), nunca como mecanismo primário. Esta política é **obrigatória** para qualquer leitura em cache que alimente cálculo decisório (Health Score, IVEA, painéis usados pela Diretoria Digital); para usos de cache puramente cosméticos/não decisórios, o TTL isolado pode ser suficiente — casos assim serão documentados individualmente em especificações futuras, não decididos aqui.

**Alternativa considerada.** *TTL como mecanismo primário de invalidação* — rejeitada para dado decisório: cria uma janela estrutural de leitura desatualizada exatamente onde a Constituição exige honestidade do dado (Art. 26); aceitável apenas para cache não decisório, por isso não foi banida por completo, apenas restrita.

**Justificativa.** Resolve a janela de inconsistência identificada na análise de compatibilidade reaproveitando o mecanismo já decidido em A.7 (barramento de eventos interno), sem introduzir tecnologia nova.

**Fundamentação constitucional.** Art. 26 (Honestidade dos Dados); ADR-002/A.6, A.7.

---

## CRITÉRIOS NÃO FUNCIONAIS — COMO A ARQUITETURA OS ATENDE

**Escalabilidade.** O RLS sobre banco único (C.1) escala em **número de tenants** sem multiplicar infraestrutura; o monólito modular (D1 do ADR-000) escala em **carga** via réplicas horizontais do mesmo artefato Docker (A.12) atrás de um balanceador, e escala em **complexidade organizacional** via extração futura de módulos para serviços quando (e só quando) uma necessidade concreta o exigir — sem reescrita, porque as fronteiras de módulo (D7) já existem em código.

**Performance.** PostgreSQL transacional (A.4) evita custos de consistência eventual em dados financeiros/pedido; Redis (A.6) absorve leituras quentes e filas (A.8) tiram do caminho síncrono tudo que não precisa responder na hora (notificações, IA, Health Score) — coerente com o fluxo orientado a eventos, não pipeline bloqueante (D4).

**Segurança.** Isolamento multi-tenant garantido no banco (C.1/C.2), não só na aplicação; autenticação própria sem terceirizar identidade (A.9) mantém controle sobre política de sessão/token; toda comunicação e persistência de senha segue práticas padrão do mercado (hash com Argon2, tokens de curta duração) — detalhamento fica para especificação de segurança futura.

**Observabilidade.** Instrumentação neutra via OpenTelemetry (A.10) desde o primeiro serviço, evitando que observabilidade seja "adicionada depois" — nasce como propriedade estrutural, coerente com Rastreabilidade Total (Art. 42) e com a Rastreabilidade do Ciclo (Art. 16).

**Manutenibilidade.** Monorepo com tipos compartilhados (B.1) elimina duplicação/dessincronia entre backend, frontend e o Modelo Canônico de Evento; módulos com fronteira explícita (A.2, B.3) tornam o custo de mudança localizado, não disperso.

**Custo operacional.** Cada escolha de infraestrutura (A.6 a A.10) reaproveita peças já decididas (Redis serve cache, pub/sub e fila; Postgres serve dados transacionais e log de eventos) — menos peças móveis a operar e a pagar, coerente com o público-alvo do produto (do microempreendedor a operações maiores, Art. 15).

**Experiência de desenvolvimento (DX).** Uma linguagem única (A.1) do banco de tipos à tela; Docker Compose (A.12) reproduz o ambiente de produção localmente; CI no mesmo lugar do código (A.13); ORM produtivo (A.5) — tempo até o primeiro valor de engenharia é o critério explícito por trás de várias escolhas acima.

---

## COMPATIBILIDADE EXPLÍCITA

| Referência | Como este ADR é compatível |
|---|---|
| **Constituição (Art. 15, 39, 42, 45, 46)** | Nenhuma decisão de stack, estrutura ou versionamento contraria Simplicidade Operacional, Síntese, Escalabilidade Multiempresa, Portabilidade/Não-aprisionamento, Verticais ou Foco — cada decisão cita explicitamente o(s) artigo(s) que a fundamenta |
| **ADR-000** | Respeita D1 (monólito modular — A.2, A.7), D2 (três anéis — B.3), D3 (três ciclos — organização interna de `core/`), D4 (fluxo orientado a eventos — A.7), D5 (IA como camada — nenhuma decisão de stack aqui escolhe modelo de IA, mantendo o adiamento), D6 (verticais por extensão — B.3), D7 (anti-acoplamento — B.1, B.2, C.1) |
| **ADR-001** | Operacionaliza DEC-3 (Bloco C) e resolve o versionamento de schema de evento que DEC-2/adiado deixou em aberto (D.2); nenhuma decisão aqui reescreve evento histórico (respeita DEC-2) |
| **DF-2 (Food lidera)** | B.3 implementa literalmente Food como única vertical populada, com `verticals/` já plural e neutra |
| **DEC-3 (tenant-scoped desde a origem)** | C.1/C.2 são a arquitetura que torna DEC-3 verificável e não apenas declarada |
| **Art. 45 (verticais sem acoplar o núcleo)** | B.3 garante, pela direção de dependência `verticals → core`, que nova vertical não exige refatorar o núcleo |

---

## ALTERNATIVAS DE ARQUITETURA GLOBAL CONSIDERADAS E REJEITADAS

- **Adotar uma plataforma de "backend as a service" completa (ex.: Supabase/Firebase) para acelerar o início** — rejeitado: acopla autenticação, banco e funções a um único fornecedor, na contramão direta de Portabilidade/Não-aprisionamento (Art. 42) e do critério de menor lock-in.
- **Poliglota desde o início (ex.: Python para IA, Node para o resto)** — rejeitado nesta fase: duplica linguagem/ferramental sem necessidade comprovada agora; a fronteira determinístico×generativo (onde um serviço Python especializado poderia fazer sentido) é justamente o que o ADR-005 (adiado) decidirá.
- **Antecipar Kubernetes/orquestração complexa** — rejeitado: nenhuma decisão atual exige orquestração distribuída; Docker Compose basta para o estágio de monólito modular; a escolha de orquestrador de produção fica para o ADR de infraestrutura.

---

## CONSEQUÊNCIAS

**Positivas**
- (+) Toda a stack cabe operacionalmente em uma equipe pequena, sem exigir especialistas dedicados a múltiplas infraestruturas distintas.
- (+) Nenhuma escolha cria lock-in que impeça a Soberania do Dono ou a saída do cliente com seus dados (Art. 42).
- (+) A estrutura de repositório e de pastas já expressa, em código, as decisões de fronteira do ADR-000 — reduzindo o risco de erosão arquitetural com o tempo.
- (+) O isolamento multi-tenant é uma garantia de banco, não de disciplina — reduz drasticamente a classe de bug "vazamento entre tenants".
- (+) O versionamento de evento resolve, de forma compatível com DEC-2, o principal risco que o ADR-001 havia sinalizado como custo futuro.

**Negativas / custos**
- (−) A integração de RLS com transações por requisição no Prisma exige disciplina de implementação (toda rota tenant-scoped precisa abrir transação com o contexto declarado) — risco conhecido, mitigável por revisão de código e testes de isolamento automatizados.
- (−) Reaproveitar Redis para cache, pub/sub e filas concentra risco de disponibilidade em uma única peça de infraestrutura — mitigável com persistência (AOF) e monitoramento, mas é uma dependência crítica única.
- (−) A ausência de um event store dedicado significa que, se o volume de eventos crescer muito além do previsto, uma futura extração para tecnologia especializada exigirá um ADR de migração — aceito conscientemente como decisão revisável (Art. 50).
- (−) GitHub Actions e a hospedagem do próprio código no GitHub criam uma dependência leve de plataforma para o pipeline (não para o código-fonte em si).

---

## ADIADO PARA ADRs / ESPECIFICAÇÕES POSTERIORES

- **Provedor de nuvem/hospedagem e orquestrador de produção** (onde os containers Docker efetivamente rodam) — decisão de infraestrutura, não de stack de código.
- **Schema concreto de tabelas, políticas RLS específicas e nomes de colunas** (Bloco C decidiu apenas a arquitetura).
- **Contrato formal de pontos de extensão de vertical** (a interface que `verticals/moda` deverá implementar) — ADR-000 já havia previsto como item futuro (antigo "ADR-007"); passa a ser candidato a **ADR-003**.
- **Fronteira determinístico × generativo e escolha de modelo/fornecedor de IA/LLM** — explicitamente fora do escopo deste ADR, permanece adiado (antigo "ADR-005"); candidato a próximo ADR de IA.
- **Curadoria e retenção detalhada da Memória** (o que se resume, o que se descarta, direito ao esquecimento em detalhe operacional) — Art. 26; candidato a ADR de Memória/Persistência avançada.
- **Algoritmo concreto de resolução de identidade e tratamento fino de PII/consentimento** — já adiado pelo ADR-001, permanece adiado.
- **Taxonomia detalhada de tipos de evento por domínio** — permanece adiado para especificação técnica.
- **Papéis e permissões internas (RBAC detalhado), Freios de Emergência, Início Frio** — itens do Anexo D da Constituição, fora do escopo de qualquer ADR até maduros.

---

## ARTIGOS CONSTITUCIONAIS ENVOLVIDOS

Art. 1, 6 (organismo único, não silos — fundamenta B.1/B.3) · Art. 15 (Fonte Única da Verdade, Simplicidade Operacional, Escalabilidade Multiempresa) · Art. 16 (Ciclo da Inteligência, Rastreabilidade) · Art. 25–27 (Memória) · Art. 26 (Honestidade dos Dados) · Art. 33 (Sentidos/Camada Anticorrupção) · Art. 36 (a Pele) · Art. 39 (Síntese/Custo Cognitivo) · Art. 42 (Isolamento multi-tenant, Segurança, Rastreabilidade Total, Portabilidade/Não-aprisionamento, Soberania do Dono) · Art. 45, 46 (Verticais, Foco) · Art. 50 (Contestação Permanente) · Art. 52 (Portão, Saldo Conceitual e Poda) · Art. 53 (Governança da Evolução). Nenhuma decisão deste ADR toca ou contraria o Núcleo Imutável (Art. 14). **DF-2** (Food lidera) e **DEC-3 do ADR-001** (tenant-scoped desde a origem) são diretamente operacionalizados — inclusive por **DEC-11** e **DEC-12** deste ADR. **DEC-13** opera o mesmo Art. 26 (Honestidade dos Dados) já citado nos Blocos A–D.

---

## RESUMO EXECUTIVO — DECISÕES APROVÁVEIS

1. **Backend:** TypeScript sobre Node.js LTS + NestJS (módulos = fronteiras de domínio).
2. **Frontend:** Next.js (React) + TypeScript.
3. **Banco de dados:** PostgreSQL único, transacional + log de eventos append-only.
4. **ORM:** Prisma.
5. **Cache:** Redis (cache + pub/sub + base de filas).
6. **Event Bus interno:** EventEmitter/CQRS do NestJS + outbox transacional em Postgres (sem broker externo nesta fase).
7. **Filas:** BullMQ sobre Redis.
8. **Autenticação:** solução própria (Passport + JWT + Argon2), sem provedor de identidade terceirizado.
9. **Observabilidade:** OpenTelemetry + backend gerenciado de baixo custo inicial.
10. **Testes:** Jest+Supertest (backend), Vitest+Testing Library (frontend), Playwright (E2E).
11. **Docker:** todos os serviços containerizados; Compose para paridade dev/produção.
12. **CI/CD:** GitHub Actions; pipeline lint → typecheck → testes → build → (main) E2E → deploy.
13. **Repositório:** monorepo (pnpm workspaces + Turborepo); `apps/{api,web}` + `packages/{canonical-events,sdk,ui,config,shared}` + `infra/` + `docs/` + `scripts/`; `libs/` e `shared/` de raiz **não** adotados como conceitos duplicados de `packages/`.
14. **Estrutura de `apps/api`:** `core/` (núcleo horizontal) + `verticals/food/` (única vertical hoje, pasta plural desde já) + `integrations/` (Camada Anticorrupção) — dependência sempre `verticals → core`.
15. **Multi-tenant:** banco e schema compartilhados; isolamento imposto por **Row-Level Security** no Postgres, contexto de tenant propagado via claim do token + transação por requisição. Schema detalhado fica para especificação futura.
16. **Versionamento de API:** por URI (`/api/v1`), breaking change só em nova versão major com depreciação anunciada.
17. **Versionamento do Evento Canônico:** campo de versão por evento; mudanças aditivas não versionam; mudanças que quebram formato criam nova versão de evento; eventos antigos nunca são reescritos (upcasting na leitura).
18. **Versionamento de release/deploy:** SemVer + trunk-based + deploy contínuo gated por CI.
19. **Adiado (explicitamente, não esquecido):** provedor de nuvem/hospedagem, schema concreto de tabelas/RLS, contrato de extensão de vertical, fronteira determinístico×generativo/modelo de IA, curadoria detalhada da Memória, algoritmo de resolução de identidade, taxonomia de eventos.
20. **DEC-11:** o relay da outbox opera sob papel de banco próprio com bypass de RLS restrito a leitura da outbox — única exceção documentada e auditada ao isolamento por RLS.
21. **DEC-12:** transação por tenant é automática e estrutural (interceptor global do núcleo), nunca uma convenção manual por rota; padrão é escopado, exceção exige marcação explícita.
22. **DEC-13:** invalidação de cache é orientada a evento (via o barramento interno de A.7), com TTL apenas como rede de segurança secundária — obrigatório para qualquer cache que alimente Health Score/IVEA/decisão.

**Nenhuma decisão contraria a Constituição, o ADR-000 ou o ADR-001.** O ADR-002 está **Aceito** (aprovado conceitualmente pelo fundador), com DEC-11 a DEC-13 formalizadas. O esqueleto físico do repositório pode agora ser criado em conformidade com este documento.
