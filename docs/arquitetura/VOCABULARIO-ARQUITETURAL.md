# Vocabulário Arquitetural (Proposta / Experimental)

## Estado

**Proposta / Experimental.** Este documento não tem autoridade canônica, não é metodologia oficial do Sistema MIM, e não altera nenhum ADR, documento metodológico ou documento arquitetural existente.

**Origem:** checkpoint experimental do mim-core, sessão de 2026-07-28, motivado pela necessidade de consolidar vocabulário antes de redigir seis propostas futuras (Metadata Schema, Governance Validation, AI Governance Protocol, Knowledge, Evidence, Audience Model, NEF Contract).

**Escopo declarado:** este documento consolida termos arquiteturais já em uso no repositório do mim-core, identifica ambiguidades e lacunas, e serve como índice de referência. Não cria conceitos novos além do estritamente necessário para nomear uma ambiguidade ou lacuna já existente.

## Princípio de autoridade

Este documento **não é fonte normativa**. Funciona como índice e consolidação de definições já existentes nos documentos de origem. A definição oficial de cada termo permanece no documento onde ele foi originalmente definido — ADR, documento metodológico ou documento arquitetural correspondente. Em caso de divergência entre este documento e a fonte original, **a fonte original sempre prevalece**.

Este princípio segue o mesmo padrão já estabelecido pelo ADR-001 (DEC-2) para `fontes/` na Base Canônica: uma representação governada pode ficar desatualizada em relação à sua origem sem nunca ganhar autoridade sobre ela.

### Convenção editorial — maturidade mista

> Quando o mesmo termo possuir sentidos ou definições provenientes de fontes com maturidades diferentes, esses sentidos devem ser apresentados separadamente, com referência cruzada, identificação da fonte e maturidade explícita.

Esta convenção é editorial e arquitetural, restrita a este Vocabulário. Ela:
- não cria nem redefine conceitos;
- não altera documentos de origem;
- não promove estados de maturidade;
- não declara equivalência entre fontes;
- não permite fundir sentidos incompatíveis;
- preserva o princípio de que a fonte original sempre prevalece.

Aplicada em: `Achado` (entradas separadas em §1 e §4), `Evidências Preventivas` (§4, referenciando "Evidência ≠ Hipótese" em §1 sem alterá-la) e o terceiro sentido de "Canônico" (§2). `Checklist-Mãe` e `Cadeia de autoridade` têm fonte única cada um — não exigiram separação por sentido, apenas declaração explícita de maturidade.

## Escopo e não-escopo

**Este documento faz:**
- lista termos arquiteturais já em uso no repositório;
- indica, para cada termo, definição resumida, responsabilidade, camada (mim-core / NEF / Produto Consumidor) e origem;
- agrupa ambiguidades, sinônimos não declarados e termos pendentes de definição formal;
- registra um achado colateral sobre nomes de projetos consumidores futuros.

**Este documento explicitamente não faz:**
- não resolve as ambiguidades registradas — apenas as nomeia;
- não define Metadata Schema, Governance Validation, AI Governance Protocol, Knowledge, Evidence, Audience Model ou NEF Contract;
- não cria protocolos, esquemas ou regras de governança;
- não altera nenhum documento existente.

---

## 1. Termos consolidados

Termos com definição já consistente entre documentos. Aqui apenas referenciados, não redefinidos.

