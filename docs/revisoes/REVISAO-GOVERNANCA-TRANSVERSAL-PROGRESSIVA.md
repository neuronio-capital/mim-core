# Revisão — Decisão Humana de Governança Transversal Progressiva (mim-core)

## Estado

**Não canônica.** Este documento é uma **decisão humana de direção**, registrada em caráter pré-incorporação. **Não é um ADR.** Não modifica, não edita e não substitui o ADR-000 (CONGELADO) nem o ADR-001 (Aceito), que permanecem inalterados. Não altera a Base Canônica, nenhum milestone, a Proposta 4, nem o documento Experimental `docs/arquitetura/GOVERNANCA-TRANSVERSAL-ECOSSISTEMA-MIM-CORE.md`, cujo estado — Experimental / Non-canonical / Unratified — permanece integralmente preservado. Segue o mesmo gênero documental de `docs/revisoes/REVISAO-ADR000-FRONTEIRA-M02-M03.md` e `docs/revisoes/REVISAO-M02-CONFLITOS-E-CONTENCAO.md`: uma decisão consolidada, sem status formal de Aceito/Canônico, subordinada às fontes superiores.

## Origem e contexto

Esta decisão foi tomada pela autoridade humana durante uma reabertura extraordinária de governança transversal (gates E1–E3, não formalizados como documentos próprios), motivada por um incidente empírico externo ao mim-core: uma auditoria (PAI) sobre outro sistema (NeuroMotion), na qual parte da evidência detalhada de determinadas unidades de trabalho permaneceu apenas em contexto/memória de agente antes de uma recuperação manual de durabilidade. Esse incidente é registrado aqui estritamente como **HUMAN-SUPPLIED FACT**, não verificado diretamente por este repositório — PAI PRO e NeuroMotion não foram, e não são, acessados pelo mim-core.

O incidente motivou a pergunta central já nomeada, em caráter Experimental, por `GOVERNANCA-TRANSVERSAL-ECOSSISTEMA-MIM-CORE.md` (seção 10): como o mim-core deveria, se dever, governar identidade, responsibility, authority, contratos, provenance e conhecimento de composição de unidades com autonomia local, sem se tornar runtime ou orquestrador central. Este documento registra a resposta de **direção** dada pela autoridade humana a essa pergunta — não a resposta técnica, que permanece não decidida.

## Decisão humana

O mim-core deverá evoluir **progressivamente** para exercer governança transversal real sobre projetos, sistemas, capabilities e unidades relevantes do ecossistema.

Essa responsabilidade **não é concedida de uma vez**. Ela deve ser adquirida por classes específicas, sustentada por casos reais, com boundaries explícitos, authority explícita, Human Authority, validação antes de qualquer expansão, e sem transformar o mim-core em sistema centralizador operacional.

Princípio de progressão ratificado:

> RESPONSABILIDADE PARCIAL → PROVA → VALIDAÇÃO → EXPANSÃO CONTROLADA → NOVA PROVA → NOVA VALIDAÇÃO

**Não há autorização, por este documento, para que o mim-core governe tudo agora.** Nenhuma expansão de responsabilidade é automática; cada nova classe ou aumento de responsabilidade exige decisão humana própria, futura e explícita — este documento autoriza apenas o registro da direção e do primeiro estágio, descritos abaixo.

## Fronteira ratificada

Preserva-se a distinção:

**Sistema/projeto/auditor local** continua responsável por: execução local; autoridade operacional local; produção de evidência; persistência da própria evidência; storage local; lógica de domínio.

**mim-core** poderá, progressivamente e apenas quando expressamente autorizado em gates futuros, passar a governar **condições transversais** sob as quais conhecimento material pode ser reconhecido, classificado, considerado provenanced, considerado durable, promovido, transferido, utilizado por outra unidade, ou declarado closed.

Isso **não significa**, e este documento explicitamente não concede, que o mim-core: possua evidência de terceiros; execute qualquer projeto ou probe; controle qualquer agente; possua runtime local de terceiros; substitua autoridade local; ou decida conteúdo técnico de qualquer sistema externo.

## Primeira classe candidata — decomposta, não unificada

O incidente motivador revelou uma primeira classe candidata de governança transversal, nomeada como quatro componentes que **não devem ser tratados como um único contrato**:

- **Authority** — quem tem a palavra final sobre um fato, dentro do próprio boundary de cada sistema. Tem precedente textual estreito no corpus (ADR-001, DEC-1).
- **Provenance** — de onde vem uma afirmação e com que rastreabilidade. Tem precedente textual estreito no corpus (ADR-001, DEC-2; "Matriz de Proveniência" já citada como conceito futuro não especificado em `docs/arquitetura/VOCABULARIO-ARQUITETURAL.md`).
- **Durability** — se e como um fato persiste além de uma sessão ou memória transitória. Sem precedente formal no corpus; apenas precedente comportamental (`docs/milestones/MILESTONE-02-FECHAMENTO.md`, separação entre "implementação concluída" e "publicação Git pendente").
- **Closure** — quando uma unidade pode ser legitimamente declarada encerrada. Sem regra formal no corpus; apenas o mesmo precedente comportamental do Milestone 02.

