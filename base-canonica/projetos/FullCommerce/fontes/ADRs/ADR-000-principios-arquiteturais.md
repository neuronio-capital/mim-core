# ADR-000 — Princípios Arquiteturais Fundadores

- **Data:** 2026-07-07
- **Status:** Aceito (ADR fundador)
- **Base constitucional:** Constituição do FullCommerce **v1.0 RC1** (`docs/constitution/CONSTITUICAO_FULLCOMMERCE.md`)
- **Supera:** — (primeiro ADR do projeto)
- **Relação com a Constituição:** este ADR **operacionaliza** Conceitos Evolutivos (Art. 49) e **nunca** viola o Núcleo Imutável (Art. 14). Onde a Constituição decide, ele obedece; onde a Constituição se cala (tecnologia), ele apenas fixa *princípios de organização*, adiando a escolha concreta.

> **Escopo e limites deste ADR.** Ele **não implementa nada**: não define código, banco de dados, APIs, telas, mensageria concreta nem stack. Estabelece **como o sistema será estruturado** e **em que ordem**, para orientar os próximos ADRs, PRDs e a arquitetura técnica. Toda escolha de tecnologia fica **explicitamente adiada** (ver seção *Decisões Adiadas*), coerente com o Escopo da Constituição e com o Art. 54.

---

## CONTEXTO

A fase conceitual está encerrada (Art. 54): a Constituição deixou de nascer funcionalidades e passou a ser documento fundacional. A evolução, daqui em diante, ocorre por **PRDs, ADRs e arquitetura técnica**, e **nenhuma implementação pode contrariar a Constituição** (Art. 53 — Governança da Evolução).

Antes de qualquer decisão de tecnologia, é preciso fixar os **princípios de arquitetura** que traduzem a identidade do produto em estrutura de software. A Constituição já impõe restrições arquiteturais fortes — ainda que em linguagem de produto, não de engenharia:

- É um **Sistema Operacional Empresarial** que fica *acima e entre* as funções, fazendo a empresa agir como **um organismo único, não como silos** (Art. 1, 6).
- Sua espinha é uma cadeia: **Dados → Contexto → Inteligência → Priorização → Decisão → Ação → Aprendizado → Crescimento** (Art. 2).
- Exige **Fonte Única da Verdade**, **Antifragilidade das Integrações**, **Escalabilidade Multiempresa** e **Simplicidade Operacional** (Art. 15).
- Pensa por um **Ciclo da Inteligência** que é *doutrina de raciocínio, não encanamento serial* (Art. 16).
- Opera **dois ciclos do negócio + o operacional** (Art. 28) sobre **duas verticais oficiais — Food e Moda** — construídas sob o **Princípio do Foco** (Art. 45, 46).
- Trata a inteligência como **"um cérebro, muitas faces"** — uma camada de raciocínio sobre **uma só Memória e uma só verdade**, com **números sempre determinísticos** (Art. 17, 18).

Este ADR converte essas restrições em decisões arquiteturais fundadoras.

---

## DECISÕES

### D1 — Monólito modular como ponto de partida (não microsserviços)

**Decisão.** O FullCommerce nasce como um **monólito modular** — um único artefato executável, internamente dividido em **módulos de domínio com fronteiras explícitas**. Microsserviços **não** serão adotados na origem; a decomposição em serviços separados só ocorrerá quando uma necessidade real (escala, isolamento de falha, cadência de time) **mudar uma decisão concreta** — e será registrada em ADR próprio.

**Fundamentação constitucional.**
- **Princípio do Foco (Art. 46):** construir de fora para dentro, resolvendo poucos problemas com profundidade antes de expandir. Microsserviços prematuros expandem complexidade horizontal antes da maturidade.
- **Simplicidade Operacional (Art. 15)** e **Síntese / Custo Cognitivo (Art. 39):** poder por dentro, simplicidade por fora; não transferir complexidade acidental para o time.
- **Fonte Única da Verdade (Art. 15):** mais fácil de garantir dentro de um processo único do que em bancos distribuídos desde o dia zero.
- **Princípio da Exclusão (Art. 40)** e **Portão (Art. 52):** microsserviços na origem não passam no teste "que decisão prática muda?" — adicionam complexidade sem inteligência.