| Termo | Definição resumida | Responsabilidade | Camada | Origem |
|---|---|---|---|---|
| Sistema MIM | Conceito guarda-chuva de governança do conhecimento da Neurônio Capital; mim-core é sua implementação atual (biblioteca) | Definir a visão de longo prazo do sistema | — (conceitual, acima das camadas) | ADR-000 |
| mim-core | Biblioteca de governança reutilizável (library/core), consumida por outros projetos como dependência, não como serviço hospedado | Governar a evolução do conhecimento dos projetos consumidores | mim-core | ADR-000 |
| Base Canônica | Memória oficial versionada dos projetos, implementável em Git/Markdown/YAML | Armazenar `fontes/`, `derivados/` e `indices/` de cada projeto | mim-core | ADR-000 |
| `fontes/` | Documentos escritos por humanos (Constituição, ADRs, Documentos Canônicos) — fonte de verdade dentro da Base Canônica | Representar, sob governança do mim-core, o conteúdo trazido do repositório de código do projeto | mim-core | ADR-000, ADR-001 (DEC-2) |
| `derivados/` | Arquivos recalculados a partir de `fontes/` (DNA, Algoritmo, EstadoAtual) — nunca editados manualmente | Refletir `fontes/`; nunca ter autoridade própria | mim-core | ADR-000, ADR-001 (DEC-3) |
| `indices/` | Pasta reservada para artefatos de busca (relacionamentos, temas) | Suportar Context Builder e Sistema Circulatório (ainda não implementados) | mim-core | ADR-000 |
| Repositório de código | Repositório de código-fonte de cada projeto consumidor | Ser a fonte primária de verdade operacional | Produto Consumidor | ADR-001 (DEC-1) |
| Estado (Experimental / Validado / Canônico) | Modelo de três estados para graduação de maturidade de um documento | Indicar o grau de confiança e autoridade de um documento | — (metodológico, transversal) | VALIDACAO-EXPERIMENTAL.md |
| Evidência ≠ Hipótese | Toda conclusão deve declarar se está baseada em fato observado, evidência direta ou hipótese | Exigir rastreabilidade de afirmações | — (metodológico, transversal) | VALIDACAO-EXPERIMENTAL.md |
| Milestone | Unidade de execução do roadmap de um projeto | Delimitar escopo de trabalho e congelamento arquitetural durante a implementação | mim-core / Produto Consumidor | ADR-000 |
| Motor de Convergência | Componente que recebe projeto, objetivo e pergunta, e determina quais documentos carregar | Selecionar documentos relevantes; não gera texto | mim-core | ADR-000 |
| Context Builder | Componente que monta o bloco de contexto final entregue à IA | Ser o único ponto de entrega de informação para a IA | mim-core | ADR-000 |
| Sistema Circulatório | Sincronizador que roda após aprovação de um Documento Canônico e recalcula os derivados | Manter `derivados/` sincronizado com `fontes/` automaticamente | mim-core | ADR-000 |
| Lateralidade | Pipeline de validação antes da aprovação de um Documento Canônico | Validar um documento por múltiplos validadores antes da aprovação | mim-core | ADR-000 |
| Validador de Paradoxos | Avaliador de tensões arquiteturais antes da aprovação final | Identificar conflitos e severidade entre pares de princípios opostos | mim-core | ADR-000 |
| DNA | Estrutura de metadados versionada (YAML) — nome, objetivo, restrições e princípios do projeto | Registrar, de forma recalculável, a identidade estrutural do projeto a partir de `fontes/` | mim-core | ADR-000 |
| Algoritmo | Descreve o fluxo lógico esperado do projeto (planejamento -> execução -> validação -> entrega) | Registrar, de forma recalculável, a sequência de execução esperada do projeto | mim-core | ADR-000 |
| Documentos Canônicos | Especificações versionadas no formato ADR/RFC (DC-014: Título, Status, Autor, Resumo, Motivação, Decisão, Impactos, Referências) | Ser a principal fonte de verdade do projeto | mim-core | ADR-000 |
| Profundidade 3.0 | Pipeline de extração e normalização de conhecimento — entrada: um documento; saída: escopo, DNA, padrões, algoritmo, checklist, metadados estruturados e relacionamentos | Extrair metadados estruturados a partir de um documento novo | mim-core | ADR-000 (Milestone 04, ainda não implementado) |
| Engenharia Reversa em Camadas | Pipeline de decomposição de um objetivo em módulos, dependências, riscos e Checklist-Mãe | Decompor um objetivo em etapas automatizáveis | mim-core | ADR-000 |
| `manifesto.yaml` | Porta de entrada do projeto (nome, versão, status, responsável, referências aos arquivos-chave) | Ser o primeiro documento consultado sobre um projeto na Base Canônica | mim-core | ADR-000 |
| `EstadoAtual.yaml` | Artefato em `derivados/` que registra milestone atual, objetivo ativo e bloqueios conhecidos de um projeto | Refletir o estado corrente do projeto, sujeito às mesmas regras de autoridade de `derivados/` (ADR-001, DEC-3) | mim-core | ADR-000; ver também Achados 1 e 2 em `MILESTONE-06-ACHADOS-PRELIMINARES.md` |
| `indice-global.yaml` | Índice de topo da Base Canônica, listando os projetos existentes; placeholder até existir um segundo projeto — distinto de `indices/` (por projeto) | Registrar quais projetos existem na Base Canônica | mim-core | ADR-000 |
| Ecossistema | Neste Vocabulário e em `ARQUITETURA-ECOSSISTEMA-MIM-CORE.md`, refere-se ao escopo governado pelo mim-core (decisão de Opção B) — distinto do campo "Ecossistema: Neurônio Capital" do cabeçalho do ADR-000, que se refere à Neurônio Capital como um todo | Delimitar o alcance de documentos que usam o termo | — (transversal) | ADR-000; `ARQUITETURA-ECOSSISTEMA-MIM-CORE.md` (decisão de Opção B) |
| Checklist-Mãe | Estrutura de metadados versionada, citada como componente do mim-core e como saída de Profundidade 3.0 e de Engenharia Reversa em Camadas | Registrar, de forma estruturada, o checklist de um objetivo ou projeto | mim-core | ADR-000. Maturidade: fonte Aceita/Congelada; conceito nomeado três vezes no documento, porém sem instância real (`.yaml` ou equivalente) observada no repositório até o momento |
| Achado (formato de registro) | Registro estruturado de um problema real do próprio mim-core (Linha do tempo; O que está/não está conforme; Causa raiz), com 2 instâncias reais registradas | Documentar problemas reais para acumular evidência antes da priorização de um Milestone | mim-core | `MILESTONE-06-ACHADOS-PRELIMINARES.md`. Maturidade: prática observada em 2 casos reais; o documento de origem não declara Estado formal (Experimental/Validado/Canônico). Ver também "Achado — ciclo de vida (proposto)" em §4 |
| `DEC-N` | Convenção de rotulagem interna usada em ADRs do `mim-core` para identificar decisões individuais dentro de um mesmo documento (ex.: DEC-1, DEC-2, DEC-3, DEC-4) | Nomear e referenciar uma decisão específica dentro de um ADR do `mim-core` | mim-core | ADR-001 (`docs/adr/ADR-001-autoridade-das-fontes-na-base-canonica.md`, Status: Aceito). Convenção restrita ao uso em ADRs do `mim-core` |
| Caso | Unidade de registro do formato "Registro de Casos": aplicação real e verificável de uma observação ou conceito, documentada com campos fixos — Status, Data, Contexto, Resultado, Ajustes | Fornecer evidência reprodutível para o critério de "casos reais independentes" já usado pelo mecanismo de graduação (ver §7, sem duplicar seu conteúdo) | — (metodológico, transversal) | `VALIDACAO-EXPERIMENTAL.md` (Estado: Validado), seção "Registro de Casos" (Caso 1, Caso 2) |
| `timeline/` | Pasta da Base Canônica com arquivos prefixados por data, para ordem cronológica natural | Registrar a linha do tempo do projeto; atualizada junto de DNA e Algoritmo pelo Sistema Circulatório | mim-core | ADR-000 |
| `DEC-4` | Decisão do ADR-001: hoje toda sincronização entre repositório de código, `fontes/` e `derivados/` é manual e deve declarar explicitamente sua fonte e a data da correção | Tornar auditável toda correção manual até a automação do Milestone 06 (Sistema Circulatório) | mim-core | ADR-001 (`docs/adr/ADR-001-autoridade-das-fontes-na-base-canonica.md`, Status: Aceito). Verificada em `MILESTONE-06-ACHADOS-PRELIMINARES.md`, Achado 2, seção "O que está conforme": "DEC-4 [...] — satisfeito." Sujeita a revisão quando a sincronização se tornar automática |
| Stress Test Pluricelular | Nome dado ao exercício de auditoria arquitetural conduzido célula a célula, forçando cada conclusão a declarar sua base (fato/evidência/hipótese) | Nomear a técnica usada para originar as observações 1–4 de `VALIDACAO-EXPERIMENTAL.md` — o nome identifica a ferramenta, não o conteúdo validado (distinção feita pela própria fonte) | — (metodológico, transversal) | `VALIDACAO-EXPERIMENTAL.md`, seção "O Stress Test Pluricelular" — documento em Estado Validado, mas essa graduação cobre as observações 1–4, não o nome da técnica em si (distinção feita pela própria fonte); aplicado no Caso 1 |

