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

## Proposta 3 (Experimental) — Registro da sessão de revisão metodológica (mim-core + FullCommerce)

- **Estado:** registro de sessão, em caráter Experimental — não é uma proposta de mudança de metodologia. Fica adiada, no sentido deste documento, qualquer incorporação das convergências abaixo à metodologia oficial.

### Contexto

- **Origem:** sessão de revisão metodológica do `mim-core`.
- **Data:** 2026-07-22.
- **Contexto:** revisão de leitura e verificação de consistência entre ADR-000 (`docs/adr/ADR-000-arquitetura-tecnica-sistema-mim.md`), ADR-001 (`docs/adr/ADR-001-autoridade-das-fontes-na-base-canonica.md`), `docs/metodologia/VALIDACAO-EXPERIMENTAL.md`, `docs/milestones/MILESTONE-06-ACHADOS-PRELIMINARES.md` e este documento. Nenhum desses documentos foi alterado durante a sessão.
- **Projetos envolvidos:** `mim-core` (governança da própria Base Canônica, Critério de Graduação de `VALIDACAO-EXPERIMENTAL.md`, Propostas 1 e 2 acima) e FullCommerce (Achado 1 e Achado 2 registrados em `MILESTONE-06-ACHADOS-PRELIMINARES.md`).
- **Problemas reais que motivaram a discussão:**
  - Achado 1: `derivados/EstadoAtual.yaml` do FullCommerce ficou desatualizado por 4 dias corridos sem nenhum mecanismo de detecção.
  - Achado 2: a correção do Achado 1 usou `VALIDACAO-EXPERIMENTAL.md` como substituto de fonte primária, sem rastreabilidade verificável (commit hash, PR ou branch) ao repositório de código do FullCommerce, descumprindo DEC-1/DEC-3 do ADR-001 — mesmo com DEC-4 (fonte e data declaradas) satisfeito.
  - A coexistência de mais de um documento de observação/metodologia (`VALIDACAO-EXPERIMENTAL.md`, este `PROPOSTAS-EM-OBSERVACAO.md`) levantou a necessidade de não confundir a qualidade de uma evidência com o estado de governança do documento que a registra.

### Convergências (Experimentais)

Esta sessão convergiu para as observações abaixo. Todas ficam registradas em caráter **Experimental**, no mesmo sentido em que `VALIDACAO-EXPERIMENTAL.md` usa o termo, e aguardam validação em casos reais antes de qualquer promoção. Nenhuma delas altera o Critério de Graduação daquele documento, nem cria novo estado metodológico, componente ou Milestone.

#### Separação entre qualidade da evidência e estado de governança

Esta sessão convergiu para observar que **qualidade da evidência** (o quanto uma afirmação é rastreável, verificável, factual) e **estado metodológico do documento** (Experimental / Validado / Canônico, conforme `VALIDACAO-EXPERIMENTAL.md`) são dimensões diferentes. Fica registrado em caráter Experimental que essas duas dimensões não devem ser confundidas — um documento em estado Validado pode conter uma afirmação com evidência fraca (caso do Achado 2), e o inverso também é possível. Aguarda validação em casos reais.

#### Workflow como fonte primária

Esta sessão convergiu para observar que o **workflow** (o processo real de trabalho, tal como ocorre — commits, sessões, decisões) tende a funcionar como fonte primária, e que qualquer matriz, índice, dashboard ou visão consolidada sobre esse workflow tenderia a ser tratada como **derivado**. Fica registrado em caráter Experimental, por analogia a DEC-1/DEC-3 do ADR-001, sem alterar aquele ADR nem propor sua revisão. Aguarda validação em casos reais.

#### Padronização de metadados antes da automação

Esta sessão convergiu para observar que uma eventual automação futura poderia se beneficiar de metadados padronizados — exemplos discutidos: `Fonte`, `Origem`, `Status`, `Nível`. Fica registrado em caráter Experimental, sem definir esquema, obrigatoriedade ou onde esses metadados viveriam, e sem constituir novo componente do Sistema MIM ou antecipar o Milestone 06. Aguarda validação em casos reais.

