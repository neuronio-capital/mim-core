# MIM-CORE — MILESTONE 02: CONTEXT BUILDER

## Contexto

Segundo milestone do mim-core. A arquitetura está definida no ADR-000 (CONGELADO) — não deve ser redesenhada neste milestone, apenas implementada. A fronteira entre este milestone e o Motor de Convergência (Milestone 03) está registrada, como decisão humana pré-implementação não canônica, em `docs/revisoes/REVISAO-ADR000-FRONTEIRA-M02-M03.md` — este plano não a reabre, apenas a implementa.

## Objetivo deste milestone

Construir o Context Builder: um script que recebe projeto, pergunta e objetivo explícitos, busca na Base Canônica, seleciona evidências documentais concretas que satisfazem a necessidade de recuperação — sem inferir objetivo, sem determinar estado ou próximo passo —, recupera seu conteúdo e monta um bloco de contexto pronto para ser entregue a qualquer IA, preservando proveniência, autoridade e maturidade das evidências utilizadas.

## Não implementar neste milestone

* Motor de Convergência (Milestone 03);
* Profundidade 3.0 (Milestone 04);
* Lateralidade (Milestone 05);
* Sistema Circulatório (Milestone 06);
* qualquer banco vetorial, embeddings, Kubernetes, Redis, filas, microsserviços, arquitetura de agentes ou memória persistente além do já autorizado pelo MVP do ADR-000;
* qualquer determinação formal de objetivo, estado ou próximo passo por parte de M02.

## Contrato conceitual de entrada

Entradas obrigatórias e explícitas: **projeto**, **pergunta**, **objetivo**. Nenhuma delas é inferida — objetivo, especificamente, nunca é derivado de projeto, pergunta, documentos ou qualquer outra evidência.

M02 pode derivar, internamente, apenas critérios de recuperação documental (o que buscar na Base Canônica) — nunca objetivo, estado ou próximo passo. Essa derivação interna não constitui, em nenhuma hipótese, uma função de Motor de Convergência.

`estado`, se fornecido explicitamente por uma fonte ou componente competente, pode ser recebido como entrada opcional adicional — mas não é uma entrada obrigatória para o funcionamento de M02, nem M02 o exige, calcula ou infere por conta própria.

O formato técnico exato dessa entrada (schema, DTO, interface) é matéria de implementação, não decidida aqui.

## Contrato conceitual de saída

O bloco de contexto deve conter, no mínimo, os cinco campos determinados pelo ADR-000: projeto; objetivo; estado; documentos relevantes; pergunta do usuário.

Adicionalmente, deve preservar as seguintes propriedades conceituais: separação entre evidência e hipótese; proveniência de cada evidência; identificação da fonte (path concreto); autoridade relativa da evidência; maturidade/estado do documento de origem; sinalização de conflito/divergência conhecida; e representação explícita de ausência de evidência.

Nenhuma dessas propriedades é, nesta fase, um campo técnico obrigatório e independente — a estrutura concreta é definida durante a implementação, no nível estritamente necessário para cumprir o requisito conceitual.

**Tratamento do campo "estado":** M02 não determina, não infere e não deriva estado — nem da pergunta, do objetivo, do projeto, dos documentos recuperados, da Base Canônica ou da necessidade informacional. Essa responsabilidade permanece fora de M02, preservando H3.

- Se um estado tiver sido fornecido explicitamente por entrada ou por componente/autoridade competente (ex.: quando M03 existir), M02 **transporta** esse valor para o bloco final, sem reinterpretá-lo, recalculá-lo ou substituí-lo.
- Se nenhum estado tiver sido fornecido explicitamente, o campo permanece semanticamente **não determinado** no bloco final.
- **"Estado não determinado" não deve ser confundido com "ausência de evidência"**: ausência de evidência refere-se à recuperação documental (nenhum documento localizado que satisfaça a necessidade); estado não determinado significa apenas que M02 não recebeu, de fonte ou componente competente, uma determinação de estado. São condições conceitualmente distintas e devem permanecer distinguíveis no bloco final.
- Quando M03 existir e determinar estado segundo sua própria responsabilidade, M02 apenas recebe e transporta esse valor — isso não altera a responsabilidade de M02. Não existe, em nenhum cenário, um comportamento de contingência em que M02 passe a determinar estado na ausência de M03.

## Responsabilidade de M02

M02 resolve a necessidade de recuperação contra a Base Canônica concreta: consulta/busca, seleciona evidências concretas, recupera/carrega conteúdo, monta o bloco final e entrega o contexto — pronto para colar em qualquer IA, sem invocar a IA programaticamente e sem gerar texto ou raciocínio próprio.

## Fronteiras explícitas

* M02 não determina objetivo, estado ou próximo passo.
* M02 não depende da implementação de M03 para funcionar.
* M02 não gera texto de raciocínio — apenas organiza conteúdo já existente.
* M02 não interpreta a resposta da IA nem executa ação além de montar e entregar contexto.
* Recuperar uma informação não promove sua autoridade.

## Universo de descoberta

Para fins de descoberta, M02 pode consultar `fontes/`, `derivados/` e `timeline/` da Base Canônica do projeto. Presença no universo de descoberta não concede, por si só, autoridade equivalente como evidência entregue no bloco final.

## Regras de autoridade e evidência

* `fontes/` é a referência primária quando houver fonte primária aplicável.
* `derivados/` pode participar do bloco de contexto quando necessário, mas nunca substitui silenciosamente `fontes/`; sua natureza derivada, sua proveniência e o risco conhecido de defasagem devem permanecer explícitos no bloco entregue.
* `timeline/` não recebe autoridade além daquela já estabelecida pelo corpus — seu uso como evidência deve ser cauteloso e não ampliado por este plano.
* Material Experimental, Proposta, Validado, Canônico, Aceito, Congelado ou Proposto pode ser recuperado e transportado por M02, desde que sua maturidade seja preservada explicitamente no bloco final — nunca apresentado como tendo maturidade superior à real.