## 2. Ambiguidades identificadas

Termos usados em mais de um sentido, sem que os documentos existentes declarem a relação entre esses sentidos. Registrados aqui apenas para consulta — nenhuma resolução é proposta.

### "Governança"

Usado em pelo menos três sentidos distintos, sem qualificação de camada:
- **componente específico** — "Governança Estrutural", nomeada no diagrama do ADR-000 (`Base Canônica / Motor de Convergência / Governança Estrutural`), nunca detalhada em seção própria;
- **qualidade genérica de processo** — "governança documental versionada" (`MILESTONE-01-FECHAMENTO.md`);
- **governança de produto** — Art. 22 "Governança da Inteligência" e Art. 53 "Governança da Evolução", específicas da `Constituicao.md` do FullCommerce (camada de Produto Consumidor, não do mim-core).

### "Canônico"

- **Documento Canônico** — artefato específico (formato DC-XXX, pipeline de Lateralidade, aprovação humana), definido no ADR-000. Maturidade da fonte: ADR-000 tem status Aceito/Congelado.
- **estado: Canônico** — grau de graduação metodológica de qualquer documento, definido em `VALIDACAO-EXPERIMENTAL.md`. Maturidade da fonte: documento em estado Validado.
- **Evento Canônico / Modelo Canônico de Evento** — conceito de modelagem de dados do FullCommerce (Produto Consumidor, externo ao mim-core), definido no ADR-001 do FullCommerce (`base-canonica/projetos/FullCommerce/fontes/ADRs/ADR-001-modelo-canonico-de-evento-e-identidade-unificada.md`). **Maturidade da fonte: aquele ADR declara no próprio cabeçalho "Status: Proposto (aguardando aprovação do fundador)" — não Aceito**; `derivados/EstadoAtual.yaml` do FullCommerce confirma isso como bloqueio conhecido ("ADR-001 permanece com status 'Proposto' [...] embora o ADR-002 já opere sobre suas decisões como se aceitas"). Este registro apenas reconhece um uso real já existente do termo — não valida, aprova ou promove o ADR-001 do FullCommerce, e não transfere autoridade do FullCommerce para o mim-core.

