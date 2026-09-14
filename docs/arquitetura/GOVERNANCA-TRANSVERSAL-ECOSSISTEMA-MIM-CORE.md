# Governança Transversal do Ecossistema — Autonomia, Componibilidade e Circulação Governada (Lacuna Registrada)

## Estado

**Proposta / Experimental.** Este documento não tem autoridade canônica, não é metodologia oficial do Sistema MIM, e não altera nenhum ADR, milestone, `PROPOSTAS-EM-OBSERVACAO.md` ou a Base Canônica. Registra **apenas uma lacuna identificada** — não a resolve, não a especifica tecnicamente, e não autoriza nenhuma implementação.

**Origem:** auditoria extraordinária READ-ONLY do mim-core (2026-09-14, unidades G1/G1R/G1W). A auditoria original concluiu cobertura parcial para a Frente 2 ("Governança Transversal do Ecossistema"): authority e proveniência têm fundamento real no corpus (ADR-001), mas esse fundamento é estreito — cobre apenas a relação entre o repositório de código de um projeto e sua representação na Base Canônica desse mesmo projeto. Uma revisão humana subsequente (unidade G1R) corrigiu o enquadramento inicial deste documento: tratar a matéria apenas como **"contratos entre sistemas independentes"** foi julgado insuficiente. O enquadramento corrigido, preservado aqui como **INPUT/DIREÇÃO HUMANA**, é mais amplo: **autonomia local + conectabilidade + interoperabilidade + componibilidade + circulação governada + composição do ecossistema**. Este documento é a versão reformulada do registro dessa lacuna, decorrente diretamente dessa correção.

**Escopo declarado:** este documento nomeia uma lacuna ampliada e as perguntas que ela levanta. Não define Metadata Schema, contrato, schema, API, capability, protocolo de comunicação, mecanismo de circulação, topologia de composição, ou qualquer arquitetura definitiva. Segue o mesmo gênero documental de `ARQUITETURA-ECOSSISTEMA-MIM-CORE.md` — registro Experimental de entendimento, não decisão.

## Princípio de autoridade

Este documento **não é fonte normativa**. Em caso de qualquer conflito futuro com ADR-000, ADR-001 ou qualquer documento canônico, a fonte canônica sempre prevalece. Segue o mesmo padrão de subordinação já estabelecido por `VOCABULARIO-ARQUITETURAL.md` e `ARQUITETURA-ECOSSISTEMA-MIM-CORE.md`.

### Convenção de classificação usada neste registro

Cada afirmação abaixo é rotulada como:

- **FATO DO CORPUS** — verificável por leitura direta de um documento já existente no repositório do mim-core.
- **DECISÃO DE PRODUTO EXTERNA AO MIM** — fato real e verificável no corpus, mas que é autoridade de um projeto consumidor (ex.: FullCommerce) sobre si mesmo, não autoridade ou descoberta do mim-core.
- **INPUT/DIREÇÃO HUMANA** — formulação ou correção fornecida diretamente pelo fundador nesta sessão, ainda sem corroboração documental própria.
- **INFERÊNCIA** — leitura razoável construída a partir de FATOs do corpus, mas não afirmada literalmente por nenhuma fonte.
- **HIPÓTESE EXTERNA** — formulação trazida de fora do corpus (discussão transversal da Neurônio Capital), ainda não corroborada por evidência interna.
- **QUESTÃO ABERTA** — pergunta explicitamente não respondida por este documento.
- **NÃO DECIDIDO** — matéria que exigiria decisão humana futura, fora do escopo desta unidade.
- **ADIADO** — matéria reconhecida como relevante, mas deliberadamente fora de escopo agora.

Nenhuma direção humana é tratada, por este documento, como descoberta histórica do MIM. Nenhum precedente de produto externo é elevado a autoridade do mim-core. Nenhuma lacuna é preenchida por plausibilidade.

## Escopo e não-escopo

**Este documento faz:**
- registra que existe uma questão aberta sobre como o mim-core poderia, no futuro, representar autonomia local, conectabilidade, interoperabilidade, componibilidade e circulação governada entre unidades do ecossistema;
- distingue o que já é fundamento real do mim-core (ADR-001) do que é precedente de produto externo (FullCommerce D1) e do que é lacuna;
- preserva um caso motivador hipotético (FullCommerce como composição modular potencialmente incluindo NeuroTrack e NeuroNext) sem incorporar nenhum desses sistemas à Base Canônica;
- lista as perguntas que permanecem sem resposta, incluindo as introduzidas pela correção humana (autonomia+composição, múltiplas composições, circulação, capability);
- registra e reforça um guardrail explícito contra o mim-core se tornar um sistema centralizador operacional (runtime, event bus, orquestrador, banco universal).