**Alternativas consideradas.**
- *Microsserviços desde o início* — rejeitado: complexidade operacional (rede, consistência distribuída, observabilidade) sem ganho de decisão nesta fase; risco de ferir Fonte Única da Verdade e Simplicidade.
- *Monólito não-modular* — rejeitado: viraria silo interno e travaria a futura decomposição e a separação núcleo/vertical (D2).

**Consequências.**
- (+) Velocidade inicial, uma verdade transacional, refatoração barata enquanto os limites ainda são aprendidos.
- (+) A modularidade preserva a opção de extrair serviços depois **sem reescrita** (Art. 15 — sem reescrita do individual ao milhares/dia).
- (−) Exige **disciplina de fronteira** ativa (ver D7), senão o monólito modular degenera em monólito acoplado.

---

### D2 — Três anéis: Núcleo, Verticais e Integrações

**Decisão.** A arquitetura se organiza em **três anéis concêntricos**, com **direção de dependência sempre para dentro**:

1. **Núcleo horizontal** — vertical-agnóstico: o Ciclo da Inteligência, a Memória, o Genoma, a Priorização (IVEA/Orçamento de Atenção), a Diretoria Digital, o modelo de evento e os domínios comuns.
2. **Verticais** — **Food** e **Moda**: o núcleo "vestido" para o setor (Genoma pré-calibrado, doutrinas operacionais e reflexos específicos). Dependem do núcleo; o núcleo **não** as conhece.
3. **Integrações (Sentidos)** — o mundo externo, sempre atrás de uma **Camada Anticorrupção** que traduz para o modelo interno.

**Fundamentação constitucional.**
- **Verticais (Art. 45)** e **Foco (Art. 46):** "uma vertical é o núcleo horizontal vestido para um setor"; núcleo reutilizável.
- **"Um cérebro, muitas faces" (Art. 17):** o cérebro é único; as faces (diretores, verticais) são camadas sobre ele.
- **Sentidos + Camada Anticorrupção (Art. 33)** e **Antifragilidade das Integrações (Art. 15):** integrações externas quebram e mudam; ficam isoladas nas bordas.

**Alternativas consideradas.**
- *Verticais como aplicações independentes com núcleo duplicado* — rejeitado: duplica lógica de cérebro, fere "um cérebro, muitas faces" e a reutilização do núcleo.
- *Integrações acopladas ao núcleo* — rejeitado: fere Antifragilidade e Fonte Única da Verdade.

**Consequências.**
- (+) Food e Moda evoluem sem colidir; o núcleo melhora para as duas ao mesmo tempo.
- (+) Trocar/ quebrar uma integração externa não contamina a verdade interna.
- (−) Exige definir **pontos de extensão** do núcleo (adiado — ver D9 e Próximos ADRs).

---

### D3 — Os Três Ciclos do Negócio como fronteiras de domínio

**Decisão.** Os módulos de domínio do núcleo são agrupados pelos **Três Ciclos do Negócio** (Art. 28), que se tornam os **contextos delimitados** de mais alto nível:

- **Ciclo de Crescimento** — Atenção → Aquisição → Funil → Conversão → Venda.
- **Ciclo Operacional** — Pedido → Produção → Logística → Entrega.
- **Ciclo de Valor** — Relacionamento → Pós-venda → Recompra → Recorrência → LTV.

Cada módulo/funcionalidade deve **fortalecer pelo menos um ciclo**; caso não fortaleça nenhum, sua existência é questionada (Art. 28) — este é um filtro arquitetural, não só de produto.

**Fundamentação constitucional.**
- **Os Três Ciclos (Art. 28):** definem o terreno que o sistema opera.
- **Cadeia de Valor Único / Funil (Art. 29):** "não existem departamentos, existe um fluxo" — os ciclos **não podem ser silos**; o dado nasce em um e flui para os outros.
- **Fonte Única da Verdade (Art. 15):** a espinha de dados/eventos costura os três ciclos.

**Alternativas consideradas.**
- *Fronteiras por área funcional isolada (marketing, financeiro, logística) sem espinha comum* — rejeitado: recria os silos que o produto existe para destruir (Art. 1).