#### Ciclo de vida do Achado (refinamento experimental)

Esta sessão convergiu para observar o seguinte workflow para o ciclo de vida de um Achado (como os já registrados em `MILESTONE-06-ACHADOS-PRELIMINARES.md`):

```
Aberto
  ↓
Investigação
  ↓
Correção
  ↓
Verificação
  ↓
Resultado
  - Corrigido
  - Descartado
  - Aceito
  ↓
Encerrado
```

Fica registrado em caráter Experimental. Os critérios de **Verificação** (que tipo de evidência rastreável seria exigida) e os critérios de cada ramo de **Resultado** (Corrigido / Descartado / Aceito) permanecem Experimentais e não estão definidos por este registro. Este workflow não substitui, altera nem antecipa a estrutura de "Achado" já usada em `MILESTONE-06-ACHADOS-PRELIMINARES.md`. Aguarda validação em casos reais.

#### Evidências Preventivas

Esta sessão convergiu para observar uma possível distinção entre:

- **Preventiva Observada** — um risco identificado e mitigado antes de se manifestar, sem confirmação posterior de que o risco de fato ocorreria.
- **Preventiva Confirmada** — um risco identificado, mitigado, e posteriormente confirmado (por evidência real) como algo que de fato teria ocorrido sem a mitigação.

Fica registrado em caráter Experimental que essa distinção ainda não houve validação em casos reais, e que ela não altera a Observação 4 de `VALIDACAO-EXPERIMENTAL.md` ("todo risco identificado deve vir acompanhado de uma forma de verificação"). Aguarda validação em casos reais.

### Questões em aberto

Os itens abaixo permanecem **sem decisão metodológica** nesta sessão; nenhum deles deve ser promovido a metodologia, componente ou critério oficial a partir deste registro:

- protocolo geral para complementos de documentos em estado Validado;
- solução definitiva para a lacuna de rastreabilidade do Achado 2 de `MILESTONE-06-ACHADOS-PRELIMINARES.md` — incluindo a alternativa de um documento complementar identificado como **CP01**, discutida nesta sessão mas **ainda sem decisão**; nenhum documento CP01 foi criado, e a discussão permanece deliberadamente em aberto para evitar criar, por precedente, um protocolo geral de emenda para documentos Validado;
- formalização do eixo **Independência** entre casos, hoje usado sem definição explícita no Critério de Graduação de `VALIDACAO-EXPERIMENTAL.md` ("dois casos reais independentes");
- eventual **Índice de Saúde** (métrica agregada sobre o estado da Base Canônica ou dos Achados) — não especificado nesta sessão;
- eventual **Matriz de Proveniência** como visão derivada (relacionando afirmações a suas fontes) — não especificada nesta sessão.

### Critérios de futura validação

Nenhuma das convergências acima deixa o estado Experimental por força deste registro. A promoção futura de cada uma seguiria o mesmo tipo de critério objetivo já em uso em `VALIDACAO-EXPERIMENTAL.md` (aplicação bem-sucedida em casos reais, independentes, com resultados registrados) — critério citado aqui por precedente, não redefinido:

- **Separação evidência/governança:** casos reais em que a separação explícita entre as duas dimensões tenha evitado um erro de interpretação que, sem ela, teria ocorrido.
- **Workflow como fonte primária:** casos reais, em pelo menos um projeto além do FullCommerce, em que tratar uma matriz/índice/dashboard como derivado (e não como fonte) tenha sido decisivo para resolver uma divergência.
- **Metadados padronizados:** existência de uma automação real que consuma esses metadados e produza valor verificável — não a mera definição do esquema.
- **Ciclo de vida do Achado:** pelo menos dois Achados reais conduzidos integralmente pelo workflow observado (Aberto → Investigação → Correção → Verificação → Resultado → Encerrado), com evidência rastreável registrada em cada etapa de Verificação.
- **Evidências Preventivas:** pelo menos um caso real em que a distinção entre Preventiva Observada e Preventiva Confirmada tenha sido aplicada e o risco correspondente tenha, de fato, se manifestado ou não.