**Este documento explicitamente não faz:**
- não define identidade de sistema, contrato, schema, API, versionamento de contrato, capability discovery ou mecanismo de circulação;
- não incorpora FullCommerce, NeuroTrack, NeuroNext ou qualquer outro sistema à Base Canônica;
- não cria autoridade nova, nem transfere autoridade de nenhum sistema para o mim-core;
- não declara topologia de composição entre sistemas do ecossistema, nem afirma relação all-to-all, nem afirma composição única obrigatória;
- não altera ADR-000, ADR-001, `PROPOSTAS-EM-OBSERVACAO.md`, a Proposta 4, o roadmap ou qualquer milestone;
- não resolve nenhuma das perguntas listadas na seção 7.

---

## 1. O que já é fundamento real do mim-core (FATO DO CORPUS)

- **ADR-001** (`docs/adr/ADR-001-autoridade-das-fontes-na-base-canonica.md`, Status: Aceito) estabelece autoridade e proveniência — mas exclusivamente entre o repositório de código de **um** projeto e sua representação em `fontes/`/`derivados/` dentro da Base Canônica desse mesmo projeto (DEC-1 a DEC-4). Não modela relação entre dois ou mais sistemas independentes, nem composição entre módulos.
- **`ARQUITETURA-ECOSSISTEMA-MIM-CORE.md`** (Experimental, 2026-07-28) descreve um modelo de três camadas (mim-core / NEF / projetos consumidores) e declara explicitamente, em sua seção "Fora de escopo desta proposta": *"Protocolos de comunicação entre as três camadas... Regras de governança específicas (quem aprova, com que critério, em que instância)"* — o próprio documento já reconhece esta lacuna e a deixa para "propostas futuras, apoiadas neste documento como referência de camadas".
- **`VALIDACAO-EXPERIMENTAL.md`** (Validado) formaliza a distinção "Evidência ≠ Hipótese" — mesma classe estrutural da distinção INTENÇÃO/DECISÃO ≠ OBSERVAÇÃO usada no caso motivador (seção 3).
- Nenhum documento do corpus governado do mim-core contém, em nenhum lugar, os termos "contrato entre sistemas", "interoperabilidade", "capability discovery", "componibilidade", "circulação governada" ou "system identity" como conceito de primeira classe. "Genealogy" só aparece dentro da Proposta 4, como hipótese não corroborada.

## 2. Precedente de produto — FullCommerce D1 (DECISÃO DE PRODUTO EXTERNA AO MIM)

O ADR-000 do FullCommerce (`base-canonica/projetos/FullCommerce/fontes/ADRs/ADR-000-principios-arquiteturais.md`, decisão D1) registra: *"o FullCommerce nasce como um **monólito modular** — um único artefato executável, internamente dividido em **módulos de domínio com fronteiras explícitas**. Microsserviços não serão adotados na origem; a decomposição em serviços separados só ocorrerá quando uma necessidade real... mudar uma decisão concreta — e será registrada em ADR próprio."* Consequência positiva registrada na mesma fonte: *"a modularidade preserva a opção de extrair serviços depois **sem reescrita**"* — reforçada em `ADR-002-fundacao-tecnica-e-estrutural-da-plataforma.md` (*"as fronteiras de módulo (D7) já existem em código"*).

Isto é citado **estritamente como evidência concreta** de que autonomia modular (fronteiras explícitas, extração futura sem reescrita) já aparece em pelo menos um projeto real do ecossistema. Três ressalvas obrigatórias:

- é decisão do **produto FullCommerce sobre si mesmo**, não do mim-core;
- **não** é autoridade do mim-core sobre FullCommerce nem sobre nenhum outro produto;
- **não** prova uma regra universal do ecossistema — é um único caso, de um único produto, sobre modularidade **interna** a esse produto, não sobre composição **entre** produtos distintos.

## 3. Caso motivador — FullCommerce como composição modular (HIPÓTESE EXTERNA — não incorporado à Base Canônica)