Não há definição de se um documento em estado Canônico (por graduação) se torna automaticamente um Documento Canônico (no sentido do ADR-000). Os três sentidos acima têm três níveis de maturidade formal distintos (Aceito/Congelado; Validado; Proposto) e não devem ser tratados como equivalentes.

### "Padrão"

Usado em `ARQUITETURA-ECOSSISTEMA-MIM-CORE.md` (o que o NEF materializa), possivelmente relacionado a "Engineering Patterns" (Proposta 2, `PROPOSTAS-EM-OBSERVACAO.md`) e a "Pattern" como componente de UI (`VALIDACAO-EXPERIMENTAL.md`, Caso 1). Nenhuma relação formal foi declarada entre os três usos.

### "Camada"

Usado em pelo menos três sentidos distintos, sem relação formal declarada entre eles:
- **eixo classificatório informal de §1** — coluna "Camada" da tabela de §1 deste próprio Vocabulário (valores: mim-core / NEF / Produto Consumidor), usada para localizar cada termo; não é definida como conceito próprio em nenhum documento de origem, apenas empregada como rótulo de coluna;
- **modelo de "três camadas" do ecossistema** — `ARQUITETURA-ECOSSISTEMA-MIM-CORE.md`, seção 3 ("As três camadas": mim-core, NEF, projetos consumidores) e seção 6 (tabela de responsabilidades por camada). **Maturidade da fonte: Proposta / Experimental** — o próprio documento declara não ter autoridade canônica (seção "Estado") e lista o modelo de camadas entre as candidatas à validação (seção 8), ainda sem casos aplicados;
- **camadas internas da Constituição do FullCommerce** (Produto Consumidor, externo ao mim-core) — usado em ao menos três sentidos distintos entre si dentro da própria fonte: Art. 25 ("As Camadas e os Domínios da Memória" — Operacional, Longo Prazo, Decisória, Institucional, do Cliente), Art. 33 ("Camada Anticorrupção" — tradução de dado externo ao Modelo Canônico) e Art. 49 ("As Três Camadas da Evolução"). Fonte: `base-canonica/projetos/FullCommerce/fontes/Constituicao.md`.

