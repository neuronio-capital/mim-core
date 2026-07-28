# Vocabulário Arquitetural (Proposta / Experimental)

## Estado

**Proposta / Experimental.** Este documento não tem autoridade canônica, não é metodologia oficial do Sistema MIM, e não altera nenhum ADR, documento metodológico ou documento arquitetural existente.

**Origem:** checkpoint experimental do mim-core, sessão de 2026-07-28, motivado pela necessidade de consolidar vocabulário antes de redigir seis propostas futuras (Metadata Schema, Governance Validation, AI Governance Protocol, Knowledge, Evidence, Audience Model, NEF Contract).

**Escopo declarado:** este documento consolida termos arquiteturais já em uso no repositório do mim-core, identifica ambiguidades e lacunas, e serve como índice de referência. Não cria conceitos novos além do estritamente necessário para nomear uma ambiguidade ou lacuna já existente.

## Princípio de autoridade

Este documento **não é fonte normativa**. Funciona como índice e consolidação de definições já existentes nos documentos de origem. A definição oficial de cada termo permanece no documento onde ele foi originalmente definido — ADR, documento metodológico ou documento arquitetural correspondente. Em caso de divergência entre este documento e a fonte original, **a fonte original sempre prevalece**.

Este princípio segue o mesmo padrão já estabelecido pelo ADR-001 (DEC-2) para `fontes/` na Base Canônica: uma representação governada pode ficar desatualizada em relação à sua origem sem nunca ganhar autoridade sobre ela.

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

## 2. Ambiguidades identificadas

Termos usados em mais de um sentido, sem que os documentos existentes declarem a relação entre esses sentidos. Registrados aqui apenas para consulta — nenhuma resolução é proposta.

### "Governança"

Usado em pelo menos três sentidos distintos, sem qualificação de camada:
- **componente específico** — "Governança Estrutural", nomeada no diagrama do ADR-000 (`Base Canônica / Motor de Convergência / Governança Estrutural`), nunca detalhada em seção própria;
- **qualidade genérica de processo** — "governança documental versionada" (`MILESTONE-01-FECHAMENTO.md`);
- **governança de produto** — Art. 22 "Governança da Inteligência" e Art. 53 "Governança da Evolução", específicas da `Constituicao.md` do FullCommerce (camada de Produto Consumidor, não do mim-core).

### "Canônico"

- **Documento Canônico** — artefato específico (formato DC-XXX, pipeline de Lateralidade, aprovação humana), definido no ADR-000;
- **estado: Canônico** — grau de graduação metodológica de qualquer documento, definido em `VALIDACAO-EXPERIMENTAL.md`.

Não há definição de se um documento em estado Canônico (por graduação) se torna automaticamente um Documento Canônico (no sentido do ADR-000).

### "Padrão"

Usado em `ARQUITETURA-ECOSSISTEMA-MIM-CORE.md` (o que o NEF materializa), possivelmente relacionado a "Engineering Patterns" (Proposta 2, `PROPOSTAS-EM-OBSERVACAO.md`) e a "Pattern" como componente de UI (`VALIDACAO-EXPERIMENTAL.md`, Caso 1). Nenhuma relação formal foi declarada entre os três usos.

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
| Matriz de Proveniência | Proposta 3 | Citado como conceito futuro, não especificado |

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