Registrado **exclusivamente como caso conceitual/falsificável**, fornecido fora deste corpus. Nenhum dos elementos abaixo além do próprio FullCommerce tem qualquer representação na Base Canônica do mim-core; nenhuma busca no repositório encontrou menção a NeuroTrack, NeuroNext, Néuron ou NeuroMotion fora deste documento.

**Direção humana preservada:** FullCommerce é concebido como sistema/produto modular progressivamente completo. NeuroTrack, NeuroNext e outros módulos/capabilities podem, em tese, participar dessa composição. Ao mesmo tempo, determinados módulos/capabilities podem ser comercializados ou consumidos separadamente.

Duas advertências humanas preservadas literalmente, como limite de interpretação:

- **FullCommerce não deve ser descrito como "simples pacote comercial de sistemas estranhos".**
- **Um módulo não perde necessariamente identity, responsibility, boundary e authority ao participar de uma composição maior.**

Papéis conceituais do caso (hipotéticos, não implementados):

- **FullCommerce** — autoridade comercial/operacional. Exemplo: "houve uma nova compra válida". Único elemento com existência real e verificável no repositório, como projeto consumidor (`base-canonica/projetos/FullCommerce/`) — mas sua Base Canônica não representa NeuroTrack nem NeuroNext, nem os declara como módulos seus.
- **NeuroTrack** (hipotético) — autoridade observacional/evidencial: fornece evidência do que realmente aconteceu na experiência observada; não decide o próximo passo.
- **NeuroNext** (hipotético) — responsabilidade candidata: resolver o próximo passo/experiência válida a partir de evento real + estado + contexto + evidência + política.

Distinção a preservar, caso esta matéria seja retomada no futuro: **NeuroNext decidiu "EP02 deve ser servido" não é igual a NeuroTrack observou "EP02 foi efetivamente servido"** — intenção/decisão ≠ realidade observada. Este exemplo **não** deve ser generalizado como arquitetura universal do ecossistema.

Registra-se explicitamente: **NeuroNext não é mecanismo de Criptografia Semântica** (matéria da Proposta 4, não tocada aqui) — foi apenas um exemplo que tornou perceptível a existência da lacuna descrita neste documento. Dr. Aura, se usado em qualquer discussão futura, é exemplo, não domínio universal do NeuroNext.

Não se define, nem se infere, quais módulos "obrigatoriamente pertencem" a uma V1 de composição do FullCommerce. Nenhum schema, contrato ou topologia é criado por este caso.

## 4. Regra de ecossistema — sem topologia fixa (INPUT/DIREÇÃO HUMANA)

O objeto desta lacuna não se limita ao FullCommerce. Direção humana a investigar, sem decidir: projetos/capabilities relevantes do ecossistema deveriam poder ser concebidos de modo a permitir composição legítima quando necessário — sem que isso implique:

- relação **all-to-all** (todo projeto conectado a todo projeto);
- uma **única composição final** obrigatória;
- um "superproduto" que obrigatoriamente contenha tudo.

Formas legítimas e coexistentes, apenas como possibilidades a preservar (não como decisão): produto isolado; módulo de um produto maior; capability compartilhada entre produtos; participante de múltiplas composições simultâneas; participante de composições futuras ainda desconhecidas. Nenhuma topologia definitiva é desenhada por este documento.

## 5. Circulação governada (INPUT/DIREÇÃO HUMANA — conceito de investigação, não primitiva ratificada)

Direção humana a investigar: o ecossistema pode precisar permitir que certas coisas circulem legitimamente entre unidades autônomas, respeitando o boundary de cada uma. Candidatos ao que poderia circular — nenhum ratificado, nenhum modelado tecnicamente: eventos; evidências; contexto; comandos; decisões; capabilities; contratos; referências; conhecimento; provenance; resultados.

Toda circulação, se um dia vier a ser desenhada, precisaria preservar (como questão, não como mecanismo decidido): **identity, responsibility, authority, contract, provenance, boundary**.

Este documento **não decide** nenhum mecanismo técnico. Não escolhe, sugere, nem descarta API, event bus, fila, MCP, banco de dados, broker, orquestrador ou qualquer stack. A pergunta "o corpus MIM já possui primitivas capazes de sustentar essa circulação governada, ou existe lacuna real?" permanece em aberto (ver seção 7) — a resposta preliminar da auditoria (unidade G1) foi de lacuna real, mas isso não é reafirmado aqui como conclusão definitiva, apenas como estado da investigação.