Este registro apenas nomeia a colisão de sentidos; não escolhe um significado único, não resolve a ambiguidade e não reestrutura o eixo classificatório já usado em §1.

## 3. Sinônimos não declarados (drift já detectado)

### "Projeto consumidor" vs. "Produto consumidor"

Dentro do próprio `ARQUITETURA-ECOSSISTEMA-MIM-CORE.md`: as seções 3.3 e 6 usam **"projetos consumidores"** (alinhado à linguagem do ADR-000: *"outros projetos (FullCommerce, Aura, e futuros)"*); o diagrama da seção 4 e a seção 8 usam **"Produtos consumidores" / "Produtos"**. Nenhuma nota declara os dois termos como sinônimos.

## 4. Termos pendentes de definição formal

| Termo | Onde aparece | Situação |
|---|---|---|
| NEF | `PROPOSTAS-EM-OBSERVACAO.md` ("Hero do NEF"), `VALIDACAO-EXPERIMENTAL.md` ("validações no NEF"), `ARQUITETURA-ECOSSISTEMA-MIM-CORE.md` (seção 3.2) | Caracterizado apenas em nível Experimental, nesta sessão; sem documento próprio |
| Padrão | `ARQUITETURA-ECOSSISTEMA-MIM-CORE.md` | Não definido; ver ambiguidade na seção 2 acima |
| Governança Estrutural | ADR-000 (diagrama) | Nomeada, nunca detalhada em seção própria |
| Independência (de casos) | `VALIDACAO-EXPERIMENTAL.md`, Proposta 3 | Usado sem definição explícita do que torna dois casos "independentes"; já registrado como questão em aberto na Proposta 3 |
| Índice de Saúde | Proposta 3 | Citado como conceito futuro, não especificado |
| Matriz de Proveniência | Proposta 3 | Citado como conceito futuro, não especificado; ver precedente de uso do conceito-raiz "proveniência" em DEC-4 do ADR-001 do FullCommerce ("todo evento carrega proveniência e confiança") |
| Base Filosófica | `PROPOSTAS-EM-OBSERVACAO.md`, Proposta 1 | Nome reservado para uso futuro (evita colisão com "Base Canônica"); documento ainda não escrito, não implementado |
| Achado — ciclo de vida (proposto) | `PROPOSTAS-EM-OBSERVACAO.md`, Proposta 3 | Experimental — propõe 6 etapas (Aberto → Investigação → Correção → Verificação → Resultado → Encerrado); a própria fonte declara que não substitui, altera nem antecipa o formato empírico já usado em `MILESTONE-06-ACHADOS-PRELIMINARES.md` (ver "Achado (formato de registro)" em §1). Nenhum dos 2 Achados reais foi rotulado com estas etapas até o momento |
| Cadeia de autoridade | `MILESTONE-06-ACHADOS-PRELIMINARES.md` (Achado 2, título e corpo) | Não é termo de primeira classe — é uma síntese descritiva do fluxo repositório de código → `fontes/` → `derivados/`, formalizado por DEC-1/DEC-2/DEC-3 do ADR-001 (mim-core), mas sem esse nome literal naquele ADR. Uso registrado numa única ocorrência, num único documento — não atinge o critério de "dois casos independentes" já usado em `VALIDACAO-EXPERIMENTAL.md`. Promoção a termo próprio condicionada a uma segunda ocorrência independente ou definição formal futura |
| Evidências Preventivas (Observada/Confirmada) | `PROPOSTAS-EM-OBSERVACAO.md`, Proposta 3 | Experimental — subclassificação proposta de "Evidência" (ver linha "Evidência ≠ Hipótese" em §1, fonte `VALIDACAO-EXPERIMENTAL.md`, Validado); a própria Proposta 3 declara que não altera a Observação 4 daquele documento. Nenhum caso real aplicado até o momento |
| Workflow como fonte primária | `PROPOSTAS-EM-OBSERVACAO.md`, seção "Workflow como fonte primária" | Experimental, registrado por analogia a DEC-1/DEC-3 do ADR-001 (`mim-core`), sem alterar aquele ADR nem propor sua revisão; sem validação; zero casos aplicados até o momento. Critério de promoção citado na própria fonte: casos reais em pelo menos um projeto além do FullCommerce em que tratar uma matriz/índice/dashboard como derivado (e não como fonte) tenha sido decisivo |
| Separação entre qualidade da evidência e estado de governança | `PROPOSTAS-EM-OBSERVACAO.md`, Proposta 3 | Experimental — observa que qualidade da evidência (rastreabilidade, verificabilidade) e estado metodológico do documento (Experimental/Validado/Canônico) são dimensões diferentes e não devem ser confundidas. Nenhum caso real aplicado até o momento; aguarda validação |
| Padronização de metadados antes da automação | `PROPOSTAS-EM-OBSERVACAO.md`, Proposta 3 | Experimental — observa que uma automação futura poderia se beneficiar de metadados padronizados (`Fonte`, `Origem`, `Status`, `Nível`), sem definir esquema, obrigatoriedade ou onde viveriam. Nenhum caso real aplicado até o momento; aguarda validação |

