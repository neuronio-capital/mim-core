# ADR-001 — Modelo Canônico de Evento e Identidade Unificada

- **Data:** 2026-07-07
- **Status:** **Proposto** (aguardando aprovação do fundador)
- **Base constitucional:** Constituição do FullCommerce **v1.0 RC1** (`docs/constitution/CONSTITUICAO_FULLCOMMERCE.md`)
- **Decorre de:** ADR-000 (D2 anéis, D3 ciclos, D4 fluxo orientado a eventos, D7 anti-acoplamento) e da Decisão Fundadora **DF-5**
- **Supera:** — (primeira decisão de fundação de dados)

> **Escopo e limites.** Este ADR decide os **princípios e invariantes** do Modelo Canônico de Evento e da Identidade Unificada. Ele **não implementa nada**: não define schema concreto, campos, formato de serialização, banco de dados, event store, API, algoritmo de resolução nem código. Essas concretizações ficam **explicitamente adiadas** para o ADR-002 (Persistência/Memória) e para especificações técnicas posteriores. Aqui decide-se **o que sempre será verdade** sobre a fundação de dados — não *como* ela será construída.

---

## CONTEXTO

A Constituição fixa que a fundação técnica começa por **identidade unificada + modelo canônico de eventos + Memória** (DF-5), e que **"nada entra no cérebro sem passar pela Coleta — dado sujo é veneno"** (Art. 16, etapa 2). O diferencial do produto — transformar dezenas de sinais dispersos em **uma** decisão priorizada (Art. 4) — depende inteiramente da etapa de **Correlação** (Art. 16.4), que só é possível se os sinais compartilharem um **vocabulário comum de evento** e estiverem atados às **mesmas identidades**.

Diferente de um ERP, que modelaria o **estado** de entidades (Art. 3), o FullCommerce é orientado a **fatos que fluem**: a unidade primária de verdade é o **Evento**. Toda a inteligência (Interpretação, Correlação, Priorização, Decisão, Ação, Aprendizado — Art. 16), toda a Memória (Art. 25–27) e o CRM 360° (Art. 32) são **construídos sobre** essa fundação. Decidi-la primeiro é, portanto, pré-requisito de tudo (ADR-000/D4).

---

## DECISÕES

### DEC-1 — Existe um Modelo Canônico de Evento único e interno
Toda mudança de estado relevante do negócio (venda, abandono, pagamento, atraso, pico, reclamação, envio, avaliação, recompra…) é representada como um **Evento canônico**, num vocabulário **interno e único**, independente da fonte que o originou.
**Fundamenta-se em:** Fonte Única da Verdade (Art. 15); Ciclo da Inteligência, etapa Coleta (Art. 16); Sentidos/Anticorrupção (Art. 33); DF-5.

### DEC-2 — O Evento é imutável e o registro é append-only
Fatos não se apagam nem se sobrescrevem. Uma correção é um **novo evento**, não a mutação do anterior. O histórico de eventos é a fonte da qual todo estado e todo número são derivados.
**Fundamenta-se em:** Memória Perpétua (Art. 15); Rastreabilidade do Ciclo — *"de qualquer ação, volta-se ao evento que a originou"* (Art. 16); Rastreabilidade Total (Art. 42); Honestidade dos Dados (Art. 15, 26).

### DEC-3 — Todo evento é tenant-scoped desde a origem *(invariante multi-tenant)*
Nenhum evento existe fora do escopo de uma empresa (tenant). O isolamento entre empresas é uma propriedade do próprio dado, não um filtro aplicado depois.
**Fundamenta-se em:** Escalabilidade Multiempresa — *"multi-tenant desde a origem; um cliente jamais vê o dado de outro"* (Art. 15); Isolamento (Art. 42).
*(O **mecanismo** concreto de isolamento é decidido no ADR-002.)*