Nenhuma convergência acima poderá sair do estado Experimental sem evidência produzida em projetos reais que justifique sua incorporação definitiva.

### Decisão da sessão

Esta sessão não altera a metodologia oficial do mim-core. As convergências registradas permanecem em estado Experimental e deverão ser exercitadas em projetos reais antes de qualquer promoção para a metodologia oficial.

### Critério de revisão

Reconsiderar esta proposta apenas quando os princípios aqui registrados forem exercitados em casos reais e produzirem evidências suficientes para **confirmar, refinar ou rejeitar** as observações experimentais listadas em "Convergências (Experimentais)". Até lá, nenhuma delas deve ser tratada como metodologia vigente.

### Nota metodológica

O objetivo desta entrada é registrar fielmente o estado atual da compreensão alcançada nesta sessão — não antecipar, propor ou insinuar uma evolução da metodologia oficial do Sistema MIM. Tudo o que está descrito acima é observação, não decisão.

---

## Proposta 4 (Hipótese em observação) — Engenharia Reversa ↔ Proteção Anti-Reconstrução

- **Estado:** adiada — hipótese em observação, não formalizada. O símbolo "↔" no título indica apenas que esta proposta trata as duas matérias em conjunto; **não** afirma uma relação formal, simétrica ou estabelecida entre elas.
- **Natureza do registro:** entrada de três camadas epistêmicas distintas, que não devem ser fundidas — (A) uma **memória humana não corroborada**; (B) **uma observação empírica recente** (um caso); (C) **uma hipótese nova em observação**. Nenhuma das três é decisão, princípio, componente, milestone ou par de paradoxo do Sistema MIM. Duas auditorias read-only desta conversa (não formalizadas como documento) precederam este registro; suas conclusões estão resumidas na Camada A.
- **Motivo do adiamento:** a matéria tem motivação real, mas repousa hoje sobre **um único caso empírico** (ver "Critério de evidência"), abaixo do critério objetivo de **dois casos independentes** já usado em `docs/metodologia/VALIDACAO-EXPERIMENTAL.md` e invocado pela Proposta 2 acima. Adicionalmente, a formulação histórica que a inspira **não foi recuperada documentalmente** (ver Camada A).

### Camada A — Memória humana (não corroborada)

O fundador recorda que, durante a idealização histórica do Sistema MIM, foi concebida uma formulação semelhante, descrita **na memória** como *"lateralidade paradoxal"* entre Engenharia Reversa e Criptografia / Proteção Defensiva. Este parágrafo registra o **vocabulário da memória humana**, não o do corpus.

Auditoria read-only estabeleceu:
- busca no corpus governado atual, em todo o histórico Git (todos os branches, objetos alcançáveis, renames, deletes, stash, reflog) e no escopo local autorizado **não encontrou** essa formulação;
- os documentos `sistema-mim-historico-v1.md` e `sistema-mim-historico-v2.md`, referenciados apenas em prosa pelo cabeçalho do ADR-000 (campo *Histórico:*, sem path, hash ou genealogia), **não foram recuperados** — não estão no repositório, nunca estiveram no Git, e não foram localizados no escopo autorizado;
- as sete proposições reconstruídas da memória (dualidade explícita; evolução em camadas; contraponto que também evolui; evolução paralela; separação das laterais; um lado observa os resultados do outro; um lado não recebe o escopo/técnicas completos do outro) permanecem todas **não encontradas** — nem provadas, nem inferíveis, nem contraditas pelas fontes disponíveis;
- a memória **não foi refutada**; permanece **não corroborada pelo corpus disponível**.

Consequência para esta proposta: a memória humana **não é usada como evidência** e **não conta como caso**. Serve apenas para registrar que a hipótese da Camada C tem uma intenção humana anterior, ainda que sem fonte recuperada.

Os termos **"Lateralidade"** e **"Validador de Paradoxos"** têm significado próprio e definido no corpus (ADR-000; Milestone 05). Esta proposta **não os reutiliza** como classificação estrutural. A expressão "lateralidade paradoxal" aparece acima **exclusivamente** como citação do vocabulário da memória humana não corroborada.