## Tratamento de maturidade documental

Todo conteúdo incluído no bloco de contexto deve carregar sua maturidade/estado de origem e sua autoridade relativa (fonte primária vs. derivada). Evidência e hipótese permanecem distintas em qualquer conteúdo transportado.

## Comportamento diante de conflito/divergência

Quando `fontes/` e `derivados/` divergirem entre si, ou quando houver divergência conhecida entre o repositório de código real e `fontes/`, M02 deve preservar essa divergência de forma explícita no bloco de contexto — nunca escolher silenciosamente uma versão sem sinalizar o conflito.

## Comportamento diante de ausência de evidência

Quando M02 não localizar evidência suficiente para a pergunta/objetivo fornecidos, o bloco de contexto deve representar isso qualitativamente (ex.: "nenhuma evidência localizada") — nunca omitir silenciosamente o campo nem inventar conteúdo.

**Distinção obrigatória:** "ausência de evidência" (recuperação documental sem resultado) e "estado não determinado" (M02 não recebeu determinação de estado de fonte competente) são condições conceitualmente distintas e não devem ser representadas, sinalizadas ou tratadas como a mesma coisa no bloco final.

## Caso funcional mínimo

Usando o único projeto real disponível na Base Canônica (FullCommerce):

- entrada: projeto = "FullCommerce"; pergunta real (ex.: "qual é o estado atual do projeto?"); objetivo explícito fornecido pelo operador;
- descoberta em `fontes/`, `derivados/` e `timeline/` do FullCommerce;
- seleção de evidência priorizando `fontes/` quando aplicável, com `derivados/EstadoAtual.yaml` participando apenas com sua natureza derivada sinalizada;
- recuperação do conteúdo;
- montagem do bloco de contexto preservando proveniência e maturidade;
- entrega pronta para colar em uma IA.

Resultado observável esperado: o conteúdo do bloco deve ser consistente com o que `derivados/EstadoAtual.yaml` já registra factualmente hoje (Milestone 03 do FullCommerce em execução; Primitives completos; Patterns Hero/ProductCard implementados e commitados). Neste caso, como nenhum estado foi fornecido explicitamente por fonte competente, o campo `estado` do bloco final deve aparecer como não determinado — não deve ser preenchido a partir de `EstadoAtual.yaml`, que é evidência documental, não uma determinação de estado por componente competente.

## Estratégia de validação

Seguir a mesma disciplina já usada no Milestone 01: decisão → aprovação → implementação → validação → revisão → commit → push, sem pular etapas. A validação deve verificar cada critério de conclusão abaixo contra o caso funcional mínimo e, quando possível, contra um segundo caso independente antes de considerar M02 encerrada — sem que isso crie um novo estado formal de graduação para milestones (essa metodologia permanece exclusiva de documentos, não é estendida aqui).

## Critérios objetivos de conclusão

* Entrada válida (projeto + pergunta + objetivo explícitos) produz um bloco de contexto.
* Toda evidência incluída no bloco é identificável por path/fonte concreta.
* Autoridade e maturidade das evidências utilizadas não são perdidas nem silenciadas no bloco final.
* Material derivado nunca substitui silenciosamente uma fonte primária disponível em `fontes/`.
* Ausência de evidência é representada explicitamente, nunca omitida ou inventada.
* Conflito/divergência conhecido entre fontes não é apagado no bloco final.
* Estado recebido explicitamente de fonte competente é transportado sem reinterpretação, recálculo ou substituição; estado não recebido permanece explicitamente não determinado, sem ser confundido com ausência de evidência.
* M02 não infere objetivo em nenhum caso testado.
* M02 não determina estado nem próximo passo em nenhum caso testado.
* Nenhuma dependência de implementação de M03 é introduzida ou exigida.
* Nenhuma tecnologia explicitamente excluída (banco vetorial, embeddings, Kubernetes, Redis, filas, microsserviços) é introduzida.

## Fora de escopo

Determinação formal de objetivo/estado/próximo passo (M03); extração de metadados de documento novo (M04); validação/aprovação de Documentos Canônicos (M05); sincronização automática (M06); qualquer banco vetorial, embeddings, Kubernetes, Redis, filas, microsserviços, arquitetura de agentes ou memória persistente; definição de schema técnico final do bloco de contexto além do conceitualmente exigido; geração de texto ou raciocínio por M02.

## Plano solicitado antes de implementar

1. Formato técnico exato do bloco de contexto (estrutura de arquivo/objeto, serialização).
2. Formato técnico exato da entrada (projeto/pergunta/objetivo).
3. Mecanismo concreto de busca dentro de `fontes/`/`derivados/`/`timeline/` (grep simples, leitura sequencial ou outro), respeitando a restrição de MVP (Git/Markdown/SQLite ou apenas arquivos; script simples).
4. Como representar tecnicamente proveniência, maturidade, conflito, ausência de evidência e estado não determinado dentro do bloco (campo de metadados, comentário, seção separada).
5. Linguagem/runtime do script (Node ou Python, já genericamente autorizado pelo ADR-000).

Todas as cinco são decisões de implementação reversíveis — nenhuma reabre a fronteira M02×M03, o ADR-000 ou qualquer decisão já tomada.

## Implementação

* Só implementar após aprovação explícita deste plano.
* Seguir a mesma disciplina de governança já usada no Milestone 01: decisão -> aprovação -> implementação -> validação -> revisão -> commit -> push, sem pular etapas.
* Não executar git add / commit / push antes da validação e aprovação.