**Consequências.**
- (+) Fronteiras derivadas da identidade do produto, não da conveniência técnica.
- (−) A "costura" entre ciclos (a Cadeia de Valor Único) precisa de um mecanismo de fluxo comum — ver D4.

---

### D4 — Ciclo da Inteligência refletido como fluxo orientado a eventos (não pipeline serial)

**Decisão.** O Ciclo da Inteligência (Evento → Coleta → Interpretação → Correlação → Priorização → Decisão → Ação → Aprendizado → Nova Decisão, Art. 16) é refletido na arquitetura como um **fluxo orientado a eventos**, contínuo e paralelo — **não** como uma fila serial e bloqueante. Princípios arquiteturais decorrentes:

- **O Evento é a espinha:** um **Modelo Canônico de Evento** normaliza todo acontecimento e alimenta a Memória (o *formato* concreto é adiado — ver D9).
- **Rastreabilidade obrigatória:** de qualquer ação deve ser possível voltar ao evento que a originou (Art. 16 — Rastreabilidade do Ciclo); isso impõe **memória de decisão** e trilha, como princípio.
- **Números determinísticos:** todo número vem de **cálculo determinístico** sobre dados reais; a IA apenas interpreta e narra (Art. 18) — decisão arquitetural inviolável.
- **Reversibilidade e limites:** ações executadas pela IA são reversíveis e operam dentro de limites (Art. 21, 22).

**Fundamentação constitucional.**
- **Ciclo da Inteligência (Art. 16):** "doutrina de raciocínio, não encanamento serial… realização orientada a fluxo, não a etapas bloqueantes".
- **Fluxo Vital (Art. 14, 15):** evento → informação → inteligência → ação.
- **Fundação de dados primeiro (Decisão Fundadora DF-5):** identidade unificada + modelo canônico de eventos + Memória antes de qualquer tela.

**Alternativas consideradas.**
- *Pipeline síncrono em nove etapas literais* — rejeitado explicitamente pela própria Constituição (Art. 16): criaria gargalos e latência.

**Consequências.**
- (+) Escala para milhares de eventos simultâneos; correlação permanente entre domínios.
- (+) Trilha de rastreabilidade nasce como propriedade da arquitetura, não como recurso posterior.
- (−) Exige decisão futura sobre o mecanismo de eventos/mensageria (adiado — ADR de mensageria).

---

### D5 — A IA é uma camada de raciocínio sobre o núcleo (não serviço isolado, nem nove serviços)

**Decisão.** A inteligência é tratada como uma **camada** sobre um núcleo determinístico que compartilha **uma só Memória e uma só verdade**:

- **Cálculo determinístico = núcleo.** Métricas, IVEA, Health Score e pareceres numéricos são computados deterministicamente.
- **Camada de inteligência = interpretação, priorização, narração e julgamento**, sobreposta ao núcleo. A Diretoria Digital são **faces** dessa camada, **não** nove serviços/IAs isolados.
- **Raciocínio generativo** fica **reservado** a onde há julgamento real (arbitragem de conflito, recomendação estratégica, conversa com o dono), por disciplina de custo.

**Fundamentação constitucional.**
- **"Um cérebro, muitas faces" (Art. 17):** nove IAs isoladas recriariam silos e feririam a Fonte Única da Verdade — proibido.
- **Números Determinísticos (Art. 18) / Governança da Inteligência (Art. 22):** a linguagem nunca é a fonte do número.
- **Criação de Valor (Art. 37)** e disciplina de custo de IA: generativo só onde muda decisão.

**Alternativas consideradas.**
- *Um microsserviço por diretor* — rejeitado: silos + custo + fere Art. 17.
- *IA como módulo periférico* — rejeitado: a inteligência é a razão de ser (Art. 1, 5), pertence ao centro, não à periferia.

**Consequências.**
- (+) Consistência (uma verdade), custo controlado, explicabilidade (o número é auditável).
- (−) Exige fronteira clara entre "o que é determinístico" e "o que é generativo" — ADR dedicado (ver Próximos ADRs).

---

### D6 — Food e Moda: verticais separadas sobre o mesmo núcleo, por pontos de extensão