### Camada B — Observação empírica recente (um caso)

Uma experiência recente e **autorizada** de engenharia reversa demonstrou, na prática, capacidade de reconstruir quantidade significativa da **estrutura aparente** de sistemas analisados a partir de **superfícies públicas / observáveis** (organização, componentes, relações aparentes, escolhas tecnológicas, arquitetura inferida).

Limites explícitos deste registro:
- **Fonte:** relato desta conversa; não verificado contra artefatos nesta sessão — mesmo espírito de declaração de fonte já usado em `derivados/EstadoAtual.yaml` e no Achado 2 de `MILESTONE-06-ACHADOS-PRELIMINARES.md`.
- **Não** se declara universalidade — não se afirma que todo sistema seja reconstruível nesse grau.
- **Não** se declara comprovação da hipótese defensiva (Camada C) — reconstruir a superfície de terceiros não prova que os nossos produtos exponham o mesmo, nem que qualquer proteção específica funcione.
- Constitui **motivação empírica**, não conclusão.

### Camada C — Hipótese nova em observação

**Hipótese:** à medida que a nossa capacidade autorizada de Engenharia Reversa melhora, pode ser útil desenvolver **paralelamente** capacidades defensivas destinadas a reduzir a **reconstruibilidade** dos nossos próprios produtos a partir das superfícies que necessariamente expomos.

Esta relação é **hipótese em observação**. **Não é** regra canônica, **não é** a Lateralidade do Milestone 05, **não é** um novo par do Validador de Paradoxos, **não é** obrigação arquitetural e **não autoriza** implementar segurança, criptografia, hardening ou ofuscação.

**Lado A — Engenharia Reversa autorizada.** Objetivo: melhorar a compreensão de sistemas, arquiteturas e superfícies observáveis por métodos **legítimos e autorizados**. Dimensões em que poderia evoluir: decomposição, observação, reconstrução, comparação, inferência estrutural, validação. Esta proposta **não registra técnicas ofensivas** e restringe-se a conhecimento, auditoria autorizada e defesa (ver "Escopo de segurança").

**Lado B — Proteção anti-reconstrução.** Objetivo: reduzir quanto da arquitetura, lógica proprietária, organização interna ou conhecimento sensível dos nossos produtos pode ser reconstruído por terceiros a partir das superfícies que necessariamente expomos. **Não é sinônimo de criptografia** (ver "Distinção defensiva").

**Relação entre os lados — apenas como hipótese a testar, nunca como princípio:**
- evolução paralela dos dois lados *pode* ser útil;
- aprendizados de um lado *podem* gerar classes de risco ou propriedades para avaliação do contraponto;
- os lados devem permanecer **conceitualmente separados**;
- **não há obrigação** de compartilhar técnicas, implementação ou escopo completo entre eles;
- capacidade ofensiva/analítica **não implica** autoridade operacional;
- proteção defensiva **não deve degradar** a auditabilidade interna.

Nenhuma dessas proposições é promovida a princípio do Sistema MIM por este registro.

### Distinção defensiva obrigatória

Três coisas que não devem ser confundidas:

| Classe | O que é | Estatuto nesta proposta |
|---|---|---|
| **A. Criptografia convencional** | Proteção criptográfica de dados, segredos, credenciais, comunicação e material sensível | Matéria conhecida e distinta. A criptografia que já aparece no corpus (Constituição e ADR-002 do FullCommerce) é desta classe. **Fora do foco desta proposta.** |
| **B. Hardening / proteção anti-reconstrução** | Redução de exposição **estrutural** desnecessária nas superfícies observáveis | **Candidato novo de investigação.** Sem registro no corpus. |
| **C. [?] "Criptografia semântica"** | Termo humano provisório para investigar se existe uma classe defensiva destinada a reduzir a reconstrução **conceitual** da arquitetura a partir de artefatos necessariamente observáveis | **Hipótese terminológica/conceitual em aberto.** Não corroborada historicamente, não definida tecnicamente, não ratificada. **Não deve ser apresentada como criptografia no sentido técnico.** |

