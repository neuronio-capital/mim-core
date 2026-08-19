# Revisão Arquitetural — Fronteira M02×M03 (ADR-000, mim-core)

## Estado

**Não canônico.** Este documento é uma decisão humana pré-implementação. **Não é um ADR.** Não modifica, não edita e não substitui o ADR-000, que permanece **CONGELADO** e inalterado. Segue o mesmo gênero documental de `docs/revisoes/REVISAO-ADR000-MILESTONE01.md` — uma revisão consolidada, sem status formal de Aceito/Canônico, produzida antes do início de uma implementação.

## Origem e contexto

O ADR-000 (`docs/adr/ADR-000-arquitetura-tecnica-sistema-mim.md`, Status: CONGELADO) contém duas formulações sobre a responsabilidade por determinar quais documentos da Base Canônica são relevantes para uma interação, sem que nenhuma das duas se declare superior à outra — ambas têm o mesmo status CONGELADO, na mesma versão do mesmo documento:

- Descrição de componente (linha 73): "**Motor de Convergência** — não gera texto. Recebe três entradas explícitas — projeto, objetivo e pergunta — e **determina quais documentos precisam ser carregados**. [...] Prepara o raciocínio; quem raciocina é a IA."
- Roadmap de milestones (linha 128): "Milestone 02 — Context Builder. Script que recebe projeto + pergunta, **busca na Base Canônica, seleciona documentos relevantes** e monta o bloco de contexto pronto para colar em qualquer IA."

Essa coexistência impede especificar corretamente os contratos de implementação de M02 (Context Builder) e M03 (Motor de Convergência) sem uma escolha prévia. A matéria foi identificada por revisão documental, antes de qualquer implementação de M02 ou M03 — nenhum código foi executado, nenhum dado real diverge. Por essa razão, e conforme a governança já estabelecida pelo próprio ADR-000 ("evoluções futuras entram como ADR-001, ADR-002 etc., motivadas por problemas reais de implementação") e pelo precedente comportamental de `REVISAO-ADR000-MILESTONE01.md` (que tratou preocupações arquiteturais pré-implementação por adiamento, não por novo ADR), esta matéria **ainda não atingiu a maturidade exigida para ser formalizada em ADR complementar**. Este documento preserva a decisão humana já tomada, sem lhe atribuir prematuramente uma autoridade canônica que o corpus ainda não sustenta.

## Decisão humana (fronteira M02×M03)

**M03 — Motor de Convergência** é responsável por determinar a **necessidade informacional**.

Pergunta conceitual: *"O que precisa ser conhecido para tratar corretamente esta interação?"*

Isso pode compreender: objetivo explícito; estado relevante; próximo passo; classes/tipos de informação necessária; critérios semânticos da necessidade informacional.

M03 **não** resolve diretamente essa necessidade contra documentos concretos da Base Canônica. M03 **não** monta o bloco final entregue à IA.

**M02 — Context Builder** é responsável por resolver a necessidade informacional contra a **Base Canônica concreta**.

Pergunta conceitual: *"Quais evidências/documentos concretos satisfazem essa necessidade?"*

M02 é responsável conceitualmente por: consultar/buscar na Base Canônica; selecionar documentos concretos relevantes; recuperar/carregar o conteúdo necessário; montar o bloco final de contexto; entregar o contexto à IA.

**Princípio de fronteira:** M03 determina **o que precisa ser conhecido**. M02 determina **quais evidências documentais concretas satisfazem essa necessidade** e materializa o contexto.

## Natureza e autoridade desta decisão

1. Esta é uma **decisão humana pré-implementação**, não uma conclusão automática.
2. Ela **reconcilia operacionalmente** duas formulações coexistentes do ADR-000 — não descobre nem revela uma leitura única que já estivesse implícita nele.
3. Esta fronteira **não deve ser apresentada** como interpretação inevitável ou previamente determinada pelo ADR-000. As duas formulações originais permanecem exatamente como estão, sem hierarquia declarada entre si.
4. O **ADR-000 permanece CONGELADO e inalterado**.
5. Este documento **não possui autoridade** para editar ou substituir o ADR-000.
6. Esta decisão **não é ainda** uma decisão formalizada em ADR.
7. A eventual formalização em ADR complementar permanece **condicionada à maturidade exigida pela governança vigente** — este documento não declara, por conta própria, que essa maturidade já existe.
8. Qualquer implementação futura de M02 ou M03 **não deve reinterpretar silenciosamente** esta fronteira — deve segui-la ou, se divergir, justificar e propor sua revisão explicitamente, no mesmo espírito de disciplina já usado para o ADR-000 durante o Milestone 01.

## Autonomia de M02

M02 **não depende** da implementação de M03 para funcionar. Enquanto M03 não existir, M02 deve poder receber ou derivar a necessidade informacional a partir das entradas explícitas disponíveis à interação, sem que isso exija a existência prévia de M03.

Quando M03 existir, poderá fornecer uma representação mais estruturada da necessidade informacional consumida por M02. **Isso não cria precedência arquitetural entre M02 e M03.**

Este documento não define contrato técnico, DTO, schema, interface, formato ou algoritmo para essa entrada — essas matérias permanecem para planejamento e implementação posteriores.

## Prioridade de execução (fora do escopo arquitetural deste documento)

A decisão de que M02 será executada primeiro nesta evolução é uma **decisão de prioridade/execução**, não uma decisão arquitetural, e não pertence ao mesmo mecanismo que esta fronteira. Ela será tratada no mecanismo próprio de milestone (no padrão já usado por `docs/milestones/MILESTONE-01-FECHAMENTO.md`, seção "Próximo passo"). **Nenhuma precedência arquitetural M02 → M03 está sendo criada por este documento.**

## Fora de escopo deste documento

Não decide: linguagem; framework; banco de dados; busca vetorial; embeddings; ranking; algoritmo de retrieval; índice; armazenamento; schema; DTO; interface de código; API; modelo de IA; formato definitivo da necessidade informacional. Essas matérias permanecem para planejamento e implementação posteriores.

## Critério de futura formalização

Esta fronteira permanece registrada como decisão pré-implementação **não canônica**. Sua eventual formalização em ADR complementar deverá ser reavaliada quando houver maturidade suficiente segundo os critérios já existentes na governança do `mim-core` — este documento não declara, por conta própria, quando essa condição estará satisfeita, nem propõe um critério novo de promoção.