## 6. Capability — conceito a investigar, não primitiva canônica (QUESTÃO ABERTA)

A auditoria e a correção humana identificaram a necessidade de investigar "capability" como conceito potencialmente relevante para esta matéria. **Capability não é, por este documento, declarada primitiva canônica do mim-core.** Distinguem-se, sem resolver, os seguintes níveis possíveis de unidade no ecossistema — nomeados apenas para nomear a ambiguidade, não para defini-los:

- **Project** — unidade de trabalho/repositório (uso já existente no corpus: "projeto consumidor").
- **Product** — unidade comercializável (uso já existente no corpus: "Produto/Produtos consumidores", `VOCABULARIO-ARQUITETURAL.md` §3, que já registra esses dois termos como sinônimo não declarado/drift).
- **System** — unidade com authority e boundary próprios (uso do caso motivador da seção 3; sem definição formal no corpus).
- **Module** — unidade interna a um produto, com fronteira explícita (uso do precedente FullCommerce D1, seção 2; interno a um único produto).
- **Capability** — unidade funcional que pode ser fornecida/consumida entre produtos (termo trazido pela correção humana; ausente do corpus).
- **Composition** — agrupamento legítimo de módulos/capabilities/produtos (termo trazido pela correção humana; ausente do corpus).

Se e como o mim-core precisaria representar essas seis noções — e se elas são, de fato, seis noções distintas ou colapsam em menos — é questão aberta, não resposta deste documento.

## 7. Questões que permanecem abertas (QUESTÃO ABERTA — nenhuma resposta neste documento)

1. FullCommerce, NeuroTrack, NeuroNext e outros produtos devem algum dia possuir representação na Base Canônica do mim-core?
2. Se sim, qual representação mínima seria legítima?
3. O mim-core deve conhecer: identidade do sistema? responsibility? authority? capabilities? contratos? versão dos contratos? provenance? genealogy? relações? composição?
4. Qual dessas informações pertenceria ao mim-core e qual permanece exclusivamente no sistema de origem?
5. Como representar authority sem transferir authority?
6. Como representar contrato sem duplicar a verdade operacional (runtime truth)?
7. Como representar provenance entre unidades sem transformar o mim-core em banco de todos os sistemas?
8. Como governar conflitos entre authorities independentes?
9. Como registrar evolução de boundaries?
10. Como preservar a distinção entre conhecimento público, autoridade interna e verdade de runtime, caso essa distinção venha a ser investigada (ver seção 9)?
11. O mim-core deveria ser governador operacional, fundação de governança, registro governado, alguma combinação, ou nenhuma dessas opções?
12. Existe necessidade de um contrato transversal comum, ou contratos devem permanecer pairwise/específicos entre sistemas?
13. Existe um modelo de capability discovery compatível com o mim-core?
14. Onde termina interoperabilidade e começa conhecimento de composição?
15. Como preservar autonomia local e composição sistêmica simultaneamente?
16. Como uma unidade participa de múltiplas composições sem perder identidade?
17. Como evitar topologia fixa desnecessária, sem impedir composição legítima quando necessária?
18. O mim-core precisa representar capabilities? Precisa representar relações de composição?
19. Como uma capability pode ser comercializada isoladamente e continuar sendo "a mesma" capability quando integrada a uma composição maior — e como evitar implementações divergentes entre a versão isolada e a versão integrada?
20. O que, exatamente, deveria poder circular entre unidades, e qual authority controlaria cada circulação?
21. Como distinguir, de forma geral e não apenas no caso NeuroTrack/NeuroNext: intent, decision, execution, observation, evidence?
22. Como impedir que qualquer resposta às perguntas acima transforme o mim-core em God System (ver seção 8)?
23. Como esta matéria se relaciona, no futuro, com a Frente 1 (documentação/exposição) sem fundir as duas em uma única matéria (ver seção 9)?

## 8. Guardrail — não criar God System (NÃO DECIDIDO, mas registrado como limite)

Qualquer investigação futura desta lacuna deve evitar que o mim-core se torne, automaticamente ou por efeito colateral de qualquer resposta às perguntas da seção 7, um sistema que:

- seja runtime central, event bus, API gateway, banco universal ou orquestrador universal;
- execute capabilities de produtos;
- decida por authorities externas;
- conheça indiscriminadamente toda implementação de cada produto;
- centralize todas as verdades do ecossistema;
- absorva FullCommerce, NeuroTrack, NeuroNext ou qualquer outro produto;
- substitua os contratos próprios de cada sistema;
- transforme documentação em autoridade de runtime.

Formulação de investigação permitida como hipótese, não como princípio: *o mim-core poderia eventualmente governar conhecimento **sobre** identity, responsibility, authority, contract, provenance, capability e composition, sem se tornar a autoridade operacional dessas coisas.* Isso permanece hipótese — não é adotado, ratificado nem implementado por este documento.

## 9. Relação com a Frente 1 (documentação / exposição) — ADIADO

`docs/revisoes/PROPOSTAS-EM-OBSERVACAO.md` e a Proposta 4 nela contida **não são alteradas por este documento** e não são reinterpretadas. Registra-se apenas, como observação Experimental e sem fundir as duas matérias: quanto maior a componibilidade real do ecossistema, mais relevante pode se tornar o **conhecimento de composição** — a Frente 2 (este documento) investigaria como as partes legitimamente se relacionam/compõem; a Frente 1 (Proposta 4), separadamente, investigaria qual parte desse conhecimento — se algum — deveria ser exposto a cada superfície. Interseção possível não é identidade entre as frentes. Essa eventual interseção permanece, ela própria, uma questão aberta (item 23 da seção 7), não uma conclusão deste registro.

## 10. Questão central candidata (NÃO RESPOSTA — NÃO RATIFICADA)

Registrada apenas como formulação candidata para orientar investigação futura, não como pergunta respondida ou decisão tomada por este documento:

> "Como o mim-core deve, se dever, governar identidade, responsibility, authority, contratos, provenance e conhecimento de composição de unidades que possuem autonomia local, mas devem permanecer legitimamente conectáveis, componíveis e capazes de participar de produtos ou capacidades maiores?"
>
> "Como fazer isso sem transformar o mim-core em runtime ou orquestrador central?"

## 11. Fora de escopo deste documento

Protocolos de comunicação entre sistemas; esquema de metadados; regras de governança específicas (quem aprova o quê); mecanismo de authority; formato de contrato; API; mecanismo de circulação (event bus, fila, broker, MCP ou qualquer stack); topologia de composição definitiva; qualquer arquitetura definitiva; incorporação de FullCommerce, NeuroTrack, NeuroNext ou qualquer outro produto à Base Canônica; qualquer alteração ao ADR-000, ADR-001, milestone ou à Proposta 4.

## 12. Critério de futura validação/promoção

Este documento segue exatamente o mesmo modelo de três estados definido em `VALIDACAO-EXPERIMENTAL.md`, com o mesmo vocabulário — sem redefinir nem flexibilizar nenhum dos critérios.

### Experimental (estado atual)

Estado de origem. A lacuna e as perguntas existem, mas nenhuma foi testada ou respondida fora desta sessão.

### Validado

Atingido **automaticamente**, sem intervenção humana adicional, quando os critérios técnicos objetivos abaixo forem cumpridos:

- aplicação bem-sucedida em pelo menos **dois casos reais independentes** que exercitem alguma das perguntas da seção 7 (ex.: duas decisões futuras, sobre sistemas reais, que precisaram desta lacuna nomeada para não repetir uma ambiguidade);
- registro dos resultados de ambos;
- registro explícito de quais afirmações precisaram de ajuste, classificando cada ajuste como refinamento de redação (não impede a graduação) ou mudança de substância (reinicia a contagem para aquela afirmação específica).

### Canônico

Atingido **somente** após revisão explícita do fundador sobre o conteúdo em estado Validado, com os mesmos três resultados possíveis já usados no corpus (Incorporação / Permanência em Validado / Reabertura).

## 13. Nota metodológica

O objetivo deste documento é registrar fielmente que uma lacuna foi identificada por auditoria, e reformulada por correção humana subsequente — não antecipar, propor ou insinuar uma solução, uma arquitetura ou uma evolução da metodologia oficial do Sistema MIM. Tudo o que está descrito acima é observação Experimental, direção humana registrada como tal, e pergunta em aberto — não decisão.