**Decisão.** Food e Moda são **módulos de vertical separados** que **não duplicam o núcleo**; elas o **estendem** por pontos de extensão definidos pelo núcleo (Genoma pré-calibrado, doutrinas operacionais, pesos de Health Score, reflexos específicos). Regras arquiteturais:

- **Dependência unidirecional:** vertical → núcleo. O núcleo nunca importa uma vertical.
- **Sem lógica de cérebro dentro da vertical:** a vertical configura e especializa; não reimplementa o Ciclo da Inteligência.
- **Food lidera** a construção; Moda usa os mesmos pontos de extensão (DF-2, Art. 46).
- **Multi-tenant** transversal a tudo (Art. 15 — Escalabilidade Multiempresa; Art. 42 — isolamento).

**Fundamentação constitucional.**
- **Verticais (Art. 45), Foco (Art. 46), missões de Food e Moda (Art. 47, 48).**
- **Escalabilidade Multiempresa e Isolamento (Art. 15, 42).**

**Alternativas consideradas.**
- *Um produto por vertical* — rejeitado: dobra manutenção, diverge o cérebro, contraria "núcleo horizontal reutilizável".
- *Núcleo com `if vertical == food` espalhado* — rejeitado: acoplamento e erosão de fronteira (fere D7).

**Consequências.**
- (+) O que melhora no núcleo melhora as duas verticais; nova vertical futura reusa os mesmos pontos de extensão.
- (−) Exige desenhar o **contrato de extensão** do núcleo (adiado — ADR de pontos de extensão de vertical).

---

### D7 — Evitar acoplamento prematuro por disciplina de fronteira

**Decisão.** Adota-se um conjunto de **princípios anti-acoplamento** como lei de arquitetura:

1. **Fronteiras de módulo explícitas:** comunicação entre módulos por **contratos/eventos**, nunca por acesso direto ao estado interno de outro módulo.
2. **Direção de dependência sempre para o núcleo** (nunca do núcleo para fora).
3. **Camada Anticorrupção obrigatória** em toda integração externa (Art. 33).
4. **Fonte Única da Verdade:** cada dado tem um dono e um lugar canônico (Art. 15).
5. **Não antecipar** decomposição, verticais adicionais ou integrações que ainda não mudam nenhuma decisão (Portão Art. 52; Exclusão Art. 40; Foco Art. 46).
6. **Adiar o adiável:** o que não é necessário agora vira decisão futura registrada, não estrutura especulativa.

**Fundamentação constitucional.**
- **Simplicidade Operacional (Art. 15), Síntese (Art. 39), Foco (Art. 46), Portão (Art. 52), Exclusão (Art. 40), Antifragilidade (Art. 15/33), Fonte Única da Verdade (Art. 15).**

**Consequências.**
- (+) Preserva a capacidade de evoluir e decompor sem reescrita.
- (−) Custa disciplina contínua de revisão de fronteiras (deve ser critério de code review e de aprovação de PRD).

---

### D8 — Como registrar decisões futuras (protocolo de ADR)

**Decisão.** Toda decisão arquitetural futura é registrada como **ADR numerado sequencialmente** (`docs/adr/ADR-NNN-titulo.md`) com a estrutura constitucional: **número e título · data · status (proposto / aceito / superado por ADR-N) · contexto · decisão · alternativas consideradas · consequências (boas e ruins) · artigos constitucionais envolvidos** (Art. 53). Regras:

- **Todo ADR cita os artigos** da Constituição que o fundamentam.
- **Nenhum ADR viola o Núcleo Imutável (Art. 14);** pode operacionalizar Conceitos Evolutivos (Art. 49).
- **Todo PRD cita os artigos** que fundamentam a funcionalidade e o(s) ADR(s) que a viabilizam (Art. 53).
- **Contestação Permanente (Art. 50):** um ADR pode ser **superado** por outro; não se reescreve o antigo — muda-se seu status e cria-se o sucessor.
- **Nenhuma implementação contraria a Constituição** (Art. 53) — este é o portão de aceitação de qualquer PR.

**Fundamentação constitucional.** Art. 53 (Governança da Evolução), Art. 49 (Camadas da Evolução), Art. 50 (Contestação Permanente), Art. 14 (Núcleo Imutável).