### DEC-4 — Todo evento carrega proveniência e confiança
Cada evento registra, no mínimo conceitual, **de onde veio** (fonte), **quando** ocorreu e — quando o dado é estimado (ex.: atribuição) — o **grau de confiança/incerteza**. A incerteza nasce no dado e o acompanha.
**Fundamenta-se em:** Honestidade dos Dados (Art. 26); Honestidade do Ciclo — *"a confiança declarada acompanha o dado até a decisão"* (Art. 16); atribuição modelada com confiança (Art. 33).

### DEC-5 — A Identidade Unificada é conceito de primeira classe
Cliente, pedido, produto e dinheiro têm um **identificador canônico único** por tenant. A resolução liga identificadores fragmentados que a mesma entidade deixa por vários canais (anônimo do anúncio → e-mail do checkout → WhatsApp do pós-venda), produzindo **uma linha do tempo única** por entidade.
**Fundamenta-se em:** Fonte Única da Verdade (Art. 15); CRM 360° / Cliente Preditivo (Art. 32); Correlação e o diferencial (Art. 4, 16.4); DF-5.

### DEC-6 — A resolução de identidade é probabilística, declarada e reversível
O sistema **nunca funde identidades fingindo certeza**: toda unificação carrega um grau de confiança, é **auditável** e **reversível** (um merge equivocado pode ser desfeito). Onde a confiança é baixa, isso é declarado.
**Fundamenta-se em:** Honestidade dos Dados (Art. 26); Reversibilidade (Art. 22); Privacidade e LGPD por padrão (Art. 42).

### DEC-7 — Toda entrada externa passa pela Camada Anticorrupção
Nenhuma fonte externa toca o cérebro diretamente. Dados de terceiros são **traduzidos** para o modelo canônico na borda; quando uma plataforma externa muda, **só a tradução muda** — a verdade interna não se corrompe.
**Fundamenta-se em:** Antifragilidade das Integrações (Art. 15); Sentidos/Anticorrupção (Art. 33); ADR-000/D2 e D7.

### DEC-8 — Números derivam de eventos por cálculo determinístico
O Evento carrega **fatos**, não interpretações geradas por linguagem. Todo número (métrica, IVEA, Health Score) é **calculado deterministicamente** a partir dos eventos; a IA interpreta e narra, nunca inventa o número nem o grava como fato.
**Fundamenta-se em:** Regra dos Números Determinísticos (Art. 18); Governança da Inteligência (Art. 22); ADR-000/D5.

### DEC-9 — A Coleta é o único portão de entrada no cérebro
Um acontecimento só participa de Interpretação, Correlação, Priorização, Decisão, Ação e Aprendizado **depois** de normalizado a evento canônico e atado à identidade unificada. Não há atalho que injete dado cru no raciocínio.
**Fundamenta-se em:** Ciclo da Inteligência — *"nada entra no cérebro sem passar pela Coleta"* (Art. 16); Integridade do Ciclo (Art. 16).

### DEC-10 — O tempo é parte estrutural do Modelo Canônico
O tempo não é um atributo acessório do evento: é parte integrante do modelo. Todo evento carrega referência temporal suficiente para reconstrução determinística da linha do tempo do negócio, **independentemente da ordem em que foi recebido ou processado**. O modelo distingue, ao menos conceitualmente, o **tempo do evento** (quando o fato ocorreu no mundo) do **tempo de processamento** (quando o sistema tomou conhecimento dele) — a linha do tempo reconstruída ordena-se pelo primeiro, não pelo segundo.
**Fundamenta-se em:** Rastreabilidade do Ciclo — *"de qualquer ação, volta-se ao evento que a originou"* (Art. 16); Rastreabilidade Total (Art. 42); Memória Perpétua e Honestidade dos Dados (Art. 15, 26); complementa DEC-2 (append-only) e DEC-4 (proveniência e confiança) deste ADR.

---

## ALTERNATIVAS CONSIDERADAS