Nenhuma decisão é tomada aqui sobre se esses quatro componentes devem ser incorporados juntos ou separadamente. Essa decomposição permanece aberta para gates futuros.

## Estágio autorizado por este documento

Este documento autoriza, e preserva, **exclusivamente** o seguinte estágio:

**Estágio 1 — Nomeação/Registro.** O mim-core registra que a condição transversal descrita acima existe como direção e como pergunta legítima, sem exercer qualquer autoridade operacional sobre ela. Este estágio concede zero autoridade de enforcement, zero posse de evidência, zero mecanismo técnico.

Estágios adicionais eventuais — descritos apenas como referência para decisão humana futura, **não autorizados por este documento**:

- **Estágio 2 — Observação validada.** Acumulação de casos reais (critério já em uso no corpus: dois casos independentes, com resultados e ajustes registrados) em que a condição nomeada tenha sido exercitada por sistemas locais autônomos, sem que o mim-core execute ou possua nada. Concederia, no máximo, autoridade sobre vocabulário/classificação.
- **Estágio 3 — Condição governada.** Somente após o Estágio 2 e revisão explícita do fundador, o mim-core poderia nomear formalmente uma condição mínima transversal — ainda sem posse de evidência, storage ou enforcement.

A transição entre estágios exige, em todos os casos, revisão explícita do fundador — o mesmo padrão de Human Gate já usado em `docs/metodologia/VALIDACAO-EXPERIMENTAL.md` ("Revisão do Fundador"). Reabertura (retorno a mais casos antes de nova tentativa) permanece sempre disponível, no mesmo sentido já usado em todo o corpus.

## Caso motivador — grau de materialidade preservado

O caso PAI/NeuroMotion é registrado aqui **apenas como caso motivador** da decisão de direção, no mesmo espírito de declaração de fonte já usado em `docs/milestones/MILESTONE-06-ACHADOS-PRELIMINARES.md` e em `docs/revisoes/PROPOSTAS-EM-OBSERVACAO.md` (Proposta 4, Camada B): fato relatado por autoridade humana, não verificado diretamente por este repositório, não corroborado por acesso a PAI PRO ou NeuroMotion, e que conta como **um único caso**, não como dois casos independentes. Este documento não declara PAI, NeuroMotion, ou qualquer sistema por eles referido como projeto consumidor do mim-core, e não cria qualquer integração, contrato, transferência de evidência ou obrigação nova sobre eles. Qualquer transferência de conhecimento entre sistemas do ecossistema permanece, explicitamente, **não autorizada** por este documento.

## Guardrail anti-God-System (reafirmado, não redefinido)

Este documento reafirma, sem reescrever, o guardrail já registrado em `docs/arquitetura/GOVERNANCA-TRANSVERSAL-ECOSSISTEMA-MIM-CORE.md` (seção 8): qualquer investigação ou expansão futura desta matéria deve evitar que o mim-core se torne runtime central, event bus, API gateway, banco universal, orquestrador universal, executor de capabilities de terceiros, decisor por autoridades externas, conhecedor indiscriminado de toda implementação de cada produto, centralizador de todas as verdades do ecossistema, ou substituto dos contratos próprios de cada sistema. A formulação "governar as condições, sem possuir a operação" permanece, como já registrado naquele documento, **hipótese em investigação, não princípio ratificado** — este documento não a ratifica.

## Critério de futura validação/promoção

Este documento segue o mesmo modelo de graduação já em uso no corpus (`docs/metodologia/VALIDACAO-EXPERIMENTAL.md`), sem redefinir seus critérios: qualquer avanço do Estágio 1 para o Estágio 2 exigiria aplicação em pelo menos dois casos reais independentes, com resultados registrados e classificação explícita de eventuais ajustes (refinamento de redação vs. mudança de substância). Qualquer avanço do Estágio 2 para o Estágio 3 exigiria, adicionalmente, revisão explícita do fundador, com os mesmos três resultados possíveis já usados em todo o corpus: Incorporação, Permanência, ou Reabertura.

## Fora de escopo deste documento

Não define, propõe ou escolhe: schema técnico, contrato, API, protocolo de comunicação, mecanismo de circulação, capability discovery, topologia de composição, MCP, hook, CI gate, event bus, banco de dados, ledger central, daemon, gateway, plugin, runtime do mim-core, integração com Claude, ou qualquer enforcement engine. Não altera ADR-000, ADR-001, a Base Canônica, qualquer milestone, a Proposta 4, ou o documento Experimental da Frente 2. Não inicia M03, M04, M05 ou M06. Não reabre M02. Não autoriza qualquer integração entre o mim-core e PAI PRO ou NeuroMotion.

## Nota metodológica

O objetivo deste documento é registrar fielmente uma decisão humana de direção e o primeiro estágio por ela autorizado — não antecipar, implementar ou ratificar mecanismo, arquitetura ou contrato algum. Tudo o que está descrito acima é decisão de direção humana registrada como tal, hipótese explicitamente rotulada como não ratificada, ou critério já existente no corpus citado por precedente — não invenção nova de autoridade.