**Consequências.**
- (+) Rastreabilidade das decisões técnicas até a identidade do produto.
- (+) Evolução auditável e reversível por design.

---

### D9 — Decisões explicitamente adiadas

**Decisão.** As seguintes decisões são **deliberadamente adiadas** para ADRs próprios, para não violar o Foco (Art. 46) nem antecipar acoplamento (D7). Ficam registradas para não se perderem:

- **Stack tecnológica** (linguagem, framework, runtime) — a Constituição não define tecnologia (Escopo; Art. 54).
- **Persistência e Memória** — banco(s) de dados, event store, estratégia de retenção/curadoria da Memória (Art. 25–27).
- **Formato concreto do Modelo Canônico de Evento e da Identidade Unificada** (princípio decidido em D4; formato adiado — DF-5).
- **Estratégia multi-tenant concreta** (isolamento por linha, schema ou base) (Art. 15, 42).
- **Mecanismo de eventos/mensageria** (síncrono vs. assíncrono, fila/broker) (decorre de D4).
- **Fronteira determinístico × generativo e escolha de modelo de IA/custo** (decorre de D5; R9/custo de IA).
- **Contrato de pontos de extensão de vertical** (decorre de D6).
- **APIs, contratos externos, autenticação/autorização, telas, deploy/infra.**
- **Fronteiras Futuras do Anexo D da Constituição** — Papéis/Governança Interna, Freios de Emergência, Início Frio, Ética da IA com o cliente final, Direitos do cliente final, Economia da Empresa: exigem revisão de identidade **ou** ADR próprio quando maduras; **não** são decididas aqui.

---

## RESUMO

### Decisões tomadas
- **D1** — Monólito modular como ponto de partida (não microsserviços).
- **D2** — Três anéis: Núcleo horizontal, Verticais, Integrações; dependência sempre para dentro.
- **D3** — Os Três Ciclos do Negócio (Crescimento, Operacional, Valor) como fronteiras de domínio.
- **D4** — Ciclo da Inteligência como **fluxo orientado a eventos**, com Modelo Canônico de Evento, rastreabilidade e números determinísticos.
- **D5** — IA como **camada de raciocínio** sobre um núcleo determinístico ("um cérebro, uma verdade"), generativo só onde há julgamento real.
- **D6** — Food e Moda como verticais separadas que **estendem** o mesmo núcleo por pontos de extensão; multi-tenant transversal.
- **D7** — Disciplina de fronteira contra acoplamento prematuro (contratos/eventos, dependência para o núcleo, anticorrupção, adiar o adiável).
- **D8** — Protocolo de registro de decisões futuras em ADRs (cita artigos, não viola o Núcleo, superável).

### Decisões adiadas (D9)
Stack · persistência/Memória · formato do Modelo Canônico de Evento e Identidade Unificada · estratégia multi-tenant · mensageria · fronteira determinístico×generativo e modelo de IA · contrato de extensão de vertical · APIs/auth/telas/infra · Fronteiras Futuras do Anexo D.

### Próximos ADRs a criar (ordem sugerida, guiada pela Fundação Antes do Andar — DF-5)
- **ADR-001 — Modelo Canônico de Evento e Identidade Unificada** *(a fundação de dados; Art. 16, 33, DF-5).*
- **ADR-002 — Persistência e a Memória Empresarial** *(bancos, event store, curadoria; Art. 25–27).*
- **ADR-003 — Estratégia multi-tenant e isolamento** *(Art. 15, 42).*
- **ADR-004 — Stack tecnológica e runtime** *(Escopo; Art. 54).*
- **ADR-005 — Fronteira determinístico × generativo e camada de IA** *(Art. 17, 18, 22).*
- **ADR-006 — Mecanismo de eventos / mensageria** *(decorre de D4).*
- **ADR-007 — Contrato de pontos de extensão de vertical (Food/Moda)** *(decorre de D6; Art. 45, 46).*

> Os itens do **Anexo D** (Freios de Emergência, Início Frio, Papéis/Governança Interna, Ética da IA com o cliente final, Direitos do cliente final, Economia da Empresa) entram como ADRs/revisões próprios **quando maduros** — não antecipados aqui.