- **Modelo relacional de entidades primeiro (estilo ERP)** — *rejeitado.* Registra estado, não fatos; perde a rastreabilidade temporal e a correlação entre domínios; recria silos. Contraria Art. 3 (*"não é mais um ERP"*) e Art. 16.
- **Armazenar dados brutos por fonte, sem modelo canônico** — *rejeitado.* Fere Fonte Única da Verdade (Art. 15) e Antifragilidade (Art. 15/33); torna a Correlação (Art. 16.4) — o diferencial — inviável.
- **Identidade por integração (cada fonte com seu id, sem unificação)** — *rejeitado.* Impede o CRM 360° (Art. 32) e a Correlação; destrói o diferencial (Art. 4).
- **Adiar a Identidade Unificada para depois da primeira vertical** — *rejeitado.* DF-5 e Art. 16.2 a colocam na fundação; adiá-la contamina toda a inteligência construída sobre dados fragmentados.
- **Eventos mutáveis / sobrescritos** — *rejeitado.* Quebra Rastreabilidade (Art. 16, 42) e Memória Perpétua (Art. 15).

---

## CONSEQUÊNCIAS

**Positivas**
- (+) Habilita o diferencial (Art. 4): a Correlação passa a ser possível porque todo sinal fala a mesma língua e aponta para as mesmas identidades.
- (+) A Memória (Art. 25–27) e o Aprendizado (Art. 24) nascem "de graça" sobre um histórico append-only.
- (+) Rastreabilidade e auditabilidade (Art. 16, 42) são propriedades estruturais, não recursos posteriores.
- (+) Isolamento multiempresa (Art. 15, 42) e antifragilidade de integrações (Art. 15, 33) ficam garantidos na origem do dado.

**Negativas / custos**
- (−) Append-only + resolução de identidade probabilística são **difíceis** e exigem disciplina; a resolução equivocada precisa de reversão auditável (DEC-6).
- (−) Guardar todos os eventos amplia a superfície de privacidade — deve ser regido pela **curadoria da Memória** (*"lembrar do que gera valor ou é exigido; resumir/descartar o resto"*, Art. 26) e pela LGPD (Art. 42). A conciliação entre append-only e direito ao esquecimento é ponto de atenção do ADR-002.
- (−) A evolução do vocabulário de evento ao longo do tempo precisará de governança (versionamento de schema) — adiado.
- (−) Reconciliar tempo-do-evento vs. tempo-de-processamento (DEC-10) exige tratamento explícito de dados atrasados/fora de ordem (late-arriving events) — não é trivial e amplia a complexidade da reconstrução da linha do tempo.

---

## ADIADO PARA ADRs / ESPECIFICAÇÕES POSTERIORES
- Schema concreto, campos, taxonomia de eventos por domínio e formato de serialização.
- Tecnologia de persistência / event store e o **mecanismo de isolamento multi-tenant** (ADR-002).
- Algoritmo concreto de resolução de identidade e tratamento de PII/consentimento (ADR-002 + especificação, sob Art. 42).
- Versionamento e evolução de schema de evento.
- Algoritmo/mecanismo concreto de ordenação, watermarks e tratamento de eventos tardios (late-arriving events) — adiado para ADR-002/especificação técnica.
- Mecanismo de transporte de eventos / mensageria (ADR-004).
- Fronteira determinístico × generativo em detalhe (ADR-005).

---

## ARTIGOS CONSTITUCIONAIS ENVOLVIDOS
Art. 2 (Missão — cadeia Dados→…→Crescimento) · Art. 3 (não é ERP) · Art. 4 (Diferencial) · Art. 15 (Fonte Única da Verdade, Memória Perpétua, Escalabilidade Multiempresa, Antifragilidade das Integrações, Honestidade dos Dados) · Art. 16 (Ciclo da Inteligência: Coleta, Correlação; Integridade, Rastreabilidade, Honestidade do Ciclo) · Art. 18 (Números Determinísticos) · Art. 22 (Reversibilidade) · Art. 24 (Aprendizado) · Art. 25–27 (Memória) · Art. 32 (CRM 360°) · Art. 33 (Sentidos / Camada Anticorrupção) · Art. 42 (Isolamento, Rastreabilidade, Privacidade/LGPD) · **DF-5** (fundação de dados primeiro). Nenhuma decisão deste ADR toca ou contraria o Núcleo Imutável (Art. 14).