## 5. Achado colateral: nomes de projetos consumidores futuros

Três listas diferentes aparecem no repositório, sem que nenhuma seja declarada como substituta da outra:

- **ADR-000** (canônico, congelado): *"FullCommerce, Aura, e futuros"*.
- **`MILESTONE-01-FECHAMENTO.md`** ("Lições aprendidas"): *"novos projetos (Aura, Pulls, Toda etc.)"*.
- **`ARQUITETURA-ECOSSISTEMA-MIM-CORE.md`** (seção 3.3): *"FullCommerce, Lime, NeuroHub"*.

Aura aparece em dois documentos anteriores a esta sessão, um deles canônico. Lime e NeuroHub aparecem apenas na sessão que originou `ARQUITETURA-ECOSSISTEMA-MIM-CORE.md` (2026-07-28), sem registro anterior no repositório. Pulls e Toda não foram mencionados nesta sessão. Este documento apenas registra a discrepância — não decide qual lista é válida.

## 6. Fora de escopo desta proposta

Não implementados por este documento:
- Metadata Schema;
- Governance Validation;
- AI Governance Protocol;
- Knowledge;
- Evidence (como documento — a definição metodológica de "evidência" já existe em `VALIDACAO-EXPERIMENTAL.md` e está apenas referenciada aqui);
- Audience Model;
- NEF Contract.

## 7. Critério de futura validação/promoção

Este documento segue o mesmo modelo de três estados definido em `VALIDACAO-EXPERIMENTAL.md`, com o mesmo vocabulário.

### Experimental (estado atual)

Estado de origem. Os agrupamentos (ambiguidades, sinônimos, pendências) existem, mas ainda não foram testados fora desta sessão.

### Validado

Atingido **automaticamente**, sem intervenção humana adicional, quando os critérios abaixo forem cumpridos, aplicados individualmente a cada item registrado:

- aplicação bem-sucedida em pelo menos **dois casos reais independentes** (ex.: duas propostas futuras que consultaram este vocabulário e evitaram uma divergência que, sem ele, teria ocorrido);
- registro dos resultados de ambos;
- registro explícito de quais itens precisaram de ajuste, classificando cada ajuste como:
  - **refinamento de redação** — não impede a graduação para Validado; ou
  - **mudança de substância** — reinicia a contagem de casos válidos **especificamente** para aquele item.

### Canônico

Atingido **somente** após revisão explícita do fundador sobre o conteúdo em estado Validado, com três resultados possíveis: **Incorporação**, **Permanência em Validado** ou **Reabertura** — nos mesmos termos definidos em `VALIDACAO-EXPERIMENTAL.md`.

## 8. Nota metodológica

O objetivo deste documento é indexar e consolidar, não normatizar. Nenhuma definição aqui substitui a fonte original; nenhuma ambiguidade aqui registrada é resolvida por este documento. Tudo o que está descrito acima é observação Experimental, não decisão.