**Segurança não é obscuridade.** Esta proposta **não assume** que renomear diretórios, ofuscar nomes ou esconder convenções constitua proteção suficiente. A pergunta experimental é mais ampla: **quanto da estrutura real do produto pode ser reconstruído a partir da superfície exposta?** Nenhuma solução é prescrita nesta etapa.

### Propriedade a observar (hipótese, não princípio)

Registra-se para observação futura a hipótese de que dois eixos podem coexistir sem se anular:
- **Interno:** alta legibilidade, alta auditabilidade, proveniência, genealogia, versionamento, clareza arquitetural.
- **Externo:** exposição apenas do necessário, redução de reconstruibilidade desnecessária.

Isto é: a proteção externa **não deveria exigir** a degradação da clareza e da auditabilidade internas. **Não** promovido a princípio canônico — é propriedade a testar.

### Teste de Reconstruibilidade (possível instrumento experimental futuro)

Registrado **somente** como conceito de instrumento, para uma rodada futura:

> superfície legitimamente observável → tentativa controlada de reconstrução → mapa reconstruído → comparação com a arquitetura real → avaliação da reconstruibilidade.

Dimensões de observação candidatas: arquitetura inferida; domínios/componentes inferidos; stack inferida; contratos inferidos; fluxos inferidos; relações internas inferidas; lógica proprietária inferida; mecanismos defensivos inferidos; tempo necessário para a inferência; confiança das inferências.

**Não** se define aqui score, fórmula, threshold, escala normativa, tooling, automação ou implementação. Nenhum teste é executado contra nenhum produto por este registro. Se e quando desenhado, este instrumento seguiria o gênero do "Stress Test Pluricelular" de `VALIDACAO-EXPERIMENTAL.md` (ferramenta nomeada, separada do conteúdo que valida).

### Critério de evidência

**Casos independentes observados: 1** (a experiência da Camada B).

Abaixo do critério objetivo de **dois casos reais independentes** já usado em `docs/metodologia/VALIDACAO-EXPERIMENTAL.md` e invocado pela Proposta 2. A memória humana da Camada A **não** conta como segundo caso (não é evidência empírica e não foi corroborada). Nenhum segundo caso é inventado. A proposta permanece deliberadamente **abaixo do limiar**.

### Critério de revisão

Reconsiderar esta proposta apenas quando surgir evidência que justifique, por exemplo:
- um novo caso independente **autorizado** de engenharia reversa, com resultado registrado e rastreável;
- um teste defensivo aplicado a **produto próprio**;
- evidência de reconstruibilidade relevante de um produto nosso a partir das superfícies expostas;
- repetição do fenômeno da Camada B em outro sistema;
- evidência de que uma proteção específica reduz a reconstruibilidade **sem** prejudicar operação ou auditabilidade;
- recuperação documental de `sistema-mim-historico-v1.md` / `-v2.md` (ou fonte equivalente) que permita reteste das proposições da Camada A.

Não se cria threshold adicional: aplica-se o mesmo critério de "dois casos independentes" já vigente no corpus.

### Escopo de segurança

Matéria **exclusivamente** voltada a: sistemas próprios, ambientes autorizados, pesquisa defensiva e avaliação legítima de exposição. **Não** registra e **não** registrará procedimentos de acesso não autorizado, bypass de autenticação, obtenção de credenciais, persistência, exfiltração ou exploração destrutiva. Engenharia Reversa, aqui, é matéria de conhecimento, auditoria autorizada e defesa.

### O que esta proposta não faz

Não altera nem antecipa: ADR-000, ADR-001, o Milestone 02, o Milestone 05, o Validador de Paradoxos, o conceito existente de Lateralidade, a Engenharia Reversa em Camadas, a Base Canônica, o roadmap, qualquer milestone, código, testes, arquivos de pacote ou o checkpoint M02 untracked. Não cria autoridade canônica — o cabeçalho deste documento já declara que nenhum item aqui a tem. Não é um ADR e não pede para se tornar um.

---

## Status

Quatro propostas registradas até o momento. Novas propostas deliberadamente adiadas devem ser adicionadas a este documento, cada uma com estado, motivo e critério de revisão explícitos.
