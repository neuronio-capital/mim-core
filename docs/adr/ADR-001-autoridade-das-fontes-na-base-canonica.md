# ADR-001 — Autoridade das Fontes na Base Canônica

- **Repositório:** `mim-core`
- **Data:** 2026-07-18
- **Status:** **Aceito** — aprovado pelo fundador em 2026-07-18.
- **Decorre de:** ADR-000 (componente Base Canônica; separação `fontes/` vs. `derivados/`)
- **Escopo:** este ADR decide exclusivamente a regra de autoridade entre o repositório de código de um projeto e sua representação na Base Canônica. **Não altera, reordena nem antecipa nenhum item do roadmap de Milestones definido no ADR-000** — é uma decisão de autoridade das fontes, adicional e independente da sequência de milestones (Context Builder, Motor de Convergência, Profundidade 3.0, Lateralidade, Sistema Circulatório permanecem exatamente como priorizados no ADR-000).

---

## CONTEXTO

O ADR-000 já separa `fontes/` (escrito por humanos) de `derivados/` (recalculado a partir das fontes), mas nunca declara explicitamente de onde `fontes/` em si tira sua autoridade. Na prática do Milestone 01, isso já apareceu: a Base Canônica do FullCommerce foi construída **por cópia** a partir do repositório de código do projeto (`github.com/neuronio-capital/fullcommerce`), "preservando o repositório original do FullCommerce como fonte operacional do código" (`MILESTONE-01-FECHAMENTO.md`). Ou seja, `fontes/` dentro da Base Canônica nunca foi, na prática, a origem do conteúdo — sempre foi uma cópia de algo que vive em outro lugar.

Essa ambiguidade implícita já causou um problema real, documentado e datado: `derivados/EstadoAtual.yaml` ficou desatualizado por 4 dias corridos (2026-07-14 a 2026-07-18) sem que nada — nem processo, nem regra escrita — sinalizasse a divergência entre o estado real do projeto (Milestone 03 do FullCommerce em execução) e o que a Base Canônica registrava ("nenhum Milestone 03 encontrado"). Ver `docs/milestones/MILESTONE-06-ACHADOS-PRELIMINARES.md` para a linha do tempo completa desse achado.

`indice-global.yaml` já antecipa que um segundo projeto entrará na Base Canônica. Sem uma regra explícita de autoridade, cada novo projeto reintroduz a mesma ambiguidade — e sem detecção automática (Milestone 06, ainda não construído), o único mecanismo de correção disponível hoje é humano.

---

## DECISÃO

### DEC-1 — O repositório de código de cada projeto é a fonte primária
Para todo projeto representado na Base Canônica, a verdade operacional vive no repositório de código do projeto (ex.: `github.com/neuronio-capital/fullcommerce`), não dentro do `mim-core`.

### DEC-2 — `fontes/` é uma representação governada, não a fonte em si
`base-canonica/projetos/<projeto>/fontes/` armazena uma cópia trazida do repositório de código do projeto, sob a governança e o formato do Sistema MIM. Ela pode ficar desatualizada em relação à origem; quando isso acontece, o repositório de código prevalece, não o conteúdo copiado.

### DEC-3 — `derivados/` é processado a partir de `fontes/`, nunca uma fonte independente
Nada em `derivados/` (DNA, Algoritmo, EstadoAtual) tem autoridade própria. Todo o seu conteúdo deriva de `fontes/` — e, transitivamente, do repositório de código via DEC-1/DEC-2. Um `derivados/` correto e um `fontes/` desatualizado ainda produzem um estado incorreto.

### DEC-4 — Hoje a sincronização é manual e deve ser registrada como tal
Não existe, nesta fase, nenhum mecanismo automático de detecção de divergência entre o repositório de código real e a Base Canônica — essa é responsabilidade futura do Milestone 06 (Sistema Circulatório), ainda não iniciado. Até lá, toda sincronização e toda correção de divergência são manuais, e devem declarar explicitamente sua fonte e a data da correção (como já feito em `derivados/EstadoAtual.yaml` em 2026-07-18). Uma correção manual sem essa declaração não está em conformidade com este ADR.

---

## CONSEQUÊNCIAS / TRADE-OFFS ACEITOS

**Positivas**
- (+) Elimina a ambiguidade sobre quem prevalece quando `fontes/`/`derivados/` e o repositório de código divergem — regra única, válida para qualquer projeto futuro na Base Canônica, não só o FullCommerce.
- (+) Torna auditável toda correção manual: a exigência de declarar fonte e data (DEC-4) transforma disciplina tácita em regra escrita, verificável por qualquer revisão futura.
- (+) Não exige nenhuma implementação nova — é uma decisão de governança sobre um comportamento que a Base Canônica já tinha na prática desde o Milestone 01, apenas não declarado.

**Negativas / custos aceitos**
- (−) Sem Milestone 06, a Base Canônica pode continuar ficando desatualizada por dias após uma mudança real no repositório de código, sem aviso automático — o mesmo risco já observado no achado de 2026-07-14→07-18. Este ADR **não resolve** esse risco; apenas nomeia formalmente quem tem razão quando ele se manifesta, e obriga o registro de cada ocorrência.
- (−) Depende inteiramente de disciplina humana para ser cumprido (nada impede, hoje, uma correção manual silenciosa que descumpra DEC-4). Aceito conscientemente até o Milestone 06 existir.
- (−) DEC-1 assume implicitamente que todo projeto futuro na Base Canônica tem um repositório de código real como origem. Projetos de outra natureza (ex.: puramente documentais, sem repositório) não estão cobertos por este ADR.

---

## CONDIÇÕES QUE JUSTIFICARIAM REVISÃO FUTURA

- **Início do Milestone 06 (Sistema Circulatório):** quando a sincronização passar a ser automática, DEC-4 precisa ser revisitado — a obrigação de declarar fonte/data manualmente pode deixar de fazer sentido, ou passar a valer só para exceções que o sincronizador não conseguir resolver sozinho.
- **Entrada de um projeto sem repositório de código real** (`indice-global.yaml` deixando de ser `[]`): DEC-1 precisaria ser generalizado ou receber uma exceção explícita, porque hoje assume repositório de código como origem universal.
- **Nova divergência não detectada por período relevante:** deve ser registrada como novo achado em `docs/milestones/MILESTONE-06-ACHADOS-PRELIMINARES.md` (evidência acumulada para priorização do Milestone 06) — isso, por si só, **não** é motivo para reabrir este ADR, que trata apenas de autoridade, não de detecção automática.
